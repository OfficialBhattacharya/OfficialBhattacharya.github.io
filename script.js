// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Add animation to elements when they come into view
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
document.querySelectorAll('.timeline-item, .experience-item, .project-card').forEach(item => {
    item.classList.add('fade-in');
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSundialNavigation();
    initMangaModal();
    initAnimations();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Handle manga image modal
function initMangaModal() {
    const mangaImages = document.querySelectorAll('.manga-image');
    const modal = document.querySelector('.manga-image-modal');
    const modalImg = document.querySelector('.manga-modal-content');
    const closeBtn = document.querySelector('.manga-modal-close');

    // Open modal when an image is clicked
    mangaImages.forEach(img => {
        img.addEventListener('click', function() {
            modalImg.src = this.src;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal via close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle animations
function initAnimations() {
    // Observe elements with animation classes
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in, .timeline-item, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Glitch Effect
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.classList.add('glitch-active');
            setTimeout(() => {
                glitchText.classList.remove('glitch-active');
            }, 200);
        }, 3000);
    }
}

// Handle sundial navigation
function initSundialNavigation() {
    const sections = document.querySelectorAll('.sundial-section');
    const mainContainer = document.querySelector('.main-container');
    const contentSections = document.querySelectorAll('section[id]');

    // Update active section based on scroll position
    function updateActiveSection() {
        const scrollPosition = mainContainer.scrollLeft;
        const containerWidth = mainContainer.clientWidth;

        contentSections.forEach((section) => {
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.offsetWidth;

            // Check if section is in view
            if (sectionLeft <= scrollPosition + (containerWidth / 2) &&
                sectionLeft + sectionWidth > scrollPosition + (containerWidth / 2)) {
                // Remove active class from all nav items
                sections.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to corresponding nav item
                const correspondingNavItem = document.querySelector(`.sundial-section[href="#${section.id}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
            }
        });
    }

    // Handle section clicks
    sections.forEach(section => {
        section.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all sections
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked section
            this.classList.add('active');

            // Get the target section and scroll to it
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', inline: 'start' });
            }
        });
    });

    // Handle subsection clicks
    const subsections = document.querySelectorAll('.sundial-subsection');
    subsections.forEach(subsection => {
        subsection.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const parentSection = targetElement.closest('section');
                if (parentSection) {
                    const sundialSection = document.querySelector(`[href="#${parentSection.id}"]`);
                    if (sundialSection) {
                        // Remove active class from all sections
                        sections.forEach(s => s.classList.remove('active'));
                        
                        // Add active class to parent section
                        sundialSection.classList.add('active');
                        
                        // Scroll to the parent section first, then to the subsection
                        parentSection.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 500);
                    }
                }
            }
        });
    });

    // Handle scroll
    let isScrolling;
    mainContainer.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(updateActiveSection, 66);
    });

    // Initial check for active section
    updateActiveSection();

    // Update active section when window is resized
    window.addEventListener('resize', updateActiveSection);
} 