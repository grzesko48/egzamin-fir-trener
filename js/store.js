const Store = {
    _data: {
        progress: {}, // chapter_id -> boolean
        streak: { count: 0, lastDate: null },
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
        this.save();
    },

    getHistory() {
        return this._data.history;
    },

    // --- Streak ---
    updateStreak() {
        const todayStr = new Date().toDateString();
        const last = this._data.streak.lastDate;
        
        if (last !== todayStr) {
            if (last) {
                const lastDateObj = new Date(last);
                const diffTime = Math.abs(new Date() - lastDateObj);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays > 1) {
                    this._data.streak.count = 0;
                }
            } else {
                this._data.streak.count = 0;
            }
            this.save();
        }
    },
    
    incrementStreak() {
        const todayStr = new Date().toDateString();
        if (this._data.streak.lastDate !== todayStr) {
            this._data.streak.count++;
            this._data.streak.lastDate = todayStr;
        }
        this.logActivity();
        this.save();
        return true;
    },

    getStreak() { return this._data.streak.count; },

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

        // Harmonogram: FSRS (model DSR), fallback prosty
        if (typeof FSRS !== 'undefined') {
            state = FSRS.schedule(state, quality, Date.now());
        } else {
            state.interval = quality >= 3 ? Math.max(1, Math.round((state.interval || 1) * 2)) : 1;
            state.nextReview = Date.now() + state.interval * 24 * 60 * 60 * 1000;
        }

        // Mastery 0-100% (zachowane dla UI/Pulpitu)
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
