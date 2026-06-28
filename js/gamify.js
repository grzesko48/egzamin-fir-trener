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
        let hpBonus = 5;
        // Re-render RPG panel if Learn module is active
        if (typeof Learn !== 'undefined' && Learn.renderRPGPanel) {
            Learn.renderRPGPanel();
        }

        const modal = document.createElement('div');
        modal.className = 'view-container flex-center active';
        modal.style.zIndex = '10000';
        modal.style.background = 'rgba(5, 5, 10, 0.9)';
        modal.style.backdropFilter = 'blur(15px)';
        
        modal.innerHTML = `
            <div class="glass-card level-up-modal" style="text-align:center; padding: 3rem; max-width: 460px; border-color: var(--primary); box-shadow: 0 0 35px var(--primary-glow); transform: scale(0.8); opacity: 0;">
                <div style="font-size: 5rem; filter: drop-shadow(0 0 15px var(--primary-glow)); margin-bottom: 1.5rem;">👑</div>
                <div class="huge-number gradient-text" style="font-size: 2.8rem; font-weight: 900; letter-spacing: 1px; margin-bottom: 0.5rem;">POZIOM ${level}!</div>
                <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;">Awansujesz na Wyższy Poziom!</h2>
                
                <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; padding: 1.2rem; margin-bottom: 2rem; text-align: left; display: flex; flex-direction: column; gap: 0.8rem;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold;">
                        <span style="color: var(--success);">❤️ Maksymalne Życie (Max HP)</span>
                        <span style="color: var(--success);">+${hpBonus}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold;">
                        <span style="color: var(--primary);">✨ Witalność / Energia</span>
                        <span style="color: var(--primary);">Uleczona (100%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.85rem; color: var(--text-muted); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.6rem;">
                        <span>Odblokowano nową rangę bohatera!</span>
                    </div>
                </div>

                <button class="btn primary ripple" style="width: 100%; border-radius: 24px; padding: 0.8rem 1.5rem; font-weight: bold;">Zatwierdź Awans (Enter)</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const card = modal.querySelector('.glass-card');
        const btn = modal.querySelector('button');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(card, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
        } else {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }
 
        const closeLevelUp = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.remove() });
            } else {
                modal.remove();
            }
        };

        btn.addEventListener('click', closeLevelUp);
        
        // Auto-close on Enter
        const handler = (e) => {
            if (e.key === 'Enter') {
                document.removeEventListener('keydown', handler);
                closeLevelUp();
            }
        };
        document.addEventListener('keydown', handler);
    }
};
