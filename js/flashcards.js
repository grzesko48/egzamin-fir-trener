const Flashcards = {
    data: null,
    currentQueue: [],
    currentIndex: 0,
    touchStartX: 0,
    touchEndX: 0,
    
    init(data) {
        this.data = data;
        this.populateFilters();
        this.bindEvents();
    },

    populateFilters() {
        const filterEl = document.getElementById('flashcard-chapter-filter');
        if (this.data.chapters) {
            this.data.chapters.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch.id;
                opt.textContent = ch.title;
                filterEl.appendChild(opt);
            });
        }
        filterEl.addEventListener('change', () => this.loadQueue());
        document.getElementById('flashcard-mode-filter').addEventListener('change', () => this.loadQueue());
        
        this.loadQueue();
    },

    bindEvents() {
        const flipBtn = document.getElementById('fc-btn-flip');
        const hardBtn = document.getElementById('fc-btn-hard');
        const goodBtn = document.getElementById('fc-btn-good');
        const easyBtn = document.getElementById('fc-btn-easy');
        const container = document.getElementById('flashcard-container');
        
        flipBtn.addEventListener('click', () => this.flip());
        hardBtn.addEventListener('click', () => this.judge(1)); // SM-2 Quality 1
        goodBtn.addEventListener('click', () => this.judge(3)); // SM-2 Quality 3
        easyBtn.addEventListener('click', () => this.judge(5)); // SM-2 Quality 5

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (App.currentView !== 'flashcards') return;
            if (e.code === 'Space') {
                e.preventDefault();
                if(flipBtn.style.display !== 'none') this.flip();
            }
            if (document.getElementById('fc-judge-buttons').style.display !== 'none') {
                if (e.key === '1') this.judge(1);
                if (e.key === '2') this.judge(3);
                if (e.key === '3') this.judge(5);
            }
        });

        // Touch Swipe Logic
        container.addEventListener('touchstart', e => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        container.addEventListener('touchend', e => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, {passive: true});
    },

    handleSwipe() {
        if (document.getElementById('fc-judge-buttons').style.display === 'none') {
            // Not flipped yet
            return; 
        }
        const delta = this.touchEndX - this.touchStartX;
        if (delta < -50) {
            // Swipe left (Hard)
            this.judge(1);
        } else if (delta > 50) {
            // Swipe right (Easy)
            this.judge(5);
        }
    },

    flip() {
        const card = document.querySelector('.flashcard');
        if(card) card.classList.add('flipped');
        document.getElementById('fc-btn-flip').style.display = 'none';
        document.getElementById('fc-judge-buttons').style.display = 'flex';
    },

    loadQueue() {
        const chapterFilter = document.getElementById('flashcard-chapter-filter').value;
        const modeFilter = document.getElementById('flashcard-mode-filter').value;
        const now = Date.now();
        
        let pool = this.data.flashcards || [];
        
        if (chapterFilter !== 'all') {
            pool = pool.filter(f => f.chapter === chapterFilter);
        }
        
        this.currentQueue = pool.filter(f => {
            if (modeFilter === 'today') {
                const fcId = f.id || f.front;
                const state = Store.getFlashcardState(fcId);
                const nr = Number(state.nextReview) || 0;
                // Due for review or new
                return nr <= now;
            }
            return true;
        });
        
        document.getElementById('fc-queue-count').textContent = this.currentQueue.length;
        
        // Sort by nextReview (oldest first)
        this.currentQueue.sort((a, b) => {
            return Store.getFlashcardState(a.id).nextReview - Store.getFlashcardState(b.id).nextReview;
        });
        
        this.currentIndex = 0;
        this.renderCurrent();
    },

    renderCurrent() {
        const container = document.getElementById('flashcard-container');
        const controls = document.getElementById('flashcard-controls');
        
        if (this.currentQueue.length === 0) {
            container.innerHTML = `
                <div class="glass-card flex-center" style="min-height: 350px;">
                    <div class="huge-number success-text">100%</div>
                    <h2>Na ten moment umiesz wszystko!</h2>
                    <p class="text-muted">Wróć jutro, aby kontynuować powtórki algorytmem SM-2.</p>
                </div>`;
            controls.style.display = 'none';
            if (typeof Anim!=='undefined') Anim.fireConfetti();
            return;
        }

        if (this.currentIndex >= this.currentQueue.length) {
            this.loadQueue(); // re-check if any repeats are due, else it will show 100% screen
            return;
        }

        const fc = this.currentQueue[this.currentIndex];
        const state = Store.getFlashcardState(fc.id);
        const chapter = this.data.chapters.find(c => c.id === fc.chapter);
        const chTitle = chapter ? chapter.title : '';

        // Add 3D rotation entry animation using GSAP if available
        container.innerHTML = `
            <div class="flashcard">
                <div class="fc-face">
                    <span class="fc-tag">${fc.tag || 'Fiszka'} | EF: ${state.efactor.toFixed(1)}</span>
                    <span class="fc-chap">${chTitle}</span>
                    <div class="fc-text">${fc.front}</div>
                </div>
                <div class="fc-face fc-back">
                    <span class="fc-tag">${fc.tag || 'Fiszka'}</span>
                    <span class="fc-chap">${chTitle}</span>
                    <div class="fc-text">${fc.back}</div>
                </div>
            </div>
        `;

        if (typeof gsap !== 'undefined') {
            gsap.from('.flashcard', {
                scale: 0.8,
                opacity: 0,
                rotationX: -20,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        }

        controls.style.display = 'flex';
        document.getElementById('fc-btn-flip').style.display = 'block';
        document.getElementById('fc-judge-buttons').style.display = 'none';
        
        document.getElementById('fc-queue-count').textContent = (this.currentQueue.length - this.currentIndex);
        
        if (window.renderMathInElement) {
            window.renderMathInElement(container, {
                delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
                throwOnError: false
            });
        }
    },

    judge(quality) {
        const fc = this.currentQueue[this.currentIndex];
        Store.updateFlashcard(fc.id, quality);
        
        // Slide out animation
        if (typeof gsap !== 'undefined') {
            const dir = quality > 2 ? 100 : -100;
            gsap.to('.flashcard', {
                x: dir,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.currentIndex++;
                    this.renderCurrent();
                }
            });
        } else {
            this.currentIndex++;
            this.renderCurrent();
        }
    }
};
