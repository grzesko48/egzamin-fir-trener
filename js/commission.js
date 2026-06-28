const Commission = {
    data: null,
    
    init(data) {
        this.data = data;
        this.render();
    },

    render() {
        const container = document.getElementById('commission-list');
        if (!container || !this.data || !this.data.chapters) return;
        
        container.innerHTML = '';
        
        let found = 0;
        
        this.data.chapters.forEach(ch => {
            if (ch.probes && ch.probes.length > 0) {
                const group = document.createElement('div');
                group.className = 'glass-card commission-item';
                
                let html = `<h3 style="margin-bottom:1rem; color:var(--primary);">${ch.title}</h3><ul>`;
                
                ch.probes.forEach(probe => {
                    let p = probe.replace(/Gdzie komisja dociska:/gi, '<strong>Gdzie dociskają:</strong>');
                    html += `<li style="margin-bottom:0.5rem;">${p}</li>`;
                    found++;
                });
                html += `</ul>`;
                
                group.innerHTML = html;
                container.appendChild(group);
            }
        });
        
        if (found === 0) {
            container.innerHTML = '<div class="placeholder-text">Brak specjalnych wskazówek komisji w bazie.</div>';
        } else {
            if (window.renderMathInElement) window.renderMathInElement(container, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});
        }
    }
};
