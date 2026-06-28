/**
 * Gamification Engine
 * Handles XP, level ups, and visual rewards
 */

window.Gamify = {
    awardXP(amount, reason = "") {
        const result = Store.addXP(amount);
        
        // Show floating text
        this.showFloatingXP(amount, reason);
        
        // Update dashboard if visible
        if (typeof Dashboard !== 'undefined' && Dashboard.renderGamify) {
            Dashboard.renderGamify();
        }

        if (result.leveledUp) {
            this.showLevelUp(result.level);
            if (typeof Anim !== 'undefined') Anim.fireConfetti();
        }
    },

    showFloatingXP(amount, reason) {
        const el = document.createElement('div');
        el.className = 'floating-xp success-text';
        el.innerHTML = `+${amount} XP <span style="font-size:0.8em; color:var(--text-muted)">${reason}</span>`;
        document.body.appendChild(el);
        
        // Position roughly at center top
        el.style.position = 'fixed';
        el.style.top = '20%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, 0)';
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '1.5rem';
        el.style.textShadow = '0 0 10px rgba(0,255,100,0.5)';
        
        // Animate up and fade out
        if (typeof gsap !== 'undefined') {
            gsap.to(el, { y: -50, opacity: 0, duration: 1.5, ease: "power1.out", onComplete: () => el.remove() });
        } else {
            setTimeout(() => el.remove(), 1500);
        }
    },

    showLevelUp(level) {
        const modal = document.createElement('div');
        modal.className = 'view-container flex-center active';
        modal.style.zIndex = '10000';
        modal.style.background = 'rgba(15, 23, 42, 0.9)';
        modal.style.backdropFilter = 'blur(10px)';
        
        modal.innerHTML = `
            <div class="glass-card" style="text-align:center; padding: 3rem; transform: scale(0.8); opacity: 0;">
                <div class="huge-number gradient-text">Poziom ${level}!</div>
                <h2>Awansujesz! Oby tak dalej!</h2>
                <button class="btn primary ripple" style="margin-top: 2rem;">Zrozumiano</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const card = modal.querySelector('.glass-card');
        const btn = modal.querySelector('button');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(card, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
        } else {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }

        btn.addEventListener('click', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.remove() });
            } else {
                modal.remove();
            }
        });
    }
};
