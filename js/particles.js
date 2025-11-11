/**
 * Particle System for Glassmorphism Design
 * Creates floating particles with randomized properties
 * Contributes to the ChatGPT 5 aesthetic with smooth animations
 */

class ParticleSystem {
    constructor(containerId = 'particles-container', particleCount = 80) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.colors = ['color-cyan', 'color-teal', 'color-blue'];
        this.sizes = ['size-1', 'size-2', 'size-3'];
        
        if (!this.container) {
            console.warn(`Particle container with id "${containerId}" not found`);
            return;
        }
        
        this.initialize();
    }
    
    /**
     * Initialize particle system and generate particles
     */
    initialize() {
        // Clear existing particles
        this.container.innerHTML = '';
        
        // Generate particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(i);
        }
        
        console.log(`✨ Particle system initialized with ${this.particleCount} particles`);
    }
    
    /**
     * Create a single particle with randomized properties
     */
    createParticle(index) {
        const particle = document.createElement('div');
        
        // Randomize color
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Randomize size
        const size = this.sizes[Math.floor(Math.random() * this.sizes.length)];
        
        // Randomize duration (2-8 seconds for variety)
        const duration = 2 + Math.random() * 6;
        
        // Randomize horizontal offset
        const offsetX = Math.random() * 200 - 100;
        
        // Randomize delay (0-2 seconds) for staggered start
        const delay = Math.random() * 2;
        
        // Randomize left position (0-100vw)
        const leftPos = Math.random() * 100;
        
        // Set particle classes and styles
        particle.className = `particle ${color} ${size}`;
        particle.style.left = `${leftPos}vw`;
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        particle.style.setProperty('--offset-x', `${offsetX}px`);
        
        this.container.appendChild(particle);
    }
    
    /**
     * Add a particle dynamically (for interactive effects)
     */
    addParticle(x, y) {
        const particle = document.createElement('div');
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const size = 'size-1'; // Smaller for interactive particles
        const duration = 2 + Math.random() * 3;
        
        particle.className = `particle ${color} ${size}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.position = 'fixed';
        particle.style.animation = `float ${duration}s linear forwards`;
        
        this.container.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => particle.remove(), duration * 1000);
    }
    
    /**
     * Destroy and recreate particles (for dynamic refresh)
     */
    refresh() {
        this.initialize();
    }
}

// Initialize particle system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem('particles-container', 80);
    });
} else {
    new ParticleSystem('particles-container', 80);
}

// Optional: Add particles on mouse click for interactive effect
document.addEventListener('click', (e) => {
    const particleSystem = window.particleSystem || new ParticleSystem('particles-container', 0);
    // Uncomment to enable interactive particles on click:
    // particleSystem.addParticle(e.clientX, e.clientY);
});
