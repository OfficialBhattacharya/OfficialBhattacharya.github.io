// Add animation classes to elements
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.timeline-item, .experience-item, .project-card').forEach(item => {
        item.classList.add('fade-in');
    });
    
    // Rest of your existing JavaScript code...
}); 