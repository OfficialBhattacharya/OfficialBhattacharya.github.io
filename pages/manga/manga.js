// Manga Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initMangaModal();
});

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
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal via close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

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
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Add a slight glow to images on hover
    mangaImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.filter = 'brightness(1.2)';
            img.style.boxShadow = '0 0 20px rgba(0, 247, 255, 0.3)';
            img.style.transition = 'filter 0.3s ease, box-shadow 0.3s ease';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.filter = 'brightness(1)';
            img.style.boxShadow = 'none';
        });
    });
} 