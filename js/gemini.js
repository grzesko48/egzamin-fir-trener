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
  }
};
