/**
 * Problem Solver Engine (Tasks Mode)
 * Fetches dynamic problems from window.PROBLEMS generators.
 */

window.Tasks = {
    generators: [],
    currentProblem: null,
    
    init(problemsData) {
        if (!problemsData) return;
        this.generators = problemsData;
        this.populateFilters();
        this.nextTask();
    },

    populateFilters() {
        const filterEl = document.getElementById('tasks-chapter-filter');
        if (!filterEl) return;
        filterEl.innerHTML = '<option value="all">Wszystkie działy</option>';
        
        const chapters = new Set();
        this.generators.forEach(p => chapters.add(p.chapter));
        chapters.forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch;
            const chapterDef = typeof App !== 'undefined' && App.data && App.data.chapters 
                ? App.data.chapters.find(c => c.id === ch) 
                : null;
            opt.textContent = chapterDef ? chapterDef.title : `Dział: ${ch}`;
            filterEl.appendChild(opt);
        });
        
        filterEl.addEventListener('change', () => this.nextTask());
        if (typeof UISelect !== 'undefined') UISelect.init();
    },

    nextTask() {
        const chapterFilter = document.getElementById('tasks-chapter-filter')?.value || 'all';
        let pool = this.generators;
        if (chapterFilter !== 'all') {
            pool = pool.filter(p => p.chapter === chapterFilter);
        }
        
        if (pool.length === 0) {
            const container = document.getElementById('tasks-container');
            const controls = document.getElementById('tasks-controls');
            if(container) container.innerHTML = `
                <div class="glass-card flex-center" style="min-height: 350px;">
                    <h2>Brak zadań w tym dziale</h2>
                </div>`;
            if(controls) controls.style.display = 'none';
            return;
        }

        // Pick random generator
        const generatorDef = pool[Math.floor(Math.random() * pool.length)];
        this.currentProblem = generatorDef.gen();
        
        this.renderTask();
    },

    renderTask() {
        const container = document.getElementById('tasks-container');
        const controls = document.getElementById('tasks-controls');
        if (!container || !controls) return;

        container.innerHTML = `
            <div class="glass-card fade-in" style="width: 100%; max-width: 700px;">
                <h2 style="margin-bottom: 1.5rem;">Zadanie</h2>
                <div class="text-lg">${this.currentProblem.question}</div>
                <div id="task-feedback" style="margin-top: 1.5rem;"></div>
            </div>
        `;

        controls.style.display = 'flex';
        const input = document.getElementById('task-answer-input');
        const btn = document.getElementById('task-submit-btn');
        
        input.value = '';
        input.placeholder = `Twój wynik (${this.currentProblem.unit || ''})...`;
        input.disabled = false;
        input.style.borderColor = 'rgba(255,255,255,0.1)';
        
        // Remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.textContent = 'Sprawdź';
        newBtn.className = 'btn primary ripple';
        
        newBtn.addEventListener('click', () => {
            if (newBtn.textContent === 'Następne') {
                this.nextTask();
                return;
            }
            
            const val = parseFloat(input.value.replace(',','.'));
            if (isNaN(val)) return;
            
            const diff = Math.abs(val - this.currentProblem.answer);
            const tol = this.currentProblem.tol || 0.001; // default low tolerance
            
            input.disabled = true;
            const feedback = document.getElementById('task-feedback');
            
            if (diff <= tol) {
                input.style.borderColor = 'var(--success)';
                feedback.innerHTML = `
                    <div class="success-text" style="font-weight:bold; margin-bottom:1rem;">✅ Znakomicie!</div>
                    <div class="glass-card" style="background: rgba(0,255,100,0.05)">
                        <h3>Krok po kroku:</h3>
                        ${this.currentProblem.solution}
                    </div>
                `;
                Gamify.awardXP(30, 'Zadanie obliczeniowe');
            } else {
                input.style.borderColor = 'var(--danger)';
                feedback.innerHTML = `
                    <div class="danger-text" style="font-weight:bold; margin-bottom:1rem;">❌ Błąd. Prawidłowy wynik: ${this.currentProblem.answer}</div>
                    <div class="glass-card" style="background: rgba(255,50,50,0.05)">
                        <h3>Zobacz rozwiązanie:</h3>
                        ${this.currentProblem.solution}
                    </div>
                `;
            }
            
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(feedback, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            }
            
            newBtn.textContent = 'Następne';
        });

        // Math
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(container, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    }
};
