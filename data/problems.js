/* problems.js — generatory zadan liczbowych dla Trybu „Zadania".
   ⛔⛔ ANTIGRAVITY: NIE NADPISUJ TEGO PLIKU. To dane Claude (kontrakt). Buduj UI/silnik, nie ruszaj data/*.
   Kazdy item: {id, chapter, title, gen} gdzie gen() -> {question, answer, tol, unit, solution}.
   Liczby losowane w przegladarce (Math.random OK). Wzory renderuje KaTeX ($...$). Autor: Claude. */
(function () {
  const R = (min, max, step) => { const n = Math.round((min + Math.random() * (max - min)) / step) * step; return +n.toFixed(6); };
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const m = x => x.toLocaleString('pl-PL');           // separator tysiecy
  const p2 = x => (Math.round(x * 100) / 100).toFixed(2);

  const PROBLEMS = [
    { id: 'var1', chapter: 't1', title: 'VaR parametryczny (1 dzien)',
      gen() {
        const V = R(1, 20, 1) * 1e6, sg = R(0.5, 3, 0.1), c = pick([[95, 1.645], [99, 2.326]]);
        const ans = c[1] * (sg / 100) * V;
        return { question: `Portfel ma wartosc $V = ${m(V)}$ zl, dzienna zmiennosc $\\sigma = ${sg}\\%$. Policz 1-dniowy VaR przy ${c[0]}% ufnosci ($z=${c[1]}$). Podaj w zl.`,
          answer: Math.round(ans), tol: Math.max(1, ans * 0.005), unit: 'zl',
          solution: `$VaR = z \\cdot \\sigma \\cdot V = ${c[1]} \\cdot ${sg / 100} \\cdot ${m(V)} = ${m(Math.round(ans))}$ zl.<br>gdzie $z$ — kwantyl normalny (${c[0]}% → ${c[1]}), $\\sigma$ — zmiennosc dzienna, $V$ — wartosc pozycji.` };
      } },
    { id: 'var10', chapter: 't1', title: 'VaR — skalowanie na 10 dni',
      gen() {
        const v1 = R(20, 400, 5) * 1000, ans = v1 * Math.sqrt(10);
        return { question: `1-dniowy VaR wynosi $${m(v1)}$ zl. Policz VaR 10-dniowy (regula pierwiastka czasu).`,
          answer: Math.round(ans), tol: Math.max(1, ans * 0.005), unit: 'zl',
          solution: `$VaR_{10} = VaR_1 \\cdot \\sqrt{10} = ${m(v1)} \\cdot 3{,}162 = ${m(Math.round(ans))}$ zl. Czas skaluje sie przez $\\sqrt{t}$, nie $\\times t$.` };
      } },
    { id: 'el', chapter: 't2', title: 'Strata oczekiwana EL',
      gen() {
        const EAD = R(100, 2000, 50) * 1000, PD = R(1, 10, 0.5), LGD = R(20, 80, 5);
        const ans = (PD / 100) * (LGD / 100) * EAD;
        return { question: `Kredyt: ekspozycja $EAD = ${m(EAD)}$ zl, $PD = ${PD}\\%$, $LGD = ${LGD}\\%$. Policz strate oczekiwana $EL$ (zl).`,
          answer: Math.round(ans), tol: Math.max(1, ans * 0.01), unit: 'zl',
          solution: `$EL = PD \\cdot LGD \\cdot EAD = ${PD / 100} \\cdot ${LGD / 100} \\cdot ${m(EAD)} = ${m(Math.round(ans))}$ zl.<br>Zabezpieczenie obniza $LGD$, nie $PD$.` };
      } },
    { id: 'wacc', chapter: 'k6', title: 'WACC',
      gen() {
        const E = R(40, 80, 5), D = 100 - E, re = R(9, 16, 0.5), rd = R(4, 9, 0.5), T = 19;
        const ans = (E / 100) * re + (D / 100) * rd * (1 - T / 100);
        return { question: `Kapital wlasny $E = ${E}\\%$ (koszt $${re}\\%$), dlug $D = ${D}\\%$ (koszt $${rd}\\%$), podatek $T = ${T}\\%$. Policz WACC (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$WACC = \\frac{E}{V}r_e + \\frac{D}{V}r_d(1-T) = ${E / 100}\\cdot${re} + ${D / 100}\\cdot${rd}\\cdot${(1 - T / 100)} = ${p2(ans)}\\%$.<br>Tarcza podatkowa $(1-T)$ TYLKO przy dlugu.` };
      } },
    { id: 'capm', chapter: 'k6', title: 'CAPM — koszt kapitalu wlasnego',
      gen() {
        const rf = R(2, 5, 0.5), beta = R(0.6, 1.8, 0.1), erp = R(4, 6, 0.5);
        const ans = rf + beta * erp;
        return { question: `Stopa wolna od ryzyka $r_f = ${rf}\\%$, $\\beta = ${beta}$, premia rynkowa $(r_m - r_f) = ${erp}\\%$. Policz koszt kapitalu wlasnego $r_e$ (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$r_e = r_f + \\beta(r_m - r_f) = ${rf} + ${beta}\\cdot${erp} = ${p2(ans)}\\%$.<br>$\\beta$ mierzy ryzyko systematyczne (rynkowe).` };
      } },
    { id: 'bep', chapter: 'k4', title: 'Prog rentownosci (BEP)',
      gen() {
        const KS = R(60, 300, 10) * 1000, cena = R(40, 200, 10), kz = R(15, cena - 15, 5);
        const ans = KS / (cena - kz);
        return { question: `Koszty stale $${m(KS)}$ zl, cena $${cena}$ zl/szt., koszt zmienny jedn. $${kz}$ zl. Policz prog rentownosci BEP (szt.).`,
          answer: Math.round(ans), tol: 1, unit: 'szt.',
          solution: `Marza pokrycia $= ${cena} - ${kz} = ${cena - kz}$ zl. $BEP = \\frac{KS}{cena - kz} = \\frac{${m(KS)}}{${cena - kz}} = ${m(Math.round(ans))}$ szt.` };
      } },
    { id: 'npv', chapter: 'k5', title: 'NPV inwestycji (3 lata)',
      gen() {
        const I0 = R(50, 200, 10) * 1000, r = R(5, 12, 1) / 100;
        const cf = [R(20, 120, 10) * 1000, R(20, 120, 10) * 1000, R(20, 120, 10) * 1000];
        let pv = 0; cf.forEach((c, i) => pv += c / Math.pow(1 + r, i + 1));
        const ans = pv - I0;
        return { question: `Naklad $I_0 = ${m(I0)}$ zl. Przeplywy: rok1 $${m(cf[0])}$, rok2 $${m(cf[1])}$, rok3 $${m(cf[2])}$ zl. Stopa $r = ${r * 100}\\%$. Policz NPV (zl).`,
          answer: Math.round(ans), tol: Math.max(1, Math.abs(ans) * 0.01) + 5, unit: 'zl',
          solution: `$NPV = \\sum \\frac{CF_t}{(1+r)^t} - I_0 = ${m(Math.round(ans))}$ zl. ${ans >= 0 ? 'NPV>0 → oplacalna.' : 'NPV<0 → nieoplacalna.'}` };
      } },
    { id: 'bond', chapter: 't5', title: 'Cena obligacji',
      gen() {
        const N = 1000, cpn = R(3, 8, 0.5), r = R(3, 9, 0.5), n = R(2, 5, 1);
        const C = N * cpn / 100; let pv = 0;
        for (let t = 1; t <= n; t++) pv += C / Math.pow(1 + r / 100, t);
        pv += N / Math.pow(1 + r / 100, n);
        return { question: `Obligacja: nominal $${m(N)}$ zl, kupon $${cpn}\\%$ rocznie, $${n}$ lat, stopa dyskontowa $${r}\\%$. Policz cene (zl).`,
          answer: +pv.toFixed(2), tol: 1, unit: 'zl',
          solution: `Kupon $C = ${C}$ zl. $P = \\sum_{t=1}^{${n}} \\frac{${C}}{(1+${r / 100})^t} + \\frac{${m(N)}}{(1+${r / 100})^{${n}}} = ${pv.toFixed(2)}$ zl.` };
      } },
    { id: 'gordon', chapter: 't5', title: 'Wycena akcji — model Gordona',
      gen() {
        const D1 = R(2, 8, 0.5), r = R(9, 16, 1), g = R(1, 5, 1);
        const ans = D1 / ((r - g) / 100);
        return { question: `Dywidenda za rok $D_1 = ${D1}$ zl, koszt kapitalu $r = ${r}\\%$, wzrost $g = ${g}\\%$. Wycen akcje (model Gordona, zl).`,
          answer: +ans.toFixed(2), tol: 0.2, unit: 'zl',
          solution: `$P = \\frac{D_1}{r - g} = \\frac{${D1}}{${r / 100} - ${g / 100}} = ${ans.toFixed(2)}$ zl. Warunek: $r > g$.` };
      } },
    { id: 'forward', chapter: 't10', title: 'Kurs forward (parytet stop)',
      gen() {
        const S = R(3.5, 4.8, 0.05), rd = R(3, 7, 0.5), rf = R(1, 5, 0.5), t = pick([0.25, 0.5, 1]);
        const F = S * (1 + rd / 100 * t) / (1 + rf / 100 * t);
        const months = t * 12;
        return { question: `Kurs spot $S = ${p2(S)}$, stopa krajowa $${rd}\\%$, zagraniczna $${rf}\\%$, horyzont $${months}$ mies. Policz kurs forward $F$ (parytet stop).`,
          answer: +F.toFixed(4), tol: 0.005, unit: '',
          solution: `$F = S \\cdot \\frac{1 + r_{kraj}\\cdot t}{1 + r_{zagr}\\cdot t} = ${p2(S)} \\cdot \\frac{1 + ${rd / 100}\\cdot${t}}{1 + ${rf / 100}\\cdot${t}} = ${F.toFixed(4)}$. Waluta o wyzszej stopie jest na forward slabsza.` };
      } },
    { id: 'variance', chapter: 'k4', title: 'Analiza odchylen (cena)',
      gen() {
        const qp = R(1000, 3000, 100), pp = R(8, 20, 1), qa = qp + R(-300, 300, 50), pa = pp + R(-3, 3, 1);
        const odchCeny = (pa - pp) * qa;
        return { question: `Plan: $${m(qp)}$ szt. x $${pp}$ zl. Wykonanie: $${m(qa)}$ szt. x $${pa}$ zl. Policz odchylenie CENY (zl).`,
          answer: Math.round(odchCeny), tol: 1, unit: 'zl',
          solution: `Odchylenie ceny $= (cena_{rzecz} - cena_{plan}) \\cdot ilosc_{rzecz} = (${pa} - ${pp}) \\cdot ${m(qa)} = ${m(Math.round(odchCeny))}$ zl. ${odchCeny <= 0 ? '(korzystne dla kosztu)' : '(niekorzystne dla kosztu)'}` };
      } },
    { id: 'duration', chapter: 't1', title: 'Ryzyko stopy — zmiana ceny obligacji',
      gen() {
        const P = 1000, Dm = R(3, 7, 0.5), bp = pick([50, 100, 150]), sign = pick([1, -1]);
        const dy = sign * bp / 10000, dP = -Dm * dy * P;
        return { question: `Obligacja o cenie $${m(P)}$ zl, duracja modyfikowana $D_{mod} = ${Dm}$. Stopa zmienia sie o $${sign > 0 ? '+' : '-'}${bp}$ pb. Policz zmiane ceny (zl).`,
          answer: Math.round(dP), tol: 1, unit: 'zl',
          solution: `$\\Delta P \\approx -D_{mod} \\cdot \\Delta y \\cdot P = -${Dm} \\cdot ${dy} \\cdot ${m(P)} = ${m(Math.round(dP))}$ zl. Wzrost stop → spadek ceny (i odwrotnie).` };
      } },
    { id: 'roe', chapter: 'k3', title: 'Rentownosc kapitalu wlasnego (ROE)',
      gen() {
        const NI = R(50, 500, 10) * 1000, E = R(500, 3000, 100) * 1000;
        const ans = NI / E * 100;
        return { question: `Zysk netto $${m(NI)}$ zl, kapital wlasny $${m(E)}$ zl. Policz ROE (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$ROE = \\frac{zysk\\ netto}{kapital\\ wlasny} = \\frac{${m(NI)}}{${m(E)}} = ${p2(ans)}\\%$. Mierzy zwrot dla wlascicieli.` };
      } },
    { id: 'roa', chapter: 'k3', title: 'Rentownosc aktywow (ROA)',
      gen() {
        const NI = R(50, 500, 10) * 1000, A = R(1000, 6000, 100) * 1000;
        const ans = NI / A * 100;
        return { question: `Zysk netto $${m(NI)}$ zl, aktywa razem $${m(A)}$ zl. Policz ROA (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$ROA = \\frac{zysk\\ netto}{aktywa} = \\frac{${m(NI)}}{${m(A)}} = ${p2(ans)}\\%$. Efektywnosc calego majatku.` };
      } },
    { id: 'margin', chapter: 'k3', title: 'Marza zysku netto',
      gen() {
        const NI = R(40, 400, 10) * 1000, S = R(1000, 5000, 100) * 1000;
        const ans = NI / S * 100;
        return { question: `Zysk netto $${m(NI)}$ zl, przychody ze sprzedazy $${m(S)}$ zl. Policz marze zysku netto (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$marza\\ netto = \\frac{zysk\\ netto}{przychody} = \\frac{${m(NI)}}{${m(S)}} = ${p2(ans)}\\%$. Ile grosza zysku z 1 zl sprzedazy.` };
      } },
    { id: 'current', chapter: 'k7', title: 'Plynnosc biezaca',
      gen() {
        const AO = R(200, 1500, 50) * 1000, ZK = R(100, 900, 50) * 1000;
        const ans = AO / ZK;
        return { question: `Aktywa obrotowe $${m(AO)}$ zl, zobowiazania krotkoterminowe $${m(ZK)}$ zl. Policz wskaznik plynnosci biezacej.`,
          answer: +ans.toFixed(2), tol: 0.02, unit: '',
          solution: `$CR = \\frac{aktywa\\ obrotowe}{zob.\\ krotkoterm.} = \\frac{${m(AO)}}{${m(ZK)}} = ${ans.toFixed(2)}$. Norma ok. 1,2-2,0.` };
      } },
    { id: 'ccc', chapter: 'k7', title: 'Cykl konwersji gotowki',
      gen() {
        const DIO = R(20, 90, 5), DSO = R(15, 75, 5), DPO = R(20, 80, 5);
        const ans = DIO + DSO - DPO;
        return { question: `Rotacja zapasow $${DIO}$ dni, naleznosci $${DSO}$ dni, zobowiazania $${DPO}$ dni. Policz cykl konwersji gotowki (dni).`,
          answer: ans, tol: 0, unit: 'dni',
          solution: `$CKG = DIO + DSO - DPO = ${DIO} + ${DSO} - ${DPO} = ${ans}$ dni. Im krocej, tym mniej kapitalu zamrozonego.` };
      } },
    { id: 'fv', chapter: 'k5', title: 'Przyszla wartosc (procent skladany)',
      gen() {
        const PV = R(1, 100, 1) * 1000, r = R(2, 10, 0.5), n = R(2, 15, 1);
        const ans = PV * Math.pow(1 + r / 100, n);
        return { question: `Wplacasz $${m(PV)}$ zl na $${n}$ lat, oprocentowanie $${r}\\%$ rocznie (kapitalizacja roczna). Policz przyszla wartosc (zl).`,
          answer: +ans.toFixed(2), tol: Math.max(1, ans * 0.005), unit: 'zl',
          solution: `$FV = PV(1+r)^n = ${m(PV)} \\cdot (1+${r / 100})^{${n}} = ${m(+ans.toFixed(2))}$ zl. Procent skladany: odsetki od odsetek.` };
      } },
    { id: 'pv', chapter: 'k5', title: 'Wartosc biezaca (dyskontowanie)',
      gen() {
        const FV = R(10, 100, 1) * 1000, r = R(3, 10, 0.5), n = R(2, 10, 1);
        const ans = FV / Math.pow(1 + r / 100, n);
        return { question: `Chcesz miec $${m(FV)}$ zl za $${n}$ lat, stopa $${r}\\%$. Ile musisz wplacic dzis (wartosc biezaca, zl)?`,
          answer: +ans.toFixed(2), tol: Math.max(1, ans * 0.005), unit: 'zl',
          solution: `$PV = \\frac{FV}{(1+r)^n} = \\frac{${m(FV)}}{(1+${r / 100})^{${n}}} = ${m(+ans.toFixed(2))}$ zl. Dyskontowanie sprowadza przyszlosc do dzis.` };
      } },
    { id: 'annuity', chapter: 'k5', title: 'Rata kredytu (annuita)',
      gen() {
        const K = R(10, 300, 10) * 1000, nom = R(4, 12, 0.5), yrs = R(2, 10, 1);
        const i = nom / 100 / 12, N = yrs * 12;
        const ans = K * i / (1 - Math.pow(1 + i, -N));
        return { question: `Kredyt $${m(K)}$ zl, oprocentowanie nominalne $${nom}\\%$ rocznie, $${yrs}$ lat, raty rowne miesieczne. Policz wysokosc raty (zl).`,
          answer: +ans.toFixed(2), tol: 1, unit: 'zl',
          solution: `$rata = K \\cdot \\frac{i}{1-(1+i)^{-N}}$, gdzie $i=\\frac{${nom}\\%}{12}=${(i).toFixed(5)}$, $N=${N}$. Rata $= ${m(+ans.toFixed(2))}$ zl.` };
      } },
    { id: 'ear', chapter: 'k5', title: 'Efektywna stopa roczna (EAR)',
      gen() {
        const nom = R(6, 18, 1), mm = pick([2, 4, 12]);
        const ans = (Math.pow(1 + nom / 100 / mm, mm) - 1) * 100;
        const nazwa = { 2: 'polroczna', 4: 'kwartalna', 12: 'miesieczna' }[mm];
        return { question: `Stopa nominalna $${nom}\\%$ rocznie, kapitalizacja ${nazwa} ($m=${mm}$). Policz efektywna stope roczna EAR (%).`,
          answer: +p2(ans), tol: 0.03, unit: '%',
          solution: `$EAR = (1+\\frac{r_{nom}}{m})^m - 1 = (1+\\frac{${nom / 100}}{${mm}})^{${mm}} - 1 = ${p2(ans)}\\%$. Czestsza kapitalizacja → wyzsza EAR.` };
      } },
    { id: 'fisher', chapter: 'k12', title: 'Realna stopa procentowa (Fisher)',
      gen() {
        const nom = R(4, 12, 0.5), inf = R(1, 8, 0.5);
        const ans = ((1 + nom / 100) / (1 + inf / 100) - 1) * 100;
        return { question: `Stopa nominalna $${nom}\\%$, inflacja $${inf}\\%$. Policz realna stope procentowa (rownanie Fishera, %).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$1+r_{real} = \\frac{1+r_{nom}}{1+inflacja} \\Rightarrow r_{real} = \\frac{1+${nom / 100}}{1+${inf / 100}} - 1 = ${p2(ans)}\\%$. Uproszczenie: $r_{real} \\approx r_{nom} - inflacja$.` };
      } },
    { id: 'putcall', chapter: 't12', title: 'Parytet put-call',
      gen() {
        const S = R(80, 200, 5), K = R(80, 200, 5), r = R(2, 8, 0.5), t = pick([0.25, 0.5, 1]);
        const PVK = K / (1 + r / 100 * t);
        const TV = R(1, 12, 0.5);
        const C = +(Math.max(S - PVK, 0) + TV).toFixed(2);
        const ans = C + PVK - S;
        return { question: `Akcja $S=${S}$ zl, cena wykonania $K=${K}$ zl, stopa $r=${r}\\%$, czas $t=${t}$ roku. Cena calla $C=${C}$ zl. Policz cene puta $P$ (parytet put-call, zl).`,
          answer: +ans.toFixed(2), tol: 0.1, unit: 'zl',
          solution: `Parytet: $C + \\frac{K}{1+rt} = P + S \\Rightarrow P = C + \\frac{K}{1+rt} - S = ${C} + \\frac{${K}}{1+${r / 100}\\cdot${t}} - ${S} = ${ans.toFixed(2)}$ zl.` };
      } },
    { id: 'altman', chapter: 'k3', title: 'Altman Z-score',
      gen() {
        const X1 = R(0.05, 0.40, 0.01), X2 = R(0.05, 0.40, 0.01), X3 = R(0.02, 0.25, 0.01), X4 = R(0.2, 2.0, 0.1), X5 = R(0.5, 2.0, 0.1);
        const ans = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 1.0 * X5;
        const ocena = ans > 2.99 ? 'strefa bezpieczna' : (ans < 1.81 ? 'strefa zagrozenia' : 'strefa szara');
        return { question: `Wskazniki: $X_1=${X1}$, $X_2=${X2}$, $X_3=${X3}$, $X_4=${X4}$, $X_5=${X5}$. Policz Altman $Z = 1{,}2X_1+1{,}4X_2+3{,}3X_3+0{,}6X_4+1{,}0X_5$.`,
          answer: +ans.toFixed(2), tol: 0.05, unit: '',
          solution: `$Z = ${ans.toFixed(2)}$ → ${ocena}. Progi: $>2{,}99$ bezpieczna, $<1{,}81$ zagrozenia.` };
      } },
    { id: 'divyield', chapter: 't5', title: 'Stopa dywidendy',
      gen() {
        const DPS = R(1, 10, 0.5), price = R(20, 200, 5);
        const ans = DPS / price * 100;
        return { question: `Dywidenda na akcje $${DPS}$ zl, cena akcji $${price}$ zl. Policz stope dywidendy (%).`,
          answer: +p2(ans), tol: 0.03, unit: '%',
          solution: `$stopa\\ dyw. = \\frac{DPS}{cena} = \\frac{${DPS}}{${price}} = ${p2(ans)}\\%$. Roczny dochod z dywidendy wzgledem ceny.` };
      } },
    { id: 'payback', chapter: 'k5', title: 'Okres zwrotu (payback)',
      gen() {
        const I0 = R(50, 300, 10) * 1000, CF = R(20, 100, 5) * 1000;
        const ans = I0 / CF;
        return { question: `Naklad $I_0 = ${m(I0)}$ zl, rowne roczne przeplywy $${m(CF)}$ zl. Policz prosty okres zwrotu (lata).`,
          answer: +ans.toFixed(2), tol: 0.05, unit: 'lat',
          solution: `$okres\\ zwrotu = \\frac{I_0}{CF} = \\frac{${m(I0)}}{${m(CF)}} = ${ans.toFixed(2)}$ lat. Nie uwzglednia wartosci pieniadza w czasie (wada).` };
      } },
    { id: 'pi', chapter: 'k5', title: 'Wskaznik rentownosci (PI)',
      gen() {
        const I0 = R(50, 200, 10) * 1000, r = R(5, 12, 1) / 100;
        const cf = [R(30, 120, 10) * 1000, R(30, 120, 10) * 1000, R(30, 120, 10) * 1000];
        let pv = 0; cf.forEach((c, i) => pv += c / Math.pow(1 + r, i + 1));
        const ans = pv / I0;
        return { question: `Naklad $I_0 = ${m(I0)}$ zl. Przeplywy: $${m(cf[0])}$, $${m(cf[1])}$, $${m(cf[2])}$ zl, stopa $${r * 100}\\%$. Policz wskaznik rentownosci PI.`,
          answer: +ans.toFixed(2), tol: 0.02, unit: '',
          solution: `$PI = \\frac{PV\\ wplywow}{I_0} = \\frac{${m(Math.round(pv))}}{${m(I0)}} = ${ans.toFixed(2)}$. ${ans >= 1 ? 'PI>1 → przyjac.' : 'PI<1 → odrzucic.'}` };
      } },
    { id: 'perpetuity', chapter: 't5', title: 'Renta wieczysta (perpetuity)',
      gen() {
        const CF = R(1000, 20000, 500), r = R(3, 10, 0.5);
        const ans = CF / (r / 100);
        return { question: `Aktywo placi wieczyscie $${m(CF)}$ zl rocznie, stopa dyskontowa $${r}\\%$. Policz jego wartosc (renta wieczysta, zl).`,
          answer: Math.round(ans), tol: 1, unit: 'zl',
          solution: `$PV = \\frac{CF}{r} = \\frac{${m(CF)}}{${r / 100}} = ${m(Math.round(ans))}$ zl. Stala platnosc bez konca, dzielona przez stope.` };
      } },
    { id: 'dol', chapter: 'k4', title: 'Stopien dzwigni operacyjnej (DOL)',
      gen() {
        const MP = R(200, 900, 20) * 1000, KS = R(50, MP / 1000 - 50, 10) * 1000, EBIT = MP - KS;
        const ans = MP / EBIT;
        return { question: `Marza pokrycia (przychody - koszty zmienne) $= ${m(MP)}$ zl, koszty stale $= ${m(KS)}$ zl. Policz stopien dzwigni operacyjnej DOL.`,
          answer: +ans.toFixed(2), tol: 0.05, unit: '',
          solution: `$EBIT = ${m(MP)} - ${m(KS)} = ${m(EBIT)}$ zl. $DOL = \\frac{marza\\ pokrycia}{EBIT} = \\frac{${m(MP)}}{${m(EBIT)}} = ${ans.toFixed(2)}$. Tyle razy zmieni sie EBIT przy zmianie sprzedazy o 1%.` };
      } },
    { id: 'dfl', chapter: 'k6', title: 'Stopien dzwigni finansowej (DFL)',
      gen() {
        const EBIT = R(200, 900, 20) * 1000, ods = R(20, EBIT / 1000 * 0.6, 10) * 1000;
        const ans = EBIT / (EBIT - ods);
        return { question: `$EBIT = ${m(EBIT)}$ zl, odsetki $= ${m(ods)}$ zl. Policz stopien dzwigni finansowej DFL.`,
          answer: +ans.toFixed(2), tol: 0.05, unit: '',
          solution: `$DFL = \\frac{EBIT}{EBIT - odsetki} = \\frac{${m(EBIT)}}{${m(EBIT)} - ${m(ods)}} = ${ans.toFixed(2)}$. Dlug zwieksza wrazliwosc zysku netto.` };
      } },
    { id: 'dupont', chapter: 'k3', title: 'ROE — rozklad DuPonta',
      gen() {
        const ros = R(3, 12, 0.5), rot = R(0.5, 2.5, 0.1), mult = R(1.2, 3, 0.1);
        const ans = ros * rot * mult;
        return { question: `Marza netto $${ros}\\%$, rotacja aktywow $${rot}$, mnoznik kapitalowy $${mult}$. Policz ROE (DuPont, %).`,
          answer: +p2(ans), tol: 0.15, unit: '%',
          solution: `$ROE = marza \\cdot rotacja \\cdot mnoznik = ${ros}\\% \\cdot ${rot} \\cdot ${mult} = ${p2(ans)}\\%$. Trzy dzwignie: rentownosc, sprawnosc, zadluzenie.` };
      } },
    { id: 'eoq', chapter: 'k7', title: 'Ekonomiczna wielkosc zamowienia (EOQ)',
      gen() {
        const D = R(1000, 20000, 500), K = R(50, 500, 25), h = R(1, 20, 1);
        const ans = Math.sqrt(2 * D * K / h);
        return { question: `Roczny popyt $D=${m(D)}$ szt., koszt zlozenia zamowienia $K=${K}$ zl, koszt utrzymania $h=${h}$ zl/szt./rok. Policz EOQ (szt.).`,
          answer: Math.round(ans), tol: 2, unit: 'szt.',
          solution: `$EOQ = \\sqrt{\\frac{2DK}{h}} = \\sqrt{\\frac{2\\cdot${m(D)}\\cdot${K}}{${h}}} = ${m(Math.round(ans))}$ szt. Optymalna partia minimalizuje sume kosztow.` };
      } },
    { id: 'cmr', chapter: 'k4', title: 'Wskaznik marzy pokrycia',
      gen() {
        const cena = R(40, 200, 10), kz = R(10, cena - 10, 5);
        const ans = (cena - kz) / cena * 100;
        return { question: `Cena $${cena}$ zl, koszt zmienny jedn. $${kz}$ zl. Policz wskaznik marzy pokrycia (%).`,
          answer: +p2(ans), tol: 0.1, unit: '%',
          solution: `$wsk. = \\frac{cena - kz}{cena} = \\frac{${cena - kz}}{${cena}} = ${p2(ans)}\\%$. Jaka czesc ceny pokrywa koszty stale i zysk.` };
      } },
    { id: 'taxshield', chapter: 'k6', title: 'Tarcza podatkowa odsetek',
      gen() {
        const ods = R(10, 300, 10) * 1000, T = 19;
        const ans = ods * T / 100;
        return { question: `Odsetki od dlugu $= ${m(ods)}$ zl, stawka podatku $T = ${T}\\%$. Policz wartosc tarczy podatkowej (zl).`,
          answer: Math.round(ans), tol: 1, unit: 'zl',
          solution: `$tarcza = odsetki \\cdot T = ${m(ods)} \\cdot ${T / 100} = ${m(Math.round(ans))}$ zl. Odsetki sa kosztem → obnizaja podatek.` };
      } },
    { id: 'ros', chapter: 'k3', title: 'Marza operacyjna (ROS)',
      gen() {
        const EBIT = R(50, 500, 10) * 1000, S = R(1000, 5000, 100) * 1000;
        const ans = EBIT / S * 100;
        return { question: `$EBIT = ${m(EBIT)}$ zl, przychody $= ${m(S)}$ zl. Policz marze operacyjna ROS (%).`,
          answer: +p2(ans), tol: 0.05, unit: '%',
          solution: `$ROS = \\frac{EBIT}{przychody} = \\frac{${m(EBIT)}}{${m(S)}} = ${p2(ans)}\\%$. Rentownosc na poziomie operacyjnym.` };
      } },
    { id: 'invturn', chapter: 'k7', title: 'Rotacja zapasow w dniach',
      gen() {
        const COGS = R(500, 5000, 100) * 1000, zap = R(50, 800, 10) * 1000;
        const ans = 365 * zap / COGS;
        return { question: `Koszt sprzedanych towarow $= ${m(COGS)}$ zl, srednie zapasy $= ${m(zap)}$ zl. Policz rotacje zapasow w dniach.`,
          answer: Math.round(ans), tol: 1, unit: 'dni',
          solution: `$DIO = \\frac{zapasy}{COGS} \\cdot 365 = \\frac{${m(zap)}}{${m(COGS)}} \\cdot 365 = ${Math.round(ans)}$ dni. Ile dni towar lezy w magazynie.` };
      } },
    { id: 'de', chapter: 'k6', title: 'Wskaznik zadluzenia D/E',
      gen() {
        const D = R(200, 2000, 50) * 1000, E = R(200, 2000, 50) * 1000;
        const ans = D / E;
        return { question: `Zobowiazania (dlug) $= ${m(D)}$ zl, kapital wlasny $= ${m(E)}$ zl. Policz wskaznik D/E.`,
          answer: +ans.toFixed(2), tol: 0.02, unit: '',
          solution: `$D/E = \\frac{dlug}{kapital\\ wlasny} = \\frac{${m(D)}}{${m(E)}} = ${ans.toFixed(2)}$. Im wyzszy, tym wieksza dzwignia i ryzyko.` };
      } },
  ];

  window.PROBLEMS = PROBLEMS;
})();
