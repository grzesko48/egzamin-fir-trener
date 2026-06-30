/* gemini.js — ocena odpowiedzi "alla ustnych" przez Gemini API.
   Klucz API podaje UZYTKOWNIK i jest trzymany TYLKO w jego localStorage (nigdy w repo).
   Uzywany OSZCZEDNIE: glownie do oceny pytan capstone (ustnych). Autor: Claude. */
window.GeminiAI = {
  MODEL: localStorage.getItem('gemini_model') || 'gemini-2.0-flash',

  key() { return (localStorage.getItem('gemini_api_key') || '').trim(); },
  setKey(k) { localStorage.setItem('gemini_api_key', (k || '').trim()); },
  clearKey() { localStorage.removeItem('gemini_api_key'); },
  hasKey() { return !!this.key(); },

  async generate(prompt, json) {
    const key = this.key();
    if (!key) return { error: 'no_key' };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${encodeURIComponent(key)}`;
    const body = { contents: [{ parts: [{ text: prompt }] }], generationConfig: json ? { temperature: 0.25, responseMimeType: 'application/json' } : { temperature: 0.7 } };
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) {
        let msg = 'HTTP ' + r.status;
        try { const j = await r.json(); msg = j.error?.message || msg; } catch (e) {}
        return { error: msg };
      }
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { text };
    } catch (e) { return { error: String(e) }; }
  },

  // Surowa, ale zyczliwa ocena odpowiedzi ustnej. Zwraca {ok:{score,pass,verdict,good,missing,tip}} albo {error}.
  async gradeOral(question, model, userAnswer) {
    const prompt = `Jesteś surowym, ale ŻYCZLIWYM i kulturalnym egzaminatorem komisji na egzaminie licencjackim z Finansów i Rachunkowości (Polska). Oceniasz ustną odpowiedź studenta.

PYTANIE KOMISJI:
${question}

WZORCOWA ODPOWIEDŹ (czego oczekuje komisja):
${model}

ODPOWIEDŹ STUDENTA:
${userAnswer}

Oceń SUROWO merytorycznie — wyłap braki, błędy, nieprecyzyjność, pominięte wzory/definicje/rozróżnienia. Ale ton ma być KULTURALNY i wspierający (jak wymagający, lecz życzliwy promotor), bez chamstwa i zniechęcania. Jeśli odpowiedź jest pusta/nie na temat — daj niski wynik i powiedz to wprost, ale grzecznie.
Zwróć WYŁĄCZNIE poprawny JSON (bez markdown):
{"score": <0-100 = ile % kluczowych punktów student realnie pokrył>, "pass": <true gdy score>=70>, "verdict": "<2-4 słowa, np. 'Zaliczone' lub 'Wymaga uzupełnienia'>", "good": "<1 zdanie: co było dobrze (lub że brak)>", "missing": ["<konkretny brak/błąd 1>", "<brak 2>"], "tip": "<1 zdanie konkretnej wskazówki>"}`;
    const res = await this.generate(prompt, true);
    if (res.error) return { error: res.error };
    try {
      let t = (res.text || '').trim().replace(/^```json/i, '').replace(/```$/, '').trim();
      const obj = JSON.parse(t);
      return { ok: obj };
    } catch (e) { return { error: 'Nie udało się odczytać oceny Gemini.', raw: res.text }; }
  },

  // OFFLINE ocena „wzorcem" — gdy Gemini niedostępny (brak klucza / wyczerpany limit).
  // Liczy pokrycie kluczowych pojęć z wzorca w odpowiedzi studenta (porównanie rdzeni słów).
  // To tylko ORIENTACYJNA wskazówka — ostateczną ocenę robi student, porównując z wzorcem.
  localGrade(model, userAnswer) {
    const STOP = new Set(('i oraz lub ale w we z ze na do od po za o u to jest są być co czy że gdy bo bez przy dla nad pod jako także też przez się nie tak jak ich jego jej ten ta te tym tej aby albo czyli np itp itd który która które gdzie kiedy ponieważ więc oznacza odpowiedź pytanie student komisja').split(' '));
    const norm = s => (s || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/[^a-ząćęłńóśźż0-9 ]/gi, ' ');
    const stem = w => (w.length > 6 ? w.slice(0, 6) : w);
    const words = s => norm(s).split(/\s+/).filter(w => w.length >= 5 && !STOP.has(w));
    // klucze z wzorca: najpierw pogrubione pojęcia, potem znaczące słowa
    const bolds = (String(model).match(/<(?:b|strong)>(.*?)<\/(?:b|strong)>/gi) || []).map(x => x.replace(/<[^>]+>/g, ''));
    let keys = [];
    bolds.forEach(b => words(b).forEach(w => keys.push(w)));
    if (keys.length < 4) keys = keys.concat(words(model));
    const seen = new Set(), uniq = [];
    keys.forEach(w => { const st = stem(w); if (!seen.has(st)) { seen.add(st); uniq.push(w); } });
    const top = uniq.slice(0, 16);
    const userStems = new Set(words(userAnswer).map(stem));
    const matched = top.filter(w => userStems.has(stem(w)));
    const missing = top.filter(w => !userStems.has(stem(w))).slice(0, 7);
    const score = top.length ? Math.round(100 * matched.length / top.length) : 0;
    return { score, matched: matched.length, total: top.length, missing };
  }
};
