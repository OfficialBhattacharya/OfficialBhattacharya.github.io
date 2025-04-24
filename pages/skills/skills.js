// Skills Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initSkillsAnimations();
});

function initSkillsAnimations() {
    // Add staggered animations to skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        // Set initial state
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        
        // Stagger the animations
        setTimeout(() => {
            category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Add random glow effect to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    
    // Give each tag a random glow on a timer
    skillTags.forEach(tag => {
        setRandomGlow(tag);
    });
    
    function setRandomGlow(tag) {
        // Set a random timeout between 2-8 seconds
        const timeout = Math.random() * 6000 + 2000;
        
        setTimeout(() => {
            // Add glow
            tag.style.boxShadow = '0 0 10px rgba(0, 247, 255, 0.6)';
            tag.style.backgroundColor = 'rgba(100, 255, 218, 0.25)';
            
            // Remove glow after a short delay
            setTimeout(() => {
                tag.style.boxShadow = 'none';
                tag.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                
                // Set up the next glow
                setRandomGlow(tag);
            }, 700);
        }, timeout);
    }
} 