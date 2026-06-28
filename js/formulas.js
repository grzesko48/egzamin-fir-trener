const Formulas = {
    data: null,
    
    init(data) {
        this.data = data;
        this.renderAll();
        this.bindEvents();
    },

    bindEvents() {
        const searchInput = document.getElementById('formula-search');
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            this.filterFormulas(term);
        });
    },

    renderAll() {
        const formulasList = document.getElementById('formulas-list');
        const ratesList = document.getElementById('rates-list');
        
        formulasList.innerHTML = '';
        ratesList.innerHTML = '';

        // Render Formulas
        if (this.data.formulas) {
            this.data.formulas.forEach(f => {
                const li = document.createElement('li');
                li.className = 'formula-item';
                li.innerHTML = `
                    <div class="formula-name">${f.name}</div>
                    <div class="formula-math">$$${f.latex}$$</div>
                    <div class="formula-legend">${f.legend}</div>
                `;
                formulasList.appendChild(li);
            });
            
            if (window.renderMathInElement) {
                window.renderMathInElement(formulasList, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        }

        // Render Rates
        if (this.data.rates) {
            this.data.rates.forEach(r => {
                const li = document.createElement('li');
                li.className = 'rate-item';
                li.innerHTML = `
                    <div class="rate-name">
                        ${r.name}
                        <div class="small-text">${r.note || ''}</div>
                    </div>
                    <div class="rate-value">${r.value}</div>
                `;
                ratesList.appendChild(li);
            });
        }
    },

    filterFormulas(term) {
        // Simple filter for formulas list
        const items = document.querySelectorAll('.formula-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(term)) item.style.display = 'block';
            else item.style.display = 'none';
        });

        // And rates
        const rateItems = document.querySelectorAll('.rate-item');
        rateItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(term)) item.style.display = 'flex';
            else item.style.display = 'none';
        });
    }
};
