/**
 * Match Mode — "Połącz w pary"
 * Szybka, grywalna metoda nauki: dopasuj termin do definicji na czas.
 * Zrodlo par: fiszki (krotki front <-> krotki back). Autor: Claude.
 */
window.Match = {
    data: null,
    pool: [],
    selected: null,
    matched: 0,
    total: 0,
    timer: null,
    seconds: 0,

    init(data) {
        this.data = data;
        this.buildPool();
        this.populateFilter();
    },

    buildPool() {
        const fcs = (this.data.flashcards || []).filter(f =>
            f.front && f.back && f.front.length <= 70 && f.back.length <= 95);
        this.pool = fcs.map(f => ({ chapter: f.chapter, a: f.front, b: f.back }));
    },

    populateFilter() {
        const el = document.getElementById('match-chapter-filter');
        if (!el) return;
        el.innerHTML = '<option value="all">Wszystkie działy</option>';
        (this.data.chapters || []).forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch.id;
            opt.textContent = ch.title;
            el.appendChild(opt);
        });
        el.addEventListener('change', () => this.newRound());
        if (typeof UISelect !== 'undefined') UISelect.init();
    },

    render() { this.newRound(); },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    newRound() {
        const container = document.getElementById('match-container');
        const status = document.getElementById('match-status');
        if (!container) return;

        const chap = document.getElementById('match-chapter-filter')?.value || 'all';
        let pool = this.pool;
        if (chap !== 'all') pool = pool.filter(p => p.chapter === chap);

        const N = Math.min(5, pool.length);
        if (N < 2) {
            container.innerHTML = `<div class="glass-card flex-center" style="min-height:300px"><p class="text-muted">Za mało par w tym dziale. Wybierz inny.</p></div>`;
            if (status) status.textContent = '';
            return;
        }

        const chosen = this.shuffle(pool.slice()).slice(0, N).map((p, i) => ({ ...p, pid: i }));
        this.matched = 0;
        this.total = N;
        this.selected = null;
        this.stopTimer();
        this.seconds = 0;
        this.startTimer();

        const left = this.shuffle(chosen.slice());
        const right = this.shuffle(chosen.slice());

        const tile = (item, side) =>
            `<button class="match-tile btn secondary ripple" data-pid="${item.pid}" data-side="${side}"
               style="text-align:left;white-space:normal;height:auto;line-height:1.35;padding:0.8rem 1rem;width:100%;">
               ${side === 'a' ? item.a : item.b}
             </button>`;

        container.innerHTML = `
            <div class="match-board" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:820px;">
                <div class="match-col" style="display:grid;gap:10px;align-content:start;">
                    ${left.map(it => tile(it, 'a')).join('')}
                </div>
                <div class="match-col" style="display:grid;gap:10px;align-content:start;">
                    ${right.map(it => tile(it, 'b')).join('')}
                </div>
            </div>`;

        container.querySelectorAll('.match-tile').forEach(btn =>
            btn.addEventListener('click', () => this.onTile(btn)));

        this.updateStatus();

        if (window.renderMathInElement) {
            window.renderMathInElement(container, {
                delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
                throwOnError: false
            });
        }
    },

    onTile(btn) {
        if (btn.classList.contains('matched') || btn.disabled) return;
        const side = btn.dataset.side;
        const pid = btn.dataset.pid;

        if (!this.selected) {
            this.markSelected(btn);
            return;
        }
        if (this.selected.dataset.side === side) {
            // ta sama kolumna — przenies zaznaczenie
            this.clearSelected();
            this.markSelected(btn);
            return;
        }
        // przeciwne kolumny — oceniaj
        const ok = this.selected.dataset.pid === pid;
        const first = this.selected;
        this.selected = null;

        if (ok) {
            [first, btn].forEach(b => {
                b.classList.add('matched');
                b.disabled = true;
                b.style.background = 'rgba(0,255,100,0.18)';
                b.style.borderColor = 'var(--success)';
                b.style.opacity = '0.85';
            });
            first.style.boxShadow = '';
            this.matched++;
            if (typeof Gamify !== 'undefined') Gamify.awardXP(8, 'Para!');
            this.updateStatus();
            if (this.matched === this.total) this.win();
        } else {
            [first, btn].forEach(b => {
                b.style.background = 'rgba(255,50,50,0.18)';
                b.style.borderColor = 'var(--danger)';
            });
            setTimeout(() => {
                [first, btn].forEach(b => {
                    if (!b.classList.contains('matched')) {
                        b.style.background = '';
                        b.style.borderColor = '';
                        b.style.boxShadow = '';
                    }
                });
            }, 600);
        }
    },

    markSelected(btn) {
        this.selected = btn;
        btn.style.boxShadow = '0 0 0 2px var(--primary)';
        btn.style.background = 'rgba(0,229,255,0.12)';
    },

    clearSelected() {
        if (this.selected && !this.selected.classList.contains('matched')) {
            this.selected.style.boxShadow = '';
            this.selected.style.background = '';
        }
        this.selected = null;
    },

    win() {
        this.stopTimer();
        if (typeof Anim !== 'undefined' && Anim.fireConfetti) Anim.fireConfetti();
        if (typeof Gamify !== 'undefined') Gamify.awardXP(20, `Runda w ${this.seconds}s!`);
        const status = document.getElementById('match-status');
        if (status) status.innerHTML = `✅ Wszystkie pary w <b>${this.seconds}s</b>!`;
        const controls = document.getElementById('match-controls');
        if (controls) {
            controls.style.display = 'flex';
            controls.innerHTML = '';
            const b = document.createElement('button');
            b.className = 'btn primary ripple';
            b.textContent = 'Nowa runda';
            b.onclick = () => { controls.style.display = 'none'; this.newRound(); };
            controls.appendChild(b);
        }
    },

    updateStatus() {
        const status = document.getElementById('match-status');
        if (status) status.innerHTML = `Dopasowano: <b>${this.matched}/${this.total}</b> &nbsp;•&nbsp; Czas: <b id="match-time">${this.seconds}s</b>`;
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            const t = document.getElementById('match-time');
            if (t) t.textContent = this.seconds + 's';
        }, 1000);
    },

    stopTimer() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
    }
};
