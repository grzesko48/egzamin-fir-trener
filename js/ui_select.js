/**
 * UI Select - Custom Dropdowns
 * Zastepuje natywne <select> ciemnym, dostepnym komponentem.
 * Otwieranie/zamykanie sterowane INLINE-style (niezawodne, niezalezne od kaskady CSS).
 */
window.UISelect = {
    init() {
        document.querySelectorAll('select.glass-input').forEach(s => this.enhance(s));
        if (!this._outsideBound) {
            this._outsideBound = true;
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.custom-select-wrapper')) {
                    document.querySelectorAll('.custom-select-wrapper').forEach(w => UISelect._setOpen(w, false));
                }
            });
        }
    },

    _setOpen(wrapper, state) {
        const opts = wrapper.querySelector('.custom-select-options');
        const display = wrapper.querySelector('.custom-select-display');
        if (!opts || !display) return;
        // Inline-style sterowanie (niezawodne — kaskada CSS bywa nadpisana; klasy zostaja dla a11y).
        const collapse = (o) => { o.style.maxHeight = '0'; o.style.opacity = '0'; o.style.pointerEvents = 'none'; };
        const expand = (o) => { o.style.maxHeight = '340px'; o.style.opacity = '1'; o.style.pointerEvents = 'auto'; o.style.overflowY = 'auto'; };
        if (!state) {
            display.classList.remove('active');
            opts.classList.remove('open');
            collapse(opts);
        } else {
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if (w !== wrapper) {
                    const d = w.querySelector('.custom-select-display');
                    const o = w.querySelector('.custom-select-options');
                    if (d) d.classList.remove('active');
                    if (o) { o.classList.remove('open'); collapse(o); }
                }
            });
            display.classList.add('active');
            opts.classList.add('open');
            expand(opts);
        }
    },

    enhance(select) {
        if (select.dataset.enhanced) return;
        select.dataset.enhanced = 'true';
        select.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        const display = document.createElement('div');
        display.className = 'custom-select-display glass-input';
        display.tabIndex = 0;

        const textSpan = document.createElement('span');
        textSpan.className = 'custom-select-text';
        textSpan.textContent = select.options[select.selectedIndex]?.textContent || '';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'custom-select-icon';
        iconSpan.innerHTML = '▼';

        display.appendChild(textSpan);
        display.appendChild(iconSpan);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options glass-card';

        wrapper.appendChild(display);
        wrapper.appendChild(optionsContainer);

        const buildOptions = () => {
            optionsContainer.innerHTML = '';
            Array.from(select.options).forEach((option, index) => {
                const optDiv = document.createElement('div');
                optDiv.className = 'custom-select-option';
                if (option.selected) optDiv.classList.add('selected');
                optDiv.textContent = option.textContent;
                optDiv.dataset.value = option.value;
                optDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.selectedIndex = index;
                    textSpan.textContent = option.textContent;
                    UISelect._setOpen(wrapper, false);
                    select.dispatchEvent(new Event('change'));
                    optionsContainer.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
                    optDiv.classList.add('selected');
                });
                optionsContainer.appendChild(optDiv);
            });
        };
        buildOptions();

        // Opcje dodawane dynamicznie (np. po wczytaniu danych) -> przebuduj
        const observer = new MutationObserver(() => {
            buildOptions();
            textSpan.textContent = select.options[select.selectedIndex]?.textContent || '';
        });
        observer.observe(select, { childList: true });

        // Toggle
        display.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsContainer.classList.contains('open');
            document.querySelectorAll('.custom-select-wrapper').forEach(w => { if (w !== wrapper) UISelect._setOpen(w, false); });
            UISelect._setOpen(wrapper, !isOpen);
        });

        // Klawiatura / a11y
        display.addEventListener('keydown', (e) => {
            const isOpen = optionsContainer.classList.contains('open');
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                display.click();
            } else if (e.key === 'Escape' && isOpen) {
                UISelect._setOpen(wrapper, false);
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const dir = e.key === 'ArrowDown' ? 1 : -1;
                let ni = select.selectedIndex + dir;
                if (ni < 0) ni = 0;
                if (ni >= select.options.length) ni = select.options.length - 1;
                if (select.selectedIndex !== ni) {
                    select.selectedIndex = ni;
                    textSpan.textContent = select.options[ni].textContent;
                    select.dispatchEvent(new Event('change'));
                    buildOptions();
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => UISelect.init());
