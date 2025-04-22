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

    // Blog scroll functionality
    const blogGrid = document.querySelector('.blog-grid');
    const prevBtn = document.querySelector('.blog-scroll-btn.prev');
    const nextBtn = document.querySelector('.blog-scroll-btn.next');
    const postWidth = document.querySelector('.blog-post').offsetWidth + 32; // Width + gap

    function updateScrollButtons() {
        prevBtn.style.display = blogGrid.scrollLeft <= 0 ? 'none' : 'block';
        nextBtn.style.display = 
            blogGrid.scrollLeft >= blogGrid.scrollWidth - blogGrid.clientWidth - 10 
            ? 'none' : 'block';
    }

    prevBtn.addEventListener('click', () => {
        blogGrid.scrollBy({
            left: -postWidth,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        blogGrid.scrollBy({
            left: postWidth,
            behavior: 'smooth'
        });
    });

    blogGrid.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();

    initTicTacToe();
    initCyberpunkNameAnimation();
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

// Ultimate Tic-Tac-Toe game logic
function initTicTacToe() {
    const gameStatus = document.querySelector('.game-status');
    const restartButton = document.querySelector('.restart-button');
    const mainBoards = document.querySelectorAll('.main-board');
    const cells = document.querySelectorAll('.cell');
    
    let isPlayerTurn = true;
    let gameActive = true;
    let nextBoard = null;
    let gameState = Array(9).fill().map(() => Array(9).fill(''));
    let boardStates = Array(9).fill(null); // null = in progress, 'X' = X won, 'O' = O won, 'D' = draw

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const mainBoard = cell.closest('.main-board');
        const boardIndex = parseInt(mainBoard.dataset.board);
        const cellIndex = parseInt(cell.dataset.cell);

        // Check if move is valid
        if (!isValidMove(boardIndex, cellIndex)) return;

        // Player's turn
        if (isPlayerTurn) {
            makeMove(boardIndex, cellIndex, 'X');
            
            if (checkGameEnd()) return;

            isPlayerTurn = false;
            gameStatus.textContent = "Computer's turn...";
            
            // Computer's turn (with a slight delay for better UX)
            setTimeout(computerMove, 500);
        }
    }

    function isValidMove(boardIndex, cellIndex) {
        return gameActive && 
               gameState[boardIndex][cellIndex] === '' && 
               (nextBoard === null || boardIndex === nextBoard) &&
               boardStates[boardIndex] === null;
    }

    function makeMove(boardIndex, cellIndex, player) {
        gameState[boardIndex][cellIndex] = player;
        const cell = document.querySelector(`.main-board[data-board="${boardIndex}"] .cell[data-cell="${cellIndex}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());

        // Check if the board is won
        if (checkBoardWin(boardIndex, player)) {
            boardStates[boardIndex] = player;
            highlightBoardWin(boardIndex, player);
        } else if (isBoardFull(boardIndex)) {
            boardStates[boardIndex] = 'D';
        }

        // Set next board
        nextBoard = cellIndex;
        
        // If next board is already won or full, allow playing in any available board
        if (boardStates[nextBoard] !== null) {
            nextBoard = null;
        }

        updateBoardHighlights();
    }

    function computerMove() {
        if (!gameActive) return;

        // Find best move
        const move = findBestMove();
        if (move) {
            makeMove(move.board, move.cell, 'O');
            
            if (checkGameEnd()) return;

            isPlayerTurn = true;
            gameStatus.textContent = "Your turn!";
        }
    }

    function findBestMove() {
        // First, try to win the current board
        if (nextBoard !== null) {
            const winningMove = findWinningMove(nextBoard, 'O');
            if (winningMove) return { board: nextBoard, cell: winningMove };
        }

        // Then, try to block player from winning the current board
        if (nextBoard !== null) {
            const blockingMove = findWinningMove(nextBoard, 'X');
            if (blockingMove) return { board: nextBoard, cell: blockingMove };
        }

        // If no winning/blocking moves, make a strategic move
        const availableBoards = nextBoard !== null ? [nextBoard] : 
            Array.from({length: 9}, (_, i) => i).filter(i => boardStates[i] === null);

        for (const board of availableBoards) {
            // Try to take center
            if (gameState[board][4] === '') {
                return { board, cell: 4 };
            }

            // Try to take corners
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => gameState[board][i] === '');
            if (availableCorners.length > 0) {
                return { board, cell: availableCorners[Math.floor(Math.random() * availableCorners.length)] };
            }

            // Take any available cell
            const availableCells = Array.from({length: 9}, (_, i) => i)
                .filter(i => gameState[board][i] === '');
            if (availableCells.length > 0) {
                return { board, cell: availableCells[Math.floor(Math.random() * availableCells.length)] };
            }
        }

        return null;
    }

    function findWinningMove(board, player) {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (gameState[board][a] === player && gameState[board][b] === player && gameState[board][c] === '') return c;
            if (gameState[board][a] === player && gameState[board][c] === player && gameState[board][b] === '') return b;
            if (gameState[board][b] === player && gameState[board][c] === player && gameState[board][a] === '') return a;
        }
        return null;
    }

    function checkBoardWin(boardIndex, player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameState[boardIndex][index] === player;
            });
        });
    }

    function isBoardFull(boardIndex) {
        return gameState[boardIndex].every(cell => cell !== '');
    }

    function checkGameEnd() {
        // Check if any player has won the ultimate game
        if (checkUltimateWin('X')) {
            gameStatus.textContent = 'You win the game!';
            gameActive = false;
            return true;
        }
        if (checkUltimateWin('O')) {
            gameStatus.textContent = 'Computer wins the game!';
            gameActive = false;
            return true;
        }
        // Check for draw
        if (boardStates.every(state => state !== null)) {
            gameStatus.textContent = 'Game ended in a draw!';
            gameActive = false;
            return true;
        }
        return false;
    }

    function checkUltimateWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return boardStates[index] === player;
            });
        });
    }

    function highlightBoardWin(boardIndex, player) {
        const board = document.querySelector(`.main-board[data-board="${boardIndex}"]`);
        board.classList.add(player.toLowerCase() + '-won');
    }

    function updateBoardHighlights() {
        mainBoards.forEach((board, index) => {
            board.classList.remove('active');
            if (nextBoard === index && boardStates[index] === null) {
                board.classList.add('active');
            }
        });
    }

    function restartGame() {
        gameState = Array(9).fill().map(() => Array(9).fill(''));
        boardStates = Array(9).fill(null);
        gameActive = true;
        isPlayerTurn = true;
        nextBoard = null;
        gameStatus.textContent = "Your turn! Click any cell to start";
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled');
        });
        
        mainBoards.forEach(board => {
            board.classList.remove('x-won', 'o-won', 'active');
        });
    }

    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);

    // Initialize game status
    gameStatus.textContent = "Your turn! Click any cell to start";
}

function initCyberpunkNameAnimation() {
    const cyberpunkName = document.getElementById('cyberpunkName');
    if (!cyberpunkName) return;
    
    // Setup reduced motion toggle
    setupReducedMotionToggle();
    
    // Create binary rain effect
    createBinaryRain();
    
    // Initialize particles
    initParticles();
    
    // Anime.js timeline for the animation sequence
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        loop: false
    });
    
    // Split text into characters for animation
    const nameText = cyberpunkName.textContent;
    cyberpunkName.innerHTML = '';
    
    // Create spans for each character
    [...nameText].forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = '0';
        charSpan.style.display = 'inline-block';
        charSpan.style.transform = 'translateY(20px) scale(0)';
        cyberpunkName.appendChild(charSpan);
    });
    
    const charElements = cyberpunkName.querySelectorAll('span');
    
    // Stage 1: Boot-Up (Letters assemble)
    timeline.add({
        targets: charElements,
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0, 1],
        duration: 800,
        delay: anime.stagger(50),
        easing: 'easeOutExpo'
    })
    
    // Stage 2: Glitch Surge
    .add({
        targets: cyberpunkName,
        opacity: [1, 0.8, 1],
        filter: [
            'blur(0px) hue-rotate(0deg)', 
            'blur(2px) hue-rotate(90deg)',
            'blur(0px) hue-rotate(0deg)'
        ],
        duration: 300,
        update: function(anim) {
            if (anim.progress > 20 && anim.progress < 80) {
                // Random glitch during animation
                if (Math.random() > 0.7) {
                    const glitchX = Math.random() * 10 - 5;
                    cyberpunkName.style.transform = `translateX(${glitchX}px)`;
                    
                    // RGB split effect
                    const rgbSplitAmount = Math.random() * 5;
                    cyberpunkName.style.textShadow = `
                        ${rgbSplitAmount}px 0 #ff00ff, 
                        -${rgbSplitAmount}px 0 #00f7ff
                    `;
                } else {
                    cyberpunkName.style.transform = 'translateX(0)';
                    cyberpunkName.style.textShadow = 'none';
                }
            }
        }
    })
    
    // Stage 3: Hologram Stabilization
    .add({
        targets: cyberpunkName,
        filter: [
            'blur(1px) brightness(1.2)', 
            'blur(0px) brightness(1)'
        ],
        translateZ: [-5, 0],
        duration: 500,
        complete: function() {
            // Clear any glitch effects
            cyberpunkName.style.transform = 'translateX(0)';
            cyberpunkName.style.textShadow = '0 0 15px rgba(0, 247, 255, 0.5)';
        }
    })
    
    // Stage 4: Idle State
    .add({
        targets: cyberpunkName,
        translateY: ['0px', '-5px', '0px'],
        rotateX: [0, 2, 0],
        rotateY: [0, -2, 0],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
    });
    
    // Add hover effect
    cyberpunkName.addEventListener('mouseenter', function() {
        anime({
            targets: cyberpunkName,
            filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
            textShadow: ['0 0 15px rgba(0, 247, 255, 0.5)', '0 0 25px rgba(0, 247, 255, 0.8)', '0 0 15px rgba(0, 247, 255, 0.5)'],
            scale: [1, 1.05, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
        
        // Trigger particle explosion
        createParticleExplosion();
    });
    
    // Add click effect
    cyberpunkName.addEventListener('click', function() {
        // System overload effect
        anime({
            targets: cyberpunkName,
            filter: [
                'blur(0px) contrast(100%)', 
                'blur(3px) contrast(200%)',
                'blur(0px) contrast(100%)'
            ],
            scale: [1, 0.95, 1.05, 1],
            duration: 600,
            easing: 'easeInOutQuad',
            update: function(anim) {
                if (anim.progress > 10 && anim.progress < 70) {
                    // Extreme glitch during "system overload"
                    if (anim.progress % 10 < 5) {
                        const glitchX = (Math.random() - 0.5) * 20;
                        const glitchY = (Math.random() - 0.5) * 10;
                        cyberpunkName.style.transform = `translate(${glitchX}px, ${glitchY}px)`;
                        
                        // Random RGB shift
                        const colorA = Math.random() > 0.5 ? '#ff00ff' : '#00f7ff';
                        const colorB = colorA === '#ff00ff' ? '#00f7ff' : '#ff00ff';
                        cyberpunkName.style.textShadow = `
                            ${Math.random() * 8 - 4}px 0 ${colorA}, 
                            ${Math.random() * 8 - 4}px 0 ${colorB}
                        `;
                    }
                } else if (anim.progress > 70) {
                    // Reset
                    cyberpunkName.style.transform = 'translateX(0)';
                    cyberpunkName.style.textShadow = '0 0 15px rgba(0, 247, 255, 0.5)';
                }
            }
        });
        
        // Create more particles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createParticleExplosion(), i * 100);
        }
    });
}

function setupReducedMotionToggle() {
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    
    if (!reducedMotionToggle) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Set initial state based on user preference or local storage
    const savedPreference = localStorage.getItem('reducedMotion');
    const shouldReduceMotion = savedPreference !== null 
        ? savedPreference === 'true' 
        : prefersReducedMotion;
    
    // Apply initial state
    if (shouldReduceMotion) {
        document.body.classList.add('reduced-motion');
        reducedMotionToggle.classList.add('active');
        reducedMotionToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        localStorage.setItem('reducedMotion', 'true');
    } else {
        document.body.classList.remove('reduced-motion');
        reducedMotionToggle.classList.remove('active');
        reducedMotionToggle.innerHTML = '<i class="fas fa-eye"></i>';
        localStorage.setItem('reducedMotion', 'false');
    }
    
    // Add click event listener
    reducedMotionToggle.addEventListener('click', function() {
        const isReducedMotion = document.body.classList.contains('reduced-motion');
        
        if (isReducedMotion) {
            // Enable animations
            document.body.classList.remove('reduced-motion');
            reducedMotionToggle.classList.remove('active');
            reducedMotionToggle.innerHTML = '<i class="fas fa-eye"></i>';
            localStorage.setItem('reducedMotion', 'false');
        } else {
            // Reduce animations
            document.body.classList.add('reduced-motion');
            reducedMotionToggle.classList.add('active');
            reducedMotionToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
            localStorage.setItem('reducedMotion', 'true');
        }
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('reduced-motion');
            reducedMotionToggle.classList.add('active');
            reducedMotionToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            // Only automatically turn animations back on if the user hasn't explicitly set a preference
            if (localStorage.getItem('reducedMotion') === null) {
                document.body.classList.remove('reduced-motion');
                reducedMotionToggle.classList.remove('active');
                reducedMotionToggle.innerHTML = '<i class="fas fa-eye"></i>';
            }
        }
    });
}

function createBinaryRain() {
    const binaryRain = document.querySelector('.binary-rain');
    if (!binaryRain) return;
    
    const width = binaryRain.offsetWidth;
    const height = binaryRain.offsetHeight;
    
    // Create binary digits
    for (let i = 0; i < 50; i++) {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        
        // Random position
        const left = Math.random() * width;
        const top = Math.random() * height;
        digit.style.left = `${left}px`;
        digit.style.top = `${top}px`;
        
        // Random speed
        const duration = 3 + Math.random() * 5;
        digit.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        digit.style.animationDelay = `${delay}s`;
        
        binaryRain.appendChild(digit);
    }
}

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Create initial particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = Math.random() > 0.5 ? '#00f7ff' : '#ff00ff';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
    }
}

function createParticleExplosion() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particles = [];
    const cyberpunkName = document.getElementById('cyberpunkName');
    const rect = cyberpunkName.getBoundingClientRect();
    const containerRect = particlesContainer.getBoundingClientRect();
    
    // Create particle origin point relative to container
    const originX = (rect.left + rect.width / 2) - containerRect.left;
    const originY = (rect.top + rect.height / 2) - containerRect.top;
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.position = 'absolute';
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = Math.random() > 0.5 ? '#00f7ff' : '#ff00ff';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 6px ${particle.style.backgroundColor}`;
        
        // Set position at origin
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }
    
    // Animate particles
    anime({
        targets: particles,
        translateX: () => anime.random(-100, 100),
        translateY: () => anime.random(-100, 100),
        opacity: [1, 0],
        scale: [1, 0],
        easing: 'easeOutExpo',
        duration: () => anime.random(600, 1000),
        complete: function() {
            // Remove particles after animation
            particles.forEach(p => p.remove());
        }
    });
} 