const Quiz = {
    data: null,
    isExamMode: false,
    examQuestions: [],
    currentExamIndex: 0,
    examAnswers: [],
    timerInterval: null,
    timeRemaining: 0,
    
    init(data) {
        this.data = data;
        this.populateFilters();
        this.bindEvents();
    },

    populateFilters() {
        const filterEl = document.getElementById('quiz-chapter-filter');
        if (this.data.chapters) {
            this.data.chapters.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch.id;
                opt.textContent = ch.title;
                filterEl.appendChild(opt);
            });
        }
    },

    bindEvents() {
        document.getElementById('quiz-start').addEventListener('click', () => {
            this.isExamMode = false;
            this.generateTrainingQuiz();
        });
        
        document.getElementById('quiz-exam-mode').addEventListener('click', () => {
            this.isExamMode = true;
            this.startExamMode();
        });
    },

    // --- Training Mode ---
    generateTrainingQuiz() {
        document.getElementById('exam-timer').style.display = 'none';
        
        const chapterFilter = document.getElementById('quiz-chapter-filter').value;
        let pool = this.data.quiz || [];
        
        if (chapterFilter !== 'all') {
            pool = pool.filter(q => q.chapter === chapterFilter);
        }

        if (pool.length === 0) {
            document.getElementById('quiz-container').innerHTML = '<div class="glass-card placeholder-text">Brak pytań w tej sekcji.</div>';
            return;
        }

        const shuffled = pool.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        this.renderTraining(selected);
    },

    renderTraining(questions) {
        const container = document.getElementById('quiz-container');
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const el = document.createElement('div');
            el.className = 'glass-card';
            el.style.marginBottom = '2rem';
            el.innerHTML = `
                <div class="quiz-question">${index + 1}. ${q.q}</div>
                <button class="btn secondary btn-sm" onclick="this.nextElementSibling.style.display='block'; this.style.display='none'">Odkryj odpowiedź</button>
                <div style="display:none; margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--border-glass);">
                    <p><strong>Odpowiedź:</strong> ${q.a}</p>
                </div>
            `;
            container.appendChild(el);
        });

        if (window.renderMathInElement) window.renderMathInElement(container, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});
    },

    // --- Exam Mode ---
    startExamMode() {
        const pool = this.data.quiz || [];
        if (pool.length === 0) return;

        // 20 random questions, 30 minutes
        this.examQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, 20);
        this.examAnswers = new Array(this.examQuestions.length).fill(null);
        this.currentExamIndex = 0;
        this.timeRemaining = 30 * 60; 
        
        document.getElementById('exam-timer').style.display = 'block';
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            if (this.timeRemaining <= 0) {
                this.endExam();
            }
        }, 1000);

        this.renderExamQuestion();
    },

    updateTimerDisplay() {
        const m = Math.floor(this.timeRemaining / 60).toString().padStart(2, '0');
        const s = (this.timeRemaining % 60).toString().padStart(2, '0');
        document.getElementById('exam-time').textContent = `${m}:${s}`;
    },

    renderExamQuestion() {
        const container = document.getElementById('quiz-container');
        const q = this.examQuestions[this.currentExamIndex];
        
        container.innerHTML = `
            <div class="glass-card" style="text-align:center;">
                <div class="small-text" style="margin-bottom:1rem;">Pytanie ${this.currentExamIndex + 1} z ${this.examQuestions.length}</div>
                <div class="quiz-question" style="font-size: 2rem;">${q.q}</div>
                
                <textarea id="exam-answer-input" class="glass-input" rows="4" placeholder="Wpisz odpowiedź na brudno (tylko dla Ciebie)..."></textarea>
                
                <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
                    ${this.currentExamIndex > 0 ? `<button class="btn secondary" onclick="Quiz.prevQuestion()">Poprzednie</button>` : '<div></div>'}
                    ${this.currentExamIndex < this.examQuestions.length - 1 ? 
                        `<button class="btn primary" onclick="Quiz.nextQuestion()">Następne</button>` : 
                        `<button class="btn danger" onclick="Quiz.endExam()">Zakończ Egzamin</button>`}
                </div>
            </div>
        `;
        if (window.renderMathInElement) window.renderMathInElement(container, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});
    },

    nextQuestion() {
        this.currentExamIndex++;
        this.renderExamQuestion();
    },
    
    prevQuestion() {
        this.currentExamIndex--;
        this.renderExamQuestion();
    },

    endExam() {
        clearInterval(this.timerInterval);
        document.getElementById('exam-timer').style.display = 'none';
        
        const container = document.getElementById('quiz-container');
        let html = `
            <div class="glass-card" style="text-align:center;">
                <h2 class="gradient-text" style="font-size:3rem; margin-bottom:1rem;">Koniec Czasu / Egzamin Zakończony</h2>
                <p>Oto prawidłowe odpowiedzi. Przeprowadź samoocenę.</p>
            </div>
        `;
        
        this.examQuestions.forEach((q, index) => {
            html += `
                <div class="glass-card" style="margin-top:2rem;">
                    <div class="quiz-question">${index + 1}. ${q.q}</div>
                    <div style="padding-top:1.5rem; border-top:1px solid var(--border-glass);">
                        <p><strong>Wzorcowa Odpowiedź:</strong> ${q.a}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        if (window.renderMathInElement) window.renderMathInElement(container, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});
        if (typeof Anim!=='undefined') Anim.fireConfetti();
    }
};
