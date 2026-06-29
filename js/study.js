/* study.js — sekcje "Postępy" (analiza nauki do obrony) i "Do poprawy"
   (aktualizuje sie po kazdej odpowiedzi). Plus konfiguracja klucza Gemini. Autor: Claude. */
window.Study = {
  data: null,

  init(data) {
    this.data = data;
    if (!Store._data.toImprove) Store._data.toImprove = [];
    if (!Store._data.answered) Store._data.answered = { ok: 0, bad: 0 };
    // Nagroda za domkniecie celu dnia (natychmiastowy feedback -> dopamina, [#duolingo-gamifikacja]).
    if (!this._goalBound) {
      this._goalBound = true;
      document.addEventListener('fir:dailygoal', (e) => {
        const fr = (e.detail && e.detail.freezes) || Store.getFreezes();
        if (typeof Gamify !== 'undefined' && Gamify.awardXP) Gamify.awardXP(25, 'Cel dnia domknięty! +❄️');
        if (typeof Anim !== 'undefined' && Anim.fireConfetti) Anim.fireConfetti();
        this.toast(`🎯 Cel dnia domknięty! Masz ${fr} ❄️ zamrożeń serii.`);
        if (App.currentView === 'progress') this.renderProgress();
      });
    }
  },

  // Lekki, samoznikajacy komunikat (bez ingerencji w style.css).
  toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;bottom:6%;transform:translateX(-50%);z-index:10001;' +
      'background:rgba(12,10,16,.95);color:#ECE6D8;border:1px solid rgba(212,175,55,.5);' +
      'padding:.7rem 1.2rem;border-radius:10px;font-weight:600;box-shadow:0 8px 30px rgba(0,0,0,.6);' +
      "font-family:'Outfit',sans-serif;max-width:90vw;text-align:center";
    document.body.appendChild(t);
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(t, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .35 });
      gsap.to(t, { opacity: 0, y: 20, duration: .4, delay: 3, onComplete: () => t.remove() });
    } else { setTimeout(() => t.remove(), 3400); }
  },

  chapterTitle(ch) {
    const c = this.data && this.data.chapters ? this.data.chapters.find(x => x.id === ch) : null;
    return c ? c.title : ch;
  },

  // --- Śledzenie "Do poprawy" (wolane z learn.js po kazdej odpowiedzi) ---
  recordAnswer(ok) {
    if (!Store._data.answered) Store._data.answered = { ok: 0, bad: 0 };
    if (ok) Store._data.answered.ok++; else Store._data.answered.bad++;
    Store.save();
  },
  addImprove(chapter, text) {
    if (!text) return;
    if (!Store._data.toImprove) Store._data.toImprove = [];
    const key = chapter + '::' + text.toLowerCase().slice(0, 80);
    if (Store._data.toImprove.some(i => (i.chapter + '::' + (i.text || '').toLowerCase().slice(0, 80)) === key)) return;
    Store._data.toImprove.unshift({ chapter, text, ts: Date.now() });
    if (Store._data.toImprove.length > 60) Store._data.toImprove.length = 60;
    Store.save();
    if (App.currentView === 'improve') this.renderImprove();
  },
  resolveImprove(idx) {
    if (Store._data.toImprove) { Store._data.toImprove.splice(idx, 1); Store.save(); this.renderImprove(); }
  },

  // --- "DZIŚ": petla nawyku (streak + freeze + cel dnia) i KOLEJKA POWTÓREK ---
  // Spaced repetition liczy nextReview, ale nic nie zmuszalo do powtorek. Tu zamieniam
  // martwy harmonogram w codzienna, PRZEPLATANA sesje recall ([#szybka-nauka]).
  todayPanelHTML(rows, now) {
    const streak = Store.getStreak ? Store.getStreak() : 0;
    const best = Store.getBestStreak ? Store.getBestStreak() : 0;
    const freezes = Store.getFreezes ? Store.getFreezes() : 0;
    const goal = Store.getDailyGoal ? Store.getDailyGoal() : 10;
    const done = Store.getItemsToday ? Store.getItemsToday() : 0;
    const pct = Math.min(100, Math.round(100 * done / Math.max(1, goal)));
    const goalDone = done >= goal;

    // Kolejka powtorek: dzialy, ktorych nextReview juz minal (przeplatane = posortowane wg "jak dawno").
    const due = rows.filter(r => r.nr > 0 && r.nr <= now && r.reps > 0).sort((a, b) => a.nr - b.nr);
    // Co dalej, gdy brak powtorek: pierwszy nieruszony dzial (active recall na nowym materiale).
    const fresh = rows.filter(r => !r.reps && r.m === 0).sort((a, b) => a.day - b.day)[0];

    const ring = `<div style="position:relative;width:88px;height:88px;flex-shrink:0;border-radius:50%;
        background:conic-gradient(${goalDone ? 'var(--success,#3ec97a)' : 'var(--primary,#E8C76A)'} ${pct * 3.6}deg, rgba(255,255,255,.08) 0)">
        <div style="position:absolute;inset:6px;border-radius:50%;background:rgba(10,8,12,.92);display:flex;flex-direction:column;align-items:center;justify-content:center">
          <b style="font-size:1.15rem;line-height:1">${done}/${goal}</b>
          <span style="font-size:.58rem;letter-spacing:.12em;opacity:.7">CEL DNIA</span>
        </div></div>`;

    const queueHTML = due.length
      ? `<div style="margin-top:1rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
            <b style="font-size:.95rem">🗓️ Powtórki na dziś — ${due.length} (przeplatane)</b>
            <button class="btn primary" style="padding:.4rem 1rem;font-size:.85rem" onclick="window.Study.goLesson('${due[0].id}')">Powtórz teraz ▶</button>
          </div>
          ${due.slice(0, 8).map(r => `<div style="display:flex;justify-content:space-between;align-items:center;padding:.35rem .2rem;border-top:1px solid rgba(255,255,255,.05);cursor:pointer" onclick="window.Study.goLesson('${r.id}')">
              <span style="font-size:.9rem">Dzień ${r.day} • ${r.title}</span>
              <span style="font-size:.75rem;opacity:.7">${this.dueLabel(r.nr, now)}</span>
            </div>`).join('')}
        </div>`
      : `<div style="margin-top:1rem;padding:.7rem .9rem;background:rgba(62,201,122,.08);border:1px solid rgba(62,201,122,.25);border-radius:10px;font-size:.9rem">
          ✅ Brak zaległych powtórek. ${fresh ? `Czas na nowy materiał: <b style="cursor:pointer;color:var(--primary,#E8C76A)" onclick="window.Study.goLesson('${fresh.id}')">Dzień ${fresh.day} • ${fresh.title} ▶</b>` : 'Pięknie — wszystko ruszone. Wróć po powtórki, gdy dojrzeją.'}
        </div>`;

    return `<div class="glass-card" style="margin-bottom:1.5rem">
      <div style="display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap">
        ${ring}
        <div style="flex:1;min-width:200px">
          <div style="display:flex;align-items:baseline;gap:.6rem">
            <span style="font-size:1.8rem;line-height:1">🔥</span>
            <b style="font-size:1.8rem;line-height:1;color:var(--primary,#E8C76A)">${streak}</b>
            <span style="opacity:.8">dni z rzędu</span>
            ${best > streak ? `<span class="text-muted" style="font-size:.8rem">(rekord ${best})</span>` : ''}
          </div>
          <div style="margin-top:.45rem;display:flex;gap:.5rem;align-items:center;flex-wrap:wrap">
            <span title="Zamrożenia chronią serię, gdy opuścisz dzień">${'❄️'.repeat(Math.max(0, freezes)) || '—'} <span class="text-muted" style="font-size:.8rem">${freezes} zamrożeń serii</span></span>
          </div>
          <div class="text-muted" style="font-size:.82rem;margin-top:.45rem">
            ${goalDone ? 'Cel dnia domknięty — seria bezpieczna. ' : `Zrób jeszcze <b>${goal - done}</b> dziś, by domknąć cel i zdobyć ❄️. `}Nie przerywaj łańcucha; jeden opuszczony dzień łapie zamrożenie.
          </div>
        </div>
      </div>
      ${queueHTML}
    </div>`;
  },

  // "zaległe 2 dni" / "na teraz" — czytelna etykieta zamiast surowego timestampu.
  dueLabel(nr, now) {
    const days = Math.floor((now - nr) / 86400000);
    if (days >= 1) return `zaległe ${days} dn.`;
    const hrs = Math.floor((now - nr) / 3600000);
    return hrs >= 1 ? `zaległe ${hrs} h` : 'na teraz';
  },

  // --- POSTĘPY ---
  renderProgress() {
    const el = document.getElementById('progress-container');
    if (!el || !this.data) return;
    const chapters = (this.data.chapters || []).filter(c => (window.LESSONS && window.LESSONS.lessons || []).some(l => l.chapter === c.id));
    const now = Date.now();
    let sumM = 0, due = 0, started = 0;
    const rows = chapters.map(c => {
      const st = Store.getLessonState(c.id);
      const m = st.mastery || 0; sumM += m;
      if ((Number(st.nextReview) || 0) <= now && st.sprintReps) due++;
      if (st.sprintReps || m > 0) started++;
      return { id: c.id, title: c.title, day: c.order, m, nr: Number(st.nextReview) || 0, reps: st.sprintReps || 0 };
    });
    const readiness = chapters.length ? Math.round(sumM / chapters.length) : 0;
    const ans = Store._data.answered || { ok: 0, bad: 0 };
    const acc = (ans.ok + ans.bad) ? Math.round(100 * ans.ok / (ans.ok + ans.bad)) : 0;
    const defense = localStorage.getItem('defense_date') || '';
    let daysLeft = '';
    if (defense) { const d = Math.ceil((new Date(defense) - now) / 86400000); daysLeft = d >= 0 ? `${d} dni` : 'po terminie'; }
    const col = v => v >= 80 ? 'var(--success)' : (v >= 50 ? 'var(--warning)' : 'var(--danger)');

    const weak = rows.slice().sort((a, b) => a.m - b.m).filter(r => r.m < 80).slice(0, 6);
    el.innerHTML = `
      ${this.todayPanelHTML(rows, now)}
      <div class="glass-card" style="text-align:center;margin-bottom:1.5rem">
        <div style="font-size:.85rem;opacity:.8;text-transform:uppercase;letter-spacing:1px">Gotowość do obrony</div>
        <div class="huge-number" style="color:${col(readiness)}">${readiness}%</div>
        <div style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-top:1rem">
          <div><b>${started}</b>/${chapters.length}<br><span class="text-muted" style="font-size:.8rem">działów ruszone</span></div>
          <div><b>${acc}%</b><br><span class="text-muted" style="font-size:.8rem">celność odpowiedzi (${ans.ok + ans.bad})</span></div>
          <div><b>${due}</b><br><span class="text-muted" style="font-size:.8rem">powtórek na teraz</span></div>
          <div><b id="def-days">${daysLeft || '—'}</b><br><span class="text-muted" style="font-size:.8rem">do obrony</span></div>
        </div>
        <div style="margin-top:1rem"><input id="def-date" type="date" class="glass-input" value="${defense}" style="padding:.4rem .8rem"> <button class="btn secondary" id="def-save" style="padding:.4rem .9rem">Ustaw datę obrony</button></div>
      </div>
      ${weak.length ? `<div class="glass-card" style="margin-bottom:1.5rem;border-color:var(--danger)"><h3 style="color:var(--danger);margin-bottom:.8rem">⚠️ Najsłabsze działy — tu skup naukę</h3>${weak.map(r => `<div style="display:flex;justify-content:space-between;align-items:center;padding:.4rem 0;cursor:pointer" onclick="window.Study.goLesson('${r.id}')"><span>${r.title}</span><span style="color:${col(r.m)};font-weight:bold">${r.m}%</span></div>`).join('')}</div>` : ''}
      <div class="glass-card"><h3 style="margin-bottom:1rem">Opanowanie wszystkich działów (kolejność nauki)</h3>
        ${rows.map(r => `<div style="margin-bottom:.7rem"><div style="display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:.2rem"><span>Dzień ${r.day} • ${r.title}</span><span style="color:${col(r.m)}">${r.m}%</span></div><div style="height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden"><div style="width:${r.m}%;height:100%;background:${col(r.m)}"></div></div></div>`).join('')}
      </div>
      ${this.geminiKeyHTML()}`;
    const ds = document.getElementById('def-save');
    if (ds) ds.onclick = () => { const v = document.getElementById('def-date').value; if (v) localStorage.setItem('defense_date', v); this.renderProgress(); };
    this.bindGeminiKey();
  },

  goLesson(id) { if (typeof Learn !== 'undefined') { Learn.selectLesson ? Learn.selectLesson(id) : null; } App.navigate('learn'); },

  // --- DO POPRAWY ---
  renderImprove() {
    const el = document.getElementById('improve-container');
    if (!el) return;
    const list = Store._data.toImprove || [];
    if (!list.length) {
      el.innerHTML = `<div class="glass-card flex-center" style="min-height:260px;text-align:center"><div style="font-size:3rem">✅</div><h2>Czysto!</h2><p class="text-muted">Brak rzeczy do poprawy. Lista zapełni się sama, gdy pomylisz się w lekcji lub komisja (Gemini) wskaże braki.</p></div>`;
      return;
    }
    const byCh = {};
    list.forEach((it, i) => { (byCh[it.chapter] = byCh[it.chapter] || []).push({ ...it, i }); });
    el.innerHTML = `<div class="glass-card" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center"><span><b>${list.length}</b> rzeczy do poprawy — aktualizuje się po każdej Twojej odpowiedzi.</span></div>` +
      Object.keys(byCh).map(ch => `<div class="glass-card" style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem">
          <h3 style="color:var(--primary)">${this.chapterTitle(ch)}</h3>
          <button class="btn secondary" style="padding:.35rem .8rem;font-size:.85rem" onclick="window.Study.goLesson('${ch}')">Powtórz dział ▶</button>
        </div>
        ${byCh[ch].map(it => `<div style="display:flex;gap:.6rem;align-items:flex-start;padding:.4rem 0;border-top:1px solid rgba(255,255,255,.05)"><span style="color:var(--warning)">•</span><span style="flex:1">${it.text}</span><button title="Odhacz" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem" onclick="window.Study.resolveImprove(${it.i})">✓</button></div>`).join('')}
      </div>`).join('');
  },

  // --- Klucz Gemini (config) ---
  geminiKeyHTML() {
    const has = typeof GeminiAI !== 'undefined' && GeminiAI.hasKey();
    return `<div class="glass-card" style="margin-top:1.5rem;border-color:var(--primary)">
      <h3 style="margin-bottom:.5rem">🔑 Egzaminator AI (Gemini) — ocena pytań ustnych</h3>
      <p class="text-muted" style="font-size:.85rem;margin-bottom:1rem">Wklej swój klucz Gemini API (z aistudio.google.com → „Get API key"). Trzymany jest TYLKO w tej przeglądarce (localStorage), nigdy w aplikacji. Wtedy pytania „komisji" (capstone) oceni surowo, ale kulturalnie prawdziwy AI. ${has ? '<b style="color:var(--success)">✓ Klucz aktywny.</b>' : '<b style="color:var(--warning)">Brak klucza — pytania ustne masz na samoocenie.</b>'}</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <input id="gem-key" type="password" class="glass-input" placeholder="Wklej klucz Gemini API..." style="flex:1;min-width:200px;padding:.6rem 1rem" value="">
        <button class="btn primary" id="gem-save" style="padding:.6rem 1.2rem">Zapisz</button>
        ${has ? '<button class="btn secondary" id="gem-clear" style="padding:.6rem 1rem">Usuń</button>' : ''}
      </div>
      <div id="gem-status" class="text-muted" style="font-size:.85rem;margin-top:.6rem"></div>
    </div>`;
  },
  bindGeminiKey() {
    const save = document.getElementById('gem-save');
    if (save) save.onclick = async () => {
      const v = document.getElementById('gem-key').value.trim();
      if (!v) return;
      GeminiAI.setKey(v);
      const s = document.getElementById('gem-status');
      if (s) s.textContent = 'Testuję klucz...';
      const r = await GeminiAI.generate('Odpowiedz jednym słowem: OK', false);
      if (s) s.innerHTML = r.error ? `<span style="color:var(--danger)">Błąd: ${r.error}</span>` : '<span style="color:var(--success)">✓ Klucz działa! Egzaminator AI aktywny.</span>';
      this.renderProgress();
    };
    const clr = document.getElementById('gem-clear');
    if (clr) clr.onclick = () => { GeminiAI.clearKey(); this.renderProgress(); };
  }
};
