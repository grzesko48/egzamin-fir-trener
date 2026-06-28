# EgzaminFiR — Trener V2 (Poziom 2026)

Kinowe doświadczenie edukacyjne zaprojektowane w celu maksymalizacji przyswajalności materiału do egzaminu licencjackiego z Finansów i Rachunkowości.

## 🚀 Instalacja i Uruchamianie (PWA / Offline)

Aplikacja to prawdziwe PWA.
1. Otwórz `index.html` na serwerze (np. `python -m http.server 8000`).
2. Wejdź przez przeglądarkę pod adres `http://localhost:8000/index.html`.
3. Na dolnym ekranie powinieneś ujrzeć powiadomienie "Zainstaluj jako PWA" (bądź opcję instalacji w pasku adresu). Po instalacji aplikacja może działać całkowicie offline z poziomu pulpitu.

*Wskazówka:* Jeśli pracujesz bez serwera (z dysku przez `file://`), CORS zablokuje zapytania do `content.json`. Obejście jest zaimplementowane: odkomentuj w kodzie `<script src="data/content.js"></script>`, i przekształć JSON w zmienną `window.CONTENT = {...}`.

## 🌟 Funkcje V2
- **Animacje Kinowe:** Pełen rendering sieci/cząsteczek (Canvas) z integrowanymi bibliotekami **GSAP** i **ScrollTrigger** (smooth scroll, 3D flip na fiszkach).
- **Zintegrowany Algorytm SM-2:** Zapomnij o prostym modelu pudełkowym. Fiszki skalują interwały powtórek na podstawie wyliczanych wartości E-Factor. Aplikacja wspiera przesuwanie palcem (Swipe L/R) oraz klawiaturę numeryczną (1/2/3).
- **Tryb Symulacji Egzaminu:** Rozwiąż wybrane pytania z timerem zliczającym w tył od 30 minut, a na koniec przejrzyj poprawne warianty.
- **Odświeżony Dashboard:** Zintegrowana Heatmapa nawyków (niczym w serwisie GitHub) oraz responsywne okręgi SVG.
- **Analityka i Ekstrakcja Wiedzy:** Izolowane widoki na statystyki wiedzy wg algorytmu E-Factor oraz widok na haczyki od komisji egzaminacyjnej.

## TODO dla Claude:
*   [ ] Wygenerować oraz wgrać ikony w katalogu `assets/` o wymiarach `icon-192.png` oraz `icon-512.png` celem w pełni instalowalnego modułu PWA (obecnie pliki PWA wywołają kod błędu 404 w konsoli dla ikon).
*   [ ] Zoptymalizować/skrócić objętości wielkich bloków tekstowych w zrzutach z rozdziałów dla lepszego wyświetlania na mobile (zależy od `content.json`).

---
## ✅ Integracja Claude (zrobione)
- Wygenerowane **ikony PWA** (`assets/icon-192.png`, `icon-512.png`) — koniec 404.
- Wpięte **pełne dane** `data/content.json` + `data/content.js` (271 fiszek, 108 pytań, 26 rozdziałów, plan 7 dni).
- **Naprawiony krytyczny bug:** moduły to `const`, więc nie były na `window`; `app.js` robił `if(window.Module)` → żaden moduł nie dostawał danych (fiszki/dashboard puste). Zmienione na `typeof Module!=='undefined'`. Po fixie: fiszki 271 w kolejce, dashboard renderuje, SM-2 działa.
- Bump cache SW do `v3` (invalidacja starej wersji).
