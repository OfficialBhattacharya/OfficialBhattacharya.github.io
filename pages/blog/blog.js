// Blog section initialization
document.addEventListener('DOMContentLoaded', function() {
    initBlogAnimations();
});

// Initialize blog animations
function initBlogAnimations() {
    // Add animation classes to blog posts
    document.querySelectorAll('.blog-post-newspaper').forEach((post, index) => {
        post.style.animationDelay = `${index * 0.1}s`;
        post.classList.add('fade-in');
    });
}

// Blog Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    initBlogCarousel();
});

function initBlogCarousel() {
    const blogGrid = document.querySelector('.blog-grid');
    const nextBtn = document.querySelector('.blog-scroll-btn.next');
    const prevBtn = document.querySelector('.blog-scroll-btn.prev');
    
    if (blogGrid && nextBtn && prevBtn) {
        setupBlogCarousel(blogGrid, nextBtn, prevBtn);
    }
}

function setupBlogCarousel(blogGrid, nextBtn, prevBtn) {
    // Hide arrows if no overflow
    updateScrollButtons();
    
    // Check if we need to show/hide scroll buttons
    window.addEventListener('resize', updateScrollButtons);
    
    // Scroll functionality
    nextBtn.addEventListener('click', () => {
        blogGrid.scrollBy({ left: 350, behavior: 'smooth' });
    });
    
    prevBtn.addEventListener('click', () => {
        blogGrid.scrollBy({ left: -350, behavior: 'smooth' });
    });
    
    function updateScrollButtons() {
        // Show/hide buttons based on scroll position and content width
        if (blogGrid.scrollWidth <= blogGrid.clientWidth) {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
            prevBtn.style.display = 'flex';
        }
    }
}

// Cyberpunk Blog Dual-Mode Scripts

// Initialize the dual-mode blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initBlogModes();
    initCardDeck();
    initMobileSwipe();
});

// Setup the view mode toggle and handle switching between modes
function initBlogModes() {
    const viewModeToggle = document.querySelector('.view-mode-toggle');
    const bodyElement = document.body;
    
    // Set default mode (Neon Chronicle/newspaper)
    if (localStorage.getItem('blogViewMode') === 'card') {
        bodyElement.classList.add('card-mode');
    }
    
    // Toggle between modes
    if (viewModeToggle) {
        viewModeToggle.addEventListener('click', function() {
            bodyElement.classList.toggle('card-mode');
            
            // Store preference in localStorage
            if (bodyElement.classList.contains('card-mode')) {
                localStorage.setItem('blogViewMode', 'card');
                // Add transition effect
                addModeTransitionEffect('newspaper-to-card');
            } else {
                localStorage.setItem('blogViewMode', 'newspaper');
                // Add transition effect
                addModeTransitionEffect('card-to-newspaper');
            }
        });
    }
}

// Add transition effect when switching between modes
function addModeTransitionEffect(transitionType) {
    const transitionElement = document.createElement('div');
    transitionElement.className = 'mode-transition';
    
    if (transitionType === 'newspaper-to-card') {
        transitionElement.style.background = 'radial-gradient(circle, rgba(255, 0, 60, 0.2) 0%, rgba(10, 10, 10, 0) 70%)';
    } else {
        transitionElement.style.background = 'radial-gradient(circle, rgba(0, 255, 157, 0.2) 0%, rgba(10, 10, 10, 0) 70%)';
    }
    
    document.body.appendChild(transitionElement);
    
    // Animate and remove
    setTimeout(() => {
        transitionElement.style.opacity = '0';
        setTimeout(() => {
            transitionElement.remove();
        }, 500);
    }, 500);
}

// Initialize the card deck behavior
function initCardDeck() {
    const dataCards = document.querySelectorAll('.data-card');
    
    if (dataCards.length === 0) return;
    
    // Card flip functionality
    dataCards.forEach(card => {
        // Double-click to flip cards
        card.addEventListener('dblclick', function() {
            this.classList.toggle('card-flipped');
        });
        
        // Card hover animation on desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                // Lift up stats and add glow
                const stats = this.querySelector('.blog-stats');
                if (stats) {
                    stats.style.transform = 'translateY(-5px)';
                    stats.style.boxShadow = '0 5px 15px rgba(255, 0, 60, 0.2)';
                }
                
                // Show floating tech stats
                const date = this.querySelector('.blog-date-deck');
                if (date) {
                    // Convert date to hex code for cyberpunk effect
                    const dateText = date.textContent;
                    const hexDate = convertDateToHex(dateText);
                    date.setAttribute('data-original', dateText);
                    date.textContent = hexDate;
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset stats
                const stats = this.querySelector('.blog-stats');
                if (stats) {
                    stats.style.transform = '';
                    stats.style.boxShadow = '';
                }
                
                // Reset date
                const date = this.querySelector('.blog-date-deck');
                if (date && date.hasAttribute('data-original')) {
                    date.textContent = date.getAttribute('data-original');
                }
            });
        }
    });
    
    // Fan-out animation on load for desktop
    if (window.innerWidth > 768) {
        setTimeout(() => {
            document.querySelectorAll('.data-card').forEach((card, index) => {
                // Start with all cards stacked
                card.style.transform = 'rotateY(0) translateZ(0) translateX(0)';
                card.style.opacity = '0';
                
                // Fan out with staggered delay
                setTimeout(() => {
                    card.style.opacity = '1';
                    switch (index) {
                        case 0:
                            card.style.transform = 'rotateY(-15deg) translateZ(10px) translateX(-160px)';
                            break;
                        case 1:
                            card.style.transform = 'rotateY(-5deg) translateZ(20px) translateX(-80px)';
                            break;
                        case 2:
                            card.style.transform = 'rotateY(0deg) translateZ(30px) translateX(0)';
                            card.style.zIndex = '3';
                            break;
                        case 3:
                            card.style.transform = 'rotateY(5deg) translateZ(20px) translateX(80px)';
                            break;
                        default:
                            card.style.transform = 'rotateY(15deg) translateZ(10px) translateX(160px)';
                    }
                }, index * 100);
            });
        }, 500);
    }
}

// Convert date to a hexadecimal cyberpunk format
function convertDateToHex(dateString) {
    let hexString = '';
    
    // Simple conversion for demo purposes
    const dateParts = dateString.split(' ');
    if (dateParts.length >= 2) {
        const dayNum = parseInt(dateParts[1].replace(',', ''));
        const monthMap = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        
        const month = monthMap[dateParts[0]] || '00';
        const year = dateParts[2] || '0000';
        
        // Create hex-like string
        const dayHex = dayNum.toString(16).padStart(2, '0').toUpperCase();
        hexString = `0x${dayHex}${month}${year.slice(2)}`;
    } else {
        hexString = '0x00000000';
    }
    
    return hexString;
}

// Initialize mobile swipe functionality with Hammer.js
function initMobileSwipe() {
    if (window.innerWidth <= 768 && typeof Hammer !== 'undefined') {
        const cardDeck = document.querySelector('.blog-grid-deck');
        if (!cardDeck) return;
        
        const cards = Array.from(document.querySelectorAll('.data-card'));
        if (cards.length === 0) return;
        
        let currentCardIndex = 0;
        
        // Create swipe dots
        const swipeIndicator = document.querySelector('.swipe-indicator');
        if (swipeIndicator) {
            const swipeDots = document.querySelector('.swipe-dots');
            if (swipeDots) {
                // Clear existing dots
                swipeDots.innerHTML = '';
                
                // Create dots
                cards.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = 'swipe-dot';
                    if (index === 0) dot.classList.add('active');
                    swipeDots.appendChild(dot);
                });
            }
        }
        
        // Show first card, hide others
        cards.forEach((card, index) => {
            if (index === 0) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) translateX(0)';
                card.style.pointerEvents = 'auto';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(0) translateX(100px)';
                card.style.pointerEvents = 'none';
            }
        });
        
        // Initialize Hammer
        const hammertime = new Hammer(cardDeck);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        
        hammertime.on('swipeleft', function() {
            if (currentCardIndex < cards.length - 1) {
                // Hide current card
                cards[currentCardIndex].style.opacity = '0';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(-100px)';
                cards[currentCardIndex].style.pointerEvents = 'none';
                
                // Show next card
                currentCardIndex++;
                cards[currentCardIndex].style.opacity = '1';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(0)';
                cards[currentCardIndex].style.pointerEvents = 'auto';
                
                // Update dots
                updateSwipeDots(currentCardIndex);
            }
        });
        
        hammertime.on('swiperight', function() {
            if (currentCardIndex > 0) {
                // Hide current card
                cards[currentCardIndex].style.opacity = '0';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(100px)';
                cards[currentCardIndex].style.pointerEvents = 'none';
                
                // Show previous card
                currentCardIndex--;
                cards[currentCardIndex].style.opacity = '1';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(0)';
                cards[currentCardIndex].style.pointerEvents = 'auto';
                
                // Update dots
                updateSwipeDots(currentCardIndex);
            }
        });
        
        // Double tap to flip card on mobile
        hammertime.get('tap').set({ event: 'doubletap', taps: 2 });
        hammertime.on('doubletap', function() {
            const currentCard = cards[currentCardIndex];
            currentCard.classList.toggle('card-flipped');
        });
    } else {
        // If Hammer.js isn't available, implement a basic swipe functionality
        implementBasicMobileSwipe();
    }
}

// Update swipe dots to show current card
function updateSwipeDots(currentIndex) {
    const dots = document.querySelectorAll('.swipe-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Basic swipe functionality without Hammer.js
function implementBasicMobileSwipe() {
    if (window.innerWidth > 768) return;
    
    const cards = Array.from(document.querySelectorAll('.data-card'));
    if (cards.length === 0) return;
    
    let currentCardIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Show first card, hide others
    cards.forEach((card, index) => {
        if (index === 0) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) translateX(0)';
            card.style.pointerEvents = 'auto';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(0) translateX(100px)';
            card.style.pointerEvents = 'none';
        }
        
        // Double tap to flip
        let lastTap = 0;
        card.addEventListener('touchend', function() {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                this.classList.toggle('card-flipped');
            }
            lastTap = currentTime;
        });
    });
    
    // Create swipe dots
    const swipeIndicator = document.querySelector('.swipe-indicator');
    if (swipeIndicator) {
        const swipeDots = document.querySelector('.swipe-dots');
        if (swipeDots) {
            // Clear existing dots
            swipeDots.innerHTML = '';
            
            // Create dots
            cards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'swipe-dot';
                if (index === 0) dot.classList.add('active');
                swipeDots.appendChild(dot);
            });
        }
    }
    
    // Basic swipe detection
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            if (currentCardIndex < cards.length - 1) {
                // Hide current card
                cards[currentCardIndex].style.opacity = '0';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(-100px)';
                cards[currentCardIndex].style.pointerEvents = 'none';
                
                // Show next card
                currentCardIndex++;
                cards[currentCardIndex].style.opacity = '1';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(0)';
                cards[currentCardIndex].style.pointerEvents = 'auto';
                
                // Update dots
                updateSwipeDots(currentCardIndex);
            }
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right
            if (currentCardIndex > 0) {
                // Hide current card
                cards[currentCardIndex].style.opacity = '0';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(100px)';
                cards[currentCardIndex].style.pointerEvents = 'none';
                
                // Show previous card
                currentCardIndex--;
                cards[currentCardIndex].style.opacity = '1';
                cards[currentCardIndex].style.transform = 'translateY(0) translateX(0)';
                cards[currentCardIndex].style.pointerEvents = 'auto';
                
                // Update dots
                updateSwipeDots(currentCardIndex);
            }
        }
    }
}

// Add parallax effect for newspaper mode on mobile
function initMobileParallax() {
    if (window.innerWidth <= 768) {
        const blogPosts = document.querySelectorAll('.blog-post-newspaper');
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            blogPosts.forEach((post, index) => {
                const speed = 0.05 + (index % 3) * 0.02;
                const yPos = scrollPosition * speed;
                post.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
} 