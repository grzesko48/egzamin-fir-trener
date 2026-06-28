const Dashboard = {
    data: null,
    pomodoroInterval: null,
    timeLeft: 25 * 60,
    isRunning: false,

    init(data) {
        this.data = data;
        this.bindEvents();
        this.calculateExamCountdown();
        this.render();
    },

    bindEvents() {
        const startBtn = document.getElementById('pomodoro-start');
        const resetBtn = document.getElementById('pomodoro-reset');
        
        if(startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.isRunning) this.pauseTimer();
                else this.startTimer();
            });
        }
        
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetTimer();
            });
        }
    },

    calculateExamCountdown() {
        const examDateStr = this.data.meta.exam_date || "2026-07-01"; 
        let parts = examDateStr.split('.'); 
        if (parts.length === 3) {
            const dateObj = new Date(parts[2], parts[1]-1, parts[0]);
            const diff = Math.ceil((dateObj - new Date()) / (1000*60*60*24));
            const el = document.getElementById('days-to-exam');
            if (el) el.textContent = diff > 0 ? `${diff} dni` : 'Dziś!';
        }
    },

    render() {
        const streakEl = document.getElementById('streak-counter');
        if(streakEl) streakEl.textContent = Store.getStreak();
        
        this.renderGamify();
        this.renderMastery();
        this.renderHeatmap();
        this.renderWeakPoints();
        this.setupBossButton();
    },

    renderGamify() {
        const state = Store.getGamifyState();
        let levelEl = document.getElementById('dashboard-gamify-info');
        
        if (!levelEl) {
            const bento = document.querySelector('.bento-grid');
            if (bento) {
                levelEl = document.createElement('div');
                levelEl.id = 'dashboard-gamify-info';
                levelEl.className = 'glass-card span-full';
                bento.insertBefore(levelEl, bento.firstChild);
            }
        }
        
        if (levelEl) {
            const currentLevel = state.level || 1;
            const xp = state.xp || 0;
            const xpNeeded = Math.floor(100 * Math.pow(currentLevel, 1.5));
            const progress = Math.min(100, Math.round((xp / xpNeeded) * 100));
            
            levelEl.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="margin:0; font-size: 2.5rem;" class="gradient-text">Poziom ${currentLevel}</h2>
                        <p class="text-muted" style="margin:0;">Doświadczenie Edukacyjne</p>
                    </div>
                    <div style="flex-grow: 1; min-width: 200px; max-width: 500px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 5px; font-weight: bold;">
                            <span style="color: var(--primary);">${xp} XP</span>
                            <span class="text-muted">${xpNeeded} XP</span>
                        </div>
                        <div style="width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                            <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px var(--primary);"></div>
                        </div>
                    </div>
                    <button id="btn-boss" class="btn danger ripple" style="padding: 1rem 2rem; font-size: 1.1rem; font-weight: bold; border-radius: 30px;">🔥 Walcz z Bossem</button>
                </div>
            `;
        }
    },

    setupBossButton() {
        const btn = document.getElementById('btn-boss');
        if (btn) {
            btn.onclick = () => {
                if(typeof Boss !== 'undefined') {
                    Boss.start();
                } else {
                    alert('Tryb Bossa nie jest jeszcze wczytany.');
                }
            };
        }
    },

    renderMastery() {
        const container = document.getElementById('today-plan');
        if (!container) return;
        container.innerHTML = '';
        
        const header = document.createElement('h3');
        header.style.marginBottom = '1.5rem';
        header.textContent = 'Twoje Postępy (Mastery)';
        container.appendChild(header);

        this.data.chapters.forEach(ch => {
            // Oblicz średnią jakość z Store.lessons dla tego działu
            const allStates = (Store._data && Store._data.lessons) || (Store.state && Store.state.lessons) || {};
            let totalQ = 0; let count = 0;
            if(window.LESSONS && window.LESSONS.lessons) {
                const myLessons = window.LESSONS.lessons.filter(l => l.chapter === ch.id);
                myLessons.forEach(l => {
                    if (allStates[l.id] && allStates[l.id].quality !== undefined) {
                        totalQ += allStates[l.id].quality;
                        count++;
                    }
                });
            }
            
            let avg = count > 0 ? (totalQ / count) : 0;
            let percent = Math.min(100, Math.round((avg / 5) * 100)); // 5 is max quality

            const itemEl = document.createElement('div');
            itemEl.style.padding = '1rem';
            itemEl.style.background = 'rgba(255,255,255,0.03)';
            itemEl.style.borderRadius = 'var(--radius-md)';
            itemEl.style.marginBottom = '0.5rem';
            itemEl.style.display = 'flex';
            itemEl.style.flexDirection = 'column';
            itemEl.style.gap = '0.5rem';
            
            itemEl.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-size:1.1rem;">
                    <span>${ch.title}</span>
                    <span style="color: ${percent >= 80 ? 'var(--success)' : (percent >= 50 ? 'var(--warning)' : 'var(--danger)')}">${percent}%</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: ${percent >= 80 ? 'var(--success)' : (percent >= 50 ? 'var(--warning)' : 'var(--danger)')};"></div>
                </div>
            `;
            container.appendChild(itemEl);
        });
    },

    renderWeakPoints() {
        const ringCard = document.querySelector('.progress-ring-container')?.parentElement;
        if (!ringCard) return;

        // Replace progress ring with "Słabe punkty"
        ringCard.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--danger);">⚠️ Wymaga Powtórki</h3>
            <div id="weak-points-list" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;"></div>
        `;

        const list = document.getElementById('weak-points-list');
        const allStates = (Store._data && Store._data.lessons) || (Store.state && Store.state.lessons) || {};
        const weak = [];
        
        if (window.LESSONS && window.LESSONS.lessons) {
            window.LESSONS.lessons.forEach(l => {
                const st = allStates[l.id];
                if (st && st.quality < 4) { // Anything below 4 is weak
                    weak.push({ id: l.id, title: l.title, quality: st.quality });
                }
            });
        }

        if (weak.length === 0) {
            list.innerHTML = `<div class="text-muted" style="text-align:center; padding: 2rem 0;">Brak słabych punktów. Oby tak dalej!</div>`;
        } else {
            weak.slice(0, 3).forEach(w => { // Show top 3
                const el = document.createElement('div');
                el.className = 'glass-card ripple';
                el.style.padding = '0.8rem';
                el.style.borderLeft = '3px solid var(--danger)';
                el.style.cursor = 'pointer';
                el.innerHTML = `<div style="font-size: 0.9rem; font-weight: bold;">${w.title}</div><div style="font-size: 0.8rem; opacity: 0.7;">Poziom opanowania: niska pewność</div>`;
                el.onclick = () => {
                    // Navigate to learn view
                    document.querySelectorAll('.nav-btn').forEach(b => {
                        if (b.dataset.view === 'learn') b.click();
                    });
                };
                list.appendChild(el);
            });
        }
    },

    renderHeatmap() {
        const container = document.getElementById('heatmap');
        if (!container) return;
        container.innerHTML = '';
        
        const history = Store.getHistory();
        const today = new Date();
        
        for(let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            const cell = document.createElement('div');
            cell.className = 'heat-cell';
            cell.title = dateStr;
            
            const entry = history.find(h => h.date === dateStr);
            if (entry) {
                if (entry.itemsDone > 5) cell.classList.add('active-3');
                else if (entry.itemsDone > 2) cell.classList.add('active-2');
                else cell.classList.add('active-1');
                cell.title += ` (${entry.itemsDone} aktywności)`;
            }
            container.appendChild(cell);
        }
    },

    // --- Pomodoro ---
    updateTimerDisplay() {
        const el = document.getElementById('pomodoro-time');
        if (!el) return;
        const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const s = (this.timeLeft % 60).toString().padStart(2, '0');
        el.textContent = `${m}:${s}`;
    },

    startTimer() {
        this.isRunning = true;
        const btn = document.getElementById('pomodoro-start');
        if(btn) {
            btn.textContent = 'Pauza';
            btn.classList.replace('primary', 'warning');
        }
        
        this.pomodoroInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
            } else {
                this.pauseTimer();
                Store.incrementStreak();
                this.render();
                
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 1);
                } catch(e) {}
                
                alert("Czas minął! Zrób 5 minut przerwy.");
                this.resetTimer();
            }
        }, 1000);
    },

    pauseTimer() {
        this.isRunning = false;
        const btn = document.getElementById('pomodoro-start');
        if(btn) {
            btn.textContent = 'Wznów';
            btn.classList.replace('warning', 'primary');
        }
        clearInterval(this.pomodoroInterval);
    },

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = 25 * 60;
        this.updateTimerDisplay();
        const btn = document.getElementById('pomodoro-start');
        if(btn) {
            btn.textContent = 'Start';
            btn.classList.replace('warning', 'primary');
        }
    }
};
