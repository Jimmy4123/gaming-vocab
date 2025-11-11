/**
 * Cursor Glow Effect System
 * Adds an elegant glow that follows the mouse cursor
 * Complements the glassmorphism aesthetic with smooth tracking
 */

class CursorGlowEffect {
    constructor() {
        this.createGlowElement();
        this.setupEventListeners();
        this.mouseX = 0;
        this.mouseY = 0;
        this.glowX = 0;
        this.glowY = 0;
    }
    
    /**
     * Create the glow element and add to DOM
     */
    createGlowElement() {
        this.glow = document.createElement('div');
        this.glow.id = 'cursor-glow';
        this.glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(6, 214, 208, 0.15) 0%, rgba(14, 165, 233, 0.08) 30%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-out;
            filter: blur(80px);
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this.glow);
    }
    
    /**
     * Setup event listeners for mouse tracking
     */
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.onMouseEnter());
        document.addEventListener('mouseleave', () => this.onMouseLeave());
    }
    
    /**
     * Handle mouse movement and update glow position
     */
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Smooth animation frame for glow position
        if (!this.animationFrameId) {
            this.animationFrameId = requestAnimationFrame(() => this.updateGlowPosition());
        }
    }
    
    /**
     * Update glow position with smooth easing
     */
    updateGlowPosition() {
        // Ease the glow position for smooth trailing effect
        this.glowX += (this.mouseX - this.glowX) * 0.2;
        this.glowY += (this.mouseY - this.glowY) * 0.2;
        
        this.glow.style.left = `${this.glowX}px`;
        this.glow.style.top = `${this.glowY}px`;
        
        this.animationFrameId = requestAnimationFrame(() => this.updateGlowPosition());
    }
    
    /**
     * Show glow when mouse enters viewport
     */
    onMouseEnter() {
        this.glow.style.opacity = '1';
    }
    
    /**
     * Hide glow when mouse leaves viewport
     */
    onMouseLeave() {
        this.glow.style.opacity = '0';
    }
}

// Initialize cursor glow effect when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CursorGlowEffect();
        console.log('✨ Cursor glow effect initialized');
    });
} else {
    new CursorGlowEffect();
    console.log('✨ Cursor glow effect initialized');
}
