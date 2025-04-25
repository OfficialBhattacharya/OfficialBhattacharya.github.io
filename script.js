// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Check if it's a mobile device
            if (window.innerWidth <= 768) {
                // On mobile, just scroll to the section without smooth behavior
                target.scrollIntoView({
                    behavior: 'auto',
                    block: 'start'
                });
            } else {
                // On desktop, use smooth scrolling
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Reset the vertical scroll position of the section
            if (target.tagName === 'SECTION') {
                setTimeout(() => {
                    target.scrollTop = 0;
                }, 100);
            }
        }
    });
});

// Fixed function for ensuring home page layout is correct
function fixHomePageLayout() {
    const homeSection = document.getElementById('home');
    if (homeSection) {
        // Make sure home section takes full height and is centered
        homeSection.style.height = '100vh';
        homeSection.style.display = 'flex';
        homeSection.style.flexDirection = 'column';
        homeSection.style.justifyContent = 'center';
        
        // Fix hero content alignment
        const heroContent = homeSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.display = 'flex';
            heroContent.style.alignItems = 'center';
            heroContent.style.justifyContent = 'space-between';
            
            // Ensure text and profile are properly sized
            const heroText = heroContent.querySelector('.hero-text');
            const profileSketch = heroContent.querySelector('.profile-sketch');
            
            if (heroText) {
                heroText.style.flex = '1';
                heroText.style.padding = '1rem';
            }
            
            if (profileSketch) {
                profileSketch.style.display = 'flex';
                profileSketch.style.justifyContent = 'center';
                profileSketch.style.alignItems = 'center';
            }
        }
        
        // Initialize cyberpunk effects
        if (typeof initCyberpunkNameAnimation === 'function') {
            initCyberpunkNameAnimation();
        }
        if (typeof createBinaryRain === 'function') {
            createBinaryRain();
        }
        if (typeof initParticles === 'function') {
            initParticles();
        }
    }
}

// Disable automatic scroll snapping on mobile
function handleMobileScroll() {
    if (window.innerWidth <= 768) {
        document.body.style.overscrollBehavior = 'auto';
        document.documentElement.style.scrollBehavior = 'auto';
    } else {
        document.body.style.overscrollBehavior = 'contain';
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

// Add resize listener to handle mobile/desktop transitions
window.addEventListener('resize', handleMobileScroll);
// Initial call
handleMobileScroll();

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
    
    // Initialize tech stack interactivity
    initTechStackInteractivity();
    
    // Observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
        // Reset all sections' scroll position initially
        section.scrollTop = 0;
    });

    initGameNavigation();

    // Function to reset scroll positions in sections when switching
    function resetSectionScrollPositions() {
        document.querySelectorAll('section').forEach(section => {
            section.scrollTop = 0;
            
            // Also reset scroll position for any iframes within sections
            const iframes = section.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    // Try to access iframe content and reset scroll
                    if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.body) {
                        iframe.contentWindow.document.body.scrollTop = 0;
                        iframe.contentWindow.document.documentElement.scrollTop = 0;
                    }
                } catch (e) {
                    // Silently fail for cross-origin iframes
                    console.log("Could not reset iframe scroll position");
                }
            });
        });
    }

    // Call once on load
    resetSectionScrollPositions();

    // Reset on section change
    window.addEventListener('hashchange', resetSectionScrollPositions);
    
    // Make sure scroll behavior is corrected after all content loads
    window.addEventListener('load', resetSectionScrollPositions);
    
    // Add event listener for any iframe loads to ensure scroll is reset
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('load', function() {
            try {
                this.contentWindow.document.body.scrollTop = 0;
                this.contentWindow.document.documentElement.scrollTop = 0;
            } catch (e) {
                // Silently fail for cross-origin iframes
                console.log("Could not reset iframe scroll position");
            }
        });
    });
    
    // Fix initial section visibility based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const targetSection = document.getElementById(initialHash);
        if (targetSection) {
            document.querySelectorAll('section').forEach(section => {
                section.style.display = section === targetSection ? 'block' : 'none';
            });
            targetSection.scrollTop = 0;
        }
    } else {
        // If no hash is present, ensure home section is displayed correctly
        fixHomePageLayout();
    }

    // Add MacBook optimization
    optimizeForMacBook();
    
    // Apply home page layout fix with a slight delay to ensure all elements are loaded
    setTimeout(fixHomePageLayout, 100);
});

// Call fixHomePageLayout on window load as well to catch any late-loaded elements
window.addEventListener('load', function() {
    fixHomePageLayout();
});

// Recheck on window resize
window.addEventListener('resize', function() {
    optimizeForMacBook();
    // Also fix home layout when resizing to ensure it stays responsive
    if (!window.location.hash || window.location.hash === '#home') {
        fixHomePageLayout();
    }
});

// Also ensure the hero layout is fixed when clicking the home navigation link
document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', function() {
        setTimeout(fixHomePageLayout, 100);
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
    if (!loader) return; // Guard against missing loader element
    
    const progress = loader.querySelector('.loader-progress');
    const text = loader.querySelector('.loader-text');
    const mainContainer = document.querySelector('.main-container');
    
    // Hide main content
    if (mainContainer) {
        mainContainer.classList.add('loading');
    }
    
    // Reset progress
    if (progress) {
        progress.style.width = '0%';
        // Animate progress over 1 second (faster loading)
        progress.style.transition = 'width 1s ease';
        setTimeout(() => {
            progress.style.width = '100%';
        }, 50);
    }
    
    // Update text
    if (text) {
        text.textContent = `LOADING ${sectionName.toUpperCase()} SECTION`;
    }
    
    // Show loader
    loader.classList.add('active');
}

function hideLoader() {
    return new Promise(resolve => {
        const loader = document.querySelector('.cyberpunk-loader');
        if (!loader) {
            resolve();
            return;
        }
        
        const progress = loader.querySelector('.loader-progress');
        const mainContainer = document.querySelector('.main-container');
        
        // Show main content
        if (mainContainer) {
            mainContainer.classList.remove('loading');
        }
        
        // Fade out loader
        loader.classList.remove('active');
        
        // Reset progress after animation
        setTimeout(() => {
            if (progress) {
                progress.style.transition = 'width 0.3s ease';
                progress.style.width = '0%';
            }
            resolve();
        }, 300);
    });
}

// Handle sundial navigation
function initSundialNavigation() {
    const sundialNav = document.querySelector('.sundial-nav');
    if (!sundialNav) return;

    const sections = document.querySelectorAll('section');
    const navLinks = sundialNav.querySelectorAll('.sundial-section');
    const leftArrow = sundialNav.querySelector('.sundial-arrow.left');
    const rightArrow = sundialNav.querySelector('.sundial-arrow.right');
    const sectionsContainer = sundialNav.querySelector('.sundial-sections');

    // Add click event to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSectionId = this.getAttribute('href').substring(1);
            
            // Show loader while section loads
            showLoader(targetSectionId);
            
            // Apply section-specific initialization
            if (targetSectionId === 'home') {
                // Ensure home section is properly laid out
                setTimeout(fixHomePageLayout, 50);
            }
            
            // Update URL hash
            window.location.hash = targetSectionId;
            
            // Update navigation state
            updateNavigationHighlight();
            
            // Hide loader after a brief delay
            setTimeout(hideLoader, 500);
        });
    });

    // Add navigation arrows to sundial nav
    if (leftArrow && rightArrow) {
        const navArrows = document.createElement('div');
        navArrows.className = 'sundial-nav-arrows';
        navArrows.appendChild(leftArrow);
        navArrows.appendChild(rightArrow);
        sundialNav.appendChild(navArrows);
        
        // Add scroll functionality
        leftArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: -100, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            sectionsContainer.scrollBy({ left: 100, behavior: 'smooth' });
        });
        
        // Add scroll event listener to update arrows
        sectionsContainer.addEventListener('scroll', updateArrows);
        
        // Update arrows on resize
        window.addEventListener('resize', updateArrows);
        
        // Initial update
        setTimeout(updateArrows, 100);
    }
    
    function updateArrows() {
        if (!sectionsContainer) return;
        
        const scrollLeft = sectionsContainer.scrollLeft;
        const maxScrollLeft = sectionsContainer.scrollWidth - sectionsContainer.clientWidth;
        
        // Show/hide arrows based on scroll position
        if (leftArrow) {
            leftArrow.style.opacity = scrollLeft > 10 ? '1' : '0';
        }
        
        if (rightArrow) {
            rightArrow.style.opacity = scrollLeft < maxScrollLeft - 10 ? '1' : '0';
        }
    }
    
    function getCurrentPageFromUrl() {
        const hash = window.location.hash.substring(1);
        return hash || 'home';
    }
    
    function updateNavigationHighlight() {
        const currentPage = getCurrentPageFromUrl();
        
        // Remove active class from all links
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Function to update active section based on hash
    function updateActiveSection() {
        const hash = window.location.hash.substring(1) || 'home';
        const activeSection = document.getElementById(hash);
        
        if (activeSection) {
            // Hide all sections except the active one
            sections.forEach(section => {
                if (section === activeSection) {
                    section.style.display = section.id === 'home' ? 'flex' : 'block';
                    section.scrollTop = 0;
                    
                    // Special handling for home section
                    if (section.id === 'home') {
                        fixHomePageLayout();
                    }
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Update navigation highlight
            updateNavigationHighlight();
        }
    }
    
    // Handle section clicks with improved scroll behavior and loading animation
    window.addEventListener('hashchange', updateActiveSection);
    
    // Initial update based on current URL
    updateActiveSection();
    updateNavigationHighlight();
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

        // Check if game is over
        if (!gameActive) return;
        
        // Check if cell is already played
        if (gameState[boardIndex][cellIndex] !== '') return;
        
        // Check if board is already won or full
        if (boardStates[boardIndex] !== null) return;

        // Check if move is valid based on next board rule
        if (nextBoard !== null && boardIndex !== nextBoard) return;

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
        if (gameActive && !isPlayerTurn) {
            // If nextBoard is null or the designated board is full/won, any board is valid
            let validBoards = [];
            if (nextBoard === null || boardStates[nextBoard] !== null) {
                for (let i = 0; i < 9; i++) {
                    if (boardStates[i] === null) {
                        validBoards.push(i);
                    }
                }
            } else {
                validBoards = [nextBoard];
            }
            
            if (validBoards.length === 0) {
                // This shouldn't happen due to game end checks, but just in case
                gameActive = false;
                gameStatus.textContent = "Game over - Draw!";
                return;
            }
            
            // Choose a random valid board
            const randomBoardIndex = validBoards[Math.floor(Math.random() * validBoards.length)];
            
            // Find empty cells in the chosen board
            const emptyCells = [];
            for (let i = 0; i < 9; i++) {
                if (gameState[randomBoardIndex][i] === '') {
                    emptyCells.push(i);
                }
            }
            
            if (emptyCells.length === 0) {
                // Try another board (this is a failsafe, should be prevented by validBoards logic)
                computerMove();
                return;
            }
            
            // Choose a random empty cell
            const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            
            // Make the move
            makeMove(randomBoardIndex, randomCellIndex, 'O');
            
            if (checkGameEnd()) return;
            
            // Switch back to player's turn
            isPlayerTurn = true;
            gameStatus.textContent = "Your turn";
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
    const blogContainer = document.querySelector('.blog-container');
    const viewButtons = document.querySelectorAll('.view-mode-button');
    
    if (!blogContainer || !viewButtons.length) return;

    // Set initial view mode from localStorage or default to grid
    const savedMode = localStorage.getItem('blogViewMode') || 'grid';
    blogContainer.className = `blog-container blog-${savedMode}-view`;
    updateActiveButton(savedMode);
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.view;
            const currentMode = blogContainer.className.includes('grid-view') ? 'grid' : 'list';
            
            // Don't do anything if clicking the current mode
            if (mode === currentMode) return;
            
            // Remove old view class and add new one
            blogContainer.classList.remove(`blog-${currentMode}-view`);
            blogContainer.classList.add(`blog-${mode}-view`);
            
            // Store the preference
            localStorage.setItem('blogViewMode', mode);
            
            // Update active button state
            updateActiveButton(mode);
        });
    });
}

function updateActiveButton(mode) {
    const buttons = document.querySelectorAll('.view-mode-button');
    buttons.forEach(button => {
        if (button.dataset.view === mode) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
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

// Wordle Game Logic
class WordleGame {
    constructor() {
        this.board = document.querySelector('.wordle-board');
        this.keyboard = document.querySelector('.wordle-keyboard');
        this.status = document.querySelector('.wordle-status');
        this.restartButton = document.querySelector('.wordle-restart-button');
        
        this.wordLength = 8; // Length of expressions like "12+34=46"
        this.maxAttempts = 6;
        this.currentRow = 0;
        this.currentCell = 0;
        this.gameOver = false;
        
        if (!this.board || !this.status || !this.keyboard || !this.restartButton) {
            console.error('Required Math Wordle elements not found');
            return;
        }
        
        this.initializeGame();
        this.setupEventListeners();
    }

    generateExpressions() {
        // Instead of generating a list, we'll generate a single random expression
        const operators = ['+', '-', '×', '÷'];
        let expression;
        let isValid = false;

        while (!isValid) {
            try {
                // Generate 2-3 numbers between 1-9
                const numCount = Math.random() < 0.5 ? 2 : 3;
                let numbers = [];
                let ops = [];

                // Generate first number (1-9)
                numbers.push(Math.floor(Math.random() * 9) + 1);

                // Generate subsequent numbers and operators
                for (let i = 1; i < numCount; i++) {
                    // Choose operator
                    const op = operators[Math.floor(Math.random() * operators.length)];
                    ops.push(op);
                    
                    // Generate number (1-9)
                    const num = Math.floor(Math.random() * 9) + 1;
                    numbers.push(num);
                }

                // Build expression string
                expression = numbers[0].toString();
                for (let i = 0; i < ops.length; i++) {
                    expression += ops[i] + numbers[i + 1].toString();
                }

                // Calculate result
                let evalExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
                const result = eval(evalExpr);

                // Validate result
                if (Number.isInteger(result) && result > 0 && result <= 99) {
                    // Check for division (must result in whole number)
                    if (expression.includes('÷')) {
                        const parts = expression.split('÷');
                        if (parts.some(part => {
                            const num = parseInt(part);
                            return !Number.isInteger(num);
                        })) {
                            continue;
                        }
                    }
                    
                    expression += '=' + result;
                    isValid = true;
                }
            } catch (e) {
                // If any error occurs, try again
                continue;
            }
        }

        // Set the current word directly instead of maintaining a list
        this.currentWord = expression;
    }
    
    initializeGame() {
        this.generateExpressions(); // This now sets this.currentWord directly
        this.currentRow = 0;
        this.currentCell = 0;
        this.gameOver = false;
        this.status.textContent = 'Enter a calculation (e.g., "1+3+8=12" or "2×3+4=10")';
        this.clearBoard();
        this.clearKeyboard();
        console.log('Game initialized with calculation:', this.currentWord);
    }
    
    setupEventListeners() {
        // Physical keyboard input
        document.addEventListener('keydown', (e) => {
            e.preventDefault(); // Prevent default to avoid double input
            this.handleKeyPress(e);
        });

        // On-screen keyboard input
        this.keyboard.addEventListener('click', (e) => {
            const key = e.target;
            if (!key.classList.contains('key')) return;
            
            let keyValue;
            if (key.classList.contains('enter')) {
                keyValue = 'Enter';
            } else if (key.classList.contains('backspace')) {
                keyValue = 'Backspace';
            } else {
                keyValue = key.textContent;
            }
            
            this.handleKeyPress({ key: keyValue, preventDefault: () => {} });
        });

        // Restart button
        this.restartButton.addEventListener('click', () => this.initializeGame());
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        const key = e.key.toUpperCase();
        console.log('Key pressed:', key); // For debugging
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (this.isValidInput(key)) {
            this.addLetter(key);
        }
    }

    isValidInput(key) {
        // Allow numbers, operators, and equals sign
        return /^[0-9]$/.test(key) || // Numbers
               ['+', '-', '×', '÷', '='].includes(key); // Operators
    }
    
    isValidExpression(expr) {
        try {
            // Split into calculation and result
            const parts = expr.split('=');
            if (parts.length !== 2) return false;

            const [calculation, resultStr] = parts;
            const expectedResult = parseInt(resultStr);

            // Replace × and ÷ with * and / for evaluation
            let evalExpr = calculation
                .replace(/×/g, '*')
                .replace(/÷/g, '/');

            // Validate format: only contains numbers and valid operators
            if (!/^[0-9+\-×÷]+$/.test(calculation)) {
                return false;
            }

            // Check for invalid operator sequences
            if (/[+\-×÷]{2,}/.test(calculation)) {
                return false;
            }

            // Check if expression starts or ends with an operator
            if (/^[+\-×÷]/.test(calculation) || /[+\-×÷]$/.test(calculation)) {
                return false;
            }

            // Evaluate the expression
            const result = eval(evalExpr);

            // Check if result is a valid number and matches expected result
            if (isNaN(result) || !isFinite(result)) {
                return false;
            }

            // Check if result is an integer and within bounds
            if (!Number.isInteger(result) || result < 1 || result > 99) {
                return false;
            }

            return result === expectedResult;
        } catch (e) {
            return false;
        }
    }
    
    addLetter(letter) {
        if (this.currentCell >= this.wordLength) return;
        
        const row = this.board.children[this.currentRow];
        if (!row) return;
        
        const cell = row.children[this.currentCell];
        if (!cell) return;
        
        // Prevent multiple operators in a row
        const currentGuess = this.getCurrentGuess();
        const lastChar = currentGuess[currentGuess.length - 1];
        if (['+', '-', '×', '÷'].includes(lastChar) && ['+', '-', '×', '÷'].includes(letter)) {
            return;
        }
        
        cell.textContent = letter;
        cell.classList.add('filled');
        this.currentCell++;
    }
    
    deleteLetter() {
        if (this.currentCell <= 0) return;
        
        this.currentCell--;
        const row = this.board.children[this.currentRow];
        if (!row) return;
        
        const cell = row.children[this.currentCell];
        if (!cell) return;
        
        cell.textContent = '';
        cell.classList.remove('filled');
        
        console.log('Letter deleted at cell:', this.currentCell); // For debugging
    }
    
    submitGuess() {
        const guess = this.getCurrentGuess();
        
        // Check if the expression is complete (has an equals sign)
        if (!guess.includes('=')) {
            this.shakeRow();
            this.status.textContent = 'Complete the calculation with an equals sign!';
            return;
        }
        
        // Validate the mathematical expression
        if (!this.isValidExpression(guess)) {
            this.shakeRow();
            this.status.textContent = 'Invalid calculation! Must be a valid equation.';
            return;
        }
        
        this.evaluateGuess(guess);
        
        if (guess === this.currentWord) {
            this.gameWon();
        } else if (this.currentRow === this.maxAttempts - 1) {
            this.gameLost();
        } else {
            this.currentRow++;
            this.currentCell = 0;
            this.status.textContent = 'Keep guessing! Enter another calculation.';
        }
    }
    
    evaluateGuess(guess) {
        const row = this.board.children[this.currentRow];
        const letterCount = {};
        
        // Count characters in the target expression
        for (let char of this.currentWord) {
            letterCount[char] = (letterCount[char] || 0) + 1;
        }
        
        // First pass: Mark correct positions
        for (let i = 0; i < this.wordLength; i++) {
            const cell = row.children[i];
            const char = guess[i];
            
            if (char === this.currentWord[i]) {
                cell.classList.add('correct');
                letterCount[char]--;
                this.updateKeyboard(char, 'correct');
            }
        }
        
        // Second pass: Mark present characters
        for (let i = 0; i < this.wordLength; i++) {
            const cell = row.children[i];
            const char = guess[i];
            
            if (!cell.classList.contains('correct') && letterCount[char] > 0) {
                cell.classList.add('present');
                letterCount[char]--;
                this.updateKeyboard(char, 'present');
            } else if (!cell.classList.contains('correct')) {
                cell.classList.add('absent');
                this.updateKeyboard(char, 'absent');
            }
        }
        
        // Add flip animation
        for (let cell of row.children) {
            cell.classList.add('flip');
        }
    }
    
    updateKeyboard(letter, status) {
        const key = Array.from(this.keyboard.getElementsByClassName('key'))
            .find(k => k.textContent === letter);
            
        if (key) {
            if (status === 'correct' || 
                (status === 'present' && !key.classList.contains('correct')) ||
                (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present'))) {
                key.classList.add(status);
            }
        }
    }
    
    gameWon() {
        this.gameOver = true;
        this.status.textContent = 'Congratulations! You won!';
        setTimeout(() => {
            this.status.textContent = `The calculation was: ${this.currentWord}`;
        }, 2000);
    }
    
    gameLost() {
        this.gameOver = true;
        this.status.textContent = `Game Over! The calculation was: ${this.currentWord}`;
    }
    
    shakeRow() {
        const row = this.board.children[this.currentRow];
        row.classList.add('shake');
        setTimeout(() => row.classList.remove('shake'), 500);
    }
    
    clearBoard() {
        for (let row of this.board.children) {
            for (let cell of row.children) {
                cell.textContent = '';
                cell.className = 'wordle-cell';
            }
        }
    }
    
    clearKeyboard() {
        for (let key of this.keyboard.getElementsByClassName('key')) {
            key.className = 'key' + (key.classList.contains('enter') ? ' enter' : '') + 
                          (key.classList.contains('backspace') ? ' backspace' : '');
        }
    }

    getCurrentGuess() {
        const row = this.board.children[this.currentRow];
        return Array.from(row.children)
            .map(cell => cell.textContent)
            .join('');
    }
}

// Initialize Wordle game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game navigation first
    initGameNavigation();
    
    // Initialize Wordle with a slight delay to ensure DOM is ready
    setTimeout(() => {
        const wordleGame = new WordleGame();
        // Store the game instance on window for debugging
        window.wordleGame = wordleGame;
    }, 100);
});

// Initialize game navigation
function initGameNavigation() {
    const prevButton = document.querySelector('.game-nav-button.prev');
    const nextButton = document.querySelector('.game-nav-button.next');
    const gameCards = document.querySelectorAll('.game-card');
    let currentGameIndex = 0;

    // Initially hide prev button since we're at the first game
    prevButton.disabled = true;

    function updateGameVisibility() {
        gameCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentGameIndex) {
                card.classList.add('active');
            }
        });

        // Update button states
        prevButton.disabled = currentGameIndex === 0;
        nextButton.disabled = currentGameIndex === gameCards.length - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentGameIndex > 0) {
            currentGameIndex--;
            updateGameVisibility();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentGameIndex < gameCards.length - 1) {
            currentGameIndex++;
            updateGameVisibility();
        }
    });
}

// Subtraction Game Logic
class SubtractionGame {
    constructor() {
        this.totalSticks = 13;
        this.maxTake = 3;
        this.gameContainer = document.querySelector('.subtraction-game');
        this.sticksContainer = this.gameContainer.querySelector('.sticks-container');
        this.gameStatus = this.gameContainer.querySelector('.game-status');
        this.sticksCount = this.gameContainer.querySelector('.sticks-count');
        this.takeButtons = this.gameContainer.querySelectorAll('.take-button');
        this.restartButton = this.gameContainer.querySelector('.restart-button');
        
        this.initializeGame();
    }

    initializeGame() {
        this.totalSticks = 13;
        this.updateDisplay();
        this.setupEventListeners();
        this.gameStatus.textContent = "Your turn! Choose 1-3 sticks to remove.";
        this.enableButtons();
    }

    updateDisplay() {
        // Clear existing sticks
        this.sticksContainer.innerHTML = '';
        
        // Add current sticks
        for (let i = 0; i < this.totalSticks; i++) {
            const stick = document.createElement('div');
            stick.className = 'stick';
            this.sticksContainer.appendChild(stick);
        }
        
        this.sticksCount.textContent = this.totalSticks;
    }

    setupEventListeners() {
        this.takeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sticksToTake = parseInt(button.dataset.sticks);
                this.playerMove(sticksToTake);
            });
        });

        this.restartButton.addEventListener('click', () => {
            this.initializeGame();
        });
    }

    playerMove(sticksToTake) {
        if (sticksToTake > this.totalSticks) return;
        
        this.totalSticks -= sticksToTake;
        this.updateDisplay();
        
        if (this.totalSticks === 0) {
            this.gameStatus.textContent = "Congratulations! You win!";
            this.disableButtons();
            return;
        }
        
        this.gameStatus.textContent = "Computer is thinking...";
        this.disableButtons();
        
        setTimeout(() => {
            this.computerMove();
        }, 1000);
    }

    computerMove() {
        // Winning strategy: Make the number of sticks equal to 4k+1 (where k is some non-negative integer)
        let computerTake;
        const remainder = this.totalSticks % 4;
        
        if (remainder === 0) {
            computerTake = 3;
        } else if (remainder === 3) {
            computerTake = 2;
        } else if (remainder === 2) {
            computerTake = 1;
        } else { // remainder === 1
            // If we can't force a winning position, take 1 stick
            computerTake = 1;
        }
        
        // Ensure we don't take more sticks than available
        computerTake = Math.min(computerTake, this.totalSticks);
        
        this.totalSticks -= computerTake;
        this.updateDisplay();
        
        if (this.totalSticks === 0) {
            this.gameStatus.textContent = "Computer wins! Try again!";
            this.disableButtons();
            return;
        }
        
        this.gameStatus.textContent = `Computer took ${computerTake} stick${computerTake > 1 ? 's' : ''}. Your turn!`;
        this.enableButtons();
    }

    enableButtons() {
        this.takeButtons.forEach(button => {
            const sticksToTake = parseInt(button.dataset.sticks);
            button.disabled = sticksToTake > this.totalSticks;
        });
    }

    disableButtons() {
        this.takeButtons.forEach(button => {
            button.disabled = true;
        });
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing game initializations ...
    
    // Initialize Subtraction Game
    const subtractionGame = new SubtractionGame();
});

// Hi-Low Predictions Game Logic
class HiLowGame {
    constructor() {
        this.deck = [];
        this.currentCard = null;
        this.nextCard = null;
        this.gameStarted = false;
        
        // DOM Elements
        this.currentCardElement = document.querySelector('.current-card');
        this.predictionButtons = document.querySelector('.prediction-buttons');
        this.higherButton = document.querySelector('.predict-button.higher');
        this.lowerButton = document.querySelector('.predict-button.lower');
        this.beginButton = document.querySelector('.begin-game-button');
        
        // Initialize event listeners
        this.initializeEventListeners();
        this.initializeDeck();
        
        // Initially hide prediction buttons and disable them
        this.hidePredictionButtons();
        this.disablePredictionButtons();
    }

    initializeEventListeners() {
        this.beginButton.addEventListener('click', () => this.startGame());
        this.higherButton.addEventListener('click', () => this.makeGuess('higher'));
        this.lowerButton.addEventListener('click', () => this.makeGuess('lower'));
    }

    initializeDeck() {
        // Create a deck of cards (1-13, each appearing 4 times for different suits)
        for (let i = 1; i <= 13; i++) {
            for (let j = 0; j < 4; j++) {
                this.deck.push(i);
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    startGame() {
        this.shuffleDeck();
        this.gameStarted = true;
        this.currentCard = this.deck.pop();
        this.nextCard = this.deck.pop();
        this.updateCurrentCardDisplay();
        this.beginButton.style.display = 'none';
        this.showPredictionButtons();
        this.enablePredictionButtons();
    }

    showPredictionButtons() {
        this.predictionButtons.classList.add('visible');
    }

    hidePredictionButtons() {
        this.predictionButtons.classList.remove('visible');
    }

    updateCurrentCardDisplay() {
        if (this.currentCard === null) {
            this.currentCardElement.innerHTML = '';
            return;
        }
        const cardDiv = document.createElement('div');
        cardDiv.className = 'playing-card';
        cardDiv.innerHTML = this.getCardDisplay(this.currentCard);
        this.currentCardElement.innerHTML = '';
        this.currentCardElement.appendChild(cardDiv);
    }

    getCardDisplay(value) {
        const cardValues = {
            1: 'A',
            11: 'J',
            12: 'Q',
            13: 'K'
        };
        return `${cardValues[value] || value}<span class="spades">♠</span>`;
    }

    enablePredictionButtons() {
        this.higherButton.disabled = false;
        this.lowerButton.disabled = false;
    }

    disablePredictionButtons() {
        this.higherButton.disabled = true;
        this.lowerButton.disabled = true;
    }

    makeGuess(prediction) {
        const isCorrect = prediction === 'higher' ? 
            this.nextCard > this.currentCard :
            this.nextCard < this.currentCard;

        this.disablePredictionButtons();
        
        setTimeout(() => {
            if (isCorrect) {
                this.currentCard = this.nextCard;
                this.nextCard = this.deck.pop();
                this.updateCurrentCardDisplay();
                if (this.deck.length > 0) {
                    this.enablePredictionButtons();
                } else {
                    alert('Congratulations! You\'ve completed the deck!');
                    this.resetGame();
                }
            } else {
                alert('Wrong guess! Game Over!');
                this.resetGame();
            }
        }, 500);
    }

    resetGame() {
        this.gameStarted = false;
        this.currentCard = null;
        this.nextCard = null;
        this.currentCardElement.innerHTML = '';
        this.beginButton.style.display = 'block';
        this.hidePredictionButtons();
        this.disablePredictionButtons();
        this.initializeDeck();
    }
}

// Initialize the Hi-Low game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const hiLowGame = new HiLowGame();
});

// Initialize interactive effects for the technical stack section
function initTechStackInteractivity() {
    const techCards = document.querySelectorAll('.tech-stack-card');
    
    techCards.forEach(card => {
        // Create skill highlight effect
        const techItems = card.querySelector('.tech-stack-items');
        if (techItems) {
            const skills = techItems.textContent.split('|');
            const newContent = skills.map(skill => {
                return `<span class="tech-skill">${skill.trim()}</span>`;
            }).join(' | ');
            techItems.innerHTML = newContent;
            
            // Add hover effect to individual skills
            const techSkills = card.querySelectorAll('.tech-skill');
            techSkills.forEach(skill => {
                skill.addEventListener('mouseover', () => {
                    skill.style.color = '#00ff9d';
                    skill.style.textShadow = '0 0 10px rgba(0, 255, 157, 0.8)';
                });
                
                skill.addEventListener('mouseout', () => {
                    skill.style.color = '';
                    skill.style.textShadow = '';
                });
            });
        }
        
        // Add particle effect on hover
        card.addEventListener('mouseenter', () => {
            createTechStackParticles(card);
        });
        
        // Add glow pulse to icon on hover
        const icon = card.querySelector('.tech-stack-icon');
        if (icon) {
            card.addEventListener('mouseover', () => {
                icon.classList.add('glowing');
            });
            
            card.addEventListener('mouseout', () => {
                icon.classList.remove('glowing');
            });
        }
    });
}

// Create tech stack particle effects
function createTechStackParticles(card) {
    // Get card dimensions and position
    const rect = card.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;
    
    // Create particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('tech-particle');
        
        // Random position around the card border
        let x, y;
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        
        switch (side) {
            case 0: // top
                x = offsetX + Math.random() * rect.width;
                y = offsetY;
                break;
            case 1: // right
                x = offsetX + rect.width;
                y = offsetY + Math.random() * rect.height;
                break;
            case 2: // bottom
                x = offsetX + Math.random() * rect.width;
                y = offsetY + rect.height;
                break;
            case 3: // left
                x = offsetX;
                y = offsetY + Math.random() * rect.height;
                break;
        }
        
        // Apply position and styling
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random color (cyan or magenta)
        const colors = ['#00ff9d', '#00f7ff', '#ff00ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        particle.style.boxShadow = `0 0 10px ${randomColor}`;
        
        // Random size
        const size = 2 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Apply random animation duration and delay
        const duration = 0.8 + Math.random() * 1.2;
        const delay = Math.random() * 0.2;
        
        particle.style.animation = `float ${duration}s ease-out ${delay}s`;
        
        // Add to document
        document.body.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(particle);
        }, (duration + delay) * 1000);
    }
}

// MacBook screen size detection and optimization
function optimizeForMacBook() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Common MacBook screen resolutions
    const isMacBook = (
        // MacBook Pro 13" and 14" at various scalings
        (width >= 1280 && width <= 1440 && height >= 800 && height <= 900) || 
        (width >= 1440 && width <= 1600 && height >= 900 && height <= 1000) ||
        // MacBook Pro 16" at various scalings
        (width >= 1536 && width <= 1792 && height >= 960 && height <= 1120) ||
        // For high pixel density displays using scaled resolution
        (pixelRatio > 1 && width >= 1280 && width <= 1792)
    );
    
    if (isMacBook) {
        document.documentElement.classList.add('macbook-screen');
        
        // Apply specific optimizations based on screen width
        if (width >= 1280 && width <= 1440) {
            document.documentElement.classList.add('macbook-13');
        } else if (width >= 1441 && width <= 1600) {
            document.documentElement.classList.add('macbook-16');
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    
    // Add MacBook optimization
    optimizeForMacBook();
});

// Recheck on window resize
window.addEventListener('resize', function() {
    optimizeForMacBook();
});

// Resume button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const resumeButton = document.querySelector('.resume-button');
    if (resumeButton) {
        resumeButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            this.style.background = 'rgba(0, 0, 0, 0.8)';
            this.style.color = '#ffffff';
        });
        
        resumeButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
            this.style.background = 'rgba(0, 0, 0, 0.7)';
            this.style.color = '#00ff9d';
        });
    }
});

// Ensure mobile scrolling works properly, especially for skills section
document.addEventListener('DOMContentLoaded', function() {
    // Fix scrolling issues on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const sections = document.querySelectorAll('section');
        const skillsSection = document.getElementById('skills');
        
        // Ensure skills section scrolls properly
        if (skillsSection) {
            skillsSection.style.overflowY = 'auto';
            skillsSection.style.webkitOverflowScrolling = 'touch';
            
            // Add touch event listeners to improve scrolling
            skillsSection.addEventListener('touchstart', function(e) {
                // Prevent scroll blocking
                e.stopPropagation();
            }, { passive: true });
        }
        
        // Ensure all sections can scroll
        sections.forEach(section => {
            section.style.overflowY = 'auto';
            section.style.webkitOverflowScrolling = 'touch';
        });
    }
});
    