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
    // Initialize cyberpunk name animation directly
    initCyberpunkNameAnimation();
    createBinaryRain();
    initParticles();
    
    // Initialize navigation and other elements
    initSundialNavigation();
    initTicTacToe();
    
    // Observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Initialize and handle the home iframe
function initHomeIframe() {
    const homeFrame = document.getElementById('home-frame');
    if (homeFrame) {
        // Adjust iframe height when content loads
        homeFrame.onload = function() {
            resizeHomeIframe(homeFrame);
            
            // Make sure animations in the iframe are properly triggered
            try {
                const iframeWindow = homeFrame.contentWindow;
                if (iframeWindow.initCyberpunkNameAnimation) {
                    iframeWindow.initCyberpunkNameAnimation();
                }
                if (iframeWindow.createBinaryRain) {
                    iframeWindow.createBinaryRain();
                }
                if (iframeWindow.initParticles) {
                    iframeWindow.initParticles();
                }
            } catch (error) {
                console.log("Could not initialize animations in home iframe", error);
            }
        };
        
        // Resize iframe on window resize
        window.addEventListener('resize', function() {
            resizeHomeIframe(homeFrame);
        });
    }
}

// Resize home iframe
function resizeHomeIframe(iframe) {
    try {
        // Set the iframe height to match the viewport height
        iframe.style.height = `${window.innerHeight}px`;
    } catch (error) {
        console.log("Could not adjust home iframe height automatically");
    }
}

// Initialize and handle the about iframe
function initAboutIframe() {
    const aboutFrame = document.getElementById('about-frame');
    if (aboutFrame) {
        // Adjust iframe height when content loads
        aboutFrame.onload = function() {
            resizeIframe(aboutFrame);
            
            // Add CRT flicker effect to the terminal occasionally
            try {
                const iframeDoc = aboutFrame.contentWindow.document;
                const terminalWindow = iframeDoc.querySelector('.terminal-window');
                
                if (terminalWindow) {
                    setInterval(() => {
                        // Random chance to trigger a flicker
                        if (Math.random() < 0.1) {
                            terminalWindow.classList.add('crt-flicker');
                            setTimeout(() => {
                                terminalWindow.classList.remove('crt-flicker');
                            }, 150);
                        }
                    }, 4000);
                }
                
                // Add glow effect to stat boxes on hover
                const statBoxes = iframeDoc.querySelectorAll('.stat-box');
                if (statBoxes.length > 0) {
                    statBoxes.forEach(box => {
                        box.addEventListener('mouseover', () => {
                            const statValue = box.querySelector('.stat-value');
                            if (statValue) {
                                statValue.style.textShadow = '0 0 20px var(--cyber-green), 0 0 30px var(--cyber-green)';
                            }
                        });
                        
                        box.addEventListener('mouseout', () => {
                            const statValue = box.querySelector('.stat-value');
                            if (statValue) {
                                statValue.style.textShadow = '0 0 10px rgba(0, 255, 157, 0.5)';
                            }
                        });
                    });
                }
            } catch (error) {
                console.log("Could not initialize terminal effects in about iframe", error);
            }
        };
        
        // Resize iframe on window resize
        window.addEventListener('resize', function() {
            resizeIframe(aboutFrame);
        });
    }
}

// Resize iframe to fit content
function resizeIframe(iframe) {
    try {
        // Try to get the content height
        const contentHeight = iframe.contentWindow.document.body.scrollHeight;
        // Set the iframe height
        iframe.style.height = (contentHeight + 30) + 'px';
    } catch (error) {
        // If any error (like cross-origin), set a default height
        console.log("Could not adjust iframe height automatically. Setting default height.");
        iframe.style.height = '500px';
    }
}

// Handle manga image modal
function initMangaModal() {
    const mangaImages = document.querySelectorAll('.manga-image');
    const modal = document.querySelector('.manga-image-modal');
    if (!modal) return;

    const modalImg = document.querySelector('.manga-modal-content');
    const closeBtn = document.querySelector('.manga-modal-close');

    mangaImages.forEach(img => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
        }
    });

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
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

// Add loader control functions at the top level
function showLoader(sectionName) {
    const loader = document.querySelector('.cyberpunk-loader');
    const progress = loader.querySelector('.loader-progress');
    const text = loader.querySelector('.loader-text');
    const mainContainer = document.querySelector('.main-container');
    
    // Hide main content
    mainContainer.classList.add('loading');
    
    // Reset progress
    progress.style.width = '0%';
    
    // Update text
    text.textContent = `LOADING ${sectionName.toUpperCase()} SECTION`;
    
    // Show loader
    loader.classList.add('active');
    
    // Animate progress over 2 seconds
    progress.style.transition = 'width 2s ease';
    setTimeout(() => {
        progress.style.width = '100%';
    }, 50);
}

function hideLoader() {
    return new Promise(resolve => {
        const loader = document.querySelector('.cyberpunk-loader');
        const progress = loader.querySelector('.loader-progress');
        const mainContainer = document.querySelector('.main-container');
        
        // Ensure minimum 2 second load time
        setTimeout(() => {
            // Show main content
            mainContainer.classList.remove('loading');
            
            // Fade out loader
            loader.classList.remove('active');
            
            // Reset progress after animation
            setTimeout(() => {
                progress.style.transition = 'width 0.3s ease';
                progress.style.width = '0%';
                resolve();
            }, 300);
        }, 2000);
    });
}

// Handle sundial navigation
function initSundialNavigation() {
    const sundialNav = document.querySelector('.sundial-nav');
    const sections = document.querySelectorAll('.sundial-section');
    const mainContainer = document.querySelector('.main-container');
    const contentSections = document.querySelectorAll('section[id]');
    
    // Add navigation arrows to sundial nav
    if (sundialNav) {
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
        sundialNav.appendChild(navArrows);
        
        const sectionsContainer = sundialNav.querySelector('.sundial-sections');
        
        // Add scroll functionality
        leftArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Update arrow visibility
        function updateArrows() {
            const isAtStart = sectionsContainer.scrollLeft === 0;
            const isAtEnd = sectionsContainer.scrollLeft + sectionsContainer.offsetWidth >= sectionsContainer.scrollWidth - 10;
            
            leftArrow.style.opacity = isAtStart ? '0' : '0.8';
            leftArrow.style.pointerEvents = isAtStart ? 'none' : 'auto';
            
            rightArrow.style.opacity = isAtEnd ? '0' : '0.8';
            rightArrow.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }
        
        sectionsContainer.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        
        // Initial update
        setTimeout(updateArrows, 100);
    }

    // Check URL to determine current page
    function getCurrentPageFromUrl() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        // If there's a hash in the URL, use it for navigation
        if (hash) {
            return hash.substring(1); // Remove the # character
        }
        
        // Check if we're on a specific page based on the path
        if (path.includes('/blog/')) {
            return 'blog';
        } else if (path.includes('/projects/')) {
            return 'projects';
        } else if (path.includes('/skills/')) {
            return 'skills';
        } else if (path.includes('/experience/')) {
            return 'experience';
        } else if (path.includes('/about/')) {
            return 'about';
        } else if (path.includes('/games/')) {
            return 'games';
        }
        
        // Default to home if no specific page is detected
        return 'home';
    }
    
    // Update navigation based on current page
    function updateNavigationHighlight() {
        const currentPage = getCurrentPageFromUrl();
        
        // Remove active class from all nav items
        sections.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to current nav item
        const activeNavItem = document.querySelector(`.sundial-section[href="#${currentPage}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }
    
    // Call this immediately to set the correct navigation
    updateNavigationHighlight();

    // Handle section clicks with improved scroll behavior and loading animation
    sections.forEach(section => {
        section.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Get section name for loader
            const targetId = this.getAttribute('href').substring(1);
            const sectionName = targetId.charAt(0).toUpperCase() + targetId.slice(1);
            
            // Store the clicked section for reference
            const clickedSection = this;
            
            // Show loader with correct section name
            showLoader(sectionName);
            
            // Remove active class from all sections
            sections.forEach(s => {
                s.classList.remove('active');
                s.classList.remove('section-highlight');
            });
            
            // Get the target section and scroll to it
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Calculate offset considering any fixed headers
                const offset = targetSection.offsetTop;
                
                // Wait for minimum load time and animations
                await hideLoader();
                
                // Add active class to clicked section after loading
                clickedSection.classList.add('active');
                clickedSection.classList.add('section-highlight');
                
                // Scroll to section
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update the updateActiveSection function to handle loading states
    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const viewportCenter = scrollPosition + (windowHeight / 2);

        // Find the section that is currently most relevant
        let currentSection = null;
        let minDistance = Infinity;

        contentSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollPosition + rect.top;
            const sectionMiddle = sectionTop + (rect.height / 2);
            
            const distance = Math.abs(viewportCenter - sectionMiddle);
            
            if (distance < minDistance) {
                minDistance = distance;
                currentSection = section;
            }
        });

        if (currentSection) {
            const previousActive = document.querySelector('.sundial-section.active');
            const newActive = document.querySelector(`.sundial-section[href="#${currentSection.id}"]`);
            
            // Only update if we're changing sections and not during a loading state
            if (previousActive && newActive && previousActive !== newActive) {
                const loader = document.querySelector('.cyberpunk-loader');
                // Only proceed if loader is not active
                if (!loader.classList.contains('active')) {
                    // Remove active class from all nav items
                    sections.forEach(navItem => {
                        navItem.classList.remove('active');
                        navItem.classList.remove('section-highlight');
                    });
                    
                    // Add active class to corresponding nav item
                    if (newActive) {
                        newActive.classList.add('active');
                        newActive.classList.add('section-highlight');
                    }
                }
            }
        }
    }

    // Handle scroll with debouncing and immediate update
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollThrottle = 50; // Minimum time between updates in ms

    window.addEventListener('scroll', function() {
        // Don't update during loading
        const loader = document.querySelector('.cyberpunk-loader');
        if (loader.classList.contains('active')) return;

        const now = Date.now();
        
        // Clear any pending timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // If enough time has passed since last update, update immediately
        if (now - lastScrollTime >= scrollThrottle) {
            updateActiveSection();
            lastScrollTime = now;
        } else {
            // Otherwise, set a timeout for a deferred update
            scrollTimeout = setTimeout(function() {
                updateActiveSection();
                lastScrollTime = Date.now();
            }, scrollThrottle);
        }
    });

    // Initial check for active section with a slight delay to ensure proper layout
    setTimeout(updateActiveSection, 100);

    // Update active section when window is resized with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
            updateActiveSection();
        }, 150);
    });

    // Listen for URL changes and update navigation
    window.addEventListener('hashchange', updateNavigationHighlight);
    
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

// Handle blog carousel navigation
function initBlogCarousel() {
    // Support direct DOM access for backward compatibility
    const blogGrid = document.querySelector('.blog-grid');
    const nextBtn = document.querySelector('.blog-scroll-btn.next');
    const prevBtn = document.querySelector('.blog-scroll-btn.prev');
    
    if (blogGrid && nextBtn && prevBtn) {
        setupBlogCarousel(blogGrid, nextBtn, prevBtn);
    }
    
    // Otherwise, it's in an iframe and handled there
}

// Setup function for blog carousel
function setupBlogCarousel(blogGrid, nextBtn, prevBtn) {
    nextBtn.addEventListener('click', () => {
        const scrollAmount = blogGrid.offsetWidth * 0.8;
        blogGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    
    prevBtn.addEventListener('click', () => {
        const scrollAmount = blogGrid.offsetWidth * 0.8;
        blogGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    // Update scroll buttons visibility
    function updateScrollButtons() {
        const isAtStart = blogGrid.scrollLeft <= 10;
        const isAtEnd = blogGrid.scrollLeft + blogGrid.offsetWidth >= blogGrid.scrollWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.3' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }
    
    blogGrid.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    
    // Initial update
    updateScrollButtons();
}

// Initialize and handle the blog iframe
function initBlogIframe() {
    const blogFrame = document.getElementById('blog-frame');
    if (blogFrame) {
        blogFrame.onload = function() {
            resizeIframe(blogFrame);
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(blogFrame);
        });
    }
}

// Initialize and handle the experience iframe
function initExperienceIframe() {
    const experienceFrame = document.getElementById('experience-frame');
    if (experienceFrame) {
        experienceFrame.onload = function() {
            resizeIframe(experienceFrame);
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(experienceFrame);
        });
    }
}

// Initialize and handle the projects iframe
function initProjectsIframe() {
    const projectsFrame = document.getElementById('projects-frame');
    if (projectsFrame) {
        projectsFrame.onload = function() {
            resizeIframe(projectsFrame);
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(projectsFrame);
        });
    }
}

// Initialize and handle the manga iframe
function initMangaIframe() {
    const mangaFrame = document.getElementById('manga-frame');
    if (mangaFrame) {
        mangaFrame.onload = function() {
            resizeIframe(mangaFrame);
            
            // Ensure manga modal works properly through the iframe
            try {
                const iframeWindow = mangaFrame.contentWindow;
                if (iframeWindow.document.querySelector('.manga-image-modal')) {
                    // The modal is inside the iframe, no need to initialize it in the parent
                    mangaImagesInIframe = true;
                }
            } catch (error) {
                console.log("Could not access manga iframe content", error);
            }
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(mangaFrame);
        });
    }
}

// Initialize and handle the skills iframe
function initSkillsIframe() {
    const skillsFrame = document.getElementById('skills-frame');
    if (skillsFrame) {
        skillsFrame.onload = function() {
            resizeIframe(skillsFrame);
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(skillsFrame);
        });
    }
}

// Initialize and handle the games iframe
function initGamesIframe() {
    const gamesFrame = document.getElementById('games-frame');
    if (gamesFrame) {
        gamesFrame.onload = function() {
            resizeIframe(gamesFrame);
            
            // Ensure the tic-tac-toe game works properly in the iframe
            try {
                const iframeWindow = gamesFrame.contentWindow;
                if (iframeWindow.document.querySelector('.ultimate-tic-tac-toe')) {
                    // The game is inside the iframe, no need to initialize it in the parent
                    ticTacToeInIframe = true;
                }
            } catch (error) {
                console.log("Could not access games iframe content", error);
            }
        };
        
        window.addEventListener('resize', function() {
            resizeIframe(gamesFrame);
        });
    }
}

// Initialize blog modes functionality
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

// Initialize mobile swipe functionality for card deck
function initMobileSwipe() {
    if (window.innerWidth <= 768) {
        const cards = Array.from(document.querySelectorAll('.data-card'));
        if (cards.length === 0) return;
        
        let currentCardIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Create/update swipe dots
        const swipeIndicator = document.querySelector('.swipe-indicator');
        if (swipeIndicator) {
            const swipeDots = swipeIndicator.querySelector('.swipe-dots');
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

// Initialize blog component with all features
function initBlogComponent() {
    initBlogModes();
    initCardDeck();
    initMobileSwipe();
    initMobileParallax();
}

// Simple smooth scrolling function
function initSmoothScrolling() {
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
}

// Initialize element animations
function initElementAnimations() {
    // Observe elements with animation classes
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                elementObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in, .timeline-item, .project-card').forEach(el => {
        elementObserver.observe(el);
    });
} 