const App = {
    data: null,
    currentView: 'dashboard',

    async init() {
        this.bindEvents();
        await this.loadData();
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.navigate(view);
            });
        });

        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if(themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                Store._data.settings.theme = newTheme;
                Store.save();
            });
        }
        
        // Settings theme load
        const savedTheme = Store._data.settings.theme;
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // PWA Install prompt handling
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            const promptEl = document.getElementById('pwa-prompt');
            if(promptEl) promptEl.style.display = 'flex';
            const pwaClose = document.getElementById('pwa-close-btn');
            if(pwaClose) pwaClose.onclick = () => { if(promptEl) promptEl.style.display = 'none'; };

            document.getElementById('pwa-install-btn').addEventListener('click', async () => {
                promptEl.style.display = 'none';
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            });
        });
    },

    async loadData() {
        // Wersja z tagu <script ...app.js?v=N> — wymusza świeży fetch danych po każdym deployu
        // (wcześniej content.json/lessons.json były pobierane bez ?v i przeglądarka serwowała stary cache).
        const _v = (document.querySelector('script[src*="app.js"]')?.src.match(/v=(\d+)/) || [])[1] || Date.now();
        try {
            // In V2 we load the full data (content.json)
            const response = await fetch('data/content.json?v=' + _v);
            if (!response.ok) throw new Error("HTTP " + response.status);
            this.data = await response.json();

            // Load Lessons
            try {
                const resL = await fetch('data/lessons.json?v=' + _v);
                if (resL.ok) this.lessonsData = await resL.json();
            } catch(e) {
                this.lessonsData = window.LESSONS || null;
            }
            
            this.onDataLoaded();
        } catch (error) {
            console.warn("Fetch failed, trying fallbacks", error);
            if (window.CONTENT) {
                this.data = window.CONTENT;
                this.lessonsData = window.LESSONS || null;
                this.onDataLoaded();
            } else {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'flex';
            }
        }
    },

    onDataLoaded() {
        document.getElementById('loading').style.display = 'none';
        
        // Remove hero after a delay or on first click
        setTimeout(() => {
            const hero = document.getElementById('hero-section');
            if(hero) {
                hero.style.opacity = '0';
                setTimeout(() => hero.style.display = 'none', 500);
            }
            this.navigate('learn');
        }, 1500); // 1.5s splash screen

        // Init modules (moduly to `const`, wiec nie sa na window — referuj bezposrednio)
        if(typeof Anim!=='undefined') Anim.init();
        if(typeof Dashboard!=='undefined') Dashboard.init(this.data);
        if(typeof Reader!=='undefined') Reader.init(this.data);
        if(typeof Flashcards!=='undefined') Flashcards.init(this.data);
        if(typeof Quiz!=='undefined') Quiz.init(this.data);
        if(typeof Commission!=='undefined') Commission.init(this.data);
        if(typeof Analytics!=='undefined') Analytics.init(this.data);
        if(typeof Formulas!=='undefined') Formulas.init(this.data);
        if(typeof Search!=='undefined') Search.init(this.data);
        if(typeof Settings!=='undefined') Settings.init();
        
        // V3 Modules
        if(typeof Learn!=='undefined') Learn.init(this.lessonsData || window.LESSONS);
        if(typeof Tasks!=='undefined') Tasks.init(window.PROBLEMS);
        if(typeof Match!=='undefined') Match.init(this.data);
        if(typeof Study!=='undefined') Study.init(this.data);
    },

    navigate(viewId) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.view === viewId) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update views
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo(0, 0);
        }

        this.currentView = viewId;
        
        // Trigger view-specific renders
        if (viewId === 'dashboard' && typeof Dashboard!=='undefined') Dashboard.render();
        if (viewId === 'analytics' && typeof Analytics!=='undefined') Analytics.render();
        if (viewId === 'match' && typeof Match!=='undefined') Match.render();
        if (viewId === 'progress' && typeof Study!=='undefined') Study.renderProgress();
        if (viewId === 'improve' && typeof Study!=='undefined') Study.renderImprove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
