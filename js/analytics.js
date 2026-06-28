const Analytics = {
    data: null,
    
    init(data) {
        this.data = data;
    },

    render() {
        const container = document.getElementById('analytics-bars');
        if (!container) return;
        container.innerHTML = '';

        if (!this.data || !this.data.chapters) return;

        // Calculate mastery per group
        const groups = {
            'baza': { label: 'Baza', total: 0, known: 0 },
            'fib': { label: 'Finanse i Bankowość', total: 0, known: 0 },
            'kier': { label: 'Kierunkowe', total: 0, known: 0 }
        };

        let fcTotal = 0;
        let fcKnown = 0; // efactor >= 2.0 or interval > 3

        if (this.data.flashcards) {
            this.data.flashcards.forEach(fc => {
                const chapter = this.data.chapters.find(c => c.id === fc.chapter);
                if (chapter && groups[chapter.group]) {
                    groups[chapter.group].total++;
                    fcTotal++;
                    
                    const state = Store.getFlashcardState(fc.id);
                    // "Known" threshold: interval > 3 days or efactor > 2.2
                    if (state.interval > 3 || state.efactor > 2.2) {
                        groups[chapter.group].known++;
                        fcKnown++;
                    }
                }
            });
        }

        // Render bars
        Object.values(groups).forEach(g => {
            const percent = g.total === 0 ? 0 : Math.round((g.known / g.total) * 100);
            
            const row = document.createElement('div');
            row.className = 'analytics-bar-container';
            row.innerHTML = `
                <div class="analytics-bar-label">${g.label}</div>
                <div class="analytics-bar-track">
                    <div class="analytics-bar-fill" style="width: 0%;"></div>
                </div>
                <div style="width: 50px; text-align:right; font-weight:700;">${percent}%</div>
            `;
            container.appendChild(row);

            // Animate width
            setTimeout(() => {
                row.querySelector('.analytics-bar-fill').style.width = `${percent}%`;
            }, 100);
        });

        // Global stat
        const globalPercent = fcTotal === 0 ? 0 : Math.round((fcKnown / fcTotal) * 100);
        const globalRow = document.createElement('div');
        globalRow.style.marginTop = '2rem';
        globalRow.innerHTML = `
            <h3>Ogólny współczynnik wiedzy: <span class="gradient-text" style="font-size:2rem;">${globalPercent}%</span></h3>
            <p class="small-text">Oparty na algorytmie E-Factor z powtórek SM-2.</p>
        `;
        container.appendChild(globalRow);
    }
};
