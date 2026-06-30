/**
 * Learn Mode Engine V4 Premium - RPG & Active Learning Super-App
 * HARDCORE DARK SOULS EDITION (2026 AAAA Edition).
 * Features: Souls & Bloodstains, Bonfires, Hardcore damage scaling, audio synth, GSAP animations.
 */

// Boss templates for all chapters
const BOSS_TEMPLATES = {
    'fundament': { name: 'Architekt Bilansu', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Strażnik zasad memoriałowych i WACC. Zmierzy się z Tobą w bezlitosnym starciu z podstaw finansowych.', rewardItem: 'Kostur Kalkulacji' },
    'stopy': { name: 'Kolekcjoner Stóp NBP', hp: 320, image: 'boss_bilans.png', hue: 45, desc: 'Pan korytarza stóp procentowych. Czy potrafisz obliczyć stopę lombardową i depozytową w locie?', rewardItem: 'Sygnet Analityka' },
    'k5': { name: 'Dyskontowy Demon NPV', hp: 340, image: 'boss_golem.png', hue: 120, desc: 'Władca przyszłej wartości pieniądza. Będzie rzucał w Ciebie trudnymi wzorami NPV i IRR.', rewardItem: 'Kostur Kalkulacji' },
    'k1': { name: 'Cenzor Memoriału', hp: 300, image: 'boss_bilans.png', hue: 180, desc: 'Bezlitosny strażnik zasady współmierności przychodów i kosztów. Uważaj na podejście kasowe!', rewardItem: 'Zbroja Audytora' },
    'k2': { name: 'Wyceniacz Pasywów', hp: 350, image: 'boss_golem.png', hue: 200, desc: 'Stoi na straży wyceny aktywów w bilansie według kosztu historycznego i wartości godziwej.', rewardItem: 'Zbroja Audytora' },
    'k3': { name: 'Golem Upadłości', hp: 380, image: 'boss_golem.png', hue: 0, desc: 'Monstrum zasilane wskaźnikiem Altmana. Zmierzy się z Tobą w analizie rentowności i płynności.', rewardItem: 'Pas Siły' },
    'k4': { name: 'Mistrz Kosztów Zmiennych', hp: 330, image: 'boss_bilans.png', hue: 240, desc: 'Sprawdza próg rentowności i marżę pokrycia. Każda pomyłka obniży Twój BEP do zera.', rewardItem: 'Pas Siły' },
    'k6': { name: 'Kapitalista WACC', hp: 360, image: 'boss_golem.png', hue: 280, desc: 'Tarcza podatkowa to jego zbroja. Spróbuje zniszczyć Twój portfel kosztem kapitału obcego.', rewardItem: 'Buty Finansisty' },
    'k7': { name: 'Pożeracz Płynności KON', hp: 320, image: 'boss_bilans.png', hue: 300, desc: 'Zamraża gotówkę w cyklu konwersji. Musisz skrócić DSO i DIO, aby zadać mu obrażenia.', rewardItem: 'Grymuar Rynkowy' },
    'k8': { name: 'Wyceniacz DCF', hp: 400, image: 'boss_golem.png', hue: 90, desc: 'Wycenia firmy dochodowo i porównawczo. Wymaga znajomości NOPAT, WACC oraz EVA.', rewardItem: 'Grymuar Rynkowy' },
    'k9': { name: 'Arbitrażowy Arbitr', hp: 350, image: 'boss_bilans.png', hue: 150, desc: 'Strażnik prawa jednej ceny. Zmusi Cię do wyłapania okazji arbitrażowych na rynku.', rewardItem: 'Grymuar Rynkowy' },
    'k10': { name: 'Gubernator Monetarny', hp: 370, image: 'boss_golem.png', hue: 60, desc: 'Kontroluje podaż pieniądza. Będzie walczył stopami procentowymi i rezerwą obowiązkową.', rewardItem: 'Sygnet Analityka' },
    'k11': { name: 'Poborca Podatkowy CIT', hp: 340, image: 'boss_bilans.png', hue: 320, desc: 'Ściąga podatki bezpośrednie i pośrednie. Zmierzy się z Tobą w kalkulacji dochodu CIT.', rewardItem: 'Zbroja Audytora' },
    'k12': { name: 'Tytan Recesji', hp: 420, image: 'boss_golem.png', hue: 340, desc: 'Władca cyklu koniunkturalnego. Musisz przetrwać jego recesję, odpowiadając na pytania PKB.', rewardItem: 'Pas Siły' },
    't1': { name: 'Władca Value at Risk (VaR)', hp: 400, image: 'boss_golem.png', hue: 200, desc: 'Mierzy maksymalną stratę z określonym prawdopodobieństwem. Czy przetrwasz jego test stresu?', rewardItem: 'Sygnet Analityka' },
    't2': { name: 'Audytor Kredytowy', hp: 360, image: 'boss_bilans.png', hue: 210, desc: 'Sprawdza zdolność kredytową i asymetrię informacji. Uważaj na selekcję negatywną!', rewardItem: 'Zbroja Audytora' },
    't5': { name: 'Syntetyk Opcji', hp: 380, image: 'boss_golem.png', hue: 130, desc: 'Tworzy skomplikowane struktury opcyjne. Będziesz musiał wycenić opcje i spłacić premię.', rewardItem: 'Grymuar Rynkowy' },
    't11': { name: 'Kosztodawca Międzynarodowy', hp: 350, image: 'boss_bilans.png', hue: 160, desc: 'Liczy koszt kapitału w transgranicznych fuzjach. Przygotuj się na parytet inflacji.', rewardItem: 'Buty Finansisty' },
    't3': { name: 'Inspektor MSR', hp: 360, image: 'boss_golem.png', hue: 180, desc: 'Weryfikuje zgodność z Międzynarodowymi Standardami Rachunkowości bankowej.', rewardItem: 'Zbroja Audytora' },
    't4': { name: 'Wykresowy Manipulator', hp: 330, image: 'boss_bilans.png', hue: 250, desc: 'Mistrz formacji świecowych i średnich kroczących. Przetestuje Twoją analizę techniczną.', rewardItem: 'Grymuar Rynkowy' },
    't6': { name: 'Bankier Produktowy', hp: 340, image: 'boss_golem.png', hue: 270, desc: 'Zna na pamięć każdy produkt bankowy i prowizję. Spróbuje obciążyć Cię kosztami.', rewardItem: 'Sygnet Analityka' },
    't8': { name: 'Kontroler Odchyleń', hp: 350, image: 'boss_bilans.png', hue: 80, desc: 'Porównuje plany z wykonaniem. Każda odchyłka od normy to obrażenia dla Twojego HP.', rewardItem: 'Pas Siły' },
    't9': { name: 'Strażnik Budżetu', hp: 370, image: 'boss_golem.png', hue: 110, desc: 'Pilnuje dyscypliny budżetowej w przedsiębiorstwie. Wymaga precyzyjnych prognoz.', rewardItem: 'Buty Finansisty' },
    't7': { name: 'Likwidator Szkód OFE', hp: 380, image: 'boss_bilans.png', hue: 140, desc: 'Władca ubezpieczeń i funduszy emerytalnych. Oblicz renty dożywotnie, by go pokonać.', rewardItem: 'Pas Siły' },
    't10': { name: 'Spekulant Forex', hp: 410, image: 'boss_golem.png', hue: 220, desc: 'Manipuluje kursami walut. Musisz przewidzieć ruchy par walutowych Forex.', rewardItem: 'Sygnet Analityka' },
    't12': { name: 'Władca Swapów i Futures', hp: 450, image: 'boss_golem.png', hue: 310, desc: 'Ostateczny boss instrumentów pochodnych. Zabezpiecz pozycje, aby przeżyć.', rewardItem: 'Grymuar Rynkowy' },
    'praca': { name: 'Komisja Obrony', hp: 420, image: 'boss_golem.png', hue: 210, desc: 'Promotor i recenzent. Bronisz pracy — musisz znać event study, wzory (AR, CAR, CAAR) i wyniki (CAAR −7,78 / −9,10 / −11,03%) na pamięć.', rewardItem: 'Dyplom Licencjata' }
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
    checkStats: { total: 0, passed: 0 }, // zadania (check/blurt/capstone) w bieżącej lekcji: ile / ile zaliczonych
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

    getItemGraphic(itemName, slotType) {
        // Recznie malowane ikony (Gemini nano banana) zamiast plaskich wektorow
        const __pi = ({ head: 'ring', weapon: 'tome', chest: 'boot' })[slotType] || 'ring';
        return `<img src="assets/items/${__pi}.jpg?v=30" alt="${slotType}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.75));">`;
        if (!itemName) {
            if (slotType === 'head') return '⚪';
            if (slotType === 'weapon') return '⚔️';
            return '🛡️';
        }

        if (itemName === 'Okulary Analityka' || itemName === 'Sygnet Analityka' || itemName === 'Wizor Rynkowy') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(197,168,128,0.7));">
                <circle cx="32" cy="38" r="14" fill="none" stroke="#d4af37" stroke-width="4.5" />
                <polygon points="32,15 38,23 32,31 26,23" fill="#38bdf8" stroke="#ffffff" stroke-width="1" />
                <circle cx="32" cy="23" r="2" fill="#ffffff" />
            </svg>`;
        }

        if (itemName === 'Złoty Kalkulator' || itemName === 'Kostur Kalkulacji') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(212,175,55,0.7));">
                <line x1="14" y1="50" x2="42" y2="22" stroke="#78350f" stroke-width="4.5" stroke-linecap="round" />
                <circle cx="45" cy="19" r="6" fill="#d4af37" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="45" cy="19" r="2" fill="#38bdf8" />
                <line x1="40" y1="24" x2="44" y2="20" stroke="#ffffff" stroke-width="1" />
            </svg>`;
        }
        if (itemName === 'Hantel 50kg' || itemName === 'Młot Kinetyczny') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(239,68,68,0.7));">
                <line x1="15" y1="49" x2="45" y2="19" stroke="#4b5563" stroke-width="5" stroke-linecap="round" />
                <rect x="36" y="10" width="18" height="14" rx="2" transform="rotate(45 45 17)" fill="#1f2937" stroke="#9ca3af" stroke-width="2" />
                <line x1="41" y1="15" x2="49" y2="23" stroke="#d32f2f" stroke-width="2" />
            </svg>`;
        }
        if (itemName === 'Notatnik Rynkowy' || itemName === 'Grymuar Rynkowy') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(168,85,247,0.7));">
                <rect x="16" y="12" width="32" height="40" rx="3" fill="#581c87" stroke="#c5a880" stroke-width="2.5" />
                <line x1="22" y1="12" x2="22" y2="52" stroke="#c5a880" stroke-width="2" />
                <polygon points="32,24 36,32 32,40 28,32" fill="#a855f7" />
            </svg>`;
        }

        if (itemName === 'Garnitur Audytora' || itemName === 'Zbroja Audytora') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(197,168,128,0.5));">
                <path d="M16,14 C20,10 44,10 48,14 L50,30 C50,44 32,54 32,54 C32,54 14,44 14,30 Z" fill="#3f3f46" stroke="#c5a880" stroke-width="2.5" />
                <path d="M32,14 L32,54" stroke="#c5a880" stroke-dasharray="2,2" stroke-width="1.5" />
                <circle cx="32" cy="28" r="4" fill="#ef4444" />
            </svg>`;
        }
        if (itemName === 'Pas Kulturystyczny' || itemName === 'Pas Siły') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(245,158,11,0.5));">
                <rect x="10" y="24" width="44" height="16" rx="2" fill="#78350f" stroke="#451a03" stroke-width="2" />
                <circle cx="32" cy="32" r="7" fill="#d4af37" stroke="#ffffff" stroke-width="1.5" />
                <polygon points="32,28 35,32 32,36 29,32" fill="#ef4444" />
            </svg>`;
        }
        if (itemName === 'Kamizelka Finansisty' || itemName === 'Buty Finansisty') {
            return `
            <svg viewBox="0 0 64 64" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(168,85,247,0.5));">
                <path d="M22,14 L34,14 L32,32 L46,42 L42,48 L20,48 L18,32 Z" fill="#581c87" stroke="#c084fc" stroke-width="2" />
                <path d="M22,14 L26,14 L24,32 L20,48 L20,48 L18,32 Z" fill="#3b0764" />
                <path d="M22,14 L34,14 L32,22 L22,22 Z" fill="#a855f7" />
            </svg>`;
        }

        return '⚪';
    },

    // --- RPG Panel Renderer ---
    renderRPGPanel() {
        const panel = document.getElementById('rpg-character-panel');
        const mainArea = document.querySelector('.learn-main-area');
        const layout = document.querySelector('.rpg-split-layout');
        const toggleBtn = document.getElementById('toggle-character-panel-btn');
        const toggleLabel = document.getElementById('toggle-panel-label');
        if (!panel) return;

        const avatar = Store._data.avatar;
        if (!avatar) {
            panel.style.display = 'none';
            if (mainArea) mainArea.style.width = '100%';
            if (toggleBtn) toggleBtn.style.display = 'none';
            return;
        } else {
            if (toggleBtn) toggleBtn.style.display = 'flex';
        }

        const isCollapsed = !!Store._data.panelCollapsed;
        if (isCollapsed) {
            panel.style.display = 'none';
            if (layout) layout.style.gridTemplateColumns = '0px 1fr 340px';
            if (toggleLabel) toggleLabel.textContent = 'Pokaż profil';
            if (mainArea) mainArea.style.width = '100%';
        } else {
            panel.style.display = 'flex';
            if (layout) layout.style.gridTemplateColumns = ''; // reset to CSS default
            if (toggleLabel) toggleLabel.textContent = 'Ukryj profil';
            if (mainArea) mainArea.style.width = '';
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

        panel.innerHTML = `
            <div class="rpg-avatar-box" style="width: 100%;">
                <div class="avatar-image-container" style="border: 2px solid var(--primary); width:120px; height:120px; overflow:hidden; border-radius:50%;">
                    <img src="assets/avatars/${avatar.class}.png?v=2026" style="width:100%; height:100%; object-fit:cover;" alt="Avatar" />
                </div>
                <h3 style="margin: 0.5rem 0 0 0;" class="gradient-text">${name}</h3>
                <div style="font-size: 0.95rem; color: #fde047; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; text-shadow: 0 0 10px rgba(253, 224, 71, 0.4), 0 2px 4px #000;">Poziom ${currentLevel} • ${rank}</div>
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
                        <div class="bar-fill" style="width: ${xpPercent}%;"></div>
                    </div>
                </div>
            </div>

            <!-- Equipment Section -->
            <div style="width: 100%;" class="rpg-equipment-section">
                <h4 style="margin-bottom: 0.8rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Ekwipunek</h4>
                <div class="rpg-equipment-grid">
                    <div class="rpg-eq-slot ${eq.head ? 'equipped' : ''}" onclick="window.Learn.inspectItem('head')">
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 4px;">
                            ${this.getItemGraphic(eq.head, 'head')}
                        </div>
                        <div class="slot-name">Sygnet</div>
                    </div>
                    <div class="rpg-eq-slot ${eq.weapon ? 'equipped' : ''}" onclick="window.Learn.inspectItem('weapon')">
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 4px;">
                            ${this.getItemGraphic(eq.weapon, 'weapon')}
                        </div>
                        <div class="slot-name">Broń</div>
                    </div>
                    <div class="rpg-eq-slot ${eq.chest ? 'equipped' : ''}" onclick="window.Learn.inspectItem('chest')">
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 4px;">
                            ${this.getItemGraphic(eq.chest, 'chest')}
                        </div>
                        <div class="slot-name">Ubiór</div>
                    </div>
                </div>
            </div>
            
            <button class="btn danger ripple" style="width: 100%; font-size: 0.9rem; padding: 0.6rem; font-weight: 700; background: #991b1b; color: #fecaca; border: 1px solid #f87171;" onclick="if(confirm('⚠️ Czy na pewno chcesz wyzerować całą postać?')) window.Learn.resetAvatar()">⚠️ Zresetuj Postać</button>
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
        let itemDesc = 'Zdobądź przedmioty za pokonywanie bossów lub awans poziomu!';

        if (slot === 'head') {
            if (item) {
                itemTitle = 'Sygnet Analityka';
                itemDesc = 'Mityczny złoty pierścień z szafirem. Chroni umysł przed kognitywnym zmęczeniem i dodaje +10% do zyskiwanego XP.';
            } else {
                itemTitle = 'Pusty Slot Sygnetu';
            }
        } else if (slot === 'weapon') {
            if (item === 'Złoty Kalkulator' || item === 'Kostur Kalkulacji') { 
                itemTitle = 'Kostur Kalkulacji';
                itemDesc = 'Kostur zwieńczony złotą kulą i runami matematycznymi. Zwiększa obrażenia zadawane Bossom o 15% oraz dodaje 10% XP za poprawne odpowiedzi.'; 
            } else if (item === 'Hantel 50kg' || item === 'Młot Kinetyczny') { 
                itemTitle = 'Młot Kinetyczny';
                itemDesc = 'Ciężki żelazny młot bojowy kinezjologa. Każde uderzenie w Bossa zadaje 20% więcej obrażeń.'; 
            } else if (item === 'Notatnik Rynkowy' || item === 'Grymuar Rynkowy') { 
                itemTitle = 'Grymuar Rynkowy';
                itemDesc = 'Grymuar oprawiony w skórę ze spisem zaklęć rynkowych. Zwiększa zysk punktów XP o 20% na wszystkich zadaniach.'; 
            } else { 
                itemTitle = 'Pusty Slot Broni'; 
            }
        } else if (slot === 'chest') {
            if (item === 'Garnitur Audytora' || item === 'Zbroja Audytora') { 
                itemTitle = 'Zbroja Audytora';
                itemDesc = 'Wykuta ze stali i złota zbroja płytowa. Zwiększa maksymalne HP postaci o 25 punktów.'; 
            } else if (item === 'Pas Kulturystyczny' || item === 'Pas Siły') { 
                itemTitle = 'Pas Siły';
                itemDesc = 'Skórzany pas nabijany żelaznymi nitami. Chroni przed obrażeniami z błędnych odpowiedzi (redukuje straty HP o 5 punktów).'; 
            } else if (item === 'Kamizelka Finansisty' || item === 'Buty Finansisty') { 
                itemTitle = 'Buty Finansisty';
                itemDesc = 'Fioletowe buty z magicznej skóry. Zwiększają maksymalne HP o 15 punktów.'; 
            } else { 
                itemTitle = 'Pusty Slot Ubioru'; 
            }
        }

        const svgContent = this.getItemGraphic(item, slot);
        const iconContainer = `<div style="width: 140px; height: 140px; border-radius: 16px; border: 2px solid var(--primary); box-shadow: 0 0 15px var(--primary-glow); background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 15px;">${svgContent}</div>`;

        modal.innerHTML = `
            <div class="glass-card inspect-item-modal fade-in" style="width:100%; max-width:440px; text-align:center; padding: 2.5rem; border-color: rgba(197, 168, 128, 0.4); box-shadow: 0 0 25px rgba(197, 168, 128, 0.25);">
                <div style="margin-bottom: 1.5rem; display:flex; justify-content:center;">${iconContainer}</div>
                <h3 class="gradient-text" style="font-size:1.6rem; margin-bottom:0.3rem;">${itemTitle}</h3>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom:1.5rem;">Slot: ${slot === 'head' ? 'Sygnet' : (slot === 'weapon' ? 'Broń' : 'Ubiór')}</div>
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
        const rightSidebar = document.getElementById('learn-right-sidebar');
        const filterEl = document.getElementById('learn-filter-container');
        const controls = document.getElementById('learn-controls');

        if (!Store._data.avatar) {
            this.lessonState = 'creator';
        }

        if (this.lessonState === 'creator') {
            if (rightSidebar) rightSidebar.style.display = 'none';
        } else {
            if (rightSidebar) rightSidebar.style.display = 'flex';
        }

        if (this.lessonState === 'map' || this.lessonState === 'creator') {
            if (titleEl) titleEl.textContent = "Kampania Lekcji";
            if (filterEl) filterEl.style.display = 'block';
            if (controls) controls.style.display = 'none';
        } else {
            if (filterEl) filterEl.style.display = 'none';
        }

        // Update active biome
        this.updateBiome();

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

    injectHelpfulGraphics(html) {
        if (!html) return html;
        let modifiedHtml = html;
        // Wstaw wykres TUZ PO akapicie zawierajacym slowo-klucz (wykresy MIEDZY akapitami tekstu)
        const ins = (kw, chart) => {
            const i = modifiedHtml.indexOf(kw);
            if (i < 0) { modifiedHtml += chart; return; }
            const pe = modifiedHtml.indexOf('</p>', i);
            const at = pe < 0 ? modifiedHtml.length : pe + 4;
            modifiedHtml = modifiedHtml.slice(0, at) + chart + modifiedHtml.slice(at);
        };

        // Wspolny szablon wykresu — Tufte: tytul-WNIOSEK, jeden akcent, bez chartjunk, ZERO przyciec.
        // Uklad wspolrzednych: pole rysowania x:72..398, y(gora)44..(dol)232 w viewBox 0 0 480 300.
        // Tytul osi Y obrocony o 90° (miesci sie w waskim lewym marginesie), tytul X wysrodkowany na dole,
        // a serie wielokrotne opisuje legenda HTML (chipy) — dzieki temu zaden tekst SVG nie wychodzi poza ramke.
        const CC = "margin:1.6rem auto; max-width:520px; padding:1.1rem 1rem 0.7rem; background:rgba(8,7,11,0.5); border:1px solid rgba(197,168,128,0.22); border-radius:14px;";
        const shell = (id, num, concl, xTitle, yTitle, legend, inner) => `
            <div id="${id}" class="medieval-chart-container" style="${CC}">
                <div style="font-size:0.7rem; color:var(--text-muted); letter-spacing:0.16em; text-transform:uppercase;">Wykres ${num}</div>
                <div style="font-size:0.98rem; color:var(--primary,#E8C76A); font-weight:700; line-height:1.35; margin:0.15rem 0 0.6rem; font-family:'Cinzel','Marcellus',serif;">${concl}</div>
                ${legend && legend.length ? `<div style="display:flex; flex-wrap:wrap; gap:0.35rem 1.1rem; justify-content:center; margin-bottom:0.5rem; font-size:0.74rem; color:#cfc6b4;">${legend.map(l => `<span style="display:inline-flex; align-items:center; gap:0.4rem;"><span style="width:16px; height:0; display:inline-block; border-top:3px ${l.dash ? 'dashed' : 'solid'} ${l.c};"></span>${l.t}</span>`).join('')}</div>` : ''}
                <svg viewBox="0 0 480 300" style="width:100%; height:auto; font-family:'Outfit',sans-serif;">
                    <line x1="72" y1="232" x2="398" y2="232" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
                    <line x1="72" y1="44" x2="72" y2="232" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
                    <text x="235" y="286" fill="var(--text-muted)" font-size="13" text-anchor="middle">${xTitle}</text>
                    <text x="22" y="138" fill="var(--text-muted)" font-size="13" text-anchor="middle" transform="rotate(-90 22 138)">${yTitle}</text>
                    ${inner}
                </svg>
            </div>`;

        // 1. CAPM / SML Chart
        if (html.includes('CAPM') && !html.includes('id="chart-capm"')) {
            const capmChart = shell('chart-capm', 1,
                'Im wyższa beta (ryzyko), tym wyższy wymagany zwrot — to mówi linia SML.',
                'Ryzyko systematyczne (β)', 'Wymagany zwrot (%)', null, `
                    <line x1="72" y1="172" x2="398" y2="172" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="4,4"/>
                    <text x="66" y="176" fill="var(--text-muted)" font-size="11" text-anchor="end">Rf</text>
                    <text x="72" y="250" fill="var(--text-muted)" font-size="11" text-anchor="middle">0</text>
                    <text x="235" y="250" fill="var(--text-muted)" font-size="11" text-anchor="middle">1,0 (rynek)</text>
                    <text x="398" y="250" fill="var(--text-muted)" font-size="11" text-anchor="middle">2,0</text>
                    <line x1="72" y1="172" x2="392" y2="68" stroke="#E8C76A" stroke-width="3" stroke-linecap="round"/>
                    <text x="392" y="58" fill="#E8C76A" font-size="12.5" font-weight="700" text-anchor="end">Linia SML</text>
                    <circle cx="235" cy="120" r="5.5" fill="#ef4444"/>
                    <text x="246" y="116" fill="#ef4444" font-size="11.5" font-weight="700" text-anchor="start">Portfel rynkowy (β=1)</text>
                `);
            ins('CAPM', capmChart);
        }

        // 2. NPV Profile Chart
        if (html.includes('NPV') && !html.includes('id="chart-npv"')) {
            const npvChart = shell('chart-npv', 2,
                'NPV spada, gdy rośnie stopa dyskontowa; w punkcie IRR przecina zero.',
                'Stopa dyskontowa r (%)', 'NPV (zł)', null, `
                    <rect x="72" y="44" width="326" height="76" fill="rgba(16,185,129,0.07)"/>
                    <rect x="72" y="120" width="326" height="112" fill="rgba(239,68,68,0.06)"/>
                    <line x1="72" y1="120" x2="398" y2="120" stroke="rgba(255,255,255,0.28)" stroke-width="1.2" stroke-dasharray="4,4"/>
                    <text x="66" y="124" fill="var(--text-muted)" font-size="11" text-anchor="end">0</text>
                    <text x="66" y="62" fill="var(--text-muted)" font-size="11" text-anchor="end">+CF</text>
                    <text x="66" y="212" fill="var(--text-muted)" font-size="11" text-anchor="end">–Nakład</text>
                    <path d="M 72,62 Q 170,96 250,120 T 398,202" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
                    <text x="120" y="86" fill="#10b981" font-size="11" font-weight="700" text-anchor="start">NPV &gt; 0 — opłaca się</text>
                    <text x="392" y="178" fill="#ef4444" font-size="11" font-weight="700" text-anchor="end">NPV &lt; 0</text>
                    <circle cx="250" cy="120" r="5.5" fill="#ef4444"/>
                    <text x="250" y="108" fill="#ef4444" font-size="11.5" font-weight="700" text-anchor="middle">IRR (NPV=0)</text>
                `);
            ins('NPV', npvChart);
        }

        // 3. NBP rates corridor chart
        if ((html.includes('lombard') || html.includes('depozyt') || html.includes('korytarz stóp')) && !html.includes('id="chart-corridor"')) {
            const corridorChart = shell('chart-corridor', 3,
                'Stopa rynkowa krąży w korytarzu NBP: między lombardową (sufit) a depozytową (podłoga).',
                'Czas →', 'Stopa (%)',
                [{ c: '#f43f5e', dash: true, t: 'Lombardowa (sufit)' }, { c: '#eab308', t: 'Referencyjna' }, { c: '#10b981', dash: true, t: 'Depozytowa (podłoga)' }, { c: '#38bdf8', t: 'Rynkowa (WIBOR)' }], `
                    <rect x="72" y="72" width="326" height="120" fill="rgba(234,179,8,0.07)"/>
                    <line x1="72" y1="72" x2="398" y2="72" stroke="#f43f5e" stroke-width="2" stroke-dasharray="5,4"/>
                    <line x1="72" y1="120" x2="398" y2="120" stroke="#eab308" stroke-width="2.5"/>
                    <line x1="72" y1="192" x2="398" y2="192" stroke="#10b981" stroke-width="2" stroke-dasharray="5,4"/>
                    <path d="M 72,150 Q 110,108 150,135 T 240,110 T 320,150 T 398,128" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
                `);
            ins('lombard', corridorChart);
        }

        // 4. WACC / Capital Structure Chart
        if (html.includes('WACC') && !html.includes('id="chart-wacc"')) {
            const waccChart = shell('chart-wacc', 4,
                'WACC ma minimum — istnieje optymalna struktura kapitału (dług vs. kapitał własny).',
                'Udział długu w kapitale (D/V)', 'Koszt kapitału (%)',
                [{ c: '#f43f5e', t: 'Re — kapitał własny' }, { c: '#10b981', t: 'Rd — dług (po podatku)' }, { c: '#eab308', t: 'WACC — średni koszt' }], `
                    <path d="M 72,128 Q 235,112 398,70" fill="none" stroke="#f43f5e" stroke-width="2.5"/>
                    <path d="M 72,196 Q 250,190 398,168" fill="none" stroke="#10b981" stroke-width="2.5"/>
                    <path d="M 72,128 C 150,178 210,182 260,178 S 360,150 398,140" fill="none" stroke="#eab308" stroke-width="3.5"/>
                    <circle cx="245" cy="180" r="5.5" fill="#ef4444"/>
                    <text x="245" y="168" fill="#ef4444" font-size="11.5" font-weight="700" text-anchor="middle">Optimum</text>
                `);
            ins('WACC', waccChart);
        }

        return modifiedHtml;
    },

    // === 26 UNIKALNYCH BIOMÓW (jeden na rozdział) — sterowane danymi, bez 26 PNG ===
    // n=nazwa, a=akcent, sky=[gora,srodek,dol] gradientu sceny, glow='r,g,b' poswiata,
    // motion=ruch czastek, cols=palety czastek 'r,g,b', con=linie konstelacji.
    BIOMES: {
        fundament: { n:'Świątynia Wiedzy', a:'#f5c977', sky:['#1a1206','#2a1d0a','#3a2810'], glow:'245,201,119', motion:'rise', cols:['255,201,119','255,170,80','255,215,0'], con:true },
        stopy:     { n:'Mennica Liczb', a:'#d4af37', sky:['#14110a','#221b0d','#2e2410'], glow:'212,175,55', motion:'fall', cols:['212,175,55','245,200,90'], con:true },
        k5:        { n:'Rzeka Czasu', a:'#2dd4bf', sky:['#06141a','#0a2230','#0e3040'], glow:'45,212,191', motion:'drift', cols:['45,212,191','94,234,212'], con:false },
        k1:        { n:'Biblioteka Ksiąg', a:'#c89b6a', sky:['#15100a','#241a10','#322417'], glow:'200,155,106', motion:'drift', cols:['200,155,106','222,180,130'], con:false },
        k2:        { n:'Skarbiec Aktywów', a:'#5ad19a', sky:['#08160f','#0e241a','#143024'], glow:'90,209,154', motion:'rise', cols:['90,209,154','245,200,90'], con:true },
        k3:        { n:'Wieża Obserwacji', a:'#818cf8', sky:['#0a0c18','#121634','#1a2044'], glow:'129,140,248', motion:'fall', cols:['129,140,248','100,116,180'], con:false },
        k4:        { n:'Kuźnia Kosztów', a:'#fb923c', sky:['#180a06','#2a120a','#3a1810'], glow:'251,146,60', motion:'rise', cols:['251,146,60','255,100,60','255,180,80'], con:true },
        k6:        { n:'Wieża Kapitału', a:'#a78bfa', sky:['#100a18','#1e1230','#2a1a44'], glow:'167,139,250', motion:'rise', cols:['167,139,250','196,160,255'], con:true },
        k7:        { n:'Młyn Płynności', a:'#38bdf8', sky:['#06101a','#0a1e30','#0e2c44'], glow:'56,189,248', motion:'drift', cols:['56,189,248','120,210,255'], con:false },
        k8:        { n:'Tron Wyceny', a:'#c084fc', sky:['#120a1a','#221033','#301848'], glow:'192,132,252', motion:'rise', cols:['192,132,252','245,200,90'], con:true },
        k9:        { n:'Wielka Giełda', a:'#22d3ee', sky:['#06121a','#0a2030','#0e2e44'], glow:'34,211,238', motion:'spark', cols:['34,211,238','120,230,255','94,234,212'], con:true },
        k10:       { n:'Bank Centralny', a:'#93c5fd', sky:['#0c1118','#161f30','#202c44'], glow:'147,197,253', motion:'fall', cols:['147,197,253','255,255,255','245,200,90'], con:false },
        k11:       { n:'Skarb Państwa', a:'#f87171', sky:['#180809','#2a0d10','#3a1216'], glow:'248,113,113', motion:'rise', cols:['248,113,113','245,200,90','255,255,255'], con:true },
        k12:       { n:'Krajobraz Gospodarki', a:'#34d399', sky:['#08140e','#0e261a','#143024'], glow:'52,211,153', motion:'drift', cols:['52,211,153','134,239,172'], con:false },
        t1:        { n:'Burza Ryzyka', a:'#ef4444', sky:['#140608','#240a0e','#300e14'], glow:'239,68,68', motion:'swirl', cols:['239,68,68','255,120,80','120,120,140'], con:false },
        t2:        { n:'Sąd Kredytowy', a:'#d97706', sky:['#150f06','#251a0a','#322410'], glow:'217,119,6', motion:'fall', cols:['217,119,6','245,180,80'], con:true },
        t3:        { n:'Skarbiec Banku', a:'#cbd5e1', sky:['#0c0f14','#181d26','#242c38'], glow:'203,213,225', motion:'fall', cols:['203,213,225','245,200,90'], con:true },
        t4:        { n:'Komnata Świec', a:'#4ade80', sky:['#08120c','#0c2014','#10160e'], glow:'74,222,128', motion:'spark', cols:['74,222,128','248,113,113'], con:true },
        t5:        { n:'Laboratorium Wyceny', a:'#c026d3', sky:['#120818','#220e30','#2e1444'], glow:'192,38,211', motion:'rise', cols:['192,38,211','216,120,240'], con:true },
        t6:        { n:'Hala Bankowa', a:'#60a5fa', sky:['#0a0f1a','#101d30','#162844'], glow:'96,165,250', motion:'fall', cols:['96,165,250','245,200,90'], con:false },
        t7:        { n:'Tarcza Ochrony', a:'#2dd4bf', sky:['#06140f','#0c241c','#103028'], glow:'45,212,191', motion:'drift', cols:['45,212,191','134,239,172'], con:false },
        t8:        { n:'Pulpit Kontrolera', a:'#06b6d4', sky:['#06121a','#0a222e','#0e2e3e'], glow:'6,182,212', motion:'spark', cols:['6,182,212','103,232,249'], con:true },
        t9:        { n:'Mapa Planów', a:'#eab308', sky:['#15110a','#241c0e','#322814'], glow:'234,179,8', motion:'drift', cols:['234,179,8','250,210,100'], con:false },
        t10:       { n:'Targ Walut', a:'#fbbf24', sky:['#120e06','#221a0c','#2e2410'], glow:'251,191,36', motion:'swirl', cols:['251,191,36','52,211,153','248,113,113','96,165,250'], con:false },
        t11:       { n:'Most Walutowy', a:'#8b5cf6', sky:['#0a0e1a','#161830','#202844'], glow:'139,92,246', motion:'drift', cols:['139,92,246','45,212,191'], con:true },
        t12:       { n:'Kuźnia Derywatów', a:'#ec4899', sky:['#160814','#2a0d24','#380f30'], glow:'236,72,153', motion:'rise', cols:['236,72,153','255,140,200','167,139,250'], con:true },
        praca:     { n:'Sala Obrony', a:'#E8C76A', sky:['#0a0c14','#141826','#1e2438'], glow:'232,199,106', motion:'fall', cols:['232,199,106','120,160,230','203,213,225'], con:true }
    },

    updateBiome() {
        let chapter = 'fundament';
        if (this.activeQuest) chapter = this.activeQuest.chapter;
        else if (this.activeBoss) chapter = this.activeBoss.chapter;
        else {
            const f = document.getElementById('learn-chapter-filter')?.value;
            if (f && f !== 'all') chapter = f;
        }

        const b = this.BIOMES[chapter] || this.BIOMES.fundament;
        const view = document.getElementById('view-learn');
        if (view && view.dataset.biome !== chapter) {
            view.dataset.biome = chapter;
            view.style.background = `radial-gradient(135% 95% at 50% 113%, rgba(${b.glow},.34) 0%, rgba(${b.glow},.10) 34%, transparent 60%), linear-gradient(177deg, ${b.sky[0]} 0%, ${b.sky[1]} 48%, ${b.sky[2]} 100%)`;
            view.style.setProperty('--biome-accent', b.a);
            view.style.setProperty('--biome-glow', `rgba(${b.glow},.55)`);
            // Przejmij zmienne motywu — cały panel (karty/ramki/tytul) zmienia kolor per rozdzial
            view.style.setProperty('--primary', b.a);
            view.style.setProperty('--primary-glow', `rgba(${b.glow},.40)`);
            view.style.setProperty('--border-glass', `rgba(${b.glow},.28)`);
            const t = document.getElementById('learn-view-title');
            if (t) t.textContent = b.n;
            // Opcjonalna warstwa FOTO: jesli istnieje assets/biomes/<scena>.jpg, podloz pod gradient-tint
            this.applyScene(view, chapter, b);
        }

        if (typeof Anim !== 'undefined' && typeof Anim.setBiome === 'function') {
            Anim.setBiome({ key: chapter, motion: b.motion, colors: b.cols, connect: b.con, connColor: b.cols[0] });
        }
    },

    // Probe FOTO: KAZDY rozdzial ma WLASNE assets/biomes/<id>.jpg (zoptymalizowane <=1600px).
    // Probe order: JPG first (wszystkie tla sa jpg), PNG jako fallback. Brak pliku => zostaje gradient (0 bledow 404 w UI).
    applyScene(view, chapter, b) {
        if (!view) return;
        const V = '35';
        const tint = `radial-gradient(135% 95% at 50% 113%, rgba(${b.glow},.28) 0%, rgba(${b.glow},.08) 38%, transparent 64%), linear-gradient(177deg, ${b.sky[0]}e6 0%, ${b.sky[1]}cc 48%, ${b.sky[2]}cc 100%)`;
        const applyBg = (ext) => {
            if (view.dataset.biome === chapter) {
                view.style.background = `${tint}, url('assets/biomes/${chapter}.${ext}?v=${V}') center/cover no-repeat`;
            }
        };
        const imgJpg = new Image();
        imgJpg.onload = () => applyBg('jpg');
        imgJpg.onerror = () => {
            const imgPng = new Image();
            imgPng.onload = () => applyBg('png');
            imgPng.src = `assets/biomes/${chapter}.png?v=${V}`;
        };
        imgJpg.src = `assets/biomes/${chapter}.jpg?v=${V}`;
    },

    toggleCharacterPanel() {
        Store._data.panelCollapsed = !Store._data.panelCollapsed;
        Store.save();
        this.renderRPGPanel();
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
                    <div class="class-card-rpg ripple" onclick="window.Learn.createHero('audytor')">
                        <img src="assets/avatars/audytor.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); margin-bottom: 1.2rem;" alt="Audytor" />
                        <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Wielki Audytor</h3>
                        <p class="text-muted" style="font-size: 0.85rem; line-height:1.5;">Ekspert bilansów i WACC. Rozpoczyna ze <b>Złotym Kalkulatorem</b> (+15% XP) i <b>Garniturem Audytora</b> (+25 max HP).</p>
                    </div>

                    <!-- Class 2 -->
                    <div class="class-card-rpg ripple" onclick="window.Learn.createHero('kinezjolog')">
                        <img src="assets/avatars/kinezjolog.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--success); margin-bottom: 1.2rem;" alt="Kinezjolog" />
                        <h3 style="color: var(--success); margin-bottom: 0.5rem;">Kinezjolog</h3>
                        <p class="text-muted" style="font-size: 0.85rem; line-height:1.5;">Mistrz fizjologii i biomechaniki. Otrzymuje <b>Hantel 50kg</b> (+20% obrażeń) oraz <b>Pas Kulturystyczny</b> (redukuje straty HP).</p>
                    </div>

                    <!-- Class 3 -->
                    <div class="class-card-rpg ripple" onclick="window.Learn.createHero('strateg')">
                        <img src="assets/avatars/strateg.png?v=2026" style="width: 130px; height: 130px; border-radius: 50%; object-fit: cover; border: 3px solid var(--secondary, #a78bfa); margin-bottom: 1.2rem;" alt="Strateg" />
                        <h3 style="color: var(--secondary, #a78bfa); margin-bottom: 0.5rem;">Strateg Rynkowy</h3>
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

    // --- STRESZCZENIA ROZDZIAŁÓW (pod Ogniskiem; odblokowane po pokonaniu bossa działu) ---
    openSummaries() {
        const SUM = window.SUMMARIES || {};
        const keys = Object.keys(SUM);
        const items = keys.map(k => {
            const s = SUM[k];
            const unlocked = s.alwaysUnlocked || (typeof Store !== 'undefined' && Store.isBossDefeated && Store.isBossDefeated(k));
            const qcount = s.groups ? s.groups.reduce((n, g) => n + (g.questions || []).length, 0) : (s.questions || []).length;
            return `<div onclick="${unlocked ? `window.Learn.viewSummary('${k}')` : ''}" style="display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:0.9rem 1.1rem; margin-bottom:0.6rem; border-radius:12px; border:1px solid ${unlocked ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}; background:${unlocked ? 'rgba(212,175,55,0.06)' : 'rgba(0,0,0,0.25)'}; cursor:${unlocked ? 'pointer' : 'default'}; opacity:${unlocked ? 1 : 0.55};">
                <span style="font-weight:700; color:${unlocked ? 'var(--gold-text,#E8C76A)' : 'var(--text-muted)'};">${s.title}</span>
                <span style="font-size:0.78rem; color:var(--text-muted); white-space:nowrap;">${unlocked ? `${qcount} pytań ▶` : '🔒 Pokonaj bossa'}</span>
            </div>`;
        }).join('');
        this._summaryModal(`<h2 style="font-family:'Cinzel','Marcellus',serif; color:var(--gold-text,#E8C76A); margin:0 0 0.3rem;">📜 Streszczenia rozdziałów</h2>
            <p class="text-muted" style="font-size:0.85rem; margin:0 0 1.2rem; line-height:1.5;">Pytania egzaminacyjne z wzorcowymi odpowiedziami. Odblokowują się po pokonaniu bossa danego działu (Fundamenty — od startu).</p>
            ${items || '<p class="text-muted">Brak streszczeń.</p>'}`);
    },
    viewSummary(ch) {
        const s = (window.SUMMARIES || {})[ch];
        if (!s) return;
        const chips = { definicyjne: '#38bdf8', obliczeniowe: '#E8C76A', porownawcze: '#a78bfa', pulapka: '#ef4444' };
        const labels = { definicyjne: 'definicyjne', obliczeniowe: 'obliczeniowe', porownawcze: 'porównawcze', pulapka: 'pułapka' };
        const card = (q) => {
            const c = chips[q.type] || '#888';
            return `<div style="background:rgba(8,7,11,0.55); border:1px solid rgba(212,175,55,0.18); border-radius:12px; padding:1.1rem 1.2rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; margin-bottom:0.6rem;">
                    <b style="font-size:1.0rem; line-height:1.45; color:#ECE6D8;">${q.q}</b>
                    <span style="flex-shrink:0; font-size:0.66rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:${c}; border:1px solid ${c}; border-radius:20px; padding:0.18rem 0.6rem; white-space:nowrap;">${labels[q.type] || q.type}</span>
                </div>
                <div style="font-size:0.92rem; line-height:1.65; color:#cfc6b4;"><b style="color:var(--gold-text,#E8C76A);">Odp:</b> ${q.a}</div>
            </div>`;
        };
        const head = (h) => `<h3 style="font-family:'Cinzel','Marcellus',serif; color:var(--gold-text,#E8C76A); font-size:1.05rem; margin:1.6rem 0 0.8rem; padding-bottom:0.35rem; border-bottom:1px solid rgba(212,175,55,0.22);">${h}</h3>`;
        // Wsparcie sekcji (groups) — np. 5 pytań komisji na każdą część pracy. Stare działy: płaska lista.
        const body = (s.groups && s.groups.length)
            ? s.groups.map(g => head(g.h) + (g.questions || []).map(card).join('')).join('')
            : (s.questions || []).map(card).join('');
        this._summaryModal(`<button onclick="window.Learn.openSummaries()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem; margin-bottom:0.6rem; padding:0;">‹ Wróć do listy</button>
            <h2 style="font-family:'Cinzel','Marcellus',serif; color:var(--gold-text,#E8C76A); margin:0 0 1.2rem;">${s.title}</h2>${body}`);
    },
    _summaryModal(inner) {
        let m = document.getElementById('summary-modal');
        if (!m) {
            m = document.createElement('div'); m.id = 'summary-modal';
            m.style.cssText = "position:fixed; inset:0; z-index:10000; background:rgba(5,5,10,0.86); backdrop-filter:blur(8px); display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding:4vh 1rem; font-family:'Outfit',sans-serif;";
            m.addEventListener('click', e => { if (e.target === m) m.remove(); });
            document.body.appendChild(m);
        }
        m.innerHTML = `<div style="background:rgba(14,12,18,0.98); border:1px solid rgba(212,175,55,0.3); border-radius:18px; max-width:760px; width:100%; padding:1.8rem 2rem; box-shadow:0 20px 60px rgba(0,0,0,0.7); position:relative;">
            <button onclick="document.getElementById('summary-modal').remove()" style="position:absolute; top:0.8rem; right:1.1rem; background:none; border:none; color:var(--text-muted); font-size:1.7rem; cursor:pointer; line-height:1;">×</button>
            ${inner}
        </div>`;
    },

    createHero(className) {
        let eq = { head: 'Sygnet Analityka', weapon: null, chest: null };
        let maxHp = 100;
        
        // Przedmioty startowe zgodne z opisami klas (i z bonusami w Store.equipBonus).
        if (className === 'audytor') {
            eq.weapon = 'Złoty Kalkulator';   // +15% XP, +10% obrazen
            eq.chest = 'Garnitur Audytora';   // redukcja obrazen
            maxHp = 125;                       // +25 max HP
        } else if (className === 'kinezjolog') {
            eq.weapon = 'Hantel 50kg';        // +20% obrazen
            eq.chest = 'Pas Kulturystyczny';  // redukcja obrazen
        } else if (className === 'strateg') {
            eq.weapon = 'Notatnik Rynkowy';   // +20% XP
            eq.chest = 'Kamizelka Finansisty';// redukcja obrazen
            maxHp = 115;                       // +15 max HP
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
            <div class="glass-card bonfire-card fade-in" style="width: 100%; padding: 1.2rem; border-color: #ff5722; text-align: center; box-shadow: 0 0 20px rgba(255, 87, 34, 0.2);">
                <div style="width: 70px; height: 70px; margin: 0 auto 0.8rem auto; filter: drop-shadow(0 0 10px #ff5722); animation: pulse 2s infinite; border-radius: 50%; overflow: hidden;">
                    <img src="assets/avatars/bonfire.png?v=2026" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <h4 style="color: #ff5722; margin: 0 0 0.4rem 0; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.95rem;">Ognisko Ocalenia</h4>
                <p class="text-muted" style="font-size: 0.75rem; margin: 0 auto 1.2rem auto; line-height: 1.4;">
                    Odpoczynek przywraca 100% HP i Energii, ale <b>odradza wszystkie powtórki!</b>
                </p>
                
                <div style="display:flex; flex-direction: column; gap: 0.6rem; width: 100%;">
                    <button class="btn warning ripple" style="font-weight: bold; font-size: 0.8rem; padding: 0.7rem;" onclick="window.Learn.restAtBonfire()">Odpocznij przy Ognisku</button>
                    <button class="btn primary ripple" style="font-weight: bold; font-size: 0.8rem; padding: 0.7rem;" ${souls >= soulsNeeded ? '' : 'disabled'} onclick="window.Learn.buyLevelUp()">Awansuj poziom (${soulsNeeded} 🔥)</button>
                    <button class="btn secondary ripple" style="font-weight: bold; font-size: 0.8rem; padding: 0.7rem;" onclick="window.Learn.openSummaries()">📜 Streszczenia rozdziałów</button>
                </div>
            </div>
        `;

        let dailiesHTML = '';
        if (this.queue.length > 0) {
            dailiesHTML = `
                <div class="glass-card fade-in" style="width: 100%; border-color: var(--warning); background: rgba(255, 234, 0, 0.02); margin-bottom: 1.5rem; padding: 1.2rem; box-shadow: 0 0 15px rgba(255,234,0,0.05); text-align: center;">
                    <h4 style="color: var(--warning); display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin: 0 0 0.5rem 0; font-size: 1rem;">⏱️ Zjawy Pamięciowe</h4>
                    <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 1rem; line-height: 1.4;">Zmagasz się z <b>${this.queue.length}</b> zjawami. Pokonaj je, aby zregenerować witalność.</p>
                    <button class="btn warning ripple" style="font-weight: bold; width: 100%; font-size: 0.85rem; padding: 0.7rem;" onclick="window.Learn.startDailies()">Rozpocznij Walkę (+20⚡)</button>
                </div>
            `;
        }

        const rightSidebar = document.getElementById('learn-right-sidebar');
        if (rightSidebar) {
            rightSidebar.innerHTML = `
                ${dailiesHTML}
                ${bonfireHTML}
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

            const boss = BOSS_TEMPLATES[ch] || { name: 'Strażnik Działu', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Tajemniczy strażnik kognitywny.', rewardItem: 'Kostur Kalkulacji' };
            const isBossUnlocked = avgMastery >= 50;
            const bossWon = (typeof Store !== 'undefined' && Store.isBossDefeated && Store.isBossDefeated(ch));

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
                    <div class="boss-chapter-card ${(isBossUnlocked || bossWon) ? 'unlocked' : 'locked'}" style="margin-top: 1.2rem; border: 1px solid ${bossWon ? 'rgba(0,230,118,0.45)' : (isBossUnlocked ? 'rgba(255,23,68,0.4)' : 'rgba(255,255,255,0.05)')}; background: ${bossWon ? 'linear-gradient(135deg, rgba(0,230,118,0.06) 0%, transparent 100%)' : (isBossUnlocked ? 'linear-gradient(135deg, rgba(255,23,68,0.04) 0%, transparent 100%)' : 'rgba(0,0,0,0.1)')}; padding: 1.2rem; border-radius: 14px; display: flex; align-items: center; gap: 1.2rem; justify-content: space-between; flex-wrap: wrap;">
                        <div style="display:flex; align-items:center; gap:1.2rem; max-width: 70%;">
                            <div style="width:68px; height:68px; border-radius:50%; overflow:hidden; border: 2px solid ${bossWon ? 'var(--success)' : (isBossUnlocked ? 'var(--danger)' : '#666')}; filter: ${(isBossUnlocked || bossWon) ? 'none' : 'grayscale(0.75) brightness(0.5)'}; flex-shrink: 0;">
                                <img src="assets/avatars/boss_${ch}.png?v=45" onerror="this.onerror=null;this.src='assets/avatars/boss_golem.png?v=2026'" style="width:100%; height:100%; object-fit:cover;" />
                            </div>
                            <div style="text-align: left;">
                                <h4 style="margin: 0; color: ${bossWon ? 'var(--success)' : (isBossUnlocked ? 'var(--danger)' : 'var(--text-muted)')}; font-size:1.1rem; font-weight:800; display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                                    ⚔️ BOSS: ${boss.name} ${bossWon ? '<span style="font-size:0.72rem; background:rgba(0,230,118,0.18); color:var(--success); border:1px solid var(--success); border-radius:20px; padding:0.1rem 0.6rem; letter-spacing:0.05em;">✓ POKONANY</span>' : ''}
                                </h4>
                                <p class="text-muted" style="font-size: 0.8rem; line-height:1.4; margin-top: 0.3rem;">${bossWon ? 'Pokonany! Zdobyłeś nagrodę. Możesz zmierzyć się ponownie dla wprawy.' : (isBossUnlocked ? boss.desc : `Aura Bossa zablokowana. Osiągnij minimum <b>50% opanowania działu</b>, aby wyzwać go na starcie.`)}</p>
                            </div>
                        </div>
                        <button class="btn ${bossWon ? 'secondary' : (isBossUnlocked ? 'danger' : 'secondary')} ripple" ${(isBossUnlocked || bossWon) ? '' : 'disabled'} style="font-weight: bold; padding: 0.7rem 1.4rem; border-radius:24px; font-size: 0.85rem;${bossWon ? ' border-color:var(--success); color:var(--success);' : ''}" onclick="window.Learn.challengeBoss('${ch}')">
                            ${bossWon ? '⚔️ Walcz ponownie' : (isBossUnlocked ? 'Rzuć Wyzwanie' : '🔒 Zablokowane')}
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
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
        
        // Dark Souls enemy respawn: powtorki wracaja na mape (staja sie wymagalne TERAZ).
        // WAZNE: zmieniamy TYLKO harmonogram (nextReview), NIE ruszamy mastery/biegłości.
        // (Poprzednio wolano Store.updateLesson(l.id, state.mastery) — mastery 0-100 trafialo jako
        //  quality 1-5, co nadpisywalo biegłość i psulo wskrzeszanie powtorek.)
        if (window.LESSONS && window.LESSONS.lessons) {
            window.LESSONS.lessons.forEach(l => {
                const state = Store._data.lessons[l.id];
                if (state && state.nextReview) { state.nextReview = Date.now(); state.interval = 0; }
            });
            Store.save();
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
        this.checkStats = { total: 0, passed: 0 };
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
        this.checkStats = { total: 0, passed: 0 };
        this.lessonState = 'intro';
        this.renderMain();
    },

    // --- Quest Intro Screen ---
    renderIntro() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        const rightSidebar = document.getElementById('learn-right-sidebar');
        if (!container || !this.activeQuest) return;

        if (rightSidebar) rightSidebar.innerHTML = ''; // Clear right sidebar to focus attention on intro

        const lesson = this.activeQuest;
        const firstTeach = lesson.steps.find(s => s.type === 'teach')?.html || '<p>Gotów na nową wiedzę?</p>';

        container.innerHTML = `
            <div class="glass-card fade-in" style="width: 100%; text-align: center; padding: 2.5rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px var(--primary-glow));">🎓</div>
                <h2 style="font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--primary);">${lesson.title}</h2>
                <div class="text-muted" style="margin-bottom: 2rem; font-weight: 500;">Dział: ${lesson.chapter}</div>
                
                <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 2rem; border-radius: var(--radius-md); margin-bottom: 2.5rem; border: 1px solid var(--border-glass); box-shadow: inset 0 0 15px rgba(0,0,0,0.4);">
                    <h4 style="color: var(--primary); margin-bottom: 1.2rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem; font-weight: 800;">Czego się nauczysz:</h4>
                    <div class="text-lg lesson-body" style="line-height: 1.65; font-size: 1.25rem; max-width: 68ch; margin-inline: auto;">${this.injectHelpfulGraphics(firstTeach)}</div>
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
        const rightSidebar = document.getElementById('learn-right-sidebar');
        if (!container || !this.activeQuest) return;

        if (rightSidebar) rightSidebar.innerHTML = ''; // Clear right sidebar to focus attention on step

        const lesson = this.activeQuest;
        const step = lesson.steps[this.currentStepIndex];
        const pct = Math.round((this.currentStepIndex / lesson.steps.length) * 100);

        container.innerHTML = `
            <div class="glass-card fade-in hardcore-step lesson-window" style="width: 100%; position: relative;">
                <!-- Postęp w lekcji -->
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600;">
                    <span>POSTĘP STARCIA</span>
                    <span>${this.currentStepIndex + 1} / ${lesson.steps.length}</span>
                </div>
                <div class="progress-fuse-container">
                    <div class="progress-fuse-fill" style="width: ${pct}%;"></div>
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
            const npcImg = lesson.chapter === 'fundament' || lesson.chapter === 'stopy' ? 'audytor' : 'kinezjolog';
            const keys = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
            contentEl.innerHTML = `
                <div class="lesson-scroll">
                    <div class="npc-head">
                        <div class="npc-portrait-frame"><img src="assets/avatars/${npcImg}.png" alt="${npcName}" /></div>
                        <div class="npc-name">${npcName}</div>
                    </div>
                    <div class="text-lg lesson-body">${this.injectHelpfulGraphics(step.html)}</div>
                </div>
                <div class="strefa-starcia">
                    <div class="starcia-head">⚔️ Strefa Starcia — Praktyka</div>
                    <div class="starcia-grid">
                        <div class="starcia-zadanie">
                            <div class="sz-label">Złote Wzory</div>
                            <div class="archiwum-wzory">
                                <div>$$NPV = \\sum_{t}\\frac{CF_t}{(1+r)^t} - I_0$$</div>
                                <div>$$r_i = R_f + \\beta\\,(R_m - R_f)$$</div>
                                <div>$$ROE = \\frac{\\text{Zysk netto}}{\\text{Kapitał własny}}$$</div>
                            </div>
                            <p style="margin-top:1rem; color:#d6cdb8;">Użyj wzorów i kamiennego kalkulatora obok, by przeliczyć przykład z tego działu. Przećwicz liczby, zanim staniesz przed komisją.</p>
                        </div>
                        <div class="strefa-kalkulator">
                            <div class="kalk-display" id="kalk-display">0</div>
                            <div class="kalk-grid">
                                ${keys.map(k => `<button class="kalk-key${'/*-+'.includes(k) ? ' op' : (k === '=' ? ' eq' : '')}" data-k="${k}">${k}</button>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            if (typeof renderMathInElement === 'function') renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
            if (rightSidebar) rightSidebar.innerHTML = '';
            // Funkcjonalny kalkulator
            (() => {
                const kd = document.getElementById('kalk-display');
                if (!kd) return;
                contentEl.querySelectorAll('.kalk-key').forEach(b => b.onclick = () => {
                    const k = b.dataset.k;
                    const cur = kd.dataset.expr || '';
                    if (k === '=') {
                        try { const r = Function('"use strict";return (' + (cur || '0') + ')')(); kd.textContent = String(r); kd.dataset.expr = String(r); }
                        catch (e) { kd.textContent = 'Błąd'; kd.dataset.expr = ''; }
                    } else {
                        kd.dataset.expr = cur + k; kd.textContent = kd.dataset.expr;
                    }
                });
            })();

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.style.borderRadius = '24px';
            btn.textContent = 'Zrozumiałem, dalej (Enter)';
            btn.onclick = () => this.nextStep(5);
            controls.appendChild(btn);

        } else if (step.type === 'check') {
            const heading = `<h3 style="margin-bottom: 1.8rem; font-size: 1.4rem; line-height: 1.5; font-weight: 700;">${step.q || step.prompt || ''}</h3>`;
            
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
                input.style.marginBottom = '1rem';
                contentEl.appendChild(input);

                // --- KALKULATOR w Starciu Kontrolnym (samodzielny; style inline, by nie kolidowac z style.css) ---
                // Bez niego pytania obliczeniowe (np. procent skladany 2000*1,1^2) sa nie do zrobienia w glowie.
                const calc = document.createElement('div');
                calc.style.cssText = 'margin:0 0 1.5rem;padding:1rem;border:1px solid rgba(212,175,55,.25);border-radius:14px;background:rgba(10,8,12,.55);box-shadow:inset 0 0 24px rgba(0,0,0,.45)';
                const calcHint = document.createElement('div');
                calcHint.textContent = '🧮 Kalkulator — „=" wpisze wynik do pola powyżej (^ = potęga)';
                calcHint.style.cssText = 'font-size:.78rem;opacity:.65;margin-bottom:.6rem;letter-spacing:.02em';
                calc.appendChild(calcHint);
                const disp = document.createElement('div');
                disp.style.cssText = "min-height:2.4rem;display:flex;align-items:center;justify-content:flex-end;padding:.4rem .8rem;margin-bottom:.7rem;font-family:'Outfit',monospace;font-size:1.3rem;color:#E8C76A;background:rgba(0,0,0,.45);border:1px solid rgba(212,175,55,.18);border-radius:8px;overflow-x:auto;white-space:nowrap";
                disp.textContent = '0';
                calc.appendChild(disp);
                let expr = '';
                const sync = () => { disp.textContent = expr || '0'; };
                const grid = document.createElement('div');
                grid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:.5rem';
                const keys = ['7','8','9','÷','C', '4','5','6','×','⌫', '1','2','3','−','+', '0',',','(',')','^', '='];
                keys.forEach(k => {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.textContent = k;
                    const eq = (k === '='), op = ('÷×−+^()C⌫'.indexOf(k) >= 0);
                    b.style.cssText = 'padding:.85rem 0;font-size:1.15rem;font-weight:700;cursor:pointer;border-radius:8px;' +
                        "font-family:'Cinzel','Marcellus',serif;color:" + (eq ? '#140f08' : (op ? '#e8a23c' : '#e8d9b5')) + ';' +
                        'border:1px solid ' + (eq ? '#E8C76A' : '#5c4a32') + ';' +
                        'background:' + (eq ? 'linear-gradient(180deg,#ffe9a8,#d6ad3c)' : 'linear-gradient(180deg,#2c2720,#14100b)') + ';' +
                        'box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 3px rgba(0,0,0,.5)';
                    if (eq) b.style.gridColumn = '1 / -1'; // "=" na całą szerokość (osobny wiersz)
                    b.onmousedown = e => e.preventDefault(); // nie zabieraj fokusu z pola odpowiedzi
                    b.onclick = () => {
                        if (k === 'C') { expr = ''; sync(); return; }
                        if (k === '⌫') { expr = expr.slice(0, -1); sync(); return; }
                        if (k === '=') {
                            try {
                                const js = expr.replace(/\^/g, '**').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
                                const safe = js.replace(/[^0-9+\-*/(). ]/g, ''); // bialalista znakow (** przetrwa)
                                const r = Function('"use strict";return(' + safe + ')')();
                                if (typeof r === 'number' && isFinite(r)) {
                                    const rounded = Math.round(r * 1e6) / 1e6;
                                    expr = String(rounded); sync();
                                    input.value = rounded;        // wynik laduje do pola odpowiedzi
                                    input.style.borderColor = 'var(--primary)';
                                } else { disp.textContent = 'błąd'; }
                            } catch (e) { disp.textContent = 'błąd'; }
                            return;
                        }
                        expr += k; sync();
                    };
                    grid.appendChild(b);
                });
                calc.appendChild(grid);
                contentEl.appendChild(calc);

                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.style.borderRadius = '24px';
                btn.textContent = 'Zatwierdź Wynik (Enter)';

                const handleNumSubmit = () => {
                    const val = parseFloat(input.value);
                    if (isNaN(val)) return;
                    input.disabled = true;
                    const diff = Math.abs(val - step.answer);
                    const tol = Math.max(step.tol || 0, Math.abs(step.answer) * 0.01); // tolerancja wzgledna ±1% (zaokraglenia)
                    if (diff <= tol + 1e-9) {
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
            // AKTYWNY RECALL bez pisania: zaznacz CAŁE ZDANIA należące do tego działu (mix z pułapkami z innych działów).
            const ch = this.activeQuest.chapter;
            const pool = this.stmtPool();
            const correct = (pool[ch] || []).slice().sort(() => Math.random() - 0.5).slice(0, 5);
            if (correct.length < 3) {
                contentEl.innerHTML = `<h3 style="font-size:1.4rem;font-weight:700;margin-bottom:1rem;">🧠 Aktywny recall</h3>
                    <p class="text-muted" style="font-size:1.05rem;line-height:1.7;border-left:3px solid var(--primary);padding-left:1.2rem;">Przypomnij sobie z pamięci wszystko o: <b>${step.prompt}</b>. Gdy gotowe — dalej.</p>`;
                const b = document.createElement('button'); b.className = 'btn primary ripple'; b.style.borderRadius = '24px'; b.textContent = 'Przypomniane — dalej (Enter)';
                b.onclick = () => { Gamify.awardXP(15, 'Recall'); this.nextStep(4); };
                controls.appendChild(b);
            } else {
                const others = Object.keys(pool).filter(k => k !== ch).flatMap(k => pool[k]);
                const distract = [...new Set(others)].sort(() => Math.random() - 0.5).slice(0, Math.min(5, Math.max(3, correct.length)));
                const tiles = correct.map(t => ({ t, ok: true })).concat(distract.map(t => ({ t, ok: false }))).sort(() => Math.random() - 0.5);
                const totalCorrect = correct.length;
                contentEl.innerHTML = `<h3 style="font-size:1.4rem;font-weight:700;margin-bottom:.5rem;">🧠 Aktywny recall — zaznacz zdania z tego działu</h3>
                    <p class="text-muted" style="margin-bottom:1.2rem;font-size:.95rem;">Temat: <b>${step.prompt}</b>. Zaznacz WSZYSTKIE zdania, które należą do tego działu — część to pułapki z innych tematów. (${totalCorrect} poprawnych)</p>
                    <div id="recall-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:.7rem;"></div>`;
                const grid = contentEl.querySelector('#recall-grid');
                const sel = new Set();
                const base = 'padding:.9rem 1.1rem;border-radius:12px;cursor:pointer;font-weight:500;font-size:.92rem;line-height:1.45;text-align:left;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);transition:all .15s;user-select:none;';
                const on = base + 'border-color:var(--primary,#E8C76A);background:rgba(212,175,55,.12);box-shadow:0 0 10px rgba(212,175,55,.25);';
                tiles.forEach((tile, i) => {
                    const d = document.createElement('div'); d.textContent = tile.t; d.style.cssText = base;
                    d.onclick = () => { if (d.dataset.locked) return; if (sel.has(i)) { sel.delete(i); d.style.cssText = base; } else { sel.add(i); d.style.cssText = on; } };
                    grid.appendChild(d);
                });
                const btn = document.createElement('button'); btn.className = 'btn primary ripple'; btn.style.borderRadius = '24px'; btn.textContent = 'Sprawdź wybór';
                btn.onclick = () => {
                    let hit = 0, wrong = 0;
                    tiles.forEach((tile, i) => {
                        const el = grid.children[i]; el.dataset.locked = '1'; const chosen = sel.has(i);
                        if (tile.ok && chosen) { hit++; el.style.cssText = base + 'border-color:var(--success);background:rgba(0,230,118,.14);'; el.textContent = '✓ ' + tile.t; }
                        else if (tile.ok && !chosen) { el.style.cssText = base + 'border-color:var(--success);opacity:.65;'; el.textContent = '◻ ' + tile.t + ' (pominięte)'; }
                        else if (!tile.ok && chosen) { wrong++; el.style.cssText = base + 'border-color:var(--danger);background:rgba(255,23,68,.14);'; el.textContent = '✗ ' + tile.t + ' (pułapka)'; }
                        else { el.style.cssText = base + 'opacity:.4;'; }
                    });
                    const frac = Math.max(0, hit - wrong) / totalCorrect; const pct = Math.round(100 * frac); const pass = frac >= 0.7;
                    contentEl.insertAdjacentHTML('beforeend', `<div class="fade-in" style="margin-top:1.2rem;padding:.9rem 1.1rem;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid ${pass ? 'rgba(0,230,118,.3)' : 'rgba(255,23,68,.3)'}"><b style="color:${pass ? 'var(--success)' : 'var(--danger)'}">${pass ? '✓ Dobry recall' : '✗ Powtórz ten temat'} — ${pct}%</b> <span class="text-muted">(trafione ${hit}/${totalCorrect}${wrong ? ', pułapki ' + wrong : ''})</span></div>`);
                    controls.innerHTML = '';
                    const next = document.createElement('button'); next.className = 'btn primary ripple'; next.style.borderRadius = '24px'; next.textContent = 'Dalej (Enter)';
                    next.onclick = () => { if (pass) { Gamify.awardXP(25, 'Aktywny recall'); if (this.activeBoss) this.damageBoss(50); } else { this.takeDamage(20); } this.nextStep(pass ? 5 : 2); };
                    controls.appendChild(next);
                };
                controls.appendChild(btn);
            }

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
                const mk = (label, cls, cb) => { const b = document.createElement('button'); b.className = 'btn ' + cls + ' ripple'; b.style.borderRadius = '20px'; b.textContent = label; b.onclick = cb; controls.appendChild(b); };
                mk('Pełna (≥80%) ✓', 'success', () => { Gamify.awardXP(40, 'Capstone'); if (this.activeBoss) this.damageBoss(100); if (typeof Study !== 'undefined') Study.recordAnswer(true); this.nextStep(5); });
                mk('Częściowa (~50%)', 'warning', () => { Gamify.awardXP(15, 'Capstone — częściowo'); if (this.activeBoss) this.damageBoss(40); if (typeof Study !== 'undefined') { Study.recordAnswer(false); Study.addImprove(chap, 'Capstone do dopracowania: ' + (this.activeQuest.title || chap)); } this.nextStep(2); });
                mk('Słaba (<50%)', 'danger', () => { this.takeDamage(35); if (typeof Study !== 'undefined') { Study.recordAnswer(false); Study.addImprove(chap, 'Pytanie komisji: ' + (this.activeQuest.title || chap)); } this.nextStep(2); });
            };
            // Ocena offline „wzorcem" (gdy AI niedostępny): orientacyjny wynik pokrycia + wzorzec + samoocena.
            const selfAssess = (ans, note) => {
                if (note) contentEl.insertAdjacentHTML('beforeend', `<div style="margin-top:1rem;color:var(--warning);font-size:.92rem">${note}</div>`);
                if (ans && typeof GeminiAI !== 'undefined' && GeminiAI.localGrade) {
                    const lg = GeminiAI.localGrade(step.model, ans);
                    const col = lg.score >= 80 ? 'var(--success)' : (lg.score >= 50 ? 'var(--warning)' : 'var(--danger)');
                    contentEl.insertAdjacentHTML('beforeend', `<div class="fade-in" style="margin-top:1rem;padding:1rem 1.2rem;background:rgba(0,0,0,.32);border-radius:12px;border:1px solid rgba(212,175,55,.22)">
                        <div style="display:flex;justify-content:space-between;align-items:center"><b style="color:var(--primary,#E8C76A)">📊 Ocena orientacyjna (offline, bez AI)</b><b style="font-size:1.35rem;color:${col}">${lg.score}%</b></div>
                        <p class="text-muted" style="font-size:.8rem;margin-top:.3rem">Pokrycie kluczowych pojęć z wzorca (${lg.matched}/${lg.total}). To tylko wskazówka — ostateczną ocenę zrób sam, porównując odpowiedź z wzorcem poniżej.</p>
                        ${lg.missing.length ? `<p style="margin-top:.4rem;font-size:.9rem"><b>Pojęcia, których nie wykryto:</b> ${lg.missing.join(', ')}</p>` : '<p style="margin-top:.4rem;color:var(--success);font-size:.9rem">Pokryłeś kluczowe pojęcia z wzorca. 👍</p>'}
                    </div>`);
                }
                revealModel();
                selfGrade();
            };

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple'; btn.style.borderRadius = '24px';
            btn.textContent = aiOn ? 'Wyślij do komisji AI' : 'Pokaż wzorzec';
            btn.onclick = async () => {
                const ans = input.value.trim();
                if (!aiOn) { btn.remove(); selfAssess(ans, null); return; }
                if (!ans) { input.focus(); return; }
                btn.disabled = true; input.disabled = true; btn.textContent = 'Komisja ocenia...';
                const r = await GeminiAI.gradeOral(step.q, step.model, ans);
                btn.remove();
                if (r.error) {
                    selfAssess(ans, `Egzaminator AI niedostępny (${r.error}). Oceniam orientacyjnie i wzorcem.`);
                    return;
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
    // Pula dystraktorów do recall: kluczowe pojęcia ze WSZYSTKICH kroków blurt (cache).
    // Pula CAŁYCH ZDAŃ (prawdziwych stwierdzeń) per dział — do recall „zaznacz zdania z tego działu".
    stmtPool() {
        if (this._stmtPool) return this._stmtPool;
        const byCh = {};
        const isNum = t => /^[\d\s.,:+\-zł%()\/]+$/i.test(t);
        const add = (ch, text) => { text = String(text || '').trim(); if (!ch || text.length < 25 || isNum(text)) return; (byCh[ch] = byCh[ch] || []).push(text); };
        (this.data || []).forEach(l => (l.steps || []).forEach(s => {
            if (s.type !== 'check') return;
            if (s.kind === 'tf' && s.bool === true && s.q) add(l.chapter, s.q);
            if (s.kind === 'mcq' && Array.isArray(s.options) && typeof s.correct === 'number') add(l.chapter, s.options[s.correct]);
        }));
        const bank = window.BOSS_QUESTIONS || {};
        Object.keys(bank).forEach(ch => (bank[ch] || []).forEach(q => { if (Array.isArray(q.options) && typeof q.correct === 'number') add(ch, q.options[q.correct]); }));
        Object.keys(byCh).forEach(ch => { byCh[ch] = [...new Set(byCh[ch])]; });
        this._stmtPool = byCh;
        return this._stmtPool;
    },

    blurtPool() {
        if (this._blurtPool) return this._blurtPool;
        const out = new Set();
        (this.data || []).forEach(l => (l.steps || []).forEach(s => {
            if (s.type === 'blurt' && Array.isArray(s.checklist)) s.checklist.forEach(w => out.add(String(w).trim()));
        }));
        const junk = s => s.length < 2 || /^\[.*\]$/.test(s) || /^(nie|tak|oraz|np\.?|itp\.?|itd\.?|lub|albo)$/i.test(s);
        this._blurtPool = [...out].filter(w => !junk(w));
        return this._blurtPool;
    },

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

        const dmgReduce = Store.equipBonus ? Store.equipBonus().dmgReduce : 0; // pancerz redukuje obrazenia
        if (dmgReduce) amount = Math.max(5, amount - dmgReduce);

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
        let text = '', icon = '';
        if (type === 'teach') { text = 'LEKCJA'; icon = '📖'; }
        else if (type === 'example') { text = 'PRZYKŁAD'; icon = '🔍'; }
        else if (type === 'check') { text = 'STARCIE KONTROLNE'; icon = '⚔️'; }
        else if (type === 'recall') { text = 'AKTYWNY RECALL'; icon = '🧠'; }
        else if (type === 'blurt') { text = 'AKTYWNY RECALL — ZAZNACZ'; icon = '🧠'; }
        else if (type === 'capstone') { text = 'WERYFIKACJA OSTATECZNA'; icon = '🎯'; }
        
        return `<div class="lesson-ribbon">${icon} ${text}</div>`;
    },

    nextStep(quality) {
        this.earnedQuality.push(quality);
        const lesson = this.activeQuest;
        // Celnosc: poprawna odpowiedz na sprawdzian/blurt (blędne licza sie w showContextualHint/capstone)
        const st = lesson.steps[this.currentStepIndex];
        if (typeof Study !== 'undefined' && st && (st.type === 'check' || st.type === 'blurt') && quality >= 4) Study.recordAnswer(true);
        // Mastery = % zaliczonych ZADAŃ z zaznaczaniem: 'check' (obliczeniowe + MCQ/kafelki + prawda/fałsz)
        // oraz 'blurt' (aktywny recall = zaznacz poprawne). Capstone (ustne/AI) NIE liczy się — nauka nie zależy od Gemini.
        if (!this.checkStats) this.checkStats = { total: 0, passed: 0 };
        if (st && (st.type === 'check' || st.type === 'blurt')) {
            this.checkStats.total++;
            if (quality >= 4) this.checkStats.passed++;
        }

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
        if (avatar && avatar.eq && (avatar.eq.weapon === 'Grymuar Rynkowy' || avatar.eq.weapon === 'Notatnik Rynkowy')) {
            soulsEarned = Math.round(soulsEarned * 1.2);
        } else if (avatar && avatar.eq && (avatar.eq.weapon === 'Kostur Kalkulacji' || avatar.eq.weapon === 'Złoty Kalkulator')) {
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
                Store.updateLesson(lesson.id, Math.round(avgQuality)); // harmonogram powtórek (SRS)
                const cs = this.checkStats || { total: 0, passed: 0 };
                const runMastery = cs.total > 0 ? Math.round(100 * cs.passed / cs.total) : 100; // % zaliczonych zadań
                Store.setMastery(lesson.id, runMastery); // ukończenie z kompletem zadań = 100% (max z dotychczasowym)
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
    // Reużywalny kalkulator (ten sam co w Starciu Kontrolnym) — wpina wynik do podanego inputu.
    buildCalc(input) {
        const calc = document.createElement('div');
        calc.style.cssText = 'margin:1rem 0 0;padding:1rem;border:1px solid rgba(212,175,55,.25);border-radius:14px;background:rgba(10,8,12,.55);box-shadow:inset 0 0 24px rgba(0,0,0,.45)';
        const hint = document.createElement('div');
        hint.textContent = '🧮 Kalkulator — „=" wpisze wynik do pola powyżej (^ = potęga)';
        hint.style.cssText = 'font-size:.78rem;opacity:.65;margin-bottom:.6rem;letter-spacing:.02em';
        calc.appendChild(hint);
        const disp = document.createElement('div');
        disp.style.cssText = "min-height:2.4rem;display:flex;align-items:center;justify-content:flex-end;padding:.4rem .8rem;margin-bottom:.7rem;font-family:'Outfit',monospace;font-size:1.3rem;color:#E8C76A;background:rgba(0,0,0,.45);border:1px solid rgba(212,175,55,.18);border-radius:8px;overflow-x:auto;white-space:nowrap";
        disp.textContent = '0';
        calc.appendChild(disp);
        let expr = ''; const sync = () => { disp.textContent = expr || '0'; };
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:.5rem';
        ['7','8','9','÷','C', '4','5','6','×','⌫', '1','2','3','−','+', '0',',','(',')','^', '='].forEach(k => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = k;
            const eq = (k === '='), op = ('÷×−+^()C⌫'.indexOf(k) >= 0);
            b.style.cssText = 'padding:.85rem 0;font-size:1.15rem;font-weight:700;cursor:pointer;border-radius:8px;' +
                "font-family:'Cinzel','Marcellus',serif;color:" + (eq ? '#140f08' : (op ? '#e8a23c' : '#e8d9b5')) + ';' +
                'border:1px solid ' + (eq ? '#E8C76A' : '#5c4a32') + ';' +
                'background:' + (eq ? 'linear-gradient(180deg,#ffe9a8,#d6ad3c)' : 'linear-gradient(180deg,#2c2720,#14100b)') + ';' +
                'box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 3px rgba(0,0,0,.5)';
            if (eq) b.style.gridColumn = '1 / -1';
            b.onmousedown = e => e.preventDefault();
            b.onclick = () => {
                if (k === 'C') { expr = ''; sync(); return; }
                if (k === '⌫') { expr = expr.slice(0, -1); sync(); return; }
                if (k === '=') {
                    try {
                        const js = expr.replace(/\^/g, '**').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');
                        const safe = js.replace(/[^0-9+\-*/(). ]/g, '');
                        const r = Function('"use strict";return(' + safe + ')')();
                        if (typeof r === 'number' && isFinite(r)) { const rd = Math.round(r * 1e6) / 1e6; expr = String(rd); sync(); input.value = rd; input.style.borderColor = 'var(--primary)'; }
                        else { disp.textContent = 'błąd'; }
                    } catch (e) { disp.textContent = 'błąd'; }
                    return;
                }
                expr += k; sync();
            };
            grid.appendChild(b);
        });
        calc.appendChild(grid);
        return calc;
    },

    challengeBoss(ch) {
        const template = BOSS_TEMPLATES[ch] || { name: 'Strażnik Wiedzy', hp: 300, image: 'boss_bilans.png', hue: 0, desc: 'Generowany strażnik kognitywny.', rewardItem: 'Kostur Kalkulacji' };
        
        this.activeBoss = {
            name: template.name,
            hp: template.hp,
            maxHp: template.hp,
            chapter: ch,
            image: template.image,
            hue: template.hue
        };

        // Pula pytań bossa: ŚWIEŻE pytania MCQ z banku (inne niż w nauce) + zadania obliczeniowe (losowane).
        this.bossPool = [];
        const bank = (window.BOSS_QUESTIONS && window.BOSS_QUESTIONS[ch]) || [];
        bank.forEach(q => this.bossPool.push({
            step: { type: 'check', kind: 'mcq', q: q.q, options: q.options, correct: q.correct, explain: q.explain },
            lessonId: 'boss'
        }));

        // Zadania obliczeniowe z bazy problemów — gen() losuje liczby (inne niż na nauce; jest kalkulator)
        if (window.PROBLEMS) {
            window.PROBLEMS.forEach(p => {
                if (p.chapter !== ch) return;
                const g = (typeof p.gen === 'function') ? p.gen() : p;
                this.bossPool.push({
                    step: { type: 'check', kind: 'num', q: g.question || p.question || p.title, answer: (g.answer != null ? g.answer : p.answer), tol: g.tol || p.tol || 0.1, unit: g.unit, explain: g.solution || 'Zadanie obliczeniowe.' },
                    lessonId: 'problem'
                });
            });
        }

        // Fallback (działy bez banku): pytania sprawdzające z lekcji tego działu, a w ostateczności skądkolwiek.
        if (this.bossPool.length === 0) {
            this.data.filter(l => l.chapter === ch).forEach(l => l.steps.forEach(s => { if (s.type === 'check') this.bossPool.push({ step: s, lessonId: l.id }); }));
        }
        if (this.bossPool.length === 0) {
            this.data.forEach(l => l.steps.forEach(s => { if (s.type === 'check') this.bossPool.push({ step: s, lessonId: l.id }); }));
        }

        // Zabezpieczenie: usuń pytania bez treści (żadnego „UNDEFINED" na ekranie).
        this.bossPool = this.bossPool.filter(x => x && x.step && x.step.q != null && String(x.step.q).trim() && String(x.step.q).trim().toLowerCase() !== 'undefined');
        this.bossPool.sort(() => Math.random() - 0.5);
        if (this.bossPool.length > 12) this.bossPool = this.bossPool.slice(0, 12); // walka ~12 pytań

        this.lessonState = 'boss_battle';
        this.currentStepIndex = 0;
        this.renderMain();
    },

    renderBossBattle() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        const rightSidebar = document.getElementById('learn-right-sidebar');
        if (!container || !this.activeBoss) return;

        if (rightSidebar) rightSidebar.innerHTML = ''; // Clear right sidebar to focus attention on boss fight

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
            <div class="boss-arena-card fade-in" style="max-width:960px; width:100%; margin:0 auto; padding:2rem 2.2rem;">
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

                <div class="boss-avatar-box" style="width: 220px; height: 220px; border-radius: 50%; overflow: hidden; border: 5px solid var(--danger); box-shadow: 0 0 50px rgba(255, 23, 68, 0.8); margin: 0.5rem auto 2.2rem auto;">
                    <img src="assets/avatars/boss_${boss.chapter}.png?v=45" onerror="this.onerror=null;this.src='assets/avatars/boss_golem.png?v=2026'" style="width:100%; height:100%; object-fit:cover;" alt="Boss" />
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

        const heading = `<h3 style="margin-bottom: 1.8rem; font-size: 1.3rem; line-height: 1.5; font-weight:700;">${step.q || step.prompt || ''}</h3>`;
        
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
            contentEl.appendChild(this.buildCalc(input));

            const checkNum = () => {
                const val = parseFloat(input.value);
                if (isNaN(val)) return;
                input.disabled = true;
                const diff = Math.abs(val - step.answer);
                const tol = Math.max(step.tol || 0, Math.abs(step.answer) * 0.01); // tolerancja wzgledna ±1% (zaokraglenia)
                if (diff <= tol + 1e-9) {
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

        const dmgMult = Store.equipBonus ? Store.equipBonus().dmgMult : 0; // bron zwieksza obrazenia bossa
        if (dmgMult) amount = Math.round(amount * (1 + dmgMult));

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
        if (typeof Store !== 'undefined' && Store.markBossDefeated) Store.markBossDefeated(ch); // odblokowuje streszczenie działu
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
