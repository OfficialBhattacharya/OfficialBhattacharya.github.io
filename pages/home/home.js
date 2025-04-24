/**
 * Home page JavaScript functionality
 */

// Initialize components when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initCyberpunkNameAnimation();
    createBinaryRain();
    initParticles();
});

// Make functions available globally
window.initAnimations = function() {
    initCyberpunkNameAnimation();
    createBinaryRain();
    initParticles();
};

/**
 * Cyberpunk name animation
 */
function initCyberpunkNameAnimation() {
    const nameElement = document.getElementById('cyberpunkName');
    if (!nameElement) return;
    
    // Reset animation
    nameElement.style.opacity = '0';
    
    // Animate name with anime.js
    anime({
        targets: '#cyberpunkName',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 300
    });
    
    // Add glitch effect
    setInterval(() => {
        nameElement.classList.add('glitch-active');
        setTimeout(() => {
            nameElement.classList.remove('glitch-active');
        }, 200);
    }, 3000);
}

/**
 * Create binary rain effect
 */
function createBinaryRain() {
    const binaryRain = document.querySelector('.binary-rain');
    if (!binaryRain) return;
    
    // Clear existing content
    binaryRain.innerHTML = '';
    
    // Generate random binary digits
    const numDigits = 40;
    for (let i = 0; i < numDigits; i++) {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        
        const x = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 3;
        
        digit.style.left = `${x}%`;
        digit.style.animationDelay = `${delay}s`;
        digit.style.animationDuration = `${duration}s`;
        
        binaryRain.appendChild(digit);
    }
}

/**
 * Initialize particles
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear existing content
    particlesContainer.innerHTML = '';
    
    // Create particles
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = 1 + Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = 0.3 + Math.random() * 0.6;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.opacity = opacity;
        
        particlesContainer.appendChild(particle);
    }
    
    // Create periodic particle explosions
    setInterval(createParticleExplosion, 2000);
}

/**
 * Create particle explosion effect
 */
function createParticleExplosion() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const numExplosionParticles = 15;
    const centerX = 30 + Math.random() * 40; // Random position within central area
    const centerY = 30 + Math.random() * 40;
    
    for (let i = 0; i < numExplosionParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        const size = 1 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * 20;
        const duration = 1 + Math.random();
        
        const x = centerX + Math.cos(angle) * 2; // Starting point
        const y = centerY + Math.sin(angle) * 2;
        const targetX = centerX + Math.cos(angle) * distance; // End point
        const targetY = centerY + Math.sin(angle) * distance;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.backgroundColor = 'rgba(0, 255, 157, 0.8)';
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 5px rgba(0, 255, 157, 0.5)';
        
        particlesContainer.appendChild(particle);
        
        // Animate particle
        anime({
            targets: particle,
            left: `${targetX}%`,
            top: `${targetY}%`,
            opacity: [1, 0],
            duration: duration * 1000,
            easing: 'easeOutExpo',
            complete: function() {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
} 