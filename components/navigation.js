/**
 * Navigation Component
 * Handles the sundial navigation functionality
 */

class SundialNavigation {
    constructor() {
        this.sundialNav = document.querySelector('.sundial-nav');
        this.sections = document.querySelectorAll('.sundial-section');
        this.contentSections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        if (!this.sundialNav) return;
        
        // Add navigation arrows to sundial nav
        this.createNavArrows();
        
        // Handle section clicks
        this.handleSectionClicks();
        
        // Handle subsection clicks
        this.handleSubsectionClicks();
        
        // Update on resize
        window.addEventListener('resize', this.updateArrows.bind(this));
        
        // Initial update
        setTimeout(this.updateArrows.bind(this), 100);
    }
    
    createNavArrows() {
        const navArrows = document.createElement('div');
        navArrows.className = 'sundial-nav-arrows';
        
        const leftArrow = document.createElement('div');
        leftArrow.className = 'sundial-arrow left';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const rightArrow = document.createElement('div');
        rightArrow.className = 'sundial-arrow right';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        navArrows.appendChild(leftArrow);
        navArrows.appendChild(rightArrow);
        this.sundialNav.appendChild(navArrows);
        
        const sectionsContainer = this.sundialNav.querySelector('.sundial-sections');
        
        // Add scroll functionality
        leftArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Store references
        this.leftArrow = leftArrow;
        this.rightArrow = rightArrow;
        this.sectionsContainer = sectionsContainer;
        
        // Add scroll event
        sectionsContainer.addEventListener('scroll', this.updateArrows.bind(this));
    }
    
    updateArrows() {
        if (!this.sectionsContainer) return;
        
        const isAtStart = this.sectionsContainer.scrollLeft === 0;
        const isAtEnd = this.sectionsContainer.scrollLeft + this.sectionsContainer.offsetWidth >= this.sectionsContainer.scrollWidth - 10;
        
        this.leftArrow.style.opacity = isAtStart ? '0' : '0.8';
        this.leftArrow.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        this.rightArrow.style.opacity = isAtEnd ? '0' : '0.8';
        this.rightArrow.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }
    
    handleSectionClicks() {
        this.sections.forEach(section => {
            section.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all sections
                this.sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked section
                section.classList.add('active');
                
                // Navigate to the target section
                window.location.hash = section.getAttribute('href');
            });
        });
    }
    
    handleSubsectionClicks() {
        const subsections = document.querySelectorAll('.sundial-subsection');
        subsections.forEach(subsection => {
            subsection.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = subsection.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const parentSectionId = this.findParentSectionId(targetElement);
                    if (parentSectionId) {
                        // Navigate to parent section first
                        window.location.hash = parentSectionId;
                        
                        // Then scroll to subsection
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 500);
                        
                        // Update active states
                        this.sections.forEach(s => s.classList.remove('active'));
                        const sundialSection = document.querySelector(`[href="#${parentSectionId}"]`);
                        if (sundialSection) sundialSection.classList.add('active');
                    }
                }
            });
        });
    }
    
    findParentSectionId(element) {
        const parentSection = element.closest('section[id]');
        return parentSection ? parentSection.id : null;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sundialNav = new SundialNavigation();
}); 