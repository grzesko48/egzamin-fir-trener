const Reader = {
    data: null,
    
    init(data) {
        this.data = data;
        this.renderList();
    },

    renderList() {
        const listEl = document.getElementById('chapters-list');
        listEl.innerHTML = '';

        // Group chapters
        const groups = {
            'baza': 'Baza',
            'fib': 'Finanse i Bankowość',
            'kier': 'Kierunkowe'
        };

        const grouped = {};
        this.data.chapters.forEach(ch => {
            if (!grouped[ch.group]) grouped[ch.group] = [];
            grouped[ch.group].push(ch);
        });

        for (const [groupKey, chapters] of Object.entries(grouped)) {
            const groupName = groups[groupKey] || groupKey;
            const titleEl = document.createElement('div');
            titleEl.className = 'chapter-group-title';
            titleEl.textContent = groupName;
            listEl.appendChild(titleEl);

            chapters.forEach(ch => {
                const isDone = Store.isChapterDone(ch.id);
                const btn = document.createElement('button');
                btn.className = 'chapter-btn';
                btn.innerHTML = `
                    <span>${ch.num ? ch.num + '. ' : ''}${ch.title}</span>
                    <span class="small-text">${ch.minutes} min ${isDone ? '✅' : ''}</span>
                `;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.renderChapter(ch);
                    
                    // On mobile, scroll to content
                    if (window.innerWidth < 992) {
                        document.getElementById('chapter-content').scrollIntoView({behavior: 'smooth'});
                    }
                });
                listEl.appendChild(btn);
            });
        }
    },

    renderChapter(ch) {
        const container = document.getElementById('chapter-content');
        let html = `<h2>${ch.title}</h2>`;
        
        if (ch.sections) {
            ch.sections.forEach(sec => {
                html += `<h3>${sec.h}</h3>`;
                // Process highlight for "Gdzie komisja dociska"
                let content = sec.html;
                content = content.replace(/Gdzie komisja dociska:/g, '<span class="highlight"><strong>Gdzie komisja dociska:</strong></span>');
                html += content;
            });
        }

        if (ch.probes && ch.probes.length > 0) {
            html += `<h3>Pytania i haczyki</h3><ul>`;
            ch.probes.forEach(probe => {
                let p = probe.replace(/Gdzie komisja dociska:/g, '<span class="highlight"><strong>Gdzie komisja dociska:</strong></span>');
                html += `<li>${p}</li>`;
            });
            html += `</ul>`;
        }

        container.innerHTML = html;

        // Trigger math rendering
        if (window.renderMathInElement) {
            window.renderMathInElement(container, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    }
};
