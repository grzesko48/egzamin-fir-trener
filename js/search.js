const Search = {
    data: null,

    init(data) {
        this.data = data;
        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById('global-search');
        const container = document.getElementById('search-results');

        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (term.length < 2) {
                container.innerHTML = '<div class="placeholder-text">Rozpocznij wpisywanie, aby przeszukać kompendium (min. 2 znaki).</div>';
                return;
            }
            this.performSearch(term, container);
        });
    },

    performSearch(term, container) {
        let results = [];

        // Search in chapters
        if (this.data.chapters) {
            this.data.chapters.forEach(ch => {
                if (ch.title.toLowerCase().includes(term)) {
                    results.push({ type: 'Rozdział', title: ch.title, link: 'reader' });
                }
                if (ch.sections) {
                    ch.sections.forEach(sec => {
                        if (sec.h.toLowerCase().includes(term) || sec.html.toLowerCase().includes(term)) {
                            results.push({ type: 'Treść', title: `${ch.title} - ${sec.h}`, link: 'reader' });
                        }
                    });
                }
            });
        }

        // Search in flashcards
        if (this.data.flashcards) {
            this.data.flashcards.forEach(fc => {
                if (fc.front.toLowerCase().includes(term) || fc.back.toLowerCase().includes(term)) {
                    results.push({ type: 'Fiszka', title: fc.front, link: 'flashcards' });
                }
            });
        }

        // Search in quiz
        if (this.data.quiz) {
            this.data.quiz.forEach(q => {
                if (q.q.toLowerCase().includes(term) || q.a.toLowerCase().includes(term)) {
                    results.push({ type: 'Quiz', title: q.q, link: 'quiz' });
                }
            });
        }

        this.renderResults(results, container);
    },

    renderResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="placeholder-text">Brak wyników wyszukiwania.</div>';
            return;
        }

        container.innerHTML = '';
        results.forEach(res => {
            const el = document.createElement('div');
            el.className = 'search-result-item';
            el.innerHTML = `
                <div class="search-result-type">${res.type}</div>
                <div class="search-result-title">${res.title}</div>
            `;
            el.addEventListener('click', () => {
                App.navigate(res.link);
            });
            container.appendChild(el);
        });
    }
};
