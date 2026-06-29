const Store = {
    _data: {
        progress: {}, // chapter_id -> boolean
        // streak: count = kolejne dni z rzedu; freezes = "zamrozenia serii" (ochrona przed rage-quit);
        // best = rekord; goalDate = dzien, w ktorym domknieto cel (by nie nagradzac 2x).
        streak: { count: 0, lastDate: null, freezes: 0, best: 0, goalDate: null },
        flashcards: {}, // fc_id -> { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0 }
        lessons: {}, // lesson_id -> { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0, mastery: 0 }
        gamify: { xp: 0, level: 1, dailyQuests: { date: null, completed: 0 } },
        history: [], // For heatmap: [{date: 'YYYY-MM-DD', itemsDone: 1}]
        settings: {
            theme: 'dark',
            dailyGoal: 10
        }
    },

    init() {
        const saved = localStorage.getItem('egzaminFiR_v2_store');
        if (saved) {
            try {
                // Merge default with saved
                const parsed = JSON.parse(saved);
                this._data = { ...this._data, ...parsed };
                // ensure nested objects are merged
                this._data.flashcards = { ...this._data.flashcards, ...(parsed.flashcards || {}) };
                this._data.lessons = { ...this._data.lessons, ...(parsed.lessons || {}) };
                this._data.gamify = { ...this._data.gamify, ...(parsed.gamify || {}) };
                this._data.progress = { ...this._data.progress, ...(parsed.progress || {}) };
                this._data.settings = { ...this._data.settings, ...(parsed.settings || {}) };
                // streak: deep-merge, by stare zapisy (bez freezes/best/goalDate) dostaly nowe pola
                this._data.streak = { ...this._data.streak, ...(parsed.streak || {}) };
            } catch (e) {
                console.error("Store V2 parsing error", e);
            }
        } else {
            // Try to migrate from V1 if exists
            const v1 = localStorage.getItem('egzaminFiR_store');
            if (v1) {
                try {
                    const parsed = JSON.parse(v1);
                    this._data.progress = parsed.progress || {};
                    this._data.streak = parsed.streak || { count: 0, lastDate: null };
                    // Reset flashcards for SM-2
                } catch(e) {}
            }
        }
        this.updateStreak();
        // Zabezpieczenie: --secondary nie jest zdefiniowana w :root, a kod jej uzywa
        // (karta klasy Strateg, pasek XP). Ustaw raz globalnie, by kazde var(--secondary) dzialalo.
        try {
            const r = document.documentElement;
            if (!getComputedStyle(r).getPropertyValue('--secondary').trim()) r.style.setProperty('--secondary', '#a78bfa');
        } catch (e) {}
    },

    save() {
        localStorage.setItem('egzaminFiR_v2_store', JSON.stringify(this._data));
    },

    exportData() {
        return JSON.stringify(this._data);
    },
    
    importData(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.progress && parsed.streak) {
                this._data = parsed;
                this.save();
                return true;
            }
        } catch(e) { return false; }
        return false;
    },
    
    clearAll() {
        localStorage.removeItem('egzaminFiR_v2_store');
        localStorage.removeItem('egzaminFiR_store');
        location.reload();
    },

    // --- History & Heatmap ---
    logActivity() {
        const today = new Date().toISOString().split('T')[0];
        let entry = this._data.history.find(h => h.date === today);
        if (!entry) {
            entry = { date: today, itemsDone: 0 };
            this._data.history.push(entry);
        }
        entry.itemsDone++;
        this._maybeAwardDailyGoal();
        this.save();
    },

    getHistory() {
        return this._data.history;
    },

    // --- Streak ---
    // Klucz dnia w czasie LOKALNYM (nie UTC) -> "YYYY-MM-DD". Liczymy w pelnych dniach
    // kalendarzowych, a nie w roznicy milisekund (stary blad: wizyta nastepnego dnia dawala
    // ceil(>1)=2 i kasowala serie, przez co streak NIGDY nie przekraczal 1).
    _dayKey(ms) {
        const d = new Date(ms);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${m}-${day}`;
    },
    // Roznica w pelnych dniach kalendarzowych miedzy dwoma kluczami/datami.
    _daysBetween(aKey, bKey) {
        const a = new Date((aKey.length === 10 ? aKey + 'T00:00:00' : aKey));
        const b = new Date((bKey.length === 10 ? bKey + 'T00:00:00' : bKey));
        a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
        return Math.round((b - a) / 86400000);
    },

    // Wolane przy starcie: jesli minal CALY dzien bez aktywnosci, zuzyj "zamrozenie" (freeze),
    // a gdy go brak — zerwij serie. Empatia anty-rage-quit ([#duolingo-gamifikacja]).
    updateStreak() {
        const s = this._data.streak;
        if (!s || !s.lastDate) return;
        const todayKey = this._dayKey(Date.now());
        const prevKey = this._dayKey(new Date(s.lastDate).getTime()); // normalizuj stary format
        s.lastDate = prevKey;
        if (prevKey === todayKey) { this.save(); return; }
        const gap = this._daysBetween(prevKey, todayKey);
        if (gap >= 2) {
            const missed = gap - 1;          // ile PELNYCH dni opuszczono
            if ((s.freezes || 0) >= missed) {
                s.freezes -= missed;
                // "most": udawaj, ze ostatnia nauka byla wczoraj, by dzisiejsza akcja kontynuowala serie
                s.lastDate = this._dayKey(Date.now() - 86400000);
            } else {
                s.count = 0;
                s.lastDate = null;           // czysty restart przy pierwszej dzisiejszej aktywnosci
            }
            this.save();
        }
    },

    incrementStreak() {
        const s = this._data.streak;
        const todayKey = this._dayKey(Date.now());
        if (s.lastDate === todayKey) { this.logActivity(); return true; } // dzis juz policzone
        const prevKey = s.lastDate ? this._dayKey(new Date(s.lastDate).getTime()) : null;
        const gap = prevKey ? this._daysBetween(prevKey, todayKey) : 1;
        if (!prevKey) {
            s.count = 1;
        } else if (gap === 1) {
            s.count = (s.count || 0) + 1;                    // kolejny dzien z rzedu
        } else if (gap >= 2) {
            const missed = gap - 1;
            if ((s.freezes || 0) >= missed) { s.freezes -= missed; s.count = (s.count || 0) + 1; }
            else { s.count = 1; }                            // seria zerwana -> start od dzis
        } else {
            s.count = Math.max(1, s.count || 0);             // anomalia zegara
        }
        s.lastDate = todayKey;
        s.best = Math.max(s.best || 0, s.count);
        this.logActivity();
        this.save();
        return true;
    },

    getStreak() { return this._data.streak.count; },
    getFreezes() { return (this._data.streak && this._data.streak.freezes) || 0; },
    getBestStreak() { return (this._data.streak && this._data.streak.best) || 0; },

    // --- Cel dnia (petla nawyku: wyzwalacz -> akcja -> mikronagroda, [#playbook-nawyk-30-dni]) ---
    getDailyGoal() { return (this._data.settings && this._data.settings.dailyGoal) || 10; },
    setDailyGoal(n) { this._data.settings.dailyGoal = Math.max(1, Math.min(100, n | 0)); this.save(); },
    getItemsToday() {
        const today = new Date().toISOString().split('T')[0];
        const e = (this._data.history || []).find(h => h.date === today);
        return e ? e.itemsDone : 0;
    },
    // Domkniecie celu dnia -> +1 freeze (max 5) + sygnal dla UI (toast/konfetti). Raz dziennie.
    _maybeAwardDailyGoal() {
        const today = this._dayKey(Date.now());
        const s = this._data.streak;
        if (s.goalDate === today) return;
        if (this.getItemsToday() >= this.getDailyGoal()) {
            s.goalDate = today;
            s.freezes = Math.min(5, (s.freezes || 0) + 1);
            try { document.dispatchEvent(new CustomEvent('fir:dailygoal', { detail: { freezes: s.freezes } })); } catch (e) {}
        }
    },

    // --- Progress ---
    markChapterDone(chapterId) {
        this._data.progress[chapterId] = true;
        this.incrementStreak();
        this.save();
    },
    
    isChapterDone(chapterId) { return !!this._data.progress[chapterId]; },
    
    toggleChapterDone(chapterId) {
        if (this._data.progress[chapterId]) {
            delete this._data.progress[chapterId];
        } else {
            this._data.progress[chapterId] = true;
            this.incrementStreak();
        }
        this.save();
    },

    getCompletedChapters() { return Object.keys(this._data.progress); },

    // --- Flashcards SM-2 ---
    getFlashcardState(fcId) {
        if (!this._data || !this._data.flashcards) return { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0 };
        const state = this._data.flashcards[fcId];
        if (state && typeof state === 'object' && state.nextReview !== undefined) {
            return state;
        }
        return { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0 };
    },

    updateFlashcard(fcId, quality) {
        // quality: 1 (Nie znam), 3 (Prawie), 5 (Znam). Harmonogram: FSRS (model DSR), fallback prosty.
        let state = this.getFlashcardState(fcId);
        if (typeof FSRS !== 'undefined') {
            state = FSRS.schedule(state, quality, Date.now());
        } else {
            state.interval = quality >= 3 ? Math.max(1, Math.round((state.interval || 1) * 2)) : 1;
            state.nextReview = Date.now() + state.interval * 24 * 60 * 60 * 1000;
        }
        this._data.flashcards[fcId] = state;
        this.incrementStreak();
        this.save();
    },

    // --- Lessons SM-2 & Mastery ---
    getLessonState(lessonId) {
        if (!this._data || !this._data.lessons) return { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0, mastery: 0 };
        const state = this._data.lessons[lessonId];
        if (state && typeof state === 'object' && state.nextReview !== undefined) {
            return state;
        }
        return { interval: 0, repetition: 0, efactor: 2.5, nextReview: 0, mastery: 0 };
    },

    updateLesson(lessonId, quality) {
        let state = this.getLessonState(lessonId);
        const prevMastery = (state.mastery == null) ? 0 : state.mastery;
        const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR;

        // Krotkoterminowy SRS pod 7-dniowy sprint egzaminacyjny (zamiast wielomiesiecznego FSRS).
        // Mikro-interwaly (15min/8h) przeplatane makro (1d/3d/6d) wg krzywej Ebbinghausa.
        let reps = state.sprintReps || 0;
        let interval;
        if (quality <= 2) { reps = 0; interval = 15 * MIN; }                 // Zapomnialem -> 15 min
        else if (quality === 3) { interval = 8 * HOUR; }                     // Z mgla -> 8 h
        else { reps += 1; interval = reps <= 1 ? DAY : (reps === 2 ? 3 * DAY : 6 * DAY); } // Solidnie -> 1d -> 3d -> 6d
        state.sprintReps = reps;
        state.interval = +(interval / DAY).toFixed(3);
        state.nextReview = Date.now() + interval;
        state.mastery = quality >= 3 ? Math.min(100, prevMastery + 20) : Math.max(0, prevMastery - 15);

        this._data.lessons[lessonId] = state;
        this.incrementStreak();
        this.save();
        return state;
    },

    // --- Gamification ---
    addXP(amount) {
        if (!this._data.gamify) {
            this._data.gamify = { xp: 0, level: 1, dailyQuests: { date: null, completed: 0 } };
        }
        this._data.gamify.xp += amount;
        
        // Level up logic (e.g. 100 * level^1.5)
        let currentLevel = this._data.gamify.level || 1;
        let xpNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));
        
        let leveledUp = false;
        while (this._data.gamify.xp >= xpNeeded) {
            this._data.gamify.xp -= xpNeeded;
            currentLevel++;
            this._data.gamify.level = currentLevel;
            xpNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));
            leveledUp = true;
        }
        
        this.save();
        return { leveledUp, level: currentLevel };
    },

    getGamifyState() {
        return this._data.gamify || { xp: 0, level: 1, dailyQuests: { date: null, completed: 0 } };
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    Store.init();
});
