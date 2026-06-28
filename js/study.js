/* study.js — sekcje "Postępy" (analiza nauki do obrony) i "Do poprawy"
   (aktualizuje sie po kazdej odpowiedzi). Plus konfiguracja klucza Gemini. Autor: Claude. */
window.Study = {
  data: null,

  init(data) {
    this.data = data;
    if (!Store._data.toImprove) Store._data.toImprove = [];
    if (!Store._data.answered) Store._data.answered = { ok: 0, bad: 0 };
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
