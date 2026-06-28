/**
 * Learn Mode Engine V4 Premium - RPG & Active Learning Super-App
 * HARDCORE DARK SOULS EDITION (2026 AAAA Edition).
 * Features: Souls & Bloodstains, Bonfires, Hardcore damage scaling, audio synth, GSAP animations.
 */

// Boss templates for all chapters
const BOSS_TEMPLATES = {
    'fundament': { name: 'Architekt Bilansu', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Strażnik zasad memoriałowych i WACC. Zmierzy się z Tobą w bezlitosnym starciu z podstaw finansowych.', rewardItem: 'Złoty Kalkulator' },
    'stopy': { name: 'Kolekcjoner Stóp NBP', hp: 320, image: 'boss_bilans.png', hue: 45, desc: 'Pan korytarza stóp procentowych. Czy potrafisz obliczyć stopę lombardową i depozytową w locie?', rewardItem: 'Wizor Rynkowy' },
    'k5': { name: 'Dyskontowy Demon NPV', hp: 340, image: 'boss_golem.png', hue: 120, desc: 'Władca przyszłej wartości pieniądza. Będzie rzucał w Ciebie trudnymi wzorami NPV i IRR.', rewardItem: 'Złoty Kalkulator' },
    'k1': { name: 'Cenzor Memoriału', hp: 300, image: 'boss_bilans.png', hue: 180, desc: 'Bezlitosny strażnik zasady współmierności przychodów i kosztów. Uważaj na podejście kasowe!', rewardItem: 'Garnitur Audytora' },
    'k2': { name: 'Wyceniacz Pasywów', hp: 350, image: 'boss_golem.png', hue: 200, desc: 'Stoi na straży wyceny aktywów w bilansie według kosztu historycznego i wartości godziwej.', rewardItem: 'Garnitur Audytora' },
    'k3': { name: 'Golem Upadłości', hp: 380, image: 'boss_golem.png', hue: 0, desc: 'Monstrum zasilane wskaźnikiem Altmana. Zmierzy się z Tobą w analizie rentowności i płynności.', rewardItem: 'Pas Kulturystyczny' },
    'k4': { name: 'Mistrz Kosztów Zmiennych', hp: 330, image: 'boss_bilans.png', hue: 240, desc: 'Sprawdza próg rentowności i marżę pokrycia. Każda pomyłka obniży Twój BEP do zera.', rewardItem: 'Pas Kulturystyczny' },
    'k6': { name: 'Kapitalista WACC', hp: 360, image: 'boss_golem.png', hue: 280, desc: 'Tarcza podatkowa to jego zbroja. Spróbuje zniszczyć Twój portfel kosztem kapitału obcego.', rewardItem: 'Kamizelka Finansisty' },
    'k7': { name: 'Pożeracz Płynności KON', hp: 320, image: 'boss_bilans.png', hue: 300, desc: 'Zamraża gotówkę w cyklu konwersji. Musisz skrócić DSO i DIO, aby zadać mu obrażenia.', rewardItem: 'Notatnik Rynkowy' },
    'k8': { name: 'Wyceniacz DCF', hp: 400, image: 'boss_golem.png', hue: 90, desc: 'Wycenia firmy dochodowo i porównawczo. Wymaga znajomości NOPAT, WACC oraz EVA.', rewardItem: 'Notatnik Rynkowy' },
    'k9': { name: 'Arbitrażowy Arbitr', hp: 350, image: 'boss_bilans.png', hue: 150, desc: 'Strażnik prawa jednej ceny. Zmusi Cię do wyłapania okazji arbitrażowych na rynku.', rewardItem: 'Notatnik Rynkowy' },
    'k10': { name: 'Gubernator Monetarny', hp: 370, image: 'boss_golem.png', hue: 60, desc: 'Kontroluje podaż pieniądza. Będzie walczył stopami procentowymi i rezerwą obowiązkową.', rewardItem: 'Wizor Rynkowy' },
    'k11': { name: 'Poborca Podatkowy CIT', hp: 340, image: 'boss_bilans.png', hue: 320, desc: 'Ściąga podatki bezpośrednie i pośrednie. Zmierzy się z Tobą w kalkulacji dochodu CIT.', rewardItem: 'Garnitur Audytora' },
    'k12': { name: 'Tytan Recesji', hp: 420, image: 'boss_golem.png', hue: 340, desc: 'Władca cyklu koniunkturalnego. Musisz przetrwać jego recesję, odpowiadając na pytania PKB.', rewardItem: 'Pas Kulturystyczny' },
    't1': { name: 'Władca Value at Risk (VaR)', hp: 400, image: 'boss_golem.png', hue: 200, desc: 'Mierzy maksymalną stratę z określonym prawdopodobieństwem. Czy przetrwasz jego test stresu?', rewardItem: 'Wizor Rynkowy' },
    't2': { name: 'Audytor Kredytowy', hp: 360, image: 'boss_bilans.png', hue: 210, desc: 'Sprawdza zdolność kredytową i asymetrię informacji. Uważaj na selekcję negatywną!', rewardItem: 'Garnitur Audytora' },
    't5': { name: 'Syntetyk Opcji', hp: 380, image: 'boss_golem.png', hue: 130, desc: 'Tworzy skomplikowane struktury opcyjne. Będziesz musiał wycenić opcje i spłacić premię.', rewardItem: 'Notatnik Rynkowy' },
    't11': { name: 'Kosztodawca Międzynarodowy', hp: 350, image: 'boss_bilans.png', hue: 160, desc: 'Liczy koszt kapitału w transgranicznych fuzjach. Przygotuj się na parytet inflacji.', rewardItem: 'Kamizelka Finansisty' },
    't3': { name: 'Inspektor MSR', hp: 360, image: 'boss_golem.png', hue: 180, desc: 'Weryfikuje zgodność z Międzynarodowymi Standardami Rachunkowości bankowej.', rewardItem: 'Garnitur Audytora' },
    't4': { name: 'Wykresowy Manipulator', hp: 330, image: 'boss_bilans.png', hue: 250, desc: 'Mistrz formacji świecowych i średnich kroczących. Przetestuje Twoją analizę techniczną.', rewardItem: 'Notatnik Rynkowy' },
    't6': { name: 'Bankier Produktowy', hp: 340, image: 'boss_golem.png', hue: 270, desc: 'Zna na pamięć każdy produkt bankowy i prowizję. Spróbuje obciążyć Cię kosztami.', rewardItem: 'Wizor Rynkowy' },
    't8': { name: 'Kontroler Odchyleń', hp: 350, image: 'boss_bilans.png', hue: 80, desc: 'Porównuje plany z wykonaniem. Każda odchyłka od normy to obrażenia dla Twojego HP.', rewardItem: 'Pas Kulturystyczny' },
    't9': { name: 'Strażnik Budżetu', hp: 370, image: 'boss_golem.png', hue: 110, desc: 'Pilnuje dyscypliny budżetowej w przedsiębiorstwie. Wymaga precyzyjnych prognoz.', rewardItem: 'Kamizelka Finansisty' },
    't7': { name: 'Likwidator Szkód OFE', hp: 380, image: 'boss_bilans.png', hue: 140, desc: 'Władca ubezpieczeń i funduszy emerytalnych. Oblicz renty dożywotnie, by go pokonać.', rewardItem: 'Pas Kulturystyczny' },
    't10': { name: 'Spekulant Forex', hp: 410, image: 'boss_golem.png', hue: 220, desc: 'Manipuluje kursami walut. Musisz przewidzieć ruchy par walutowych Forex.', rewardItem: 'Wizor Rynkowy' },
    't12': { name: 'Władca Swapów i Futures', hp: 450, image: 'boss_golem.png', hue: 310, desc: 'Ostateczny boss instrumentów pochodnych. Zabezpiecz pozycje, aby przeżyć.', rewardItem: 'Notatnik Rynkowy' }
};

// Web Audio API Synthesizer for offline haptic feedback
window.LearnSound = {
    ctx: null,
    init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Web Audio API not supported", e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playSuccess() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.35);
    },
    playDamage() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.25);
    },
    playLevelUp() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
        const times = [0, 0.08, 0.16, 0.24, 0.32, 0.40];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + times[idx]);
            gain.gain.setValueAtTime(0.1, now + times[idx]);
            gain.gain.exponentialRampToValueAtTime(0.005, now + times[idx] + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + times[idx]);
            osc.stop(now + times[idx] + 0.4);
        });
    },
    playVictory() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [349.23, 440.00, 523.25, 587.33, 698.46, 880.00, 1046.50];
        const times = [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + times[idx]);
            gain.gain.setValueAtTime(0.08, now + times[idx]);
            gain.gain.exponentialRampToValueAtTime(0.005, now + times[idx] + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + times[idx]);
            osc.stop(now + times[idx] + 0.5);
        });
    },
    playDefeat() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [220.00, 196.00, 174.61, 146.83];
        const times = [0, 0.15, 0.30, 0.45];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + times[idx]);
            gain.gain.setValueAtTime(0.12, now + times[idx]);
            gain.gain.exponentialRampToValueAtTime(0.005, now + times[idx] + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + times[idx]);
            osc.stop(now + times[idx] + 0.4);
        });
    }
};

window.Learn = {
    data: [],
    currentLessonIndex: 0,
    currentStepIndex: 0,
    lessonState: 'map', // 'map', 'creator', 'intro', 'step', 'outro', 'boss_battle'
    activeQuest: null, // lesson object
    queue: [], // SRS due queue
    earnedQuality: [], // track qualities during active lesson
    selectedFeynmanOrder: [],
    scrambledFeynmanBlocks: [],
    blurtingChecklist: [],
    activeBoss: null,
    bossPool: [],
    keydownHandler: null,

    init(lessonsData) {
        if (!lessonsData || !lessonsData.lessons) return;
        this.data = lessonsData.lessons;

        // Initialize RPG stats if missing
        if (!Store._data.avatar) {
            Store._data.avatar = null;
        }
        if (Store._data.vitality === undefined) {
            Store._data.vitality = 100;
        }

        // Initialize souls and bloodstain systems for Hardcore mode
        if (Store._data.avatar) {
            if (Store._data.avatar.souls === undefined) Store._data.avatar.souls = 0;
            if (Store._data.avatar.level === undefined) Store._data.avatar.level = 1;
            if (Store._data.avatar.bloodstain === undefined) Store._data.avatar.bloodstain = null;
        }
        
        // Override store level-up callback for retro sound
        const originalAddXP = Store.addXP;
        Store.addXP = function(amount) {
            // In Dark Souls Mode, XP is raw souls. No auto level up.
            const avatar = Store._data.avatar;
            if (avatar) {
                avatar.souls += amount;
                Store.save();
            }
            return { leveledUp: false }; 
        };

        this.populateFilters();
        this.loadQueue();
        this.setupKeyboard();
        this.renderRPGPanel();
        this.renderMain();
    },

    setupKeyboard() {
        if (this.keydownHandler) document.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = (e) => {
            if (!document.getElementById('view-learn')?.classList.contains('active')) return;
            
            // Ignore when typing
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    const submitBtn = document.querySelector('#learn-controls button.primary');
                    if (submitBtn) submitBtn.click();
                }
                return;
            }

            const controls = document.getElementById('learn-controls');
            if (!controls || controls.style.display === 'none') return;

            if (e.key === 'Enter') {
                const primary = controls.querySelector('button.primary') || controls.querySelector('button');
                if (primary) {
                    e.preventDefault();
                    primary.click();
                }
            } else if (['1', '2', '3', '4'].includes(e.key)) {
                const btns = document.querySelectorAll('#step-content .btn.secondary, #learn-controls .btn-srs');
                const idx = parseInt(e.key) - 1;
                if (btns && btns[idx] && !btns[idx].disabled) {
                    e.preventDefault();
                    btns[idx].click();
                }
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
    },

    populateFilters() {
        const filterEl = document.getElementById('learn-chapter-filter');
        if (!filterEl) return;
        filterEl.innerHTML = '<option value="all">Wszystkie działy</option>';
        
        const chapters = [...new Set(this.data.map(l => l.chapter))];
        chapters.forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch;
            const chapterDef = typeof App !== 'undefined' && App.data && App.data.chapters 
                ? App.data.chapters.find(c => c.id === ch) 
                : null;
            opt.textContent = chapterDef ? chapterDef.title : `Dział: ${ch}`;
            filterEl.appendChild(opt);
        });
        
        filterEl.addEventListener('change', () => {
            this.loadQueue();
            this.renderMain();
        });
        if (typeof UISelect !== 'undefined') UISelect.init();
    },

    loadQueue() {
        const chapterFilter = document.getElementById('learn-chapter-filter')?.value || 'all';
        let pool = this.data;
        if (chapterFilter !== 'all') {
            pool = pool.filter(l => l.chapter === chapterFilter);
        }
        
        const now = Date.now();
        this.queue = pool.filter(l => {
            const state = Store.getLessonState(l.id);
            const nr = Number(state.nextReview) || 0;
            return nr <= now;
        });

        this.queue.sort((a, b) => {
            return (Number(Store.getLessonState(a.id).nextReview) || 0) - (Number(Store.getLessonState(b.id).nextReview) || 0);
        });
    },

    // --- Dynamic Character Titles based on level ---
    getCharacterRank(className, level) {
        if (className === 'audytor') {
            if (level < 3) return 'Młodszy Księgowy';
            if (level < 6) return 'Starszy Analityk';
            if (level < 10) return 'Wielki Audytor';
            return 'Wiceprezes ds. Fuzji';
        } else if (className === 'kinezjolog') {
            if (level < 3) return 'Adept Treningu';
            if (level < 6) return 'Trener Personalny';
            if (level < 10) return 'Kinezjolog Kliniczny';
            return 'Mistrz Biomechaniki';
        } else {
            if (level < 3) return 'Stażysta Rynkowy';
            if (level < 6) return 'Doradca Inwestycyjny';
            if (level < 10) return 'Strateg Rynkowy';
            return 'Prezes Funduszu';
        }
    },

    // --- RPG Panel Renderer ---
    renderRPGPanel() {
        const panel = document.getElementById('rpg-character-panel');
        if (!panel) return;

        const avatar = Store._data.avatar;
        if (!avatar) {
            panel.innerHTML = `
                <div style="text-align: center; padding: 1rem 0; width:100%;">
                    <h3 class="gradient-text">Bohater Nieaktywny</h3>
                    <p class="text-muted" style="font-size:0.85rem; margin-top: 0.5rem;">Wybierz klasę postaci po prawej stronie, aby rozpocząć grę.</p>
                </div>
            `;
            return;
        }

        const currentLevel = avatar.level || 1;
        const rank = this.getCharacterRank(avatar.class, currentLevel);
        const classNames = { audytor: 'Wielki Audytor', kinezjolog: 'Kinezjolog', strateg: 'Strateg Rynkowy' };
        const name = classNames[avatar.class] || 'Student';

        const souls = avatar.souls || 0;
        const soulsNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));
        const xpPercent = Math.min(100, Math.round((souls / soulsNeeded) * 100));

        const hp = avatar.hp || 100;
        const maxHp = avatar.maxHp || 100;
        const hpPercent = Math.min(100, Math.round((hp / maxHp) * 100));

        const vit = Store._data.vitality || 100;
        const vitPercent = Math.min(100, Math.round((vit / 100) * 100));

        const eq = avatar.eq || { head: null, weapon: null, chest: null };

        // Determine item graphic display inside slots
        let weaponImg = '⚪';
        if (eq.weapon === 'Złoty Kalkulator') weaponImg = `<img src="assets/avatars/item_kalkulator.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px;" />`;
        else if (eq.weapon === 'Hantel 50kg') weaponImg = `<img src="assets/avatars/item_hantel.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px;" />`;
        else if (eq.weapon === 'Notatnik Rynkowy') weaponImg = `<img src="assets/avatars/item_notatnik.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px;" />`;

        let chestImg = '⚪';
        if (eq.chest === 'Garnitur Audytora') chestImg = `<img src="assets/avatars/item_garnitur.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px;" />`;
        else if (eq.chest === 'Pas Kulturystyczny') chestImg = `<img src="assets/avatars/item_pas.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px;" />`;
        else if (eq.chest === 'Kamizelka Finansisty') chestImg = `<img src="assets/avatars/item_garnitur.png?v=2026" style="width:100%; height:100%; object-fit:cover; border-radius:11px; filter: hue-rotate(90deg);" />`;

        panel.innerHTML = `
            <div class="rpg-avatar-box" style="width: 100%;">
                <div class="avatar-image-container" style="border: 2px solid var(--primary); width:120px; height:120px; overflow:hidden; border-radius:50%;">
                    <img src="assets/avatars/${avatar.class}.png?v=2026" style="width:100%; height:100%; object-fit:cover;" alt="Avatar" />
                </div>
                <h3 style="margin: 0.5rem 0 0 0;" class="gradient-text">${name}</h3>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Poziom ${currentLevel} • ${rank}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                <!-- HP Bar -->
                <div class="rpg-stat-bar bar-hp">
                    <div class="bar-label">
                        <span>❤️ Punkty Życia</span>
                        <span>${hp} / ${maxHp}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${hpPercent}%;"></div>
                    </div>
                </div>

                <!-- Vitality Bar -->
                <div class="rpg-stat-bar bar-vitality">
                    <div class="bar-label">
                        <span>⚡ Witalność (Energia)</span>
                        <span>${vit} / 100</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${vitPercent}%;"></div>
                    </div>
                </div>

                <!-- Souls (XP) Bar -->
                <div class="rpg-stat-bar bar-xp">
                    <div class="bar-label">
                        <span style="color:#ffa726;">🔥 Zebrane Dusze (Souls)</span>
                        <span>${souls} / ${soulsNeeded}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${xpPercent}%; background: linear-gradient(90deg, #ff5722, #ffb74d); box-shadow: 0 0 8px rgba(255,87,34,0.5);"></div>
                    </div>
                </div>
            </div>

            <!-- Equipment Section -->
            <div style="width: 100%;" class="rpg-equipment-section">
                <h4 style="margin-bottom: 0.8rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Ekwipunek</h4>
                <div class="rpg-equipment-grid">
                    <div class="rpg-eq-slot ${eq.head ? 'equipped' : ''}" onclick="window.Learn.inspectItem('head')">
                        ${eq.head ? '🎓' : '⚪'}
                        <div class="slot-name">Głowa</div>
                    </div>
                    <div class="rpg-eq-slot ${eq.weapon ? 'equipped' : ''}" onclick="window.Learn.inspectItem('weapon')">
                        ${weaponImg}
                        <div class="slot-name">Broń</div>
                    </div>
                    <div class="rpg-eq-slot ${eq.chest ? 'equipped' : ''}" onclick="window.Learn.inspectItem('chest')">
                        ${chestImg}
                        <div class="slot-name">Klatka</div>
                    </div>
                </div>
            </div>
            
            <button class="btn secondary ripple" style="width: 100%; font-size: 0.85rem; padding: 0.6rem;" onclick="window.Learn.resetAvatar()">Zresetuj Postać</button>
        `;
    },

    inspectItem(slot) {
        const avatar = Store._data.avatar;
        if (!avatar || !avatar.eq) return;
        const item = avatar.eq[slot];

        // Animated AAAA Inspect Modal Overlay (No browser alert)
        const modal = document.createElement('div');
        modal.className = 'view-container active';
        modal.style.zIndex = '10005';
        modal.style.background = 'rgba(5, 5, 10, 0.85)';
        modal.style.backdropFilter = 'blur(15px)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        let itemTitle = item || 'Pusty Slot';
        let itemIcon = '⚪';
        let itemDesc = 'Zdobądź przedmioty za pokonywanie bossów lub awans poziomu!';

        if (slot === 'head') {
            itemIcon = '🎓';
            if (item) {
                itemTitle = item;
                itemDesc = 'Okulary Analityka. Chronią wzrok przed zmęczeniem i dodają +10% do zyskiwanego XP.';
            } else {
                itemTitle = 'Pusty Slot Głowy';
            }
        } else if (slot === 'weapon') {
            if (item === 'Złoty Kalkulator') { 
                itemIcon = `<img src="assets/avatars/item_kalkulator.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow);" />`; 
                itemDesc = 'Mityczne narzędzie matematyczne. Zwiększa obrażenia zadawane Bossom o 15% oraz dodaje 10% XP za poprawne odpowiedzi.'; 
            } else if (item === 'Hantel 50kg') { 
                itemIcon = `<img src="assets/avatars/item_hantel.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--success); box-shadow: 0 0 15px rgba(0,255,100,0.3);" />`; 
                itemDesc = 'Ultraciężki ciężar. Każde uderzenie w Bossa zadaje 20% więcej obrażeń.'; 
            } else if (item === 'Notatnik Rynkowy') { 
                itemIcon = `<img src="assets/avatars/item_notatnik.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--secondary); box-shadow: 0 0 15px rgba(0,229,255,0.3);" />`; 
                itemDesc = 'Uporządkowane tabele finansowe. Zwiększa zysk punktów XP o 20% na wszystkich zadaniach.'; 
            } else { 
                itemTitle = 'Pusty Slot Broni'; 
            }
        } else if (slot === 'chest') {
            if (item === 'Garnitur Audytora') { 
                itemIcon = `<img src="assets/avatars/item_garnitur.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow);" />`; 
                itemDesc = 'Wzmacnia autorytet. Zwiększa maksymalne HP postaci o 25 punktów.'; 
            } else if (item === 'Pas Kulturystyczny') { 
                itemIcon = `<img src="assets/avatars/item_pas.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--success); box-shadow: 0 0 15px rgba(0,255,100,0.3);" />`; 
                itemDesc = 'Zabezpiecza kręgosłup. Chroni przed obrażeniami z błędnych odpowiedzi (redukuje straty HP o 5 punktów).'; 
            } else if (item === 'Kamizelka Finansisty') { 
                itemIcon = `<img src="assets/avatars/item_garnitur.png" style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--secondary); filter: hue-rotate(90deg); box-shadow: 0 0 15px rgba(0,229,255,0.3);" />`; 
                itemDesc = 'Ochronny styl korporacyjny. Zwiększa maksymalne HP o 15 punktów.'; 
            } else { 
                itemTitle = 'Pusty Slot Pancerza'; 
            }
        }

        const iconContainer = itemIcon.startsWith('<img') 
            ? itemIcon 
            : `<div style="font-size: 4.5rem; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));">${itemIcon}</div>`;

        modal.innerHTML = `
            <div class="glass-card inspect-item-modal fade-in" style="width:100%; max-width:440px; text-align:center; padding: 2.5rem; border-color: rgba(0, 229, 255, 0.4); box-shadow: 0 0 25px rgba(0,229,255,0.25);">
                <div style="margin-bottom: 1.5rem; display:flex; justify-content:center;">${iconContainer}</div>
                <h3 class="gradient-text" style="font-size:1.6rem; margin-bottom:0.3rem;">${itemTitle}</h3>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom:1.5rem;">Slot: ${slot === 'head' ? 'Głowa' : (slot === 'weapon' ? 'Broń / Narzędzie' : 'Pancerz / Ubiór')}</div>
                <p class="text-muted" style="line-height: 1.6; font-size:1rem; margin-bottom: 2rem;">${itemDesc}</p>
                <button class="btn primary ripple" style="width:100%; border-radius:24px; padding:0.8rem 1.5rem;">Zamknij Panel</button>
            </div>
        `;

        document.body.appendChild(modal);

        const card = modal.querySelector('.glass-card');
        const btn = modal.querySelector('button');

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" });
        }

        btn.onclick = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(modal, { opacity: 0, duration: 0.25, onComplete: () => modal.remove() });
            } else {
                modal.remove();
            }
        };
    },

    resetAvatar() {
        if (confirm("Czy na pewno chcesz usunąć swojego bohatera RPG i zresetować jego statystyki?")) {
            Store._data.avatar = null;
            Store.save();
            this.lessonState = 'creator';
            this.renderRPGPanel();
            this.renderMain();
        }
    },

    // --- Cinematic GSAP Transition Wrapper ---
    animateTransition(updateCallback) {
        const container = document.getElementById('learn-container');
        // ZAWSZE renderuj treść NATYCHMIAST (niezawodnie), animację rób na gotowej treści.
        updateCallback();
        if (container && typeof gsap !== 'undefined') {
            gsap.fromTo(container,
                { opacity: 0, y: -12 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "opacity,transform" }
            );
        }
    },

    // --- Main Study Area Router ---
    renderMain() {
        const titleEl = document.getElementById('learn-view-title');
        const filterEl = document.getElementById('learn-filter-container');
        const controls = document.getElementById('learn-controls');

        if (!Store._data.avatar) {
            this.lessonState = 'creator';
        }

        if (this.lessonState === 'map' || this.lessonState === 'creator') {
            if (titleEl) titleEl.textContent = "Kampania Lekcji";
            if (filterEl) filterEl.style.display = 'block';
            if (controls) controls.style.display = 'none';
        } else {
            if (filterEl) filterEl.style.display = 'none';
        }

        this.animateTransition(() => {
            switch (this.lessonState) {
                case 'creator':
                    this.renderCreator();
                    break;
                case 'map':
                    this.renderMap();
                    break;
                case 'intro':
                    this.renderIntro();
                    break;
                case 'step':
                    this.renderStep();
                    break;
                case 'outro':
                    this.renderOutro();
                    break;
                case 'boss_battle':
                    this.renderBossBattle();
                    break;
            }
        });
    },

    // --- RPG Character Creator Screen ---
    renderCreator() {
        const container = document.getElementById('learn-container');
        if (!container) return;

        container.innerHTML = `
            <div class="glass-card" style="width:100%; text-align:center; padding: 2.5rem;">
                <div style="font-size: 4.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 15px var(--primary));">⚔️</div>
                <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary);">Rozpocznij Kognitywną Przygodę</h2>
                <p class="text-muted" style="margin-bottom: 2.5rem;">Wybierz klasę swojego bohatera. Każda klasa posiada unikalne bonusy ułatwiające opanowanie materiału w 7 dni.</p>
                
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; text-align: left; width: 100%;">
                    
                    <!-- Class 1 -->
                    <div class="glass-card class-card-rpg ripple" style="cursor:pointer; border-color: rgba(255, 234, 0, 0.2); padding: 1.5rem; transition: all 0.3s; display:flex; flex-direction:column; align-items:center; text-align:center;" onclick="window.Learn.createHero('audytor')">
                        <img src="assets/avatars/audytor.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow); margin-bottom: 1.2rem;" alt="Audytor" />
                        <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Wielki Audytor</h3>
                        <p class="text-muted" style="font-size: 0.85rem; line-height:1.5;">Ekspert bilansów i WACC. Rozpoczyna ze <b>Złotym Kalkulatorem</b> (+15% XP) i <b>Garniturem Audytora</b> (+25 max HP).</p>
                    </div>

                    <!-- Class 2 -->
                    <div class="glass-card class-card-rpg ripple" style="cursor:pointer; border-color: rgba(0, 255, 100, 0.2); padding: 1.5rem; transition: all 0.3s; display:flex; flex-direction:column; align-items:center; text-align:center;" onclick="window.Learn.createHero('kinezjolog')">
                        <img src="assets/avatars/kinezjolog.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--success); box-shadow: 0 0 15px rgba(0,255,100,0.3); margin-bottom: 1.2rem;" alt="Kinezjolog" />
                        <h3 style="color: var(--success); margin-bottom: 0.5rem;">Kinezjolog</h3>
                        <p class="text-muted" style="font-size: 0.85rem; line-height:1.5;">Mistrz fizjologii i biomechaniki. Otrzymuje <b>Hantel 50kg</b> (+20% obrażeń) oraz <b>Pas Kulturystyczny</b> (redukuje straty HP).</p>
                    </div>

                    <!-- Class 3 -->
                    <div class="glass-card class-card-rpg ripple" style="cursor:pointer; border-color: rgba(0, 229, 255, 0.2); padding: 1.5rem; transition: all 0.3s; display:flex; flex-direction:column; align-items:center; text-align:center;" onclick="window.Learn.createHero('strateg')">
                        <img src="assets/avatars/strateg.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--secondary); box-shadow: 0 0 15px rgba(0,229,255,0.3); margin-bottom: 1.2rem;" alt="Strateg" />
                        <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">Strateg Rynkowy</h3>
                        <p class="text-muted" style="font-size: 0.85rem; line-height:1.5;">Optymalizuje rynki rygoru. Otrzymuje <b>Notatnik Rynkowy</b> (+20% zysku XP) oraz <b>Kamizelkę Finansisty</b> (+15 max HP).</p>
                    </div>

                </div>
            </div>
        `;
        
        // Stagger animation on cards
        if (typeof gsap !== 'undefined') {
            gsap.from('.class-card-rpg', { opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" });
        }
    },

    createHero(className) {
        let eq = { head: null, weapon: null, chest: null };
        let maxHp = 100;
        
        if (className === 'audytor') {
            eq.weapon = 'Złoty Kalkulator';
            eq.chest = 'Garnitur Audytora';
            maxHp = 125;
        } else if (className === 'kinezjolog') {
            eq.weapon = 'Hantel 50kg';
            eq.chest = 'Pas Kulturystyczny';
        } else if (className === 'strateg') {
            eq.weapon = 'Notatnik Rynkowy';
            eq.chest = 'Kamizelka Finansisty';
            maxHp = 115;
        }

        Store._data.avatar = {
            class: className,
            hp: maxHp,
            maxHp: maxHp,
            eq: eq,
            souls: 0,
            level: 1,
            bloodstain: null
        };
        Store._data.vitality = 100;
        Store.save();

        window.LearnSound.playLevelUp();
        this.lessonState = 'map';
        this.renderRPGPanel();
        this.renderMain();
    },

    // --- Campaign Map Screen (Lessons & Dailies Selection) ---
    renderMap() {
        const container = document.getElementById('learn-container');
        if (!container) return;

        this.loadQueue();
        const avatar = Store._data.avatar;
        const currentLevel = avatar?.level || 1;
        const souls = avatar?.souls || 0;
        const soulsNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));

        const chapterFilter = document.getElementById('learn-chapter-filter')?.value || 'all';
        let lessonsPool = this.data;
        if (chapterFilter !== 'all') {
            lessonsPool = lessonsPool.filter(l => l.chapter === chapterFilter);
        }

        // --- BONFIRE (Ognisko) & LEVEL UP CARD ---
        let bonfireHTML = `
            <div class="glass-card bonfire-card fade-in" style="width: 100%; margin-bottom: 2rem; padding: 2rem; border-color: #ff5722; text-align: center; box-shadow: 0 0 20px rgba(255, 87, 34, 0.2);">
                <div style="width: 90px; height: 90px; margin: 0 auto 1rem auto; filter: drop-shadow(0 0 15px #ff5722); animation: pulse 2s infinite; border-radius: 50%; overflow: hidden;">
                    <img src="assets/avatars/bonfire.png?v=2026" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <h3 style="color: #ff5722; margin: 0 0 0.5rem 0; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">Ognisko Ocalenia (Bonfire)</h3>
                <p class="text-muted" style="font-size: 0.9rem; max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
                    Odpocznij, aby uleczyć rany i odzyskać witalność. Odpoczynek przywraca 100% HP i Energii, ale <b>wszystkie codzienne powtórki (przeciwnicy) natychmiast odrodzą się na mapie!</b>
                </p>
                
                <div style="display:flex; justify-content:center; gap: 1rem; flex-wrap:wrap; margin-bottom:1rem;">
                    <button class="btn warning ripple" style="font-weight: bold; border-color:#ff5722; background:rgba(255,87,34,0.15); padding: 0.8rem 1.5rem; border-radius:30px;" onclick="window.Learn.restAtBonfire()">Odpocznij (Ulecz HP i Energię)</button>
                    <button class="btn primary ripple" style="font-weight: bold; padding: 0.8rem 1.5rem; border-radius:30px;" ${souls >= soulsNeeded ? '' : 'disabled'} onclick="window.Learn.buyLevelUp()">Awansuj Poziom (Koszt: ${soulsNeeded} Duszy)</button>
                </div>
            </div>
        `;

        let dailiesHTML = '';
        if (this.queue.length > 0) {
            dailiesHTML = `
                <div class="glass-card fade-in" style="width: 100%; border-color: var(--warning); background: rgba(255, 234, 0, 0.02); margin-bottom: 2rem; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: 0 0 15px rgba(255,234,0,0.05);">
                    <div>
                        <h3 style="color: var(--warning); display: flex; align-items: center; gap: 0.5rem; margin: 0;">⏱️ Zjawy Pamięciowe (Powtórki)</h3>
                        <p class="text-muted" style="font-size: 0.9rem; margin-top: 0.3rem;">Masz <b>${this.queue.length}</b> aktywnych zjaw kognitywnych do pokonania w celu regeneracji witalności.</p>
                    </div>
                    <button class="btn warning ripple" style="font-weight: bold; padding: 0.8rem 1.5rem; border-radius:30px;" onclick="window.Learn.startDailies()">Rozpocznij Walkę (+20⚡)</button>
                </div>
            `;
        }

        // Group lessons by Chapter
        const uniqueChapters = [...new Set(lessonsPool.map(l => l.chapter))];
        let mapHTML = '';

        uniqueChapters.forEach(ch => {
            const chapterLessons = lessonsPool.filter(l => l.chapter === ch);
            const chapterDef = typeof App !== 'undefined' && App.data && App.data.chapters 
                ? App.data.chapters.find(c => c.id === ch) 
                : null;
            const chapterTitle = chapterDef ? chapterDef.title : `Kategoria: ${ch.toUpperCase()}`;

            const totalMastery = chapterLessons.reduce((acc, l) => acc + (Store.getLessonState(l.id).mastery || 0), 0);
            const avgMastery = chapterLessons.length > 0 ? Math.round(totalMastery / chapterLessons.length) : 0;

            const boss = BOSS_TEMPLATES[ch] || { name: 'Strażnik Działu', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Tajemniczy strażnik kognitywny.', rewardItem: 'Złoty Kalkulator' };
            const isBossUnlocked = avgMastery >= 50;

            let lessonsListHTML = '';
            chapterLessons.forEach(lesson => {
                const state = Store.getLessonState(lesson.id);
                const mastery = state.mastery || 0;
                
                // Check if bloodstain is dropped here
                const hasBloodstain = avatar?.bloodstain && avatar.bloodstain.lessonId === lesson.id;
                const bloodstainBadge = hasBloodstain 
                    ? `<span style="font-size: 0.75rem; background: rgba(0, 230, 118, 0.15); border:1px solid var(--success); color: var(--success); padding: 4px 10px; border-radius:12px; font-weight: bold; margin-left: 0.5rem; display: inline-flex; align-items: center; gap: 6px; animation: pulse 1.5s infinite;"><img src="assets/avatars/bloodstain.png?v=2026" style="width: 14px; height: 14px; border-radius:50%; object-fit: cover;" /> Plama Krwi (${avatar.bloodstain.souls} Duszy)</span>`
                    : '';

                lessonsListHTML += `
                    <div class="quest-map-card ${mastery >= 100 ? 'completed' : 'unlocked'} ${hasBloodstain ? 'bloodstain-active' : ''}" onclick="window.Learn.selectLesson('${lesson.id}')" style="margin-bottom:0.8rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.3rem; max-width: 70%;">
                            <div style="font-size: 0.75rem; color: var(--primary); font-weight: bold; letter-spacing:0.5px; display:flex; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                                DZIEŃ ${lesson.day} • MISJA GŁÓWNA ${bloodstainBadge}
                            </div>
                            <h4 style="margin: 0; font-size: 1.1rem;">${lesson.title}</h4>
                        </div>
                        <div style="text-align: right; display:flex; flex-direction:column; align-items:flex-end; gap:0.3rem;">
                            <span style="font-weight: bold; font-size: 0.85rem; color: ${mastery >= 80 ? 'var(--success)' : (mastery >= 40 ? 'var(--warning)' : 'var(--danger)')}">${mastery}% Mastery</span>
                            <div style="width: 80px; height: 5px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;">
                                <div style="width: ${mastery}%; height: 100%; background: ${mastery >= 80 ? 'var(--success)' : (mastery >= 40 ? 'var(--warning)' : 'var(--danger)')};"></div>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Chapter Box HTML
            mapHTML += `
                <div class="glass-card" style="margin-bottom: 2rem; padding: 1.8rem; border-color: rgba(255,255,255,0.06);">
                    <div style="display:flex; justify-content:between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
                        <div>
                            <h3 style="margin: 0; font-size:1.25rem;" class="gradient-text">${chapterTitle}</h3>
                            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">Dział: ${ch.toUpperCase()} • Opanowanie: ${avgMastery}%</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column;">
                        ${lessonsListHTML}
                    </div>

                    <!-- Chapter Boss Card at the end of Chapter -->
                    <div class="boss-chapter-card ${isBossUnlocked ? 'unlocked' : 'locked'}" style="margin-top: 1.2rem; border: 1px solid ${isBossUnlocked ? 'rgba(255,23,68,0.4)' : 'rgba(255,255,255,0.05)'}; background: ${isBossUnlocked ? 'linear-gradient(135deg, rgba(255,23,68,0.04) 0%, transparent 100%)' : 'rgba(0,0,0,0.1)'}; padding: 1.2rem; border-radius: 14px; display: flex; align-items: center; gap: 1.2rem; justify-content: space-between; flex-wrap: wrap;">
                        <div style="display:flex; align-items:center; gap:1.2rem; max-width: 70%;">
                            <div style="width:68px; height:68px; border-radius:50%; overflow:hidden; border: 2px solid ${isBossUnlocked ? 'var(--danger)' : '#666'}; filter: hue-rotate(${boss.hue}deg) ${isBossUnlocked ? '' : 'grayscale(1)'}; flex-shrink: 0;">
                                <img src="assets/avatars/${boss.image}?v=2026" style="width:100%; height:100%; object-fit:cover;" />
                            </div>
                            <div style="text-align: left;">
                                <h4 style="margin: 0; color: ${isBossUnlocked ? 'var(--danger)' : 'var(--text-muted)'}; font-size:1.1rem; font-weight:800; display:flex; align-items:center; gap:0.5rem;">
                                    ⚔️ BOSS: ${boss.name}
                                </h4>
                                <p class="text-muted" style="font-size: 0.8rem; line-height:1.4; margin-top: 0.3rem;">${isBossUnlocked ? boss.desc : `Aura Bossa zablokowana. Osiągnij minimum <b>50% opanowania działu</b>, aby wyzwać go na starcie.`}</p>
                            </div>
                        </div>
                        <button class="btn ${isBossUnlocked ? 'danger' : 'secondary'} ripple" ${isBossUnlocked ? '' : 'disabled'} style="font-weight: bold; padding: 0.7rem 1.4rem; border-radius:24px; font-size: 0.85rem;" onclick="window.Learn.challengeBoss('${ch}')">
                            ${isBossUnlocked ? 'Rzuć Wyzwanie' : '🔒 Zablokowane'}
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            ${bonfireHTML}
            ${dailiesHTML}
            <div class="quest-list-container">
                ${mapHTML}
            </div>
        `;
    },

    restAtBonfire() {
        const avatar = Store._data.avatar;
        if (!avatar) return;

        // Bonfire restores all HP and energy
        avatar.hp = avatar.maxHp || 100;
        Store._data.vitality = 100;
        Store.save();

        window.LearnSound.playLevelUp();
        
        // Dark Souls enemy respawn logic: Resets all daily queues, reshuffling reviews back to map!
        if (window.LESSONS && window.LESSONS.lessons) {
            window.LESSONS.lessons.forEach(l => {
                const state = Store.getLessonState(l.id);
                // Reshuffle review times to current time, making Dailies active again!
                state.nextReview = Date.now();
                Store.updateLesson(l.id, state.mastery);
            });
        }
        
        alert("🔥 Odpocząłeś przy Ognisku. Twoje zdrowie i energia kognitywna zostały w pełni odnowione. Uważaj: cienie przeszłości (powtórki) odrodziły się!");
        
        this.loadQueue();
        this.renderRPGPanel();
        this.renderMain();
    },

    buyLevelUp() {
        const avatar = Store._data.avatar;
        if (!avatar) return;

        const currentLevel = avatar.level || 1;
        const soulsNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));

        if (avatar.souls < soulsNeeded) {
            alert("🔥 Masz zbyt mało dusz, by połączyć się z płomieniem.");
            return;
        }

        avatar.souls -= soulsNeeded;
        avatar.level = currentLevel + 1;
        
        // Permanent HP scaling
        avatar.maxHp = (avatar.maxHp || 100) + 5;
        avatar.hp = avatar.maxHp; // Full heal
        Store._data.vitality = 100;
        Store.save();

        // Trigger Level-Up modal overlay
        if (typeof Gamify !== 'undefined' && Gamify.showLevelUp) {
            Gamify.showLevelUp(avatar.level);
        }

        this.renderRPGPanel();
        this.renderMain();
    },

    startDailies() {
        if (this.queue.length === 0) return;
        
        this.activeQuest = this.queue[0];
        this.currentStepIndex = 0;
        this.earnedQuality = [];
        this.lessonState = 'step';
        
        Store._data.vitality = Math.min(100, (Store._data.vitality || 0) + 20);
        Store.save();
        this.renderRPGPanel();
        
        this.renderMain();
    },

    selectLesson(lessonId) {
        const lesson = this.data.find(l => l.id === lessonId);
        if (!lesson) return;

        const vit = Store._data.vitality || 0;
        if (vit < 20) {
            alert("⚡ Brak witalności! Odpocznij przy ognisku (Bonfire) lub pokonaj zjawy pamięciowe.");
            return;
        }

        Store._data.vitality = Math.max(0, vit - 20);
        Store.save();
        this.renderRPGPanel();

        this.activeQuest = lesson;
        this.currentStepIndex = 0;
        this.earnedQuality = [];
        this.lessonState = 'intro';
        this.renderMain();
    },

    // --- Quest Intro Screen ---
    renderIntro() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container || !this.activeQuest) return;

        const lesson = this.activeQuest;
        const firstTeach = lesson.steps.find(s => s.type === 'teach')?.html || '<p>Gotów na nową wiedzę?</p>';

        container.innerHTML = `
            <div class="glass-card fade-in" style="width: 100%; text-align: center; padding: 2.5rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px var(--primary-glow));">🎓</div>
                <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--primary);">${lesson.title}</h2>
                <div class="text-muted" style="margin-bottom: 2rem; font-weight: 500;">Dział: ${lesson.chapter}</div>
                
                <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2.5rem; border: 1px solid var(--border-glass); box-shadow: inset 0 0 15px rgba(0,0,0,0.4);">
                    <h4 style="color: var(--primary); margin-bottom: 1.2rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem; font-weight: 800;">Czego się nauczysz:</h4>
                    <div class="text-lg" style="line-height: 1.8; font-size: 1.15rem;">${firstTeach}</div>
                </div>
            </div>
        `;

        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.padding = '1rem 2rem';
            btn.style.borderRadius = '30px';
            btn.style.fontSize = '1.1rem';
            btn.textContent = 'Rozpocznij Starcie (Enter)';
            btn.onclick = () => {
                this.lessonState = 'step';
                this.currentStepIndex = 0;
                this.renderMain();
            };
            controls.appendChild(btn);
        }

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(container, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
        }
    },

    // --- Active Study step screen ---
    renderStep() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container || !this.activeQuest) return;

        const lesson = this.activeQuest;
        const step = lesson.steps[this.currentStepIndex];
        const pct = Math.round((this.currentStepIndex / lesson.steps.length) * 100);

        container.innerHTML = `
            <div class="glass-card fade-in hardcore-step" style="width: 100%; position: relative;">
                <!-- Postęp w lekcji -->
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600;">
                    <span>Postęp starcia</span>
                    <span>${this.currentStepIndex + 1} / ${lesson.steps.length}</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; margin-bottom: 2rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.03);">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.3s ease;"></div>
                </div>

                ${this.getRibbonHTML(step.type)}
                <div id="step-content"></div>
            </div>
        `;

        const contentEl = document.getElementById('step-content');
        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
        }

        if (step.type === 'teach' || step.type === 'example') {
            const npcName = lesson.chapter === 'fundament' || lesson.chapter === 'stopy' ? 'Wielki Audytor' : 'Trener-Mistrz';

            contentEl.innerHTML = `
                <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1rem; background: rgba(255,255,255,0.01); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.03); box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                    <div style="font-size: 2.8rem; background: rgba(0,229,255,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid var(--primary-glow); overflow:hidden;">
                        <img src="assets/avatars/${lesson.chapter === 'fundament' || lesson.chapter === 'stopy' ? 'audytor' : 'kinezjolog'}.png" style="width:100%; height:100%; object-fit:cover;" />
                    </div>
                    <div>
                        <div style="font-weight: bold; color: var(--primary); font-size: 1rem; margin-bottom: 0.5rem; letter-spacing: 0.5px;">💬 ${npcName}</div>
                        <div class="text-lg" style="line-height: 1.8; font-size: 1.1rem;">${step.html}</div>
                    </div>
                </div>
            `;
            
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            btn.textContent = 'Zrozumiałem, dalej (Enter)';
            btn.onclick = () => this.nextStep(5);
            controls.appendChild(btn);

        } else if (step.type === 'check') {
            const heading = `<h3 style="margin-bottom: 1.8rem; font-size: 1.4rem; line-height: 1.5; font-weight: 700;">${step.q}</h3>`;
            
            if (step.kind === 'mcq') {
                contentEl.innerHTML = heading;
                const grid = document.createElement('div');
                grid.style.display = 'grid';
                grid.style.gap = '12px';
                
                step.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'btn secondary ripple';
                    btn.style.textAlign = 'left';
                    btn.style.padding = '1.2rem 1.8rem';
                    btn.style.fontSize = '1.05rem';
                    btn.style.borderRadius = '14px';
                    btn.innerHTML = `<span style="opacity:0.4; margin-right: 1rem; font-weight: 800; font-size:1.1rem; color:var(--primary);">${idx+1}</span> ${opt}`;
                    
                    btn.onclick = () => {
                        Array.from(grid.children).forEach(b => b.disabled = true);
                        if (idx === step.correct) {
                            window.LearnSound.playSuccess();
                            btn.style.background = 'rgba(0, 255, 100, 0.12)';
                            btn.style.borderColor = 'var(--success)';
                            btn.style.boxShadow = '0 0 15px rgba(0,255,100,0.2)';
                            Gamify.awardXP(15, 'Szybki strzał');
                            if (this.activeBoss) this.damageBoss(50);
                            setTimeout(() => this.nextStep(5), 1000);
                        } else {
                            window.LearnSound.playDamage();
                            btn.style.background = 'rgba(255, 23, 68, 0.12)';
                            btn.style.borderColor = 'var(--danger)';
                            btn.style.boxShadow = '0 0 15px rgba(255,23,68,0.2)';
                            grid.children[step.correct].style.border = '2px solid var(--success)';
                            
                            this.takeDamage(35); // Hardcore Damage
                            this.showContextualHint(step.explain || 'Błąd. Zrozum zasady, zanim spróbujesz ponownie.');
                        }
                    };
                    grid.appendChild(btn);
                });
                contentEl.appendChild(grid);

            } else if (step.kind === 'num') {
                contentEl.innerHTML = heading;
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'glass-input';
                input.placeholder = `Wpisz wynik w jednostce: ${step.unit || 'liczba'}`;
                input.style.width = '100%';
                input.style.padding = '1.2rem';
                input.style.fontSize = '1.25rem';
                input.style.borderRadius = '14px';
                input.style.marginBottom = '1.5rem';
                contentEl.appendChild(input);

                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.style.borderRadius = '24px';
                btn.textContent = 'Zatwierdź Wynik (Enter)';

                const handleNumSubmit = () => {
                    const val = parseFloat(input.value);
                    if (isNaN(val)) return;
                    input.disabled = true;
                    const diff = Math.abs(val - step.answer);
                    if (diff <= (step.tol || 0)) {
                        window.LearnSound.playSuccess();
                        input.style.borderColor = 'var(--success)';
                        input.style.color = 'var(--success)';
                        Gamify.awardXP(20, 'Liczenie bezbłędne');
                        if (this.activeBoss) this.damageBoss(50);
                        setTimeout(() => this.nextStep(5), 1000);
                    } else {
                        window.LearnSound.playDamage();
                        input.style.borderColor = 'var(--danger)';
                        input.style.color = 'var(--danger)';
                        this.takeDamage(35); // Hardcore Damage
                        this.showContextualHint(`Poprawna odpowiedź to: <b>${step.answer}</b>.<br><br>${step.explain || ''}`);
                    }
                };

                btn.onclick = handleNumSubmit;
                input.addEventListener('keydown', e => { if (e.key === 'Enter') handleNumSubmit(); });
                controls.appendChild(btn);
                setTimeout(() => input.focus(), 100);

            } else if (step.kind === 'tf') {
                contentEl.innerHTML = heading;
                const grid = document.createElement('div');
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = '1fr 1fr';
                grid.style.gap = '12px';

                [['Prawda', true], ['Fałsz', false]].forEach(([label, val], idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'btn secondary ripple';
                    btn.style.padding = '1.8rem';
                    btn.style.fontSize = '1.1rem';
                    btn.style.borderRadius = '14px';
                    btn.innerHTML = `<span style="opacity:0.4; margin-right: 0.5rem; font-weight: 800; color:var(--primary);">${idx+1}</span> ${label}`;
                    
                    btn.onclick = () => {
                        Array.from(grid.children).forEach(b => b.disabled = true);
                        const isCorrect = (val === step.bool);
                        if (isCorrect) {
                            window.LearnSound.playSuccess();
                            btn.style.background = 'rgba(0, 255, 100, 0.12)';
                            btn.style.borderColor = 'var(--success)';
                            btn.style.boxShadow = '0 0 15px rgba(0,255,100,0.2)';
                            Gamify.awardXP(15, 'Dobra dedukcja');
                            if (this.activeBoss) this.damageBoss(50);
                            setTimeout(() => this.nextStep(5), 1000);
                        } else {
                            window.LearnSound.playDamage();
                            btn.style.background = 'rgba(255, 23, 68, 0.12)';
                            btn.style.borderColor = 'var(--danger)';
                            btn.style.boxShadow = '0 0 15px rgba(255,23,68,0.2)';
                            this.takeDamage(35); // Hardcore Damage
                            this.showContextualHint(step.explain || 'Błąd logiczny. Skup się.');
                        }
                    };
                    grid.appendChild(btn);
                });
                contentEl.appendChild(grid);

            } else if (step.kind === 'cloze') {
                contentEl.innerHTML = `${heading}<p class="text-muted" style="margin-top: -0.8rem; margin-bottom: 1.8rem;">Uzupełnij brakujące słowo / pojęcie.</p>`;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'glass-input';
                input.placeholder = 'Twoja odpowiedź...';
                input.style.width = '100%';
                input.style.padding = '1.2rem';
                input.style.fontSize = '1.15rem';
                input.style.borderRadius = '14px';
                input.style.marginBottom = '1.5rem';
                contentEl.appendChild(input);

                const norm = s => (s || '').toString().trim().toLowerCase()
                    .replace(/[ąàáä]/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
                    .replace(/ń/g, 'n').replace(/[óòöô]/g, 'o').replace(/ś/g, 's').replace(/[żź]/g, 'z')
                    .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');

                const checkCloze = () => {
                    const typed = input.value;
                    if (!typed) return;
                    input.disabled = true;

                    const acceptedAnswers = [step.cloze_answer, ...(step.accept || [])].map(norm);
                    const isCorrect = acceptedAnswers.includes(norm(typed));

                    if (isCorrect) {
                        window.LearnSound.playSuccess();
                        input.style.borderColor = 'var(--success)';
                        input.style.color = 'var(--success)';
                        Gamify.awardXP(20, 'Dokładna pamięć');
                        if (this.activeBoss) this.damageBoss(50);
                        setTimeout(() => this.nextStep(5), 1000);
                    } else {
                        window.LearnSound.playDamage();
                        input.style.borderColor = 'var(--danger)';
                        input.style.color = 'var(--danger)';
                        this.takeDamage(35); // Hardcore Damage
                        this.showContextualHint(`Prawidłowe słowo: <b>${step.cloze_answer}</b>.<br><br>${step.explain || ''}`);
                    }
                };

                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.style.borderRadius = '24px';
                btn.textContent = 'Sprawdź (Enter)';
                btn.onclick = checkCloze;
                input.addEventListener('keydown', e => { if (e.key === 'Enter') checkCloze(); });
                controls.appendChild(btn);
                setTimeout(() => input.focus(), 100);
            }

        } else if (step.type === 'recall') {
            const rawSentences = step.model ? step.model.replace(/<[^>]*>/g, '').split(/[.!?]\s+/).map(s => s.trim()).filter(s => s.length > 5) : [];
            
            if (rawSentences.length >= 3) {
                // FEYNMAN METHOD
                this.scrambledFeynmanBlocks = rawSentences.map((s, idx) => ({ text: s, originalIdx: idx })).sort(() => Math.random() - 0.5);
                this.selectedFeynmanOrder = [];

                contentEl.innerHTML = `
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem; font-weight:700;">🧩 Technika Feynmana (Logiczne Wyjaśnianie)</h3>
                    <p class="text-muted" style="margin-bottom: 1.8rem; font-size: 0.95rem;">Ułóż poniższe zdania we właściwym logicznym ciągu, aby precyzyjnie wyjaśnić zagadnienie: <b>${step.prompt}</b>.</p>
                    <div class="feynman-blocks-container" id="feynman-blocks-list"></div>
                `;

                const listEl = document.getElementById('feynman-blocks-list');
                this.scrambledFeynmanBlocks.forEach((block, idx) => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'feynman-block';
                    blockDiv.dataset.idx = idx;
                    blockDiv.style.border = '1px solid var(--border-glass)';
                    blockDiv.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.01)';
                    blockDiv.innerHTML = `<span class="order-badge">${idx + 1}</span> <span>${block.text}</span>`;
                    blockDiv.onclick = () => this.clickFeynmanBlock(idx);
                    listEl.appendChild(blockDiv);
                });

                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.style.borderRadius = '24px';
                btn.textContent = 'Zatwierdź Kolejność';
                btn.onclick = () => this.checkFeynmanSequence();
                controls.appendChild(btn);

            } else {
                // Standard Flashcard Active Recall
                contentEl.innerHTML = `
                    <h3 style="font-size: 1.45rem; margin-bottom: 1.8rem; line-height: 1.5; font-weight:700;">${step.prompt}</h3>
                    <p class="text-muted" style="margin-bottom:2rem; font-size: 1.05rem; border-left: 3px solid var(--primary); padding-left: 1.2rem; line-height:1.7;">
                        <i>Zastanów się przez chwilę, sformułuj odpowiedź w pamięci, a następnie odsłoń wzorzec do weryfikacji.</i>
                    </p>
                `;

                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.style.borderRadius = '24px';
                btn.textContent = 'Pokaż wzorzec odpowiedzi (Enter)';
                btn.onclick = () => {
                    contentEl.innerHTML += `
                        <div class="fade-in" style="margin-top:2rem; padding:1.8rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid rgba(0, 229, 255, 0.15); box-shadow: inset 0 0 15px rgba(0,229,255,0.03);">
                            <div style="font-size: 0.8rem; color: var(--primary); font-weight: 800; margin-bottom: 0.8rem; letter-spacing: 1.5px; text-transform: uppercase;">Wzorzec Odpowiedzi:</div>
                            <div class="text-lg" style="line-height: 1.7; font-size: 1.1rem;">${step.model}</div>
                        </div>
                    `;
                    controls.innerHTML = '';
                    
                    const btnForgot = document.createElement('button');
                    btnForgot.className = 'btn btn-srs btn-forgot ripple';
                    btnForgot.style.borderRadius = '20px';
                    btnForgot.innerHTML = '<strong>1.</strong> Zapomniałem';
                    btnForgot.onclick = () => {
                        window.LearnSound.playDamage();
                        this.takeDamage(35); // Hardcore Damage
                        this.nextStep(1); 
                    };
                    
                    const btnHazy = document.createElement('button');
                    btnHazy.className = 'btn btn-srs btn-hazy ripple';
                    btnHazy.style.borderRadius = '20px';
                    btnHazy.innerHTML = '<strong>2.</strong> Z mgłą';
                    btnHazy.onclick = () => {
                        this.takeDamage(10); // Hardcore Damage
                        this.nextStep(3); 
                    };
                    
                    const btnSolid = document.createElement('button');
                    btnSolid.className = 'btn btn-srs btn-solid ripple';
                    btnSolid.style.borderRadius = '20px';
                    btnSolid.innerHTML = '<strong>3.</strong> Solidnie';
                    btnSolid.onclick = () => {
                        window.LearnSound.playSuccess();
                        Gamify.awardXP(25, 'Silny ślad pamięciowy');
                        if (this.activeBoss) this.damageBoss(60);
                        this.nextStep(5); 
                    };
                    
                    controls.appendChild(btnForgot);
                    controls.appendChild(btnHazy);
                    controls.appendChild(btnSolid);

                    if (typeof renderMathInElement === 'function') {
                        renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                    }
                };
                controls.appendChild(btn);
            }

        } else if (step.type === 'blurt') {
            contentEl.innerHTML = `
                <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem; font-weight:700;">✍️ Metoda Blurtingu</h3>
                <p class="text-muted" style="margin-bottom: 1.2rem; font-size: 0.95rem;">Zrób maksymalnie dokładny zrzut z pamięci w poniższym polu tekstowym dla tematu: <b>${step.prompt}</b>.</p>
                <textarea id="blurting-textarea" class="glass-input" style="width:100%; height:180px; padding:1.2rem; font-size:1.05rem; resize:none; line-height: 1.6; border-radius:14px; margin-bottom:1.5rem; box-shadow: inset 0 0 15px rgba(0,0,0,0.3);" placeholder="Pisz swoimi słowami definicje, powiązania, mechanizmy..."></textarea>
                <div class="blurting-checklist" id="blurt-checklist-box" style="display: none;"></div>
            `;

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            btn.textContent = 'Sprawdź Pamięć (Ctrl + Enter)';
            btn.onclick = () => this.checkBlurtingText();
            controls.appendChild(btn);
            setTimeout(() => document.getElementById('blurting-textarea')?.focus(), 100);

        } else if (step.type === 'capstone') {
            const chap = this.activeQuest.chapter;
            const aiOn = (typeof GeminiAI !== 'undefined' && GeminiAI.hasKey());
            contentEl.innerHTML = `<h3 style="margin-bottom: 1rem; font-size: 1.4rem; font-weight:700;">🎤 Pytanie komisji (ustne)</h3><div class="text-lg" style="line-height:1.7;">${step.q}</div>
                <p class="text-muted" style="margin-top:.8rem;font-size:.9rem">${aiOn ? '🛡️ Egzaminator AI (Gemini) oceni Twoją odpowiedź — surowo, ale kulturalnie.' : '<i>Odpowiedz jak przed komisją, potem porównaj z wzorcem. (Włącz Egzaminatora AI w zakładce „Postępy", by oceniał prawdziwy AI.)</i>'}</p>`;
            const input = document.createElement('textarea');
            input.className = 'glass-input';
            input.placeholder = 'Wpisz swoją odpowiedź ustną...';
            input.style.cssText = 'width:100%;margin-top:1rem;padding:1rem;min-height:120px;border-radius:14px;font-family:inherit;line-height:1.6';
            contentEl.appendChild(input);

            const revealModel = () => {
                contentEl.insertAdjacentHTML('beforeend', `<div class="fade-in" style="margin-top:1.5rem;padding:1.5rem;background:rgba(0,0,0,.3);border-radius:var(--radius-md);border:1px solid rgba(0,255,100,.15)"><div style="font-size:.8rem;color:var(--success);font-weight:bold;margin-bottom:.5rem;letter-spacing:1.5px;text-transform:uppercase">Wzorzec Odpowiedzi:</div><div class="text-lg" style="line-height:1.6">${step.model}</div></div>`);
                if (typeof renderMathInElement === 'function') renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
            };
            const selfGrade = () => {
                controls.innerHTML = '';
                const ok = document.createElement('button'); ok.className = 'btn success ripple'; ok.style.borderRadius = '20px'; ok.textContent = 'Zgadza się z moją';
                ok.onclick = () => { Gamify.awardXP(40, 'Capstone'); if (this.activeBoss) this.damageBoss(100); if (typeof Study !== 'undefined') Study.recordAnswer(true); this.nextStep(5); };
                const bad = document.createElement('button'); bad.className = 'btn danger ripple'; bad.style.borderRadius = '20px'; bad.textContent = 'Mam luki';
                bad.onclick = () => { this.takeDamage(35); if (typeof Study !== 'undefined') { Study.recordAnswer(false); Study.addImprove(chap, 'Pytanie komisji: ' + (this.activeQuest.title || chap)); } this.nextStep(2); };
                controls.appendChild(ok); controls.appendChild(bad);
            };

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple'; btn.style.borderRadius = '24px';
            btn.textContent = aiOn ? 'Wyślij do komisji AI' : 'Pokaż wzorzec';
            btn.onclick = async () => {
                const ans = input.value.trim();
                if (!aiOn) { revealModel(); selfGrade(); btn.remove(); return; }
                if (!ans) { input.focus(); return; }
                btn.disabled = true; input.disabled = true; btn.textContent = 'Komisja ocenia...';
                const r = await GeminiAI.gradeOral(step.q, step.model, ans);
                btn.remove();
                if (r.error) {
                    contentEl.insertAdjacentHTML('beforeend', `<div style="margin-top:1rem;color:var(--warning)">Egzaminator AI niedostępny (${r.error}). Oceń się sam wzorcem.</div>`);
                    revealModel(); selfGrade(); return;
                }
                const g = r.ok, pass = !!g.pass;
                contentEl.insertAdjacentHTML('beforeend', `<div class="fade-in glass-card" style="margin-top:1.5rem;border-color:${pass ? 'var(--success)' : 'var(--danger)'}">
                    <div style="display:flex;justify-content:space-between;align-items:center"><b style="color:${pass ? 'var(--success)' : 'var(--danger)'};font-size:1.2rem">🎓 ${g.verdict || (pass ? 'Zaliczone' : 'Wymaga uzupełnienia')}</b><b style="font-size:1.4rem">${g.score}%</b></div>
                    <p style="margin-top:.6rem"><b>👍 Dobrze:</b> ${g.good || '—'}</p>
                    ${(g.missing && g.missing.length) ? `<p style="margin-top:.4rem"><b>⚠️ Czego zabrakło:</b></p><ul>${g.missing.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
                    ${g.tip ? `<p style="margin-top:.4rem"><b>💡 Wskazówka:</b> ${g.tip}</p>` : ''}</div>`);
                revealModel();
                if (typeof Study !== 'undefined') { Study.recordAnswer(pass); (g.missing || []).forEach(m => Study.addImprove(chap, m)); }
                if (pass) { Gamify.awardXP(Math.round(g.score / 2), 'Komisja AI zaliczyła'); if (this.activeBoss) this.damageBoss(g.score); } else { this.takeDamage(35); }
                controls.innerHTML = '';
                const next = document.createElement('button'); next.className = 'btn primary ripple'; next.textContent = 'Dalej (Enter)';
                next.onclick = () => this.nextStep(pass ? 5 : 2);
                controls.appendChild(next);
            };
            controls.appendChild(btn);
            setTimeout(() => input.focus(), 100);
        }

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(container, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    // --- Feynman interaction logic ---
    clickFeynmanBlock(scrambledIdx) {
        const blockDiv = document.querySelector(`.feynman-block[data-idx="${scrambledIdx}"]`);
        if (!blockDiv) return;

        const alreadySelected = this.selectedFeynmanOrder.indexOf(scrambledIdx);
        if (alreadySelected > -1) {
            this.selectedFeynmanOrder.splice(alreadySelected, 1);
            blockDiv.classList.remove('selected');
            blockDiv.style.borderColor = 'var(--border-glass)';
            blockDiv.style.background = 'rgba(255, 255, 255, 0.03)';
            const badge = blockDiv.querySelector('.order-badge');
            if (badge) badge.textContent = scrambledIdx + 1;
            
            this.selectedFeynmanOrder.forEach((idx, order) => {
                const b = document.querySelector(`.feynman-block[data-idx="${idx}"] .order-badge`);
                if (b) b.textContent = order + 1;
            });
        } else {
            this.selectedFeynmanOrder.push(scrambledIdx);
            blockDiv.classList.add('selected');
            blockDiv.style.borderColor = 'var(--success)';
            blockDiv.style.background = 'rgba(0, 230, 118, 0.05)';
            const badge = blockDiv.querySelector('.order-badge');
            if (badge) badge.textContent = this.selectedFeynmanOrder.length;
        }
    },

    checkFeynmanSequence() {
        if (this.selectedFeynmanOrder.length < this.scrambledFeynmanBlocks.length) {
            alert("Uporządkuj najpierw WSZYSTKIE zdania, zanim zatwierdzisz.");
            return;
        }

        let isCorrect = true;
        for (let i = 0; i < this.selectedFeynmanOrder.length; i++) {
            const blockIndex = this.selectedFeynmanOrder[i];
            const block = this.scrambledFeynmanBlocks[blockIndex];
            if (block.originalIdx !== i) {
                isCorrect = false;
                break;
            }
        }

        const container = document.getElementById('step-content');
        const controls = document.getElementById('learn-controls');
        if (!container || !controls) return;

        document.querySelectorAll('.feynman-block').forEach(b => b.onclick = null);

        if (isCorrect) {
            window.LearnSound.playSuccess();
            document.querySelectorAll('.feynman-block').forEach(b => {
                b.style.borderColor = 'var(--success)';
                b.style.background = 'rgba(0, 255, 100, 0.12)';
                b.style.boxShadow = '0 0 15px rgba(0,255,100,0.1)';
            });
            Gamify.awardXP(30, 'Doskonaly Feynman');
            if (this.activeBoss) this.damageBoss(60);
            setTimeout(() => this.nextStep(5), 1500);
        } else {
            window.LearnSound.playDamage();
            document.querySelectorAll('.feynman-block').forEach(b => {
                b.style.borderColor = 'var(--danger)';
                b.style.background = 'rgba(255, 23, 68, 0.12)';
                b.style.boxShadow = '0 0 15px rgba(255,23,68,0.1)';
            });
            
            const correctOrderTexts = this.scrambledFeynmanBlocks
                .slice()
                .sort((a, b) => a.originalIdx - b.originalIdx)
                .map(b => `<li>${b.text}</li>`)
                .join('');

            this.takeDamage(40); // Feynman Error Damage
            this.showContextualHint(`Niepoprawna sekwencja logiczna. Prawidłowy ciąg to:<br><ol style="margin-left: 1.5rem; margin-top: 0.5rem; line-height: 1.6;">${correctOrderTexts}</ol>`);
        }
    },

    // --- Blurting interaction logic ---
    checkBlurtingText() {
        const textarea = document.getElementById('blurting-textarea');
        if (!textarea) return;

        const text = textarea.value.trim();
        if (!text) return;

        textarea.disabled = true;

        const step = this.activeQuest.steps[this.currentStepIndex];
        const checklist = step.checklist || [
            "wartość pieniądza", "czas", "dyskontowanie", "przyszłe", "kapitał", "stopa", "odsetki"
        ]; 

        const normalize = str => str.toLowerCase().replace(/[^a-z0-9ąéółźżśńć]/gi, '');
        const normalizedText = normalize(text);

        let hits = 0;
        this.blurtingChecklist = checklist.map(keyword => {
            const cleanWord = normalize(keyword);
            const isHit = normalizedText.includes(cleanWord);
            if (isHit) hits++;
            return { word: keyword, hit: isHit };
        });

        const box = document.getElementById('blurt-checklist-box');
        if (box) {
            box.style.display = 'grid';
            box.innerHTML = '';
            this.blurtingChecklist.forEach((item, i) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `checklist-item ${item.hit ? 'hit' : 'miss'} blurt-item-${i}`;
                itemDiv.style.opacity = '0';
                itemDiv.style.transform = 'translateY(10px)';
                itemDiv.innerHTML = `<span class="badge">${item.hit ? '✓' : '✗'}</span> <span>${item.word}</span>`;
                box.appendChild(itemDiv);
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(`.blurt-item-${i}`, { opacity: item.hit ? 1 : 0.5, translateY: 0, delay: i * 0.05, duration: 0.3 });
                } else {
                    itemDiv.style.opacity = item.hit ? '1' : '0.5';
                    itemDiv.style.transform = 'none';
                }
            });
        }

        const pct = Math.round((hits / checklist.length) * 100);
        const controls = document.getElementById('learn-controls');
        if (controls) {
            controls.innerHTML = '';

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            
            if (pct >= 70) { // Hardcore threshold raised to 70%
                window.LearnSound.playSuccess();
                btn.textContent = 'Świetny blurt! Dalej (Enter)';
                btn.onclick = () => {
                    Gamify.awardXP(Math.round(pct * 0.4), 'Szeroka pamięć');
                    if (this.activeBoss) this.damageBoss(pct);
                    this.nextStep(5);
                };
            } else {
                window.LearnSound.playDamage();
                btn.textContent = 'Brak kluczowych pojęć. Dalej (Enter)';
                btn.onclick = () => {
                    this.takeDamage(35); // Hardcore Damage
                    this.nextStep(2);
                };
            }
            controls.appendChild(btn);
        }
    },

    // --- Damage / Shield / HP handlers ---
    takeDamage(amount) {
        const avatar = Store._data.avatar;
        if (!avatar) return;

        if (avatar.eq && avatar.eq.chest === 'Pas Kulturystyczny') {
            amount = Math.max(5, amount - 5);
        }

        avatar.hp = Math.max(0, avatar.hp - amount);
        Store.save();
        this.renderRPGPanel();

        const card = document.getElementById('rpg-character-panel');
        if (card) {
            card.classList.add('shake-danger');
            setTimeout(() => card.classList.remove('shake-danger'), 500);
        }
        
        window.LearnSound.playDamage();

        const rect = card.getBoundingClientRect();
        const floatEl = document.createElement('div');
        floatEl.className = 'floating-damage';
        floatEl.textContent = `-${amount} HP`;
        floatEl.style.left = `${rect.left + rect.width / 2}px`;
        floatEl.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(floatEl);
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(floatEl, 
                { scale: 0.8, opacity: 0, y: 0 },
                { scale: 1.2, opacity: 1, y: -40, duration: 0.3, ease: "power2.out", onComplete: () => {
                    gsap.to(floatEl, { y: -80, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.3, onComplete: () => floatEl.remove() });
                }}
            );
        } else {
            setTimeout(() => floatEl.remove(), 1200);
        }

        if (avatar.hp <= 0) {
            setTimeout(() => this.triggerDefeat(), 600);
        }
    },

    healHero(amount) {
        const avatar = Store._data.avatar;
        if (!avatar) return;
        
        avatar.hp = Math.min(avatar.maxHp || 100, avatar.hp + amount);
        Store.save();
        this.renderRPGPanel();

        const card = document.getElementById('rpg-character-panel');
        if (card) {
            const rect = card.getBoundingClientRect();
            const floatEl = document.createElement('div');
            floatEl.className = 'floating-heal';
            floatEl.textContent = `+${amount} HP`;
            floatEl.style.left = `${rect.left + rect.width / 2}px`;
            floatEl.style.top = `${rect.top + rect.height / 2}px`;
            document.body.appendChild(floatEl);
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(floatEl, 
                    { scale: 0.8, opacity: 0, y: 0 },
                    { scale: 1.2, opacity: 1, y: -40, duration: 0.3, ease: "power2.out", onComplete: () => {
                        gsap.to(floatEl, { y: -80, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.3, onComplete: () => floatEl.remove() });
                    }}
                );
            } else {
                setTimeout(() => floatEl.remove(), 1200);
            }
        }
    },

    triggerDefeat() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container) return;

        window.LearnSound.playDefeat();

        // Dark Souls Death: Lose all unspent souls and drop them as bloodstain at this lesson!
        const avatar = Store._data.avatar;
        if (avatar) {
            const lostSouls = avatar.souls || 0;
            if (lostSouls > 0) {
                avatar.bloodstain = {
                    lessonId: this.activeQuest ? this.activeQuest.id : 'unknown',
                    souls: lostSouls
                };
            }
            avatar.souls = 0; // Wipe current souls
            avatar.hp = Math.round(avatar.maxHp / 2); // Resurrect at half health
            Store.save();
        }

        container.innerHTML = `
            <div class="glass-card fade-in flex-center" style="width: 100%; text-align: center; padding: 4rem 2rem; border-color: #ff1744; background: rgba(5,5,10,0.95); box-shadow: 0 0 35px rgba(255, 23, 68, 0.4);">
                <div style="width: 70px; height: 70px; margin: 0 auto 1.5rem auto; border-radius:50%; overflow:hidden; border:2px dashed var(--danger); opacity:0.8;">
                    <img src="assets/avatars/bloodstain.png?v=2026" style="width:100%; height:100%; object-fit:cover; filter: grayscale(1) brightness(0.6);" />
                </div>
                <div class="you-died-title" style="margin-bottom: 2rem;">YOU DIED</div>
                <p class="text-lg text-muted" style="margin-bottom: 2.5rem; line-height:1.7; max-width:560px; margin-left:auto; margin-right:auto;">
                    Straciłeś wszystkie zgromadzone dusze. Twoja plama krwi została upuszczona na polu bitwy. Odrodziłeś się przy ognisku z 50% HP.
                </p>
                <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 14px; font-size: 0.9rem; border: 1px dashed rgba(255,255,255,0.1); margin-bottom: 2rem; max-width:560px; text-align:left; line-height:1.6; margin-left:auto; margin-right:auto;">
                    💡 <b>Zasada Plamy Krwi:</b> Wejdź ponownie do lekcji, w której poległeś, i ukończ ją pomyślnie, aby odzyskać stracone dusze. Kolejna śmierć przed odzyskaniem plamy wymaże ją na zawsze.
                </div>
            </div>
        `;

        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '30px';
            btn.style.padding = '1rem 2.5rem';
            btn.textContent = 'Powróć do Ogniska (Enter)';
            btn.onclick = () => {
                this.lessonState = 'map';
                this.activeQuest = null;
                this.activeBoss = null;
                this.renderRPGPanel();
                this.renderMain();
            };
            controls.appendChild(btn);
        }
    },

    // --- Contextual explanation hint popup ---
    showContextualHint(htmlContent) {
        const controls = document.getElementById('learn-controls');
        const contentEl = document.getElementById('step-content');
        if (!contentEl || !controls) return;
        // Sledzenie: bledna odpowiedz -> sekcja "Do poprawy" + celnosc
        if (typeof Study !== 'undefined' && this.activeQuest) {
            Study.recordAnswer(false);
            const cs = this.activeQuest.steps[this.currentStepIndex];
            const q = (cs && (cs.q || cs.prompt)) || this.activeQuest.title || this.activeQuest.chapter;
            Study.addImprove(this.activeQuest.chapter, String(q).replace(/<[^>]+>/g, '').slice(0, 130));
        }

        const hintDiv = document.createElement('div');
        hintDiv.className = 'fade-in';
        hintDiv.style.marginTop = '1.5rem';
        hintDiv.style.padding = '1.5rem';
        hintDiv.style.background = 'rgba(255, 23, 68, 0.05)';
        hintDiv.style.borderRadius = 'var(--radius-md)';
        hintDiv.style.border = '1px solid rgba(255, 23, 68, 0.15)';
        hintDiv.style.borderLeft = '5px solid var(--danger)';
        hintDiv.style.boxShadow = 'inset 0 0 15px rgba(0,0,0,0.3)';
        hintDiv.innerHTML = `
            <div style="font-weight: 800; color: var(--danger); font-size: 0.85rem; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 1.5px; display:flex; align-items:center; gap:0.5rem;">⚠️ Merytoryczne uderzenie zwrotne:</div>
            <div class="text-muted" style="font-size: 1.05rem; line-height: 1.7;">${htmlContent}</div>
        `;
        contentEl.appendChild(hintDiv);

        controls.innerHTML = '';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn primary';
        nextBtn.style.borderRadius = '24px';
        nextBtn.textContent = 'Zrozumiałem, kontynuuj (Enter)';
        nextBtn.onclick = () => this.nextStep(2);
        controls.appendChild(nextBtn);

        if (typeof gsap !== 'undefined') {
            gsap.from(hintDiv, { height: 0, opacity: 0, overflow: 'hidden', duration: 0.35, ease: "power2.out" });
        }

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(hintDiv, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
        }
    },

    // --- Ribbon Generator Helper ---
    getRibbonHTML(type) {
        let text = '', bg = '', icon = '';
        if (type === 'teach') { text = 'LEKCJA'; bg = 'rgba(0, 240, 255, 0.15)'; icon = '📖'; }
        else if (type === 'example') { text = 'PRZYKŁAD'; bg = 'rgba(255, 170, 0, 0.15)'; icon = '🔍'; }
        else if (type === 'check') { text = 'STARCIE KONTROLNE'; bg = 'rgba(255, 23, 68, 0.15)'; icon = '⚔️'; }
        else if (type === 'recall') { text = 'AKTYWNY RECALL'; bg = 'rgba(200, 50, 255, 0.15)'; icon = '💬'; }
        else if (type === 'blurt') { text = 'PRÓBA DUSZY (BLURTING)'; bg = 'rgba(255, 0, 150, 0.15)'; icon = '✍️'; }
        else if (type === 'capstone') { text = 'WERYFIKACJA OSTATECZNA'; bg = 'rgba(255, 120, 0, 0.15)'; icon = '🎯'; }
        
        return `<div style="
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: ${bg}; padding: 0.4rem 1.1rem; border-radius: 20px;
            font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; color: var(--text);
            margin-bottom: 1.8rem; border: 1px solid rgba(255,255,255,0.05);
        ">${icon} ${text}</div>`;
    },

    nextStep(quality) {
        this.earnedQuality.push(quality);
        const lesson = this.activeQuest;
        // Celnosc: poprawna odpowiedz na sprawdzian/blurt (blędne licza sie w showContextualHint/capstone)
        const st = lesson.steps[this.currentStepIndex];
        if (typeof Study !== 'undefined' && st && (st.type === 'check' || st.type === 'blurt') && quality >= 4) Study.recordAnswer(true);

        if (this.currentStepIndex >= lesson.steps.length - 1) {
            this.lessonState = 'outro';
            this.renderMain();
        } else {
            this.currentStepIndex++;
            this.renderStep();
        }
    },

    // --- Quest Outro Screen ---
    renderOutro() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container || !this.activeQuest) return;

        const lesson = this.activeQuest;
        const avgQuality = this.earnedQuality.length ? (this.earnedQuality.reduce((a,b)=>a+b,0)/this.earnedQuality.length) : 5;
        let soulsEarned = Math.round(avgQuality * 15);

        const avatar = Store._data.avatar;
        if (avatar && avatar.eq && avatar.eq.weapon === 'Notatnik Rynkowy') {
            soulsEarned = Math.round(soulsEarned * 1.2);
        } else if (avatar && avatar.eq && avatar.eq.weapon === 'Złoty Kalkulator') {
            soulsEarned = Math.round(soulsEarned * 1.1);
        }

        // Bloodstain Recovery Logic
        let bloodstainMsg = '';
        if (avatar && avatar.bloodstain && avatar.bloodstain.lessonId === lesson.id) {
            const recoveredSouls = avatar.bloodstain.souls;
            avatar.souls += recoveredSouls;
            avatar.bloodstain = null; // Cleared
            Store.save();
            
            bloodstainMsg = `
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; background: rgba(0, 230, 118, 0.08); padding: 1.2rem; border-radius: 16px; border: 1.5px solid var(--success); box-shadow: 0 0 20px rgba(0, 230, 118, 0.2);">
                    <div style="width: 50px; height: 50px; margin-bottom: 0.5rem; border-radius: 50%; overflow: hidden;">
                        <img src="assets/avatars/bloodstain.png?v=2026" style="width:100%; height:100%; object-fit:cover;" />
                    </div>
                    <span style="font-size: 0.85rem; font-weight: 800; color: var(--success); letter-spacing: 1px;">ODZYSKANO PLAMĘ KRWI!</span>
                    <span style="font-size: 1.5rem; font-weight: 900; color: #fff; margin-top: 0.3rem;">+${recoveredSouls} Duszy</span>
                </div>
            `;
            window.LearnSound.playLevelUp(); // Extra triumph sound
        }

        container.innerHTML = `
            <div class="glass-card fade-in flex-center" style="width: 100%; min-height: 380px; text-align: center; padding: 2.5rem; border-color:var(--success); background: linear-gradient(135deg, rgba(0,255,100,0.03) 0%, transparent 100%);">
                <div style="font-size: 5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 15px rgba(0,255,100,0.4));">🎉</div>
                <h2 style="font-size: 2.2rem; color: var(--success); text-shadow: 0 0 10px rgba(0, 255, 100, 0.2); font-weight:900;">POLE WALKI OPANOWANE</h2>
                <p class="text-lg text-muted" style="margin-top: 1rem; margin-bottom: 2rem; line-height:1.7;">Zwyciężyłeś starcie merytoryczne w lekcji <b>${lesson.title}</b>.</p>
                
                <div style="display: flex; flex-direction:column; gap: 1rem; align-items:center; justify-content: center; margin-bottom: 2rem; width:100%;">
                    <div style="background: rgba(255,87,34,0.06); padding: 1.2rem 2.5rem; border-radius: 16px; border: 1px solid rgba(255,87,34,0.25); box-shadow: 0 0 15px rgba(255,87,34,0.05); text-align:center; max-width:260px; width:100%;">
                        <div style="font-size: 0.85rem; color:#ff8a65; margin-bottom: 0.4rem; font-weight: 800; text-transform: uppercase;">Zdobycz Duszy</div>
                        <div style="font-size: 2.5rem; font-weight: 900; color: #ff5722; letter-spacing:0.5px;">+${soulsEarned}</div>
                    </div>
                    ${bloodstainMsg}
                </div>
            </div>
        `;

        window.LearnSound.playVictory();
        Gamify.awardXP(soulsEarned, 'Zwycięstwo');
        this.healHero(25);

        if (window.Anim) {
            window.Anim.init();
            window.Anim.fireConfetti();
        }

        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '30px';
            btn.style.padding = '1rem 2rem';
            btn.style.fontSize = '1.1rem';
            btn.textContent = 'Powróć z Tarczą (Enter)';
            btn.onclick = () => {
                Store.updateLesson(lesson.id, Math.round(avgQuality));
                this.lessonState = 'map';
                this.activeQuest = null;
                this.renderRPGPanel();
                this.renderMain();
            };
            controls.appendChild(btn);
        }
    },

    // ==========================================================================
    // BOSS FIGHT / ARENA GAMEPLAY
    // ==========================================================================
    challengeBoss(ch) {
        const template = BOSS_TEMPLATES[ch] || { name: 'Strażnik Wiedzy', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Generowany strażnik kognitywny.', rewardItem: 'Złoty Kalkulator' };
        
        this.activeBoss = {
            name: template.name,
            hp: template.hp,
            maxHp: template.hp,
            chapter: ch,
            image: template.image,
            hue: template.hue
        };

        // Gather questions for the boss fight from lessons in this specific chapter!
        this.bossPool = [];
        const chapterLessons = this.data.filter(l => l.chapter === ch);
        
        chapterLessons.forEach(l => {
            l.steps.forEach(s => {
                if (s.type === 'check') {
                    this.bossPool.push({ step: s, lessonId: l.id });
                }
            });
        });

        // Add computational problems matching the chapter theme if available
        if (window.PROBLEMS) {
            window.PROBLEMS.forEach(p => {
                if (p.chapter === ch) {
                    this.bossPool.push({
                        step: {
                            type: 'check',
                            kind: 'num',
                            q: p.question,
                            answer: p.answer,
                            tol: p.tol || 0.1,
                            explain: 'Zadanie z bazy problemów obliczeniowych.'
                        },
                        lessonId: 'problem'
                    });
                }
            });
        }

        // If pool is empty, grab from anywhere so the boss fight doesn't crash
        if (this.bossPool.length === 0) {
            this.data.forEach(l => {
                l.steps.forEach(s => {
                    if (s.type === 'check') {
                        this.bossPool.push({ step: s, lessonId: l.id });
                    }
                });
            });
        }

        this.bossPool.sort(() => Math.random() - 0.5);

        this.lessonState = 'boss_battle';
        this.currentStepIndex = 0;
        this.renderMain();
    },

    renderBossBattle() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container || !this.activeBoss) return;

        const boss = this.activeBoss;
        const bossHpPercent = Math.min(100, Math.round((boss.hp / boss.maxHp) * 100));

        if (boss.hp <= 0) {
            this.triggerBossVictory();
            return;
        }

        if (this.currentStepIndex >= this.bossPool.length) {
            this.activeBoss.hp = 0;
            this.triggerBossVictory();
            return;
        }

        const currentQuestItem = this.bossPool[this.currentStepIndex];
        const step = currentQuestItem.step;

        container.innerHTML = `
            <div class="boss-arena-card fade-in">
                <!-- Boss Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
                    <div style="text-align:left;">
                        <h2 style="color: var(--danger); margin:0; font-size:1.6rem; font-weight:900; letter-spacing:0.5px;">${boss.name}</h2>
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold; text-transform: uppercase; letter-spacing:1px;">BOJOWA ARENA EGZAMINACYJNA</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight:bold; color: var(--danger); font-size:1.1rem;">${boss.hp} / ${boss.maxHp} HP</span>
                        <div style="width: 160px; height: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; overflow: hidden; border:1px solid rgba(255,23,68,0.3); margin-top:0.3rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);">
                            <div style="width: ${bossHpPercent}%; height:100%; background: linear-gradient(90deg, #ff1744, #ff5252); transition: width 0.3s ease; box-shadow: 0 0 8px rgba(255,23,68,0.5);"></div>
                        </div>
                    </div>
                </div>

                <div class="boss-avatar-box" style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; border: 4px solid var(--danger); box-shadow: 0 0 25px rgba(255, 23, 68, 0.6); margin: 0 auto 2rem auto;">
                    <img src="assets/avatars/${boss.image}?v=2026" style="width:100%; height:100%; object-fit:cover; filter: hue-rotate(${boss.hue}deg);" alt="Boss" />
                </div>
                
                <!-- Active Challenge -->
                <div id="boss-challenge-area" style="background: rgba(0,0,0,0.4); padding: 1.8rem; border-radius: 16px; border:1px solid rgba(255,23,68,0.25); text-align: left; box-shadow: inset 0 0 15px rgba(0,0,0,0.5);">
                    <div style="font-size: 0.8rem; color: var(--danger); font-weight: 800; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px;">⚔️ WYZWANIE BOSSA:</div>
                    <div id="step-content"></div>
                </div>
            </div>
        `;

        const contentEl = document.getElementById('step-content');
        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
        }

        const heading = `<h3 style="margin-bottom: 1.8rem; font-size: 1.3rem; line-height: 1.5; font-weight:700;">${step.q}</h3>`;
        
        if (step.kind === 'mcq') {
            contentEl.innerHTML = heading;
            const grid = document.createElement('div');
            grid.style.display = 'grid'; grid.style.gap = '10px';
            step.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'btn secondary ripple';
                btn.style.textAlign = 'left';
                btn.style.borderRadius = '12px';
                btn.style.padding = '1rem 1.5rem';
                btn.innerHTML = `<span style="opacity:0.4; margin-right: 0.6rem; color:var(--primary); font-weight:800;">${idx+1}</span> ${opt}`;
                btn.onclick = () => {
                    Array.from(grid.children).forEach(b => b.disabled = true);
                    if (idx === step.correct) {
                        this.damageBoss(60);
                        setTimeout(() => { this.currentStepIndex++; this.renderBossBattle(); }, 1000);
                    } else {
                        btn.style.background = 'rgba(255, 23, 68, 0.12)';
                        btn.style.borderColor = 'var(--danger)';
                        grid.children[step.correct].style.border = '2px solid var(--success)';
                        this.takeDamage(40); // Hardcore Boss Damage
                        this.showBossExplanation(step.explain || 'Błędna odpowiedź.');
                    }
                };
                grid.appendChild(btn);
            });
            contentEl.appendChild(grid);

        } else if (step.kind === 'tf') {
            contentEl.innerHTML = heading;
            const grid = document.createElement('div');
            grid.style.display = 'grid'; grid.style.gridTemplateColumns = '1fr 1fr'; grid.style.gap = '10px';
            [['Prawda', true], ['Fałsz', false]].forEach(([label, val], idx) => {
                const btn = document.createElement('button');
                btn.className = 'btn secondary ripple';
                btn.style.borderRadius = '12px';
                btn.style.padding = '1.2rem';
                btn.innerHTML = `<span style="opacity:0.4; margin-right: 0.5rem; color:var(--primary); font-weight:800;">${idx+1}</span> ${label}`;
                btn.onclick = () => {
                    Array.from(grid.children).forEach(b => b.disabled = true);
                    const isCorrect = (val === step.bool);
                    if (isCorrect) {
                        this.damageBoss(50);
                        setTimeout(() => { this.currentStepIndex++; this.renderBossBattle(); }, 1000);
                    } else {
                        btn.style.background = 'rgba(255, 23, 68, 0.12)';
                        btn.style.borderColor = 'var(--danger)';
                        this.takeDamage(40); // Hardcore Boss Damage
                        this.showBossExplanation(step.explain || 'Niestety błąd.');
                    }
                };
                grid.appendChild(btn);
            });
            contentEl.appendChild(grid);

        } else if (step.kind === 'num') {
            contentEl.innerHTML = heading;
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'glass-input';
            input.placeholder = `Wynik...`;
            input.style.width = '100%'; input.style.marginTop = '1rem'; input.style.padding = '1rem'; input.style.borderRadius = '12px';
            input.style.fontSize = '1.15rem';
            contentEl.appendChild(input);

            const checkNum = () => {
                const val = parseFloat(input.value);
                if (isNaN(val)) return;
                input.disabled = true;
                const diff = Math.abs(val - step.answer);
                if (diff <= (step.tol || 0.1)) {
                    this.damageBoss(70);
                    setTimeout(() => { this.currentStepIndex++; this.renderBossBattle(); }, 1000);
                } else {
                    input.style.borderColor = 'var(--danger)';
                    this.takeDamage(45); // Hardcore Boss Damage
                    this.showBossExplanation(`Poprawna wartość: <b>${step.answer}</b>.<br><br>${step.explain || ''}`);
                }
            };

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            btn.textContent = 'Zatwierdź';
            btn.onclick = checkNum;
            input.addEventListener('keydown', e => { if (e.key === 'Enter') checkNum(); });
            controls.appendChild(btn);
            setTimeout(() => input.focus(), 100);
        } else {
            contentEl.innerHTML = heading;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'glass-input';
            input.placeholder = 'Twoja odpowiedź...';
            input.style.width = '100%'; input.style.marginTop = '1rem'; input.style.padding = '1rem'; input.style.borderRadius = '12px';
            contentEl.appendChild(input);

            const norm = s => (s || '').toString().trim().toLowerCase()
                .replace(/[ąàáä]/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
                .replace(/ń/g, 'n').replace(/[óòöô]/g, 'o').replace(/ś/g, 's').replace(/[żź]/g, 'z')
                .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');

            const checkCloze = () => {
                const typed = input.value;
                if (!typed) return;
                input.disabled = true;

                const isCorrect = norm(typed) === norm(step.cloze_answer);
                if (isCorrect) {
                    this.damageBoss(60);
                    setTimeout(() => { this.currentStepIndex++; this.renderBossBattle(); }, 1000);
                } else {
                    input.style.borderColor = 'var(--danger)';
                    this.takeDamage(40); // Hardcore Boss Damage
                    this.showBossExplanation(`Prawidłowe pojęcie: <b>${step.cloze_answer}</b>.<br><br>${step.explain || ''}`);
                }
            };

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            btn.textContent = 'Zatwierdź';
            btn.onclick = checkCloze;
            input.addEventListener('keydown', e => { if (e.key === 'Enter') checkCloze(); });
            controls.appendChild(btn);
            setTimeout(() => input.focus(), 100);
        }

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(container, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
        }
    },

    damageBoss(amount) {
        const boss = this.activeBoss;
        if (!boss) return;

        const avatar = Store._data.avatar;
        if (avatar && avatar.eq) {
            if (avatar.eq.weapon === 'Hantel 50kg') {
                amount = Math.round(amount * 1.2);
            } else if (avatar.eq.weapon === 'Złoty Kalkulator') {
                amount = Math.round(amount * 1.1);
            }
        }

        boss.hp = Math.max(0, boss.hp - amount);

        const card = document.querySelector('.boss-arena-card');
        if (card) {
            card.classList.add('shake-danger');
            setTimeout(() => card.classList.remove('shake-danger'), 300);
            
            const rect = card.getBoundingClientRect();
            const floatEl = document.createElement('div');
            floatEl.className = 'floating-damage';
            floatEl.textContent = `-${amount} HP`;
            floatEl.style.left = `${rect.left + rect.width / 2}px`;
            floatEl.style.top = `${rect.top + rect.height / 3}px`;
            document.body.appendChild(floatEl);

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(floatEl, 
                    { scale: 0.8, opacity: 0, y: 0 },
                    { scale: 1.5, opacity: 1, y: -50, duration: 0.35, ease: "back.out(1.5)", onComplete: () => {
                        gsap.to(floatEl, { y: -100, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.3, onComplete: () => floatEl.remove() });
                    }}
                );
            } else {
                setTimeout(() => floatEl.remove(), 1200);
            }
        }

        window.LearnSound.playSuccess();
    },

    showBossExplanation(htmlContent) {
        const controls = document.getElementById('learn-controls');
        const box = document.getElementById('boss-challenge-area');
        if (!box || !controls) return;

        const hintDiv = document.createElement('div');
        hintDiv.className = 'fade-in';
        hintDiv.style.marginTop = '1.2rem';
        hintDiv.style.padding = '1.2rem';
        hintDiv.style.background = 'rgba(255,23,68,0.06)';
        hintDiv.style.borderLeft = '3px solid var(--danger)';
        hintDiv.style.borderRadius = '8px';
        hintDiv.innerHTML = `
            <div style="font-weight:bold; color:var(--danger); font-size:0.8rem; margin-bottom: 0.3rem;">KONTRAATAK BOSSA (Wyjaśnienie):</div>
            <div style="font-size: 0.95rem; line-height: 1.5; color: var(--text-muted);">${htmlContent}</div>
        `;
        box.appendChild(hintDiv);

        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'btn primary ripple';
        btn.style.borderRadius = '24px';
        btn.textContent = 'Rozumiem, kontynuuj starcie (Enter)';
        btn.onclick = () => {
            this.currentStepIndex++;
            this.renderBossBattle();
        };
        controls.appendChild(btn);

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(hintDiv, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
        }
    },

    triggerBossVictory() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container || !this.activeBoss) return;

        const bossName = this.activeBoss.name;
        const rewardXP = 350;

        // Dynamic items drop
        const ch = this.activeBoss.chapter;
        const template = BOSS_TEMPLATES[ch];
        const rewardItem = template ? template.rewardItem : null;
        let itemClaimedMsg = '';

        const avatar = Store._data.avatar;
        if (avatar && rewardItem) {
            let slot = 'weapon';
            if (rewardItem.includes('Garnitur') || rewardItem.includes('Pas') || rewardItem.includes('Kamizelka')) {
                slot = 'chest';
            } else if (rewardItem.includes('Wizor') || rewardItem.includes('Okulary')) {
                slot = 'head';
            }

            if (avatar.eq[slot] !== rewardItem) {
                avatar.eq[slot] = rewardItem;
                Store.save();
                this.renderRPGPanel();
                itemClaimedMsg = `
                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; background: rgba(0,229,255,0.06); padding: 1.2rem; border-radius: 16px; border: 1px dashed var(--primary); box-shadow: 0 0 15px rgba(0,229,255,0.1);">
                        <span style="font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; color: var(--primary);">🎁 NOWY ŁUP ZDOBYTY!</span>
                        <span style="font-size: 1.25rem; font-weight: 900; color: #fff; margin-top: 0.3rem;">${rewardItem}</span>
                        <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem; text-align: center;">Przedmiot został automatycznie wyposażony w slot: ${slot === 'head' ? 'Głowa' : (slot === 'weapon' ? 'Broń' : 'Klatka')}. Sprawdź kartę postaci!</span>
                    </div>
                `;
            }
        }

        window.LearnSound.playVictory();

        container.innerHTML = `
            <div class="glass-card fade-in flex-center" style="width: 100%; text-align: center; padding: 3rem; border-color: var(--success); background: linear-gradient(135deg, rgba(0,255,100,0.05) 0%, transparent 100%); box-shadow: 0 0 25px rgba(0,255,100,0.2);">
                <div style="font-size: 5.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(0,255,100,0.4));">🏆</div>
                <h2 style="font-size: 2.5rem; color: var(--success); text-shadow: 0 0 10px rgba(0,255,100,0.3); font-weight:900;">BOSSA POKONANO!</h2>
                <p class="text-lg text-muted" style="margin-top: 1rem; margin-bottom: 2rem; line-height:1.7;">Udało Ci się ostatecznie zwyciężyć <b>${bossName}</b>. Poziomy Twojej wiedzy osiągnęły pełne mistrzostwo.</p>
                
                <div style="display: flex; flex-direction: column; gap: 1rem; justify-content: center; align-items: center; width: 100%;">
                    <div style="background: rgba(255,87,34,0.06); padding: 1.2rem 2.2rem; border-radius: 16px; border: 1px solid rgba(255,87,34,0.25); box-shadow: 0 0 15px rgba(255,87,34,0.05); text-align: center; max-width: 300px;">
                        <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.4rem; font-weight:800; text-transform: uppercase;">ZWYCIĘSKIE DUSZE</div>
                        <div style="font-size: 2.2rem; font-weight: 900; color: #ff5722;">+${rewardXP} Duszy</div>
                    </div>
                    ${itemClaimedMsg}
                </div>
            </div>
        `;

        Gamify.awardXP(rewardXP, 'Pokonanie Bossa!');
        this.healHero(50); 

        if (window.Anim) {
            window.Anim.init();
            window.Anim.fireConfetti();
            setTimeout(() => window.Anim.fireConfetti(), 1000);
        }

        Store._data.vitality = 100;
        Store.save();

        if (controls) {
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '30px';
            btn.style.padding = '1rem 2rem';
            btn.style.fontSize = '1.1rem';
            btn.textContent = 'Powróć do Ogniska (Enter)';
            btn.onclick = () => {
                this.lessonState = 'map';
                this.activeQuest = null;
                this.activeBoss = null;
                this.renderRPGPanel();
                this.renderMain();
            };
            controls.appendChild(btn);
        }
    }
};
