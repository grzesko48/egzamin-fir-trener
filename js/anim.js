const Anim = {
    canvas: null,
    ctx: null,
    particles: [],
    numParticles: 100,
    animationFrameId: null,

    init() {
        this.initCanvas();
        this.initScrollAnimations();
    },

    initCanvas() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -0.2 - Math.random() * 0.8, // Drift upwards
                color: Math.random() > 0.6 
                    ? `rgba(255, 87, 34, ${Math.random() * 0.5 + 0.1})` // Orange
                    : (Math.random() > 0.5 
                        ? `rgba(255, 23, 68, ${Math.random() * 0.5 + 0.1})` // Crimson
                        : `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.1})`) // Gold
            });
        }

        this.animateCanvas();
    },

    activeBiome: 'castle',
    biomeCfg: { connect: true, connColor: '255, 87, 34' },
    // Konfiguracja obiektowa: setBiome({key, motion, colors:['r,g,b',...], connect, connColor})
    // motion: 'rise' (zarzace wegielki), 'fall' (snieg/pyl), 'drift' (motyle/liscie),
    //         'swirl' (chaos/burza), 'spark' (szybkie neony). Wstecznie: string => legacy.
    setBiome(cfg) {
        if (typeof cfg === 'string') {
            const legacy = { castle:{motion:'rise',colors:['255,87,34','255,23,68','255,215,0'],connect:true},
                mine:{motion:'rise',colors:['212,175,55','245,158,11'],connect:true},
                snow:{motion:'fall',colors:['255,255,255','147,197,253']},
                forest:{motion:'drift',colors:['16,185,129','52,211,153']} };
            cfg = Object.assign({ key: cfg }, legacy[cfg] || legacy.castle);
        }
        const key = cfg.key || 'default';
        if (this.activeBiome === key) return;
        this.activeBiome = key;

        const motion = cfg.motion || 'rise';
        const colors = (cfg.colors && cfg.colors.length) ? cfg.colors : ['255,215,0'];
        this.biomeCfg = { connect: !!cfg.connect, connColor: cfg.connColor || colors[0] };
        if (!this.canvas) return;
        this.particles = [];

        const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
        for (let i = 0; i < this.numParticles; i++) {
            let vx, vy, radius;
            if (motion === 'fall') { vy = rnd(0.4, 1.2); vx = (Math.random() - 0.5) * 0.4; radius = rnd(1, 4); }
            else if (motion === 'drift') { vx = -rnd(0.2, 0.7); vy = rnd(0.08, 0.4); radius = rnd(0.5, 2.5); }
            else if (motion === 'swirl') { vx = (Math.random() - 0.5) * 1.2; vy = (Math.random() - 0.5) * 1.2; radius = rnd(0.5, 2.2); }
            else if (motion === 'spark') { vy = -rnd(0.5, 1.6); vx = (Math.random() - 0.5) * 0.5; radius = rnd(0.4, 1.8); }
            else { vy = -rnd(0.2, 1.0); vx = (Math.random() - 0.5) * 0.3; radius = rnd(0.5, 3); }
            const rgb = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius, vx, vy,
                color: `rgba(${rgb}, ${(Math.random() * 0.5 + 0.15).toFixed(2)})`
            });
        }
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    animateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections (subtle glowing constellation lines - per-biome toggle)
        if (this.biomeCfg && this.biomeCfg.connect) {
            const connColor = this.biomeCfg.connColor;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < 80) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(${connColor}, ${0.05 - dist/1600})`;
                        this.ctx.lineWidth = 0.3;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Warp around sides
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            
            // Warp vertically
            if (p.vy < 0) {
                // Drifting up
                if (p.y < 0) {
                    p.y = this.canvas.height;
                    p.x = Math.random() * this.canvas.width;
                }
            } else {
                // Drifting down
                if (p.y > this.canvas.height) {
                    p.y = 0;
                    p.x = Math.random() * this.canvas.width;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = Math.random() > 0.8 ? 8 : 0;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0; // reset
        });

        this.animationFrameId = requestAnimationFrame(() => this.animateCanvas());
    },

    initScrollAnimations() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Hero parallax
        gsap.to('.hero-content', {
            y: 200,
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Stagger glass cards
        gsap.utils.toArray('.glass-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    },

    fireConfetti() {
        // Simple confetti drop simulation (can be expanded)
        const emoji = ['🎉', '✨', '🔥', '🏆'];
        for(let i=0; i<30; i++) {
            const el = document.createElement('div');
            el.textContent = emoji[Math.floor(Math.random() * emoji.length)];
            el.style.position = 'fixed';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-50px';
            el.style.fontSize = (Math.random() * 20 + 10) + 'px';
            el.style.zIndex = 9999;
            el.style.pointerEvents = 'none';
            document.body.appendChild(el);

            gsap.to(el, {
                y: window.innerHeight + 100,
                x: '+=' + (Math.random() * 200 - 100),
                rotation: Math.random() * 360,
                duration: Math.random() * 2 + 2,
                ease: 'power1.in',
                onComplete: () => el.remove()
            });
        }
    }
};
