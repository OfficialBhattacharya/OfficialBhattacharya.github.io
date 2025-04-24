// Projects Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initProjectImages();
});

function initProjectImages() {
    // Make project images respond to hover with a slight glow effect
    const projectImages = document.querySelectorAll('.project-image-item img');
    
    projectImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.filter = 'brightness(1.2)';
            img.style.transition = 'filter 0.3s ease';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.filter = 'brightness(1)';
        });
    });
    
    // Optional: Add a click handler to show larger images if needed
    projectImages.forEach(img => {
        img.addEventListener('click', () => {
            // Could add modal functionality here later
            console.log('Project image clicked:', img.alt);
        });
    });
} 