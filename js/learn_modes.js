/* learn_modes.js — dodatkowe METODY nauki w sekcji "Ucz mnie".
   Tryby poza lekcja prowadzona: Blitz (arcade na czas), Komisja (symulacja ustna + checklist),
   Wyjasnij (Feynman). Dane: lessons.json (checki) + window.EXAM (pakiety egzaminacyjne). Autor: Claude. */
window.LearnModes = {
  lessons: [],
  exam: {},
  mode: 'lesson',

  init(lessonsData, examData) {
    this.lessons = (lessonsData && lessonsData.lessons) || [];
    this.exam = examData || window.EXAM || {};
    this.buildBar();
    const sel = document.getElementById('learn-chapter-filter');
    if (sel) sel.addEventListener('change', () => { if (this.mode !== 'lesson') this.render(); });
    this.setMode('lesson');
  },

  setExam(examData) { this.exam = examData || {}; if (this.mode === 'oral' || this.mode === 'feynman') this.render(); },

  TILES: [
    { id: 'lesson', icon: '📚', label: 'Lekcja' },
    { id: 'blitz', icon: '⚡', label: 'Blitz na czas' },
    { id: 'oral', icon: '🎤', label: 'Komisja' },
    { id: 'feynman', icon: '🧠', label: 'Wyjaśnij' },
  ],

  buildBar() {
    const bar = document.getElementById('learn-modebar');
    if (!bar) return;
    bar.innerHTML = '';
    this.TILES.forEach(t => {
      const b = document.createElement('button');
      b.className = 'mode-tile';
      b.dataset.mode = t.id;
      b.innerHTML = `<span class="mt-icon">${t.icon}</span><span class="mt-label">${t.label}</span>`;
      b.onclick = () => this.setMode(t.id);
      bar.appendChild(b);
    });
  },

  setMode(m) {
    this.mode = m;
    document.querySelectorAll('#learn-modebar .mode-tile').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === m));
    const lc = document.getElementById('learn-container');
    const lctrl = document.getElementById('learn-controls');
    const stage = document.getElementById('modes-stage');
    if (m === 'lesson') {
      if (lc) lc.style.display = '';
      if (stage) stage.style.display = 'none';
      if (typeof Learn !== 'undefined') Learn.loadQueue();
    } else {
      if (lc) lc.style.display = 'none';
      if (lctrl) { lctrl.style.display = 'none'; lctrl.innerHTML = ''; }
      if (stage) stage.style.display = '';
      this.render();
    }
  },

  chapter() { return document.getElementById('learn-chapter-filter')?.value || 'all'; },

  // zbierz pytania-checki z lekcji danego dzialu (lub wszystkich)
  collectChecks(ch) {
    const pool = [];
    this.lessons.forEach(l => {
      if (ch !== 'all' && l.chapter !== ch) return;
      (l.steps || []).forEach(s => { if (s.type === 'check') pool.push(s); });
    });
    return pool;
  },

  collectExam(ch) {
    const out = [];
    Object.keys(this.exam || {}).forEach(cid => {
      if (ch !== 'all' && cid !== ch) return;
      (this.exam[cid] || []).forEach(q => out.push(Object.assign({ chapter: cid }, q)));
    });
    return out;
  },

  shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; },
  katex(el) { if (window.renderMathInElement) window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); },

  render() {
    const stage = document.getElementById('modes-stage');
    if (!stage) return;
    if (this.mode === 'blitz') this.renderBlitz(stage);
    else if (this.mode === 'oral') this.renderOral(stage);
    else if (this.mode === 'feynman') this.renderFeynman(stage);
  },

  /* ===== BLITZ — arcade na czas, combo, rekord ===== */
  renderBlitz(stage) {
    const ch = this.chapter();
    const pool = this.shuffle(this.collectChecks(ch));
    if (pool.length < 3) { stage.innerHTML = `<div class="glass-card flex-center" style="min-height:260px"><p class="text-muted">Za mało pytań w tym dziale na Blitz. Wybierz inny lub „Wszystkie".</p></div>`; return; }
    const bestKey = 'blitz_best_' + ch;
    let best = Number(localStorage.getItem(bestKey) || 0);
    let i = 0, score = 0, combo = 0, correct = 0, total = 0, time = 60, timer = null;
    stage.innerHTML = `
      <div class="glass-card" style="width:100%;max-width:640px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <div>⏱ <b id="bz-time">60</b>s &nbsp; 🏆 Rekord: <b>${best}</b></div>
          <div>Wynik: <b id="bz-score" style="color:var(--primary)">0</b> &nbsp; 🔥 <b id="bz-combo">x1</b></div>
        </div>
        <div id="bz-q"></div>
      </div>`;
    const qEl = stage.querySelector('#bz-q');
    const sEl = stage.querySelector('#bz-score'), cEl = stage.querySelector('#bz-combo'), tEl = stage.querySelector('#bz-time');
    const self = this;
    const end = () => {
      clearInterval(timer);
      const isRec = score > best; if (isRec) localStorage.setItem(bestKey, score);
      if (isRec && typeof Anim !== 'undefined' && Anim.fireConfetti) Anim.fireConfetti();
      stage.innerHTML = `<div class="glass-card flex-center fade-in" style="min-height:300px;max-width:640px;text-align:center">
        <div style="font-size:3rem">${isRec ? '🏆' : '⏱'}</div>
        <h2>${isRec ? 'NOWY REKORD!' : 'Koniec czasu!'}</h2>
        <div class="huge-number" style="color:var(--primary)">${score}</div>
        <p class="text-muted">Trafione: ${correct}/${total} • najlepsze combo wpływa na wynik</p>
        <button class="btn primary ripple" id="bz-again" style="margin-top:1rem">Jeszcze raz</button></div>`;
      stage.querySelector('#bz-again').onclick = () => self.renderBlitz(stage);
    };
    const tick = () => { time--; tEl.textContent = time; if (time <= 0) end(); };
    timer = setInterval(tick, 1000);
    const next = () => {
      if (i >= pool.length) { i = 0; this.shuffle(pool); }
      const s = pool[i++]; total++;
      const done = (ok) => {
        if (ok) { combo++; correct++; const pts = 10 * combo; score += pts; }
        else { combo = 0; }
        sEl.textContent = score; cEl.textContent = 'x' + (combo + 1);
        cEl.style.color = combo >= 2 ? 'var(--success)' : '';
        setTimeout(() => { if (time > 0) next(); }, ok ? 350 : 900);
      };
      this.renderCheck(qEl, s, done, true);
    };
    next();
  },

  // render pojedynczego checka; compact=true dla Blitz (bez wyjasnien przy dobrej)
  renderCheck(el, s, done, compact) {
    el.innerHTML = '';
    const q = document.createElement('h3'); q.style.marginBottom = '1rem'; q.innerHTML = s.q || ''; el.appendChild(q);
    const finish = (ok, showExplain) => {
      if (!ok && (showExplain || !compact) && s.explain) {
        const ex = document.createElement('div'); ex.className = 'text-muted'; ex.style.marginTop = '.8rem'; ex.innerHTML = s.explain; el.appendChild(ex); this.katex(el);
      }
      done(ok);
    };
    if (s.kind === 'mcq') {
      const grid = document.createElement('div'); grid.style.display = 'grid'; grid.style.gap = '8px';
      s.options.forEach((opt, idx) => {
        const b = document.createElement('button'); b.className = 'btn secondary ripple'; b.style.textAlign = 'left'; b.innerHTML = opt;
        b.onclick = () => { Array.from(grid.children).forEach(x => x.disabled = true); const ok = idx === s.correct;
          b.style.borderColor = ok ? 'var(--success)' : 'var(--danger)'; b.style.background = ok ? 'rgba(0,255,100,.18)' : 'rgba(255,50,50,.18)';
          if (!ok) grid.children[s.correct].style.borderColor = 'var(--success)'; finish(ok, true); };
        grid.appendChild(b);
      });
      el.appendChild(grid);
    } else if (s.kind === 'tf') {
      const wrap = document.createElement('div'); wrap.style.display = 'grid'; wrap.style.gridTemplateColumns = '1fr 1fr'; wrap.style.gap = '8px';
      [['Prawda', true], ['Fałsz', false]].forEach(([lab, val]) => {
        const b = document.createElement('button'); b.className = 'btn secondary ripple'; b.textContent = lab;
        b.onclick = () => { Array.from(wrap.children).forEach(x => x.disabled = true); const ok = val === s.bool;
          b.style.borderColor = ok ? 'var(--success)' : 'var(--danger)'; b.style.background = ok ? 'rgba(0,255,100,.18)' : 'rgba(255,50,50,.18)'; finish(ok, true); };
        wrap.appendChild(b);
      });
      el.appendChild(wrap);
    } else { // num / cloze -> input
      const inp = document.createElement('input'); inp.className = 'glass-input'; inp.style.width = '100%'; inp.style.marginTop = '.5rem';
      inp.type = s.kind === 'num' ? 'number' : 'text'; inp.placeholder = s.kind === 'num' ? ('Wynik ' + (s.unit || '')) : 'Odpowiedź';
      el.appendChild(inp);
      const btn = document.createElement('button'); btn.className = 'btn primary ripple'; btn.textContent = 'OK'; btn.style.marginTop = '.6rem';
      const norm = x => (x || '').toString().trim().toLowerCase().replace(/[ąàáä]/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/[óòöô]/g, 'o').replace(/ś/g, 's').replace(/[żź]/g, 'z').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
      const check = () => { let ok; if (s.kind === 'num') { const v = parseFloat(inp.value); ok = !isNaN(v) && Math.abs(v - s.answer) <= (s.tol || 0); } else { ok = [s.cloze_answer, ...(s.accept || [])].map(norm).includes(norm(inp.value)); }
        inp.style.borderColor = ok ? 'var(--success)' : 'var(--danger)'; btn.disabled = true; finish(ok, true); };
      btn.onclick = check; inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      el.appendChild(btn); setTimeout(() => inp.focus(), 30);
    }
    this.katex(el);
  },

  /* ===== KOMISJA — symulacja ustna + checklist samooceny ===== */
  renderOral(stage) { this._renderAnswerMode(stage, false); },
  renderFeynman(stage) { this._renderAnswerMode(stage, true); },

  _renderAnswerMode(stage, feynman) {
    const ch = this.chapter();
    const qs = this.shuffle(this.collectExam(ch));
    if (!qs.length) { stage.innerHTML = `<div class="glass-card flex-center" style="min-height:260px"><p class="text-muted">Pakiety egzaminacyjne dla tego trybu jeszcze się ładują (dostarcza je nauka). Spróbuj za chwilę lub wybierz „Lekcja".</p></div>`; return; }
    const item = qs[0];
    const intro = feynman
      ? `<p class="text-muted" style="margin:.5rem 0 1rem">Wytłumacz to PROSTYM językiem, bez żargonu — własnymi słowami (na głos lub wpisz). Potem porównaj z wzorcem.</p>
         <textarea id="om-input" class="glass-input" style="width:100%;min-height:120px" placeholder="Twoje wytłumaczenie..."></textarea>`
      : `<p class="text-muted" style="margin:.5rem 0 1rem">Odpowiedz tak, jak przed komisją (na głos lub w myślach). Gdy skończysz — pokaż wzorzec i odhacz, co powiedziałeś.</p>`;
    stage.innerHTML = `
      <div class="glass-card fade-in" style="width:100%;max-width:720px">
        <div style="font-size:.8rem;color:var(--primary);font-weight:bold;margin-bottom:.8rem">${feynman ? '🧠 WYJAŚNIJ (FEYNMAN)' : '🎤 KOMISJA — PYTANIE'} • dział ${item.chapter}</div>
        <h2 style="font-size:1.4rem;line-height:1.4">${item.q}</h2>
        ${intro}
      </div>`;
    const card = stage.querySelector('.glass-card');
    this.katex(card);
    const revealBtn = document.createElement('button');
    revealBtn.className = 'btn primary ripple'; revealBtn.textContent = 'Pokaż wzorzec i oceń się'; revealBtn.style.marginTop = '1rem';
    revealBtn.onclick = () => this._reveal(stage, item, feynman);
    card.appendChild(revealBtn);
  },

  _reveal(stage, item, feynman) {
    const card = stage.querySelector('.glass-card');
    const yours = feynman ? (document.getElementById('om-input')?.value || '') : '';
    const list = item.checklist || [];
    const wrap = document.createElement('div'); wrap.style.marginTop = '1.2rem'; wrap.style.borderTop = '1px solid rgba(255,255,255,.1)'; wrap.style.paddingTop = '1rem';
    wrap.innerHTML = `<h3 style="margin-bottom:.6rem">Wzorcowa odpowiedź (poziom komisji)</h3><div class="text-lg" style="line-height:1.7">${item.model || ''}</div>
      <h4 style="margin:1.2rem 0 .5rem">Odhacz, co realnie powiedziałeś:</h4>`;
    const checks = document.createElement('div');
    list.forEach((pt, idx) => {
      const id = 'ck' + idx;
      const row = document.createElement('label'); row.style.display = 'flex'; row.style.gap = '.6rem'; row.style.alignItems = 'flex-start'; row.style.padding = '.35rem 0'; row.style.cursor = 'pointer';
      row.innerHTML = `<input type="checkbox" id="${id}" style="margin-top:.3rem;width:18px;height:18px;accent-color:var(--primary)"><span>${pt}</span>`;
      checks.appendChild(row);
    });
    wrap.appendChild(checks);
    if ((item.traps || []).length) {
      const tr = document.createElement('div'); tr.style.marginTop = '1rem'; tr.className = 'text-muted';
      tr.innerHTML = `<b>⚠️ Gdzie komisja dociska:</b><ul>${item.traps.map(t => `<li>${t}</li>`).join('')}</ul>`;
      wrap.appendChild(tr);
    }
    const grade = document.createElement('button'); grade.className = 'btn success ripple'; grade.textContent = 'Oceń (werdykt komisji)'; grade.style.marginTop = '1rem';
    const verdict = document.createElement('div'); verdict.style.marginTop = '1rem';
    grade.onclick = () => {
      const ticked = list.filter((_, idx) => document.getElementById('ck' + idx)?.checked).length;
      const pct = list.length ? Math.round(100 * ticked / list.length) : 0;
      const pass = pct >= 80;
      verdict.innerHTML = `<div class="glass-card" style="text-align:center;border:1px solid ${pass ? 'var(--success)' : 'var(--danger)'}">
        <div style="font-size:2rem">${pass ? '✅' : '📚'}</div>
        <h3 style="color:${pass ? 'var(--success)' : 'var(--danger)'}">${pass ? 'KOMISJA: ZALICZONE — umiesz to na 100%' : 'Jeszcze nie — wróć do lekcji tego działu'}</h3>
        <p class="text-muted">Pokryłeś ${ticked}/${list.length} kluczowych punktów (${pct}%)${pass ? '' : '. Cel: ≥80%.'}</p></div>`;
      if (pass) { if (typeof Gamify !== 'undefined') Gamify.awardXP(40, 'Komisja zaliczona!'); if (typeof Anim !== 'undefined' && Anim.fireConfetti) Anim.fireConfetti(); }
      // SM-2/FSRS: zapisz jakosc dla tego dzialu (jako lekcja)
      if (typeof Store !== 'undefined' && Store.updateLesson) Store.updateLesson(item.chapter, pass ? 5 : 2);
      grade.disabled = true;
    };
    const nextBtn = document.createElement('button'); nextBtn.className = 'btn ripple'; nextBtn.textContent = 'Następne pytanie'; nextBtn.style.marginTop = '1rem'; nextBtn.style.marginLeft = '.5rem';
    nextBtn.onclick = () => this.render();
    wrap.appendChild(grade); wrap.appendChild(nextBtn); wrap.appendChild(verdict);
    // usun przycisk reveal
    const rb = card.querySelector('button'); if (rb) rb.remove();
    card.appendChild(wrap);
    this.katex(card);
  }
};
