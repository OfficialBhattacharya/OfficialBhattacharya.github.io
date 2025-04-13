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

// Project Modal Functionality
const createModal = () => {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body">
                <h2 class="modal-title">TradeDash - Trading Dashboard</h2>
                <div class="project-overview">
                    <p>A comprehensive trading dashboard that provides real-time market analysis and portfolio management capabilities. Built with modern web technologies and designed for optimal user experience.</p>
                </div>
                <div class="screenshots-grid">
                    <div class="screenshot-item">
                        <img src="assets/tradedash-strategy.JPG" alt="Strategy Analysis">
                        <h3>Strategy Analysis</h3>
                        <p>Advanced technical analysis tools with customizable indicators and backtesting capabilities.</p>
                    </div>
                    <div class="screenshot-item">
                        <img src="assets/tradedash-pnl.JPG" alt="P&L Simulation">
                        <h3>P&L Simulation</h3>
                        <p>Detailed profit and loss simulation with portfolio value tracking and drawdown analysis.</p>
                    </div>
                    <div class="screenshot-item">
                        <img src="assets/tradedash-similar.JPG" alt="Similar Stocks">
                        <h3>Similar Stocks</h3>
                        <p>Find correlated stocks and analyze market relationships based on various metrics.</p>
                    </div>
                    <div class="screenshot-item">
                        <img src="assets/tradedash-scanner.JPG" alt="Market Scanner">
                        <h3>Market Scanner</h3>
                        <p>Real-time market scanning with customizable filters and performance metrics.</p>
                    </div>
                    <div class="screenshot-item">
                        <img src="assets/tradedash-recommendations.JPG" alt="Trading Recommendations">
                        <h3>Trading Recommendations</h3>
                        <p>AI-powered trading signals and technical analysis recommendations.</p>
                    </div>
                    <div class="screenshot-item">
                        <img src="assets/tradedash-charts.JPG" alt="Advanced Charting">
                        <h3>Advanced Charting</h3>
                        <p>Interactive charts with multiple timeframes and technical indicators.</p>
                    </div>
                </div>
                <div class="project-details">
                    <h3>Technical Stack</h3>
                    <div class="tech-stack">
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">MongoDB</span>
                        <span class="tech-tag">WebSocket</span>
                        <span class="tech-tag">Chart.js</span>
                        <span class="tech-tag">D3.js</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initSundialNavigation();
    initMangaModal();

    function initializeModal() {
        // Create modal container if it doesn't exist
        const modalContainer = document.querySelector('.project-modal') || createModal();
        const modalClose = modalContainer.querySelector('.modal-close');

        // Add click event to the TradeDash demo link
        const tradeDashDemo = document.getElementById('tradeDashDemo');
        if (tradeDashDemo) {
            tradeDashDemo.addEventListener('click', function(e) {
                e.preventDefault();
                showModal();
            });
        }

        // Close button event
        if (modalClose) {
            modalClose.addEventListener('click', () => hideModal());
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                hideModal();
            }
        });

        function showModal() {
            modalContainer.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Verify images are loading
            const images = modalContainer.querySelectorAll('img');
            images.forEach(img => {
                img.onerror = function() {
                    console.error('Failed to load image:', img.src);
                    // Set a fallback background
                    img.style.backgroundColor = 'rgba(0, 247, 255, 0.1)';
                    img.style.display = 'flex';
                    img.style.alignItems = 'center';
                    img.style.justifyContent = 'center';
                    img.style.minHeight = '200px';
                    img.insertAdjacentHTML('afterend', '<div class="image-error">Image loading failed</div>');
                };
                img.onload = function() {
                    console.log('Image loaded successfully:', img.src);
                };
            });
        }

        function hideModal() {
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        return { showModal, hideModal };
    }

    // Initialize the modal functionality
    initializeModal();

    // Scroll Progress Indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    // Navigation Dots
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    // Update active dot based on scroll position
    function updateActiveDot() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === currentSection) {
                dot.classList.add('active');
            }
        });
    }
    
    // Smooth scroll to section when dot is clicked
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetSection = document.getElementById(dot.getAttribute('data-section'));
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Update active dot on scroll
    window.addEventListener('scroll', updateActiveDot);
    
    // Initial update
    updateActiveDot();

    // Intersection Observer for animations
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

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
        observer.observe(el);
    });

    // Project Modal
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            const projectDetails = getProjectDetails(projectId);
            
            // Populate modal with project details
            document.querySelector('.modal-title').textContent = projectDetails.title;
            document.querySelector('.modal-description').textContent = projectDetails.description;
            document.querySelector('.modal-tech').innerHTML = projectDetails.techStack.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
            
            // Show modal
            showModal();
        });
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

    // Interactive Anime Characters
    const animeCharacters = document.querySelectorAll('.anime-character');
    
    animeCharacters.forEach(character => {
        character.addEventListener('mousemove', (e) => {
            const rect = character.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            character.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        character.addEventListener('mouseleave', () => {
            character.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message sent successfully!';
            contactForm.appendChild(successMessage);
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Project details data
    function getProjectDetails(projectId) {
        // This would typically come from a database or API
        const projects = {
            'project1': {
                title: 'Project 1',
                description: 'A detailed description of Project 1...',
                techStack: ['React', 'Node.js', 'MongoDB']
            },
            'project2': {
                title: 'Project 2',
                description: 'A detailed description of Project 2...',
                techStack: ['Vue.js', 'Express', 'PostgreSQL']
            },
            // Add more projects as needed
        };
        
        return projects[projectId] || {
            title: 'Project Not Found',
            description: 'Project details not available.',
            techStack: []
        };
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add parallax effect to sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add typing effect to subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect when element is in view
        const subtitleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    subtitleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        subtitleObserver.observe(subtitle);
    }

    // Initialize subtitle observer
    subtitleObserver.observe(subtitle);
});

function initSundialNavigation() {
    const sections = document.querySelectorAll('.sundial-section');
    const marker = document.querySelector('.sundial-marker');
    const mainContainer = document.querySelector('.main-container');

    // Initialize the sundial
    function initSundial() {
        sections.forEach(section => {
            const angle = section.dataset.angle;
            section.style.transform = `rotate(${angle}deg) translateX(-50%)`;
        });

        // Set initial position
        const activeSection = document.querySelector('section.active');
        if (activeSection) {
            const activeSundialSection = document.querySelector(`[href="#${activeSection.id}"]`);
            if (activeSundialSection) {
                const angle = activeSundialSection.dataset.angle;
                marker.style.transform = `rotate(${angle}deg)`;
                activeSundialSection.classList.add('active');
            }
        }
    }

    // Handle section navigation
    function navigateToSection(section) {
        const angle = section.dataset.angle;
        marker.style.transform = `rotate(${angle}deg)`;
        
        sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');

        const targetId = section.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }
    }

    // Click handlers for sundial sections
    sections.forEach(section => {
        section.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection(this);
        });
    });

    // Scroll handler for main container
    let isScrolling = false;
    mainContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentSection = Array.from(sections).find(section => {
                    const targetId = section.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    const rect = targetSection.getBoundingClientRect();
                    return rect.left >= 0 && rect.left <= window.innerWidth / 2;
                });

                if (currentSection) {
                    const angle = currentSection.dataset.angle;
                    marker.style.transform = `rotate(${angle}deg)`;
                    
                    sections.forEach(s => s.classList.remove('active'));
                    currentSection.classList.add('active');
                }
                isScrolling = false;
            });
        }
        isScrolling = true;
    });

    // Handle subsection navigation
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
                        navigateToSection(sundialSection);
                        setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 500);
                    }
                }
            }
        });
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activeSection = document.querySelector('.sundial-section.active');
        if (!activeSection) return;

        const currentAngle = parseInt(activeSection.dataset.angle);
        let nextSection;

        switch(e.key) {
            case 'ArrowLeft':
                nextSection = Array.from(sections).find(s => parseInt(s.dataset.angle) === currentAngle - 30);
                break;
            case 'ArrowRight':
                nextSection = Array.from(sections).find(s => parseInt(s.dataset.angle) === currentAngle + 30);
                break;
        }

        if (nextSection) {
            navigateToSection(nextSection);
        }
    });

    // Initialize
    initSundial();
}

function initMangaModal() {
    const mangaModal = document.getElementById('manga-modal');
    const mangaModalImage = document.getElementById('manga-modal-image');
    const mangaModalClose = document.querySelector('.manga-modal-close');
    const mangaItems = document.querySelectorAll('.manga-item');

    if (mangaItems.length > 0) {
        mangaItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const imgSrc = this.querySelector('.manga-image').getAttribute('src');
                mangaModalImage.setAttribute('src', imgSrc);
                mangaModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        if (mangaModalClose) {
            mangaModalClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                mangaModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }

        if (mangaModal) {
            mangaModal.addEventListener('click', function(e) {
                if (e.target === mangaModal) {
                    mangaModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mangaModal && mangaModal.classList.contains('show')) {
                mangaModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
} 