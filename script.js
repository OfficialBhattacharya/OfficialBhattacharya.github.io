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
                <h2>TradeDash - Trading Dashboard</h2>
                <div class="project-demo">
                    <iframe src="https://github.com/OfficialBhattacharya/TradeDash" frameborder="0"></iframe>
                </div>
                <div class="project-details">
                    <h3>Project Overview</h3>
                    <p>TradeDash is a comprehensive trading dashboard that provides real-time market data, technical analysis tools, and portfolio management capabilities. The application is built with modern web technologies and follows best practices for performance and user experience.</p>
                    
                    <h3>Technical Implementation</h3>
                    <ul>
                        <li>Frontend: React.js with Redux for state management</li>
                        <li>Backend: Node.js with Express</li>
                        <li>Database: MongoDB for data persistence</li>
                        <li>Real-time updates: WebSocket integration</li>
                        <li>Data visualization: Chart.js and D3.js</li>
                        <li>Authentication: JWT-based secure authentication</li>
                    </ul>

                    <h3>Key Features</h3>
                    <ul>
                        <li>Real-time stock price updates and charts</li>
                        <li>Technical analysis indicators and tools</li>
                        <li>Portfolio tracking and performance analytics</li>
                        <li>Market news and sentiment analysis</li>
                        <li>User authentication and profile management</li>
                        <li>Responsive design for all devices</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
};

const modal = createModal();
const demoLink = document.getElementById('tradeDashDemo');
const closeBtn = modal.querySelector('.modal-close');

demoLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Add animation to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}); 