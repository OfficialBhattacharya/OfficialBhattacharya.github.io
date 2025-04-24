// Main JavaScript file for Diganta's Website
document.addEventListener('DOMContentLoaded', function() {
    // Load section-specific scripts and styles
    loadSectionModules();
    
    // Load the about section content
    loadAboutSectionContent();
    
    // Initialize global elements
    initSmoothScrolling();
    initSundialNavigation();
    
    // Add animation to elements when they come into view
    initElementAnimations();
});

// Load section-specific modules dynamically
function loadSectionModules() {
    // Get all sections from the DOM
    const sections = document.querySelectorAll('section[id]');
    
    // Process each section
    sections.forEach(section => {
        const sectionId = section.id;
        loadSectionModule(sectionId);
    });
}

// Load a specific section's module
function loadSectionModule(sectionId) {
    // Skip if not a valid section or if it's already loaded
    if (!sectionId || document.querySelector(`script[data-section="${sectionId}"]`)) {
        return;
    }
    
    // Load CSS
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `pages/${sectionId}/${sectionId}.css`;
    styleLink.setAttribute('data-section', sectionId);
    document.head.appendChild(styleLink);
    
    // Load JS
    const script = document.createElement('script');
    script.src = `pages/${sectionId}/${sectionId}.js`;
    script.setAttribute('data-section', sectionId);
    document.body.appendChild(script);
    
    console.log(`Loaded module for section: ${sectionId}`);
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize sundial navigation
function initSundialNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const sundialLinks = document.querySelectorAll('.sundial-section');
    
    // Set active section on scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Initial update
    updateActiveSection();
    
    function updateActiveSection() {
        let currentSectionId = '';
        
        // Find the section that is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 100 && 
                window.scrollY < sectionTop + sectionHeight - 100) {
                currentSectionId = section.id;
            }
        });
        
        // Update active link in sundial navigation
        sundialLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize element animations
function initElementAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add animation classes to elements
    document.querySelectorAll('.timeline-item, .project-card, .paper-item, .manga-item, .skill-category, .game-card').forEach(item => {
        item.classList.add('fade-in');
    });
}

// Load the about section content
function loadAboutSectionContent() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    fetch('pages/about/about.html')
        .then(response => response.text())
        .then(html => {
            // Replace the placeholder with the fetched content
            aboutSection.innerHTML = html;
            
            // Re-run any initialization that might be needed after content is loaded
            if (typeof initTerminalEffects === 'function') initTerminalEffects();
            if (typeof initHologramDisks === 'function') initHologramDisks();
            if (typeof initCyberCatTracking === 'function') initCyberCatTracking();
            if (typeof initHexSkillMatrix === 'function') initHexSkillMatrix();
        })
        .catch(error => {
            console.error('Error loading About section:', error);
            // Provide a fallback if the fetch fails
            aboutSection.innerHTML = `
                <div class="section-content">
                    <h2 class="section-title">About</h2>
                    <p class="error-message">Failed to load About section content. Please try refreshing the page.</p>
                </div>
            `;
        });
} 