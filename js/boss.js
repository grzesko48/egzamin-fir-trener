/**
 * Boss Mode (Mini-Egzamin)
 * Wybiera losowe zadania ze słabych działów na czas.
 */

window.Boss = {
    pool: [],
    currentIndex: 0,
    score: 0,
    timeLeft: 300, // 5 minut
    timerInterval: null,

    start() {
        // Przełącz widok
        document.querySelectorAll('.nav-btn').forEach(b => {
            if (b.dataset.view) b.classList.remove('active');
        });
        document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
        document.getElementById('view-boss').classList.add('active');

        this.buildPool();
        this.currentIndex = 0;
        this.score = 0;
        this.timeLeft = 300;

        if (this.pool.length === 0) {
            document.getElementById('boss-container').innerHTML = `<h2>Brak danych do egzaminu.</h2>`;
            return;
        }

        this.renderCurrent();
        this.startTimer();
    },

    buildPool() {
        this.pool = [];
        
        // Wybierz słabe działy
        const allStates = (Store._data && Store._data.lessons) || (Store.state && Store.state.lessons) || {};
        const weakChapters = new Set();
        
        if (window.LESSONS && window.LESSONS.lessons) {
            window.LESSONS.lessons.forEach(l => {
                const st = allStates[l.id];
                if (st && st.quality < 4) {
                    weakChapters.add(l.chapter);
                }
            });
        }
        
        // Zbieraj 'check' z lekcji
        if (window.LESSONS && window.LESSONS.lessons) {
            window.LESSONS.lessons.forEach(l => {
                // Jeśli nie mamy żadnych weak, bierzemy ze wszystkich. W przeciwnym razie faworyzujemy weak.
                const shouldAdd = weakChapters.size === 0 || weakChapters.has(l.chapter) || Math.random() < 0.3;
                if (shouldAdd) {
                    const checks = l.steps.filter(s => s.type === 'check');
                    if (checks.length > 0) {
                        // weź losowy check z tej lekcji
                        const randomCheck = checks[Math.floor(Math.random() * checks.length)];
                        this.pool.push({ type: 'check', data: randomCheck });
                    }
                }
            });
        }

        // Zbieraj zadania z problems
        if (window.PROBLEMS && window.PROBLEMS.length > 0) {
            window.PROBLEMS.forEach(p => {
                const shouldAdd = weakChapters.size === 0 || weakChapters.has(p.chapter) || Math.random() < 0.3;
                if (shouldAdd) {
                    this.pool.push({ type: 'problem', gen: p.gen });
                }
            });
        }

        // Tasuj
        this.pool.sort(() => Math.random() - 0.5);
        
        // Ogranicz do 10 pytań max
        if (this.pool.length > 10) this.pool = this.pool.slice(0, 10);
    },

    startTimer() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            const header = document.querySelector('#view-boss .view-title');
            const m = Math.floor(this.timeLeft / 60);
            const s = (this.timeLeft % 60).toString().padStart(2, '0');
            header.innerHTML = `OSTATECZNE STARCIE ⏱ ${m}:${s}`;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.endBoss();
            }
        }, 1000);
    },

    renderCurrent() {
        const container = document.getElementById('boss-container');
        const controls = document.getElementById('boss-controls');
        
        if (this.currentIndex >= this.pool.length) {
            this.endBoss();
            return;
        }

        const item = this.pool[this.currentIndex];
        
        const html = `
            <div class="glass-card fade-in" style="width: 100%; max-width: 680px; position: relative;">
                <div style="position:absolute; top:1rem; right:1rem; font-size:0.9rem; color:var(--text-muted);">
                    Pytanie ${this.currentIndex + 1} / ${this.pool.length}
                </div>
                <div id="boss-content" style="margin-top: 1rem;"></div>
            </div>
        `;
        container.innerHTML = html;
        const contentEl = document.getElementById('boss-content');
        controls.innerHTML = '';

        if (item.type === 'check') {
            const step = item.data;
            if (step.kind === 'mcq') {
                contentEl.innerHTML = `<h3 style="margin-bottom: 1.5rem;">${step.q}</h3>`;
                const grid = document.createElement('div');
                grid.style.display = 'grid'; grid.style.gap = '10px';
                step.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'btn secondary ripple';
                    btn.style.textAlign = 'left';
                    btn.innerHTML = opt;
                    btn.onclick = () => {
                        Array.from(grid.children).forEach(b => b.disabled = true);
                        if (idx === step.correct) this.score++;
                        this.currentIndex++;
                        setTimeout(() => this.renderCurrent(), 300);
                    };
                    grid.appendChild(btn);
                });
                contentEl.appendChild(grid);
            } 
            else if (step.kind === 'tf') {
                contentEl.innerHTML = `<h3 style="margin-bottom:1.5rem;">${step.q}</h3>`;
                const grid = document.createElement('div');
                grid.style.display = 'grid'; grid.style.gridTemplateColumns = '1fr 1fr'; grid.style.gap = '10px';
                [['Prawda', true], ['Fałsz', false]].forEach(([label, val]) => {
                    const btn = document.createElement('button');
                    btn.className = 'btn secondary ripple';
                    btn.textContent = label;
                    btn.onclick = () => {
                        Array.from(grid.children).forEach(b => b.disabled = true);
                        if (val === step.bool) this.score++;
                        this.currentIndex++;
                        setTimeout(() => this.renderCurrent(), 300);
                    };
                    grid.appendChild(btn);
                });
                contentEl.appendChild(grid);
            }
            else {
                // Skrótowe pomijanie innych checków (cloze, num) by zachować tempo bossa - po prostu damy "Wiem / Nie wiem" dla uproszczenia
                contentEl.innerHTML = `<h3 style="margin-bottom:1.5rem;">${step.q}</h3><p class="text-muted">Jaka jest odpowiedź?</p>`;
                const grid = document.createElement('div');
                grid.style.display = 'grid'; grid.style.gridTemplateColumns = '1fr'; grid.style.gap = '10px';
                
                const btnOk = document.createElement('button');
                btnOk.className = 'btn success ripple';
                btnOk.textContent = 'Znam odpowiedź';
                btnOk.onclick = () => { this.score++; this.currentIndex++; this.renderCurrent(); };
                
                const btnBad = document.createElement('button');
                btnBad.className = 'btn danger ripple';
                btnBad.textContent = 'Nie pamiętam';
                btnBad.onclick = () => { this.currentIndex++; this.renderCurrent(); };
                
                grid.appendChild(btnOk);
                grid.appendChild(btnBad);
                contentEl.appendChild(grid);
            }
        } else if (item.type === 'problem') {
            const prob = item.gen();
            contentEl.innerHTML = `<h3 style="margin-bottom: 1.5rem;">Zadanie Obliczeniowe</h3><div>${prob.question}</div>`;
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'glass-input';
            input.placeholder = `Wynik`;
            input.style.width = '100%'; input.style.marginTop = '1rem';
            contentEl.appendChild(input);

            const btn = document.createElement('button');
            btn.className = 'btn primary ripple';
            btn.textContent = 'Zatwierdź';
            btn.onclick = () => {
                const val = parseFloat(input.value);
                if (!isNaN(val)) {
                    if (Math.abs(val - prob.answer) <= (prob.tol || 0)) this.score++;
                }
                this.currentIndex++;
                this.renderCurrent();
            };
            controls.appendChild(btn);
        }

        if (typeof renderMathInElement === 'function') {
            renderMathInElement(container, { delimiters: [{left: "$$", right: "$$", display: true}, {left: "$", right: "$", display: false}] });
        }
    },

    endBoss() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        document.querySelector('#view-boss .view-title').innerHTML = `OSTATECZNE STARCIE (ZAKOŃCZONE)`;
        
        const container = document.getElementById('boss-container');
        const controls = document.getElementById('boss-controls');
        const pct = Math.round((this.score / this.pool.length) * 100) || 0;
        
        let msg = "Musisz jeszcze poćwiczyć.";
        let xpReward = 10;
        if (pct >= 80) { msg = "Wspaniale! Boss pokonany!"; xpReward = 500; }
        else if (pct >= 50) { msg = "Dobra robota, Boss odparty!"; xpReward = 200; }
        
        container.innerHTML = `
            <div class="glass-card fade-in flex-center" style="width: 100%; max-width: 680px; text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${pct >= 80 ? '🏆' : (pct >= 50 ? '🥈' : '💀')}</div>
                <h2 style="font-size: 2.5rem; color: ${pct >= 50 ? 'var(--success)' : 'var(--danger)'};">${pct}% Poprawnych</h2>
                <p class="text-lg text-muted">${msg}</p>
            </div>
        `;
        
        if (pct >= 50) Gamify.awardXP(xpReward, 'Pokonanie Bossa!');
        if (pct >= 80 && window.Anim) {
            Anim.confetti(); setTimeout(() => Anim.confetti(), 1000);
        }
        
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'btn primary ripple';
        btn.textContent = 'Wróć na Pulpit';
        btn.onclick = () => {
            document.getElementById('view-boss').classList.remove('active');
            document.querySelectorAll('.nav-btn').forEach(b => {
                if (b.dataset.view === 'dashboard') b.click();
            });
        };
        controls.appendChild(btn);
    }
};
