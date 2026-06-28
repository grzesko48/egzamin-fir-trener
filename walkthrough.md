# ⚔️ FiR Trener: Kompletny Upgrade Wizualny i Mechaniczny V5 (AAAA) 🛡️

Zaimplementowaliśmy kompletny, bezlitosny mechanizm rozgrywki inspirowany grami z serii **Dark Souls** oraz przebudowaliśmy układ interfejsu na wzór **trójkolumnowego podziału kognitywnego** z gier RPG takich jak *Baldur's Gate 3*.

---

## 🎨 Nowości Wizualne i Układ Ekranu (AAAA Grid Layout):

### 1. 📐 Dynamiczny 3-Kolumnowy Layout
Ekran aplikacji został podzielony na trzy wyspecjalizowane kolumny:
*   **Kolumna Lewa (310px)**: Karta Postaci (portret klasy, statystyki HP/Energia/Dusze oraz slots na ekwipunek).
*   **Kolumna Środkowa (1fr)**: Główny teatr kampanii (lista lekcji, starcia z bossami, zadania).
*   **Kolumna Prawa (340px)**: Ognisko Ocalenia oraz Zjawy Pamięciowe (Powtórki).
*   **Chowany Panel Profilu**: Użytkownik ma możliwość ukrycia lewego panelu za pomocą przycisku `👤 Ukryj profil` w nagłówku, aby uzyskać 100% szerokości środkowego ekranu na zadania dydaktyczne. Stan ten jest utrwalany w bazie danych.
*   **Skupienie na Walce**: Prawa kolumna (Ognisko) automatycznie ukrywa się podczas aktywnej lekcji lub walki z bossem.

### 2. 🌌 Cztery Dynamiczne Biomy i Fizyka Cząsteczek
Zamiast statycznego tła, wdrożyliśmy biomy dopasowane do bossa końcowego każdego działu:
*   **Zamek Bilansów (Castle)**: Szkarłatno-pomarańczowe iskry dryfujące ku górze z gorącymi nitkami ciepła.
*   **Złota Kopalnia (Mine)**: Złoto-bursztynowe iskierki migoczące w tle.
*   **Mroźne Szczyty (Snow)**: Płatki śniegu opadające na dół pod wpływem grawitacji (odwrócony wektor pionowy).
*   **Elfickie Ruiny (Forest)**: Szmaragdowe listki niesione silnym wiatrem w lewą stronę (wektor poziomy).

### 3. ⚔️ Średniowieczny Ekwipunek High-Fantasy (Dynamiczne SVGs)
Usunęliśmy nowoczesne/futurystyczne przedmioty, wprowadzając ikoniczne grafiki w locie generowane przez kod **inline SVG** z pięknymi poświatami i gradientami:
*   **Sygnet Analityka** (slot Sygnetu, dawniej Głowa) — daje +10% XP.
*   **Kostur Kalkulacji / Młot Kinetyczny / Grymuar Rynkowy** (slot Broni) — modyfikatory obrażeń bosa (1.1x / 1.2x) oraz duszy (1.1x / 1.2x).
*   **Zbroja Audytora / Pas Siły / Buty Finansisty** (slot Ubioru) — zwiększają max HP lub redukują obrażenia z błędów o 5 punktów.

### 4. 📊 Pomocnicze Wykresy i Wykresy Inline SVG
Podczas lekcji system automatycznie analizuje treść i wstrzykuje średniowiecznie stylizowane wykresy wektorowe SVG:
*   **Wykres CAPM (SML)**: Linia rynku papierów wartościowych, korelacja ryzyka (Beta) i zwrotu.
*   **Profil NPV**: Krzywa malejąca z zaznaczonym punktem przecięcia IRR (gdzy NPV = 0).
*   **Korytarz Stóp NBP**: Pokazuje sufit (Lombard), podłogę (Depozyt) i referencyjną stopę.
*   **Wykres WACC**: Przedstawia strukturę kapitału i Trade-off Theory długu.

---

## 💀 Pętla Rozgrywki Hardcore (Dark Souls):

### 1. 🔥 Ognisko (Bonfire) i System Awansu
*   **Odpoczynek przy Ognisku**: W pełni leczy HP i Energię, ale **wszystkie codzienne wyzwania natychmiast odradzają się na mapie**.
*   **Wydawanie Dusz (Level Up)**: Doświadczenie (XP) to teraz **Dusze (Souls)**. Musisz udać się do Ogniska i wydać dusze ręcznie, by awansować. Każdy poziom daje +5 Max HP.

### 2. 🟢 Plama Krwi (Bloodstain) i Strata Dusz
*   Gdy HP spadnie do 0, zobaczysz ekran **YOU DIED**.
*   Tracisz niewydane dusze — wypadają na mapie przy lekcji jako **Plama Krwi**.
*   Ukończ tę lekcję ponownie bezbłędnie, by je odzyskać. Kolejna śmierć niszczy starą plamę na zawsze.

### 3. ⚔️ Obrażenia (Hardcore Scaling)
*   Błędy na lekcjach zadają **35 HP** obrażeń.
*   Złe klocki Feynmana kosztują **40 HP**.
*   Niezaliczona metoda Blurtingu (<70%) zabiera **35 HP**.

---
### 🖥️ Podejmij wyzwanie:
Serwer czeka na Ciebie pod adresem:  
👉 **[http://localhost:8000](http://localhost:8000)**

Szczegółowy opis techniczny wdrożenia znajduje się w:  
👉 **[CLAUDE_HANDOFF.md](file:///C:/Users/grzes/Documents/Agents/ecosystem/apps/egzamin_app/CLAUDE_HANDOFF.md)**
