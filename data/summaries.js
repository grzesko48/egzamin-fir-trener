/* summaries.js — streszczenia rozdziałów (pytania egzaminacyjne z wzorcowymi odpowiedziami).
   Dostępne w hubie POD OGNISKIEM dopiero po pokonaniu bossa danego działu.
   Wyjątek: 'fundament' ma alwaysUnlocked:true (dostępne od startu).
   Bramka (do wpięcia w render huba):
     const unlocked = SUM.alwaysUnlocked || (Store._data.bossDefeated && Store._data.bossDefeated[chapterId]);
   Typy pytań: 'definicyjne' | 'obliczeniowe' | 'porownawcze' | 'pulapka'. */
window.SUMMARIES = {
  fundament: {
    title: 'Fundamenty finansów',
    alwaysUnlocked: true,
    questions: [
      { type: 'definicyjne', q: 'Czym jest wartość pieniądza w czasie (TVM)? Podaj wzory na FV i PV.',
        a: 'Złotówka dziś jest warta więcej niż złotówka jutro, bo można ją zainwestować i da odsetki. Wartość przyszła: FV = PV·(1+r)ⁿ; wartość bieżąca (dyskontowanie): PV = FV/(1+r)ⁿ, gdzie r to stopa, n — liczba okresów. Przykład: 1000 zł na 10% przez 2 lata → FV = 1000·1,1² = 1210 zł.' },
      { type: 'obliczeniowe', q: 'Wpłacasz 2000 zł na 10% rocznie (procent składany). Ile po 2 latach?',
        a: 'FV = PV·(1+r)ⁿ = 2000·(1,10)² = 2000·1,21 = 2420 zł. Odsetki składane: 420 zł (przy prostym byłoby 400 zł — różnica 20 zł to odsetki od odsetek).' },
      { type: 'porownawcze', q: 'Procent prosty vs składany — czym się różnią?',
        a: 'Prosty: odsetki tylko od kapitału początkowego (FV = PV·(1+r·n)). Składany: odsetki też od narosłych odsetek (FV = PV·(1+r)ⁿ) — rośnie wykładniczo. Im dłuższy horyzont i wyższa stopa, tym większa przewaga składanego.' },
      { type: 'pulapka', q: 'Najczęstszy błąd przy dyskontowaniu wielu przepływów?',
        a: 'Dyskontowanie wszystkich CF tą samą liczbą lat. Każdy przepływ dyskontuje się o LICZBĘ OKRESÓW do niego: CF₁/(1+r)¹, CF₂/(1+r)², itd. NPV = Σ CFₜ/(1+r)ᵗ − I₀.' }
    ]
  },

  // Przykład działu odblokowywanego po bossie (Ryzyko rynkowe / VaR).
  ryzyko_rynkowe: {
    title: 'Ryzyko rynkowe — Value at Risk (VaR)',
    bossId: 'var',
    questions: [
      { type: 'definicyjne', q: 'Czym jest Value at Risk (VaR)? Podaj definicję, trzy parametry oraz interpretację.',
        a: 'VaR to maksymalna oczekiwana strata wartości portfela w zadanym horyzoncie czasowym, która nie zostanie przekroczona z określonym prawdopodobieństwem (poziomem ufności). Wymaga trzech parametrów: poziomu ufności (np. 95% lub 99%), horyzontu czasowego (np. 1 dzień, 10 dni) oraz waluty pomiaru. Interpretacja: 1-dniowy VaR = 1 mln zł przy 99% oznacza, że w ciągu jednego dnia z prawdopodobieństwem 99% strata nie przekroczy 1 mln zł (średnio 1 dzień na 100 strata będzie większa). VaR mierzy więc kwantyl rozkładu strat, a nie stratę przeciętną.' },
      { type: 'obliczeniowe', q: 'Portfel 10 mln zł, dzienna zmienność (σ) 1,5%. Oblicz 1-dniowy VaR przy 99%, potem przeskaluj na 10 dni.',
        a: 'Metoda parametryczna: VaR = wartość·z·σ. Kwantyl 99% rozkładu normalnego: z = 2,326. VaR(1d) = 10 000 000·2,326·0,015 = 348 900 zł (ok. 349 tys. zł). Skalowanie regułą √czasu: VaR(10d) = VaR(1d)·√10 = 348 900·3,162 = 1 103 200 zł (ok. 1,10 mln zł). Dla 95% z = 1,645.' },
      { type: 'porownawcze', q: 'Porównaj trzy metody wyznaczania VaR: wariancji-kowariancji, symulacji historycznej i Monte Carlo.',
        a: 'Wariancja-kowariancja (parametryczna): zakłada normalność i liniowość pozycji; zaleta — prosta i szybka, wada — zaniża ryzyko przy grubych ogonach i źle obsługuje opcje (nieliniowość). Symulacja historyczna: stosuje rzeczywiste zmiany czynników ryzyka, bez założenia o rozkładzie; zaleta — uwzględnia faktyczne grube ogony, wada — zależna od danych, zakłada że przeszłość reprezentuje przyszłość. Monte Carlo: generuje losowe scenariusze z modelu; zaleta — radzi sobie z opcjami i dowolnymi rozkładami, wada — kosztowna obliczeniowo i wrażliwa na błąd specyfikacji modelu.' },
      { type: 'pulapka', q: 'Dlaczego VaR nie jest pełną miarą ryzyka i czym różni się Expected Shortfall (CVaR)?',
        a: 'VaR mówi tylko o progu straty, ale NIC o tym, jak duża będzie strata, gdy ten próg zostanie przekroczony (ignoruje ogon poza kwantylem). Wady: (1) VaR nie jest miarą koherentną — nie spełnia subaddytywności, więc VaR portfela może być większy od sumy VaR składników, co zaprzecza dywersyfikacji; (2) niedoszacowuje ryzyka katastroficznych zdarzeń w ogonie. Expected Shortfall (CVaR) to średnia strata WARUNKOWA pod warunkiem przekroczenia VaR — jest koherentny i lepiej opisuje ogon, dlatego Bazylea (FRTB) przesunęła wymóg kapitałowy z VaR 99% na ES 97,5%.' }
    ]
  }
};
