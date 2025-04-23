/**
 * Router.js - Page routing and dynamic content loading
 * Handles URL hash-based navigation and loads content dynamically
 */

class Router {
    constructor() {
        this.routes = {
            '': 'home',
            '#home': 'home',
            '#about': 'about',
            '#blog': 'blog',
            '#experience': 'experience',
            '#projects': 'projects',
            '#paper-presentations': 'paper-presentations',
            '#manga': 'manga',
            '#skills': 'skills',
            '#games': 'games'
        };
        
        this.mainContent = document.getElementById('main-content');
        this.currentPage = null;
        
        this.init();
    }
    
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        
        // Initial route handling
        this.handleRouteChange();
        
        // Preload pages for faster navigation
        this.preloadPages();
    }
    
    handleRouteChange() {
        const hash = window.location.hash || '';
        const page = this.routes[hash] || 'home';
        
        // Don't reload if already on the same page
        if (this.currentPage === page) return;
        
        this.loadPage(page);
    }
    
    async loadPage(page) {
        try {
            // Show loading indicator
            this.showLoading();
            
            // Fetch page content
            const response = await fetch(`./pages/${page}/${page}.html`);
            if (!response.ok) throw new Error(`Could not load page: ${page}`);
            
            const html = await response.text();
            
            // Update page content
            this.mainContent.innerHTML = html;
            
            // Load page-specific CSS
            this.loadCSS(page);
            
            // Load page-specific JS
            this.loadJS(page);
            
            // Update current page tracker
            this.currentPage = page;
            
            // Update active state in navigation
            this.updateActiveNavItem(page);
            
            // Hide loading indicator
            this.hideLoading();
            
            // Initialize page content (animations, etc.)
            this.initPageContent();
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Page loading error:', error);
            this.showErrorMessage();
        }
    }
    
    loadCSS(page) {
        // Remove any previous page-specific CSS
        const existingPageCSS = document.querySelector('link[data-page-css]');
        if (existingPageCSS) existingPageCSS.remove();
        
        // Add new page-specific CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `./pages/${page}/${page}.css`;
        link.setAttribute('data-page-css', page);
        document.head.appendChild(link);
    }
    
    loadJS(page) {
        // Remove any previous page-specific JS
        const existingPageJS = document.querySelector('script[data-page-js]');
        if (existingPageJS) existingPageJS.remove();
        
        // Add new page-specific JS
        const script = document.createElement('script');
        script.src = `./pages/${page}/${page}.js`;
        script.setAttribute('data-page-js', page);
        script.async = true;
        document.body.appendChild(script);
    }
    
    updateActiveNavItem(page) {
        // Remove active class from all nav items
        document.querySelectorAll('.sundial-section').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current nav item
        const activeNavItem = document.querySelector(`.sundial-section[href="#${page}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');
    }
    
    showLoading() {
        // Create loading indicator if it doesn't exist
        if (!document.querySelector('.page-loading')) {
            const loader = document.createElement('div');
            loader.className = 'page-loading';
            loader.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            `;
            document.body.appendChild(loader);
        }
        
        // Show the loading indicator
        document.querySelector('.page-loading').classList.add('active');
    }
    
    hideLoading() {
        const loader = document.querySelector('.page-loading');
        if (loader) loader.classList.remove('active');
    }
    
    showErrorMessage() {
        this.hideLoading();
        this.mainContent.innerHTML = `
            <div class="error-container">
                <h2>Page Not Found</h2>
                <p>Sorry, the page you requested could not be loaded.</p>
                <a href="#home" class="error-home-link">Return to Home</a>
            </div>
        `;
    }
    
    initPageContent() {
        // Initialize animations for new content
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            setTimeout(() => {
                el.classList.add('animate');
            }, 100);
        });
        
        // Re-initialize any components that need it
        if (window.initAnimations) window.initAnimations();
        if (window.initComponents) window.initComponents();
    }
    
    preloadPages() {
        // Preload critical pages in the background
        setTimeout(() => {
            Object.values(this.routes).forEach(page => {
                if (page !== this.currentPage) {
                    fetch(`./pages/${page}/${page}.html`).catch(() => {});
                }
            });
        }, 2000);
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
}); 