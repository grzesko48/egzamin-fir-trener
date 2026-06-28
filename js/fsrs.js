/* fsrs.js — Free Spaced Repetition Scheduler (model DSR, FSRS v4).
   Zastepuje heurystyke SM-2: modeluje Stability (S), Difficulty (D), Retrievability (R),
   celuje w 90% retencji, eliminuje "Ease Hell" (mean reversion trudnosci). Autor: Claude.
   API: FSRS.schedule(state, quality, nowMs) -> nowy state (zachowuje pola zgodne z UI). */
window.FSRS = (function () {
  // Domyslne wagi FSRS v4 (19 parametrow).
  const w = [0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234,
             1.616, 0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034, 0.6567];
  const DECAY = -0.5;
  const FACTOR = 19 / 81;          // = 0.9^(1/DECAY) - 1
  const TARGET_R = 0.9;            // docelowe prawdopodobienstwo przypomnienia
  const DAY = 24 * 60 * 60 * 1000;
  const clampD = d => Math.min(10, Math.max(1, d));
  const clampS = s => Math.max(0.1, s);

  // ocena 1..4 (again/hard/good/easy) z jakosci aplikacji (1/2/3/4/5)
  function gradeFromQuality(q) {
    if (q <= 2) return 1;     // znowu (blad)
    if (q === 3) return 2;    // trudne
    if (q === 4) return 3;    // dobre
    return 4;                 // latwe (q>=5)
  }

  const initStability = g => clampS(w[g - 1]);
  const initDifficulty = g => clampD(w[4] - (g - 3) * w[5]);

  // krzywa zapominania: R po t dniach przy stabilnosci S
  function retrievability(tDays, S) {
    return Math.pow(1 + FACTOR * tDays / S, DECAY);
  }
  // interwal dni dla docelowej retencji
  function intervalDays(S) {
    const i = (S / FACTOR) * (Math.pow(TARGET_R, 1 / DECAY) - 1);
    return Math.max(1, Math.round(i));
  }

  function nextDifficulty(D, g) {
    let d = D - w[6] * (g - 3);              // latwiejsza ocena -> mniejsza trudnosc
    d = w[7] * initDifficulty(3) + (1 - w[7]) * d;  // mean reversion (anty "Ease Hell")
    return clampD(d);
  }
  function nextStabilityRecall(D, S, R, g) {
    const hard = g === 2 ? w[15] : 1;
    const easy = g === 4 ? w[16] : 1;
    const inc = Math.exp(w[8]) * (11 - D) * Math.pow(S, -w[9]) * (Math.exp((1 - R) * w[10]) - 1) * hard * easy;
    return clampS(S * (1 + inc));
  }
  function nextStabilityLapse(D, S, R) {
    return clampS(w[11] * Math.pow(D, -w[12]) * (Math.pow(S + 1, w[13]) - 1) * Math.exp((1 - R) * w[14]));
  }

  // state: {stability, difficulty, last, reps, ...zachowane pola}; quality 1..5; nowMs = Date.now()
  function schedule(state, quality, nowMs) {
    const g = gradeFromQuality(quality);
    const s = Object.assign({}, state);
    const firstTime = !s.reps || s.stability == null || s.stability <= 0;

    let S, D;
    if (firstTime) {
      S = initStability(g);
      D = initDifficulty(g);
    } else {
      const elapsed = Math.max(0, (nowMs - (s.last || nowMs)) / DAY);
      const R = retrievability(elapsed, s.stability);
      D = nextDifficulty(s.difficulty || initDifficulty(3), g);
      S = (g === 1) ? nextStabilityLapse(D, s.stability, R) : nextStabilityRecall(D, s.stability, R, g);
    }

    const interval = intervalDays(S);
    s.stability = +S.toFixed(4);
    s.difficulty = +D.toFixed(4);
    s.reps = (s.reps || 0) + 1;
    s.last = nowMs;
    s.interval = interval;
    s.nextReview = nowMs + interval * DAY;
    // pola zgodnosci z UI (SM-2): efactor ~ malejaca z trudnoscia (do wyswietlenia)
    s.efactor = +(1.3 + (10 - D) / 10 * 1.4).toFixed(2);  // 1.3..2.7
    return s;
  }

  return { schedule, gradeFromQuality, intervalDays, retrievability, _w: w };
})();
