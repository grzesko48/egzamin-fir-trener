/**
 * Learn Mode Engine V4
 * 11/10 Premium UX: Teaching-first, Ribbons, Intro/Outro, Keyboard shortcuts.
 */

window.Learn = {
    data: [],
    currentLessonIndex: 0,
    currentStepIndex: 0,
    lessonState: 'intro', // 'intro', 'step', 'outro'
    queue: [],
    earnedQuality: [], // track quality per step
    keydownHandler: null,

    init(lessonsData) {
        if (!lessonsData || !lessonsData.lessons) return;
        this.data = lessonsData.lessons;
        this.populateFilters();
        this.loadQueue();
        this.setupKeyboard();
    },

    setupKeyboard() {
        if (this.keydownHandler) document.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = (e) => {
            if (document.getElementById('view-learn').classList.contains('active')) {
                // Focus in input prevents shortcuts
                if (e.target.tagName === 'INPUT' && e.key !== 'Enter') return;
                
                const controls = document.getElementById('learn-controls');
                if (!controls) return;
                
                if (e.key === 'Enter') {
                    // find primary button
                    const primary = controls.querySelector('button.primary') || controls.querySelector('button');
                    if (primary) {
                        e.preventDefault();
                        primary.click();
                    }
                } else if (['1', '2', '3', '4'].includes(e.key)) {
                    // click n-th secondary button for MCQ
                    const btns = document.querySelectorAll('#step-content .btn.secondary');
                    const idx = parseInt(e.key) - 1;
                    if (btns && btns[idx] && !btns[idx].disabled) {
                        e.preventDefault();
                        btns[idx].click();
                    }
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
        
        filterEl.addEventListener('change', () => this.loadQueue());
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

        // Sortuj wg terminu powtorki, a przy remisie (np. nowe lekcje) wg KOLEJNOSCI NAUKI (order).
        this.queue.sort((a, b) => {
            const nrDiff = (Number(Store.getLessonState(a.id).nextReview) || 0) - (Number(Store.getLessonState(b.id).nextReview) || 0);
            if (nrDiff !== 0) return nrDiff;
            return (a.order || 999) - (b.order || 999);
        });

        this.currentLessonIndex = 0;
        this.lessonState = 'intro';
        this.renderCurrent();
    },

    getRibbonHTML(type) {
        let text = '', bg = '', icon = '';
        if (type === 'teach') { text = 'LEKCJA'; bg = 'rgba(0, 240, 255, 0.15)'; icon = '📖'; }
        else if (type === 'example') { text = 'PRZYKŁAD'; bg = 'rgba(255, 170, 0, 0.15)'; icon = '🔍'; }
        else if (type === 'check') { text = 'SZYBKI SPRAWDZIAN'; bg = 'rgba(0, 255, 100, 0.15)'; icon = '✅'; }
        else if (type === 'recall') { text = 'WYTŁUMACZ WŁASNYMI SŁOWAMI'; bg = 'rgba(200, 50, 255, 0.15)'; icon = '💬'; }
        
        return `<div style="
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: ${bg}; padding: 0.4rem 1rem; border-radius: 20px;
            font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; color: var(--text);
            margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.05);
        ">${icon} ${text}</div>`;
    },

    renderCurrent() {
        const container = document.getElementById('learn-container');
        const controls = document.getElementById('learn-controls');
        if (!container) return;

        if (this.queue.length === 0) {
            container.innerHTML = `
                <div class="glass-card flex-center fade-in" style="min-height: 350px;">
                    <div class="huge-number success-text">100%</div>
                    <h2>Mistrzostwo osiągnięte!</h2>
                    <p class="text-muted">Brak lekcji na ten moment. Wróć później lub wybierz inny dział.</p>
                </div>`;
            controls.style.display = 'none';
            return;
        }

        const lesson = this.queue[this.currentLessonIndex];
        
        if (this.lessonState === 'intro') {
            const firstTeach = lesson.steps.find(s => s.type === 'teach')?.html || '<p>Gotów na nową wiedzę?</p>';
            // Zbuduj intro
            container.innerHTML = `
                <div class="glass-card fade-in" style="width: 100%; max-width: 680px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
                    <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary);">${lesson.title}</h2>
                    <div class="text-muted" style="margin-bottom: 2rem;">Dział: ${lesson.chapter}</div>
                    
                    <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                        <h4 style="color: var(--text); margin-bottom: 1rem; opacity: 0.8;">CZEGO SIĘ NAUCZYSZ:</h4>
                        <div class="text-lg" style="line-height: 1.7;">${firstTeach}</div>
                    </div>
                </div>`;
            
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.textContent = 'Zaczynamy (Enter)';
            btn.onclick = () => {
                this.lessonState = 'step';
                this.currentStepIndex = 0;
                this.earnedQuality = [];
                this.renderCurrent();
            };
            controls.appendChild(btn);

        } else if (this.lessonState === 'outro') {
            const avgQuality = this.earnedQuality.length ? (this.earnedQuality.reduce((a,b)=>a+b,0)/this.earnedQuality.length) : 5;
            const xpEarned = Math.round(avgQuality * 10);
            
            container.innerHTML = `
                <div class="glass-card fade-in flex-center" style="width: 100%; max-width: 680px; min-height: 400px; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--success);">Lekcja Ukończona!</h2>
                    <p class="text-lg text-muted" style="margin-bottom: 2rem;">Świetna robota! Wiedza z ${lesson.title} utrwalona.</p>
                    <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 2rem;">
                        <div style="background: rgba(0,255,100,0.1); padding: 1rem 2rem; border-radius: 12px; border: 1px solid rgba(0,255,100,0.3);">
                            <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">Zdobyte XP</div>
                            <div style="font-size: 2rem; font-weight: bold; color: var(--success);">+${xpEarned}</div>
                        </div>
                    </div>
                </div>`;
                
            Gamify.awardXP(xpEarned, 'Ukończenie Lekcji');
            if(window.Anim) Anim.confetti();
            
            controls.innerHTML = '';
            controls.style.display = 'flex';
            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.textContent = 'Następna Lekcja (Enter)';
            btn.onclick = () => {
                Store.updateLesson(lesson.id, Math.round(avgQuality));
                this.currentLessonIndex++;
                if (this.currentLessonIndex >= this.queue.length) {
                    this.loadQueue();
                } else {
                    this.lessonState = 'intro';
                    this.renderCurrent();
                }
            };
            controls.appendChild(btn);

        } else if (this.lessonState === 'step') {
            const step = lesson.steps[this.currentStepIndex];
            const pct = Math.round(((this.currentStepIndex) / lesson.steps.length) * 100);

            container.innerHTML = `
                <div class="glass-card fade-in" style="width: 100%; max-width: 680px;">
                    <!-- Postęp -->
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                        <span>Postęp lekcji</span>
                        <span>${this.currentStepIndex + 1} / ${lesson.steps.length}</span>
                    </div>
                    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 1.5rem; overflow: hidden;">
                        <div style="width: ${pct}%; height: 100%; background: var(--primary); transition: width 0.3s ease;"></div>
                    </div>
                    
                    ${this.getRibbonHTML(step.type)}
                    <div id="step-content"></div>
                </div>`;

            const contentEl = document.getElementById('step-content');
            controls.innerHTML = '';
            controls.style.display = 'flex';

            if (step.type === 'teach' || step.type === 'example') {
                contentEl.innerHTML = `<div class="text-lg" style="line-height: 1.7;">${step.html}</div>`;
                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.textContent = 'Dalej (Enter)';
                btn.onclick = () => this.nextStep(5);
                controls.appendChild(btn);
            } 
            else if (step.type === 'check') {
                if (step.kind === 'mcq') {
                    contentEl.innerHTML = `<h3 style="margin-bottom: 1.5rem; font-size: 1.4rem;">${step.q}</h3>`;
                    const grid = document.createElement('div');
                    grid.style.display = 'grid';
                    grid.style.gap = '10px';
                    
                    step.options.forEach((opt, idx) => {
                        const btn = document.createElement('button');
                        btn.className = 'btn secondary ripple';
                        btn.style.textAlign = 'left';
                        btn.style.padding = '1rem 1.5rem';
                        btn.innerHTML = `<span style="opacity:0.5; margin-right: 1rem;">${idx+1}</span> ${opt}`;
                        btn.onclick = () => {
                            Array.from(grid.children).forEach(b => b.disabled = true);
                            if (idx === step.correct) {
                                btn.style.background = 'rgba(0,255,100,0.15)';
                                btn.style.borderColor = 'var(--success)';
                                Gamify.awardXP(10, 'Szybki strzał');
                                setTimeout(() => this.nextStep(5), 1000);
                            } else {
                                btn.style.background = 'rgba(255,50,50,0.15)';
                                btn.style.borderColor = 'var(--danger)';
                                grid.children[step.correct].style.border = '2px solid var(--success)';
                                
                                const explain = document.createElement('div');
                                explain.className = 'fade-in';
                                explain.style.marginTop = '1.5rem';
                                explain.style.padding = '1rem';
                                explain.style.background = 'rgba(255,255,255,0.05)';
                                explain.style.borderRadius = 'var(--radius-md)';
                                explain.style.borderLeft = '4px solid var(--danger)';
                                explain.innerHTML = `<strong>Wyjaśnienie:</strong><br><span class="text-muted">${step.explain || 'Błędna odpowiedź.'}</span>`;
                                contentEl.appendChild(explain);
                                
                                const nextBtn = document.createElement('button');
                                nextBtn.className = 'btn primary';
                                nextBtn.textContent = 'Zrozumiałem (Enter)';
                                nextBtn.onclick = () => this.nextStep(2);
                                controls.innerHTML = '';
                                controls.appendChild(nextBtn);
                                if (typeof renderMathInElement === 'function') renderMathInElement(explain, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                            }
                        };
                        grid.appendChild(btn);
                    });
                    contentEl.appendChild(grid);
                } else if (step.kind === 'num') {
                    contentEl.innerHTML = `<h3 style="margin-bottom: 1.5rem; font-size: 1.4rem;">${step.q}</h3>`;
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'glass-input';
                    input.placeholder = `Wynik w ${step.unit || 'jednostkach'}`;
                    input.style.width = '100%';
                    input.style.padding = '1rem';
                    input.style.fontSize = '1.2rem';
                    contentEl.appendChild(input);

                    const btn = document.createElement('button');
                    btn.className = 'btn primary ripple';
                    btn.textContent = 'Sprawdź (Enter)';
                    
                    const check = () => {
                        const val = parseFloat(input.value);
                        if (isNaN(val)) return;
                        input.disabled = true;
                        const diff = Math.abs(val - step.answer);
                        if (diff <= (step.tol || 0)) {
                            input.style.borderColor = 'var(--success)';
                            input.style.color = 'var(--success)';
                            Gamify.awardXP(15, 'Liczenie bezbłędne');
                            setTimeout(() => this.nextStep(5), 1000);
                        } else {
                            input.style.borderColor = 'var(--danger)';
                            input.style.color = 'var(--danger)';
                            const explain = document.createElement('div');
                            explain.className = 'fade-in';
                            explain.style.marginTop = '1.5rem';
                            explain.style.padding = '1rem';
                            explain.style.background = 'rgba(255,255,255,0.05)';
                            explain.style.borderRadius = 'var(--radius-md)';
                            explain.style.borderLeft = '4px solid var(--danger)';
                            explain.innerHTML = `<strong>Poprawna odpowiedź: ${step.answer}</strong><br><span class="text-muted">${step.explain || ''}</span>`;
                            contentEl.appendChild(explain);
                            btn.textContent = 'Dalej (Enter)';
                            btn.onclick = () => this.nextStep(2);
                            if (typeof renderMathInElement === 'function') renderMathInElement(explain, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                        }
                    };
                    btn.onclick = check;
                    input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
                    controls.appendChild(btn);
                }
                else if (step.kind === 'tf') {
                    contentEl.innerHTML = `<h3 style="margin-bottom:1.5rem; font-size: 1.4rem;">${step.q}</h3>`;
                    const grid = document.createElement('div');
                    grid.style.display = 'grid';
                    grid.style.gridTemplateColumns = '1fr 1fr';
                    grid.style.gap = '10px';
                    [['Prawda', true], ['Fałsz', false]].forEach(([label, val], idx) => {
                        const btn = document.createElement('button');
                        btn.className = 'btn secondary ripple';
                        btn.style.padding = '1.5rem';
                        btn.innerHTML = `<span style="opacity:0.5; margin-right: 0.5rem;">${idx+1}</span> ${label}`;
                        btn.onclick = () => {
                            Array.from(grid.children).forEach(b => b.disabled = true);
                            const ok = (val === step.bool);
                            btn.style.background = ok ? 'rgba(0,255,100,0.15)' : 'rgba(255,50,50,0.15)';
                            btn.style.borderColor = ok ? 'var(--success)' : 'var(--danger)';
                            
                            const explain = document.createElement('div');
                            explain.className = 'fade-in';
                            explain.style.marginTop = '1.5rem';
                            explain.style.padding = '1rem';
                            explain.style.background = 'rgba(255,255,255,0.05)';
                            explain.style.borderRadius = 'var(--radius-md)';
                            explain.style.borderLeft = `4px solid ${ok ? 'var(--success)' : 'var(--danger)'}`;
                            explain.innerHTML = `<strong>${ok ? 'Zgadza się!' : 'Niestety nie.'}</strong><br><span class="text-muted">${step.explain || ''}</span>`;
                            contentEl.appendChild(explain);
                            
                            if (ok) Gamify.awardXP(10, 'Dobra dedukcja');
                            controls.innerHTML = '';
                            const nb = document.createElement('button');
                            nb.className = 'btn primary';
                            nb.textContent = 'Dalej (Enter)';
                            nb.onclick = () => this.nextStep(ok ? 5 : 2);
                            controls.appendChild(nb);
                            if (typeof renderMathInElement === 'function') renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                        };
                        grid.appendChild(btn);
                    });
                    contentEl.appendChild(grid);
                }
                else if (step.kind === 'cloze') {
                    contentEl.innerHTML = `<h3 style="margin-bottom:1.5rem; font-size: 1.4rem;">${step.q}</h3><p class="text-muted" style="margin-top:0.5rem">Uzupełnij brakujące słowo / wyrażenie.</p>`;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'glass-input';
                    input.placeholder = 'Wpisz odpowiedź';
                    input.style.marginTop = '1rem';
                    input.style.width = '100%';
                    input.style.padding = '1rem';
                    contentEl.appendChild(input);
                    const norm = s => (s || '').toString().trim().toLowerCase()
                        .replace(/[ąàáä]/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
                        .replace(/ń/g, 'n').replace(/[óòöô]/g, 'o').replace(/ś/g, 's').replace(/[żź]/g, 'z')
                        .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
                    const check = () => {
                        const accept = [step.cloze_answer, ...(step.accept || [])].map(norm);
                        const ok = accept.includes(norm(input.value));
                        input.style.borderColor = ok ? 'var(--success)' : 'var(--danger)';
                        input.style.color = ok ? 'var(--success)' : 'var(--danger)';
                        input.disabled = true;
                        if (ok) {
                            Gamify.awardXP(15, 'Słowo w słowo');
                            setTimeout(() => this.nextStep(5), 1000);
                        } else {
                            const explain = document.createElement('div');
                            explain.className = 'fade-in';
                            explain.style.marginTop = '1.5rem';
                            explain.style.padding = '1rem';
                            explain.style.background = 'rgba(255,255,255,0.05)';
                            explain.style.borderRadius = 'var(--radius-md)';
                            explain.style.borderLeft = '4px solid var(--danger)';
                            explain.innerHTML = `<strong>Poprawnie: ${step.cloze_answer}</strong><br><span class="text-muted">${step.explain || ''}</span>`;
                            contentEl.appendChild(explain);
                            btn.textContent = 'Dalej (Enter)';
                            btn.onclick = () => this.nextStep(2);
                            if (typeof renderMathInElement === 'function') renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                        }
                    };
                    const btn = document.createElement('button');
                    btn.className = 'btn primary ripple';
                    btn.textContent = 'Sprawdź (Enter)';
                    btn.onclick = check;
                    input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
                    controls.appendChild(btn);
                    setTimeout(() => input.focus(), 100);
                }
            }
            else if (step.type === 'recall') {
                contentEl.innerHTML = `<h3 style="font-size: 1.5rem; margin-bottom: 1rem;">${step.prompt}</h3>
                    <p class="text-muted" style="margin-bottom:2rem; font-size: 1.1rem; border-left: 3px solid var(--primary); padding-left: 1rem;">
                        <i>Zastanów się przez chwilę, ułóż odpowiedź w głowie, a następnie sprawdź wzorzec.</i>
                    </p>`;
                const btn = document.createElement('button');
                btn.className = 'btn primary ripple';
                btn.textContent = 'Pokaż wzorzec (Enter)';
                btn.onclick = () => {
                    contentEl.innerHTML += `
                        <div class="fade-in" style="margin-top:2rem; padding:1.5rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: 0.8rem; color: var(--primary); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 1px;">WZORZEC ODPOWIEDZI:</div>
                            <div class="text-lg" style="line-height: 1.6;">${step.model}</div>
                        </div>`;
                    controls.innerHTML = '';
                    
                    const gbtn = document.createElement('button');
                    gbtn.className = 'btn success ripple';
                    gbtn.innerHTML = '<strong>1.</strong> Wiedziałem';
                    gbtn.onclick = () => { Gamify.awardXP(20, 'Szczerość i Pamięć'); this.nextStep(5); };
                    
                    const mbtn = document.createElement('button');
                    mbtn.className = 'btn secondary ripple';
                    mbtn.innerHTML = '<strong>2.</strong> Coś świtało';
                    mbtn.onclick = () => this.nextStep(3);
                    
                    const bbtn = document.createElement('button');
                    bbtn.className = 'btn danger ripple';
                    bbtn.innerHTML = '<strong>3.</strong> Pustka';
                    bbtn.onclick = () => this.nextStep(1);
                    
                    controls.appendChild(gbtn);
                    controls.appendChild(mbtn);
                    controls.appendChild(bbtn);
                    if (typeof renderMathInElement === 'function') renderMathInElement(contentEl, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}] });
                };
                controls.appendChild(btn);
            }

            // Render math for the entire step
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(container, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            }
        }
    },

    nextStep(quality) {
        this.earnedQuality.push(quality);
        const lesson = this.queue[this.currentLessonIndex];
        
        if (this.currentStepIndex >= lesson.steps.length - 1) {
            this.lessonState = 'outro';
            this.renderCurrent();
        } else {
            this.currentStepIndex++;
            this.renderCurrent();
        }
    }
};
