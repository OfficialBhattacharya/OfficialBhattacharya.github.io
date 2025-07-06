/**
 * Main JavaScript file
 * Handles all interactive functionality for the portfolio
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHomeAnimations();
    initTerminalEffects();
    initGames();
    initScrollAnimations();
    initResponsiveFeatures();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.sundial-section');
    const sections = document.querySelectorAll('section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Home section animations
 */
function initHomeAnimations() {
    initCyberpunkNameAnimation();
    createBinaryRain();
    initParticles();
}

function initCyberpunkNameAnimation() {
    const nameElement = document.getElementById('cyberpunkName');
    if (!nameElement) return;
    
    // Reset animation
    nameElement.style.opacity = '0';
    
    // Animate name with anime.js if available
    if (typeof anime !== 'undefined') {
        anime({
            targets: '#cyberpunkName',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: 300
        });
    } else {
        // Fallback animation
        setTimeout(() => {
            nameElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            nameElement.style.opacity = '1';
            nameElement.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add periodic glitch effect
    setInterval(() => {
        nameElement.style.textShadow = '2px 0 #ff003c, -2px 0 #00ff9d';
        setTimeout(() => {
            nameElement.style.textShadow = '0 0 15px rgba(0, 255, 157, 0.5)';
        }, 200);
    }, 3000);
}

function createBinaryRain() {
    const binaryRain = document.querySelector('.binary-rain');
    if (!binaryRain) return;
    
    // Clear existing content
    binaryRain.innerHTML = '';
    
    // Generate random binary digits
    const numDigits = 30;
    for (let i = 0; i < numDigits; i++) {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        
        const x = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 3;
        
        digit.style.left = `${x}%`;
        digit.style.animationDelay = `${delay}s`;
        digit.style.animationDuration = `${duration}s`;
        
        binaryRain.appendChild(digit);
    }
}

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear existing content
    particlesContainer.innerHTML = '';
    
    // Create particles
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(0, 255, 157, 0.6)';
        particle.style.borderRadius = '50%';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Terminal effects
 */
function initTerminalEffects() {
    // Blinking cursor
    const cursor = document.querySelector('.blink-cursor');
    if (cursor) {
        setInterval(() => {
            cursor.textContent = cursor.textContent === '_' ? '' : '_';
        }, 500);
    }
    
    // Animate stat values
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(statValue => {
        const finalValue = parseInt(statValue.textContent);
        if (isNaN(finalValue)) return;
        
        statValue.textContent = '0';
        
        let currentValue = 0;
        const interval = setInterval(() => {
            if (currentValue < finalValue) {
                currentValue++;
                statValue.textContent = currentValue + '+';
            } else {
                clearInterval(interval);
            }
        }, 100);
    });
    
    // Add hover effects to terminal items
    const termItems = document.querySelectorAll('.term-data-list > li');
    termItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const label = item.querySelector('.term-label');
            if (label) {
                label.style.textShadow = '0 0 10px rgba(255, 0, 127, 0.7)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const label = item.querySelector('.term-label');
            if (label) {
                label.style.textShadow = '0 0 5px rgba(255, 0, 127, 0.5)';
            }
        });
    });
}

/**
 * Games functionality
 */
function initGames() {
    initTicTacToe();
}

function initTicTacToe() {
    const cells = document.querySelectorAll('.cell');
    const boards = document.querySelectorAll('.main-board');
    const gameStatus = document.querySelector('.game-status');
    const restartBtn = document.querySelector('.restart-button');
    
    if (!cells.length || !gameStatus) return;
    
    let gameActive = true;
    let currentPlayer = 'X';
    let nextBoard = null;
    let gameState = {
        boardStates: Array(9).fill().map(() => Array(9).fill('')),
        mainBoardState: Array(9).fill('')
    };
    
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    
    // Add click event to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    // Add restart button event
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    function handleCellClick(e) {
        const cell = e.target;
        const boardIndex = parseInt(cell.parentNode.getAttribute('data-board'));
        const cellIndex = parseInt(cell.getAttribute('data-cell'));
        
        if (!isValidMove(boardIndex, cellIndex)) return;
        
        makeMove(boardIndex, cellIndex, currentPlayer);
        
        if (checkGameEnd()) return;
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        nextBoard = cellIndex;
        
        if (isBoardFull(nextBoard) || gameState.mainBoardState[nextBoard] !== '') {
            nextBoard = null;
        }
        
        updateBoardHighlights();
        gameStatus.textContent = `${currentPlayer}'s turn`;
        
        if (currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500);
        }
    }
    
    function isValidMove(boardIndex, cellIndex) {
        return gameActive && 
               gameState.boardStates[boardIndex][cellIndex] === '' && 
               gameState.mainBoardState[boardIndex] === '' &&
               (nextBoard === null || boardIndex === nextBoard);
    }
    
    function makeMove(boardIndex, cellIndex, player) {
        gameState.boardStates[boardIndex][cellIndex] = player;
        
        const cell = document.querySelector(`.main-board[data-board="${boardIndex}"] .cell[data-cell="${cellIndex}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        if (checkBoardWin(boardIndex, player)) {
            gameState.mainBoardState[boardIndex] = player;
            highlightBoardWin(boardIndex, player);
        } else if (isBoardFull(boardIndex)) {
            gameState.mainBoardState[boardIndex] = 'draw';
        }
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        const move = findBestMove();
        if (move) {
            setTimeout(() => {
                makeMove(move.board, move.cell, 'O');
                
                if (checkGameEnd()) return;
                
                currentPlayer = 'X';
                nextBoard = move.cell;
                
                if (isBoardFull(nextBoard) || gameState.mainBoardState[nextBoard] !== '') {
                    nextBoard = null;
                }
                
                updateBoardHighlights();
                gameStatus.textContent = `${currentPlayer}'s turn`;
            }, 300);
        }
    }
    
    function findBestMove() {
        // Simple AI: try to win, then block, then random
        const availableBoards = nextBoard !== null ? [nextBoard] : 
            Array.from({length: 9}, (_, i) => i).filter(i => gameState.mainBoardState[i] === '');
        
        for (const board of availableBoards) {
            const winningMove = findWinningMove(board, 'O');
            if (winningMove !== null) {
                return { board, cell: winningMove };
            }
        }
        
        for (const board of availableBoards) {
            const blockingMove = findWinningMove(board, 'X');
            if (blockingMove !== null) {
                return { board, cell: blockingMove };
            }
        }
        
        // Random move
        const validMoves = [];
        for (const board of availableBoards) {
            for (let cell = 0; cell < 9; cell++) {
                if (gameState.boardStates[board][cell] === '') {
                    validMoves.push({ board, cell });
                }
            }
        }
        
        return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null;
    }
    
    function findWinningMove(board, player) {
        for (let i = 0; i < 9; i++) {
            if (gameState.boardStates[board][i] !== '') continue;
            
            gameState.boardStates[board][i] = player;
            const win = checkBoardWin(board, player);
            gameState.boardStates[board][i] = '';
            
            if (win) return i;
        }
        return null;
    }
    
    function checkBoardWin(boardIndex, player) {
        const board = gameState.boardStates[boardIndex];
        return winningCombinations.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }
    
    function isBoardFull(boardIndex) {
        return gameState.boardStates[boardIndex].every(cell => cell !== '');
    }
    
    function checkGameEnd() {
        if (checkUltimateWin('X')) {
            gameStatus.textContent = 'X Wins!';
            gameActive = false;
            return true;
        }
        
        if (checkUltimateWin('O')) {
            gameStatus.textContent = 'O Wins!';
            gameActive = false;
            return true;
        }
        
        const allBoardsFinished = gameState.mainBoardState.every(state => state !== '');
        if (allBoardsFinished) {
            gameStatus.textContent = 'Game ended in a draw!';
            gameActive = false;
            return true;
        }
        
        return false;
    }
    
    function checkUltimateWin(player) {
        return winningCombinations.some(pattern => {
            return pattern.every(index => gameState.mainBoardState[index] === player);
        });
    }
    
    function highlightBoardWin(boardIndex, player) {
        const board = document.querySelector(`.main-board[data-board="${boardIndex}"]`);
        board.style.backgroundColor = player === 'X' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 51, 102, 0.2)';
        
        const cells = board.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    }
    
    function updateBoardHighlights() {
        boards.forEach(board => {
            board.classList.remove('active');
        });
        
        if (nextBoard !== null) {
            boards[nextBoard].classList.add('active');
        } else {
            boards.forEach((board, index) => {
                if (gameState.mainBoardState[index] === '') {
                    board.classList.add('active');
                }
            });
        }
    }
    
    function restartGame() {
        gameState = {
            boardStates: Array(9).fill().map(() => Array(9).fill('')),
            mainBoardState: Array(9).fill('')
        };
        
        gameActive = true;
        currentPlayer = 'X';
        nextBoard = null;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.style.pointerEvents = 'auto';
        });
        
        boards.forEach(board => {
            board.style.backgroundColor = '';
        });
        
        updateBoardHighlights();
        gameStatus.textContent = 'X starts! Click any cell to begin';
    }
    
    // Initialize
    updateBoardHighlights();
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .tech-stack-card, .project-card, .blog-post');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

/**
 * Responsive features
 */
function initResponsiveFeatures() {
    // Handle mobile navigation
    const navSections = document.querySelector('.sundial-sections');
    if (navSections && window.innerWidth <= 768) {
        // Add touch scrolling for mobile nav
        navSections.style.overflowX = 'auto';
        navSections.style.scrollSnapType = 'x mandatory';
        
        const navItems = document.querySelectorAll('.sundial-section');
        navItems.forEach(item => {
            item.style.scrollSnapAlign = 'center';
        });
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reinitialize binary rain on resize
            createBinaryRain();
            
            // Update particle positions
            initParticles();
        }, 250);
    });
    
    // Optimize for mobile performance
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        const binaryDigits = document.querySelectorAll('.binary-digit');
        binaryDigits.forEach((digit, index) => {
            if (index > 15) { // Keep only first 15 digits on mobile
                digit.remove();
            }
        });
    }
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential external use
window.portfolioApp = {
    initNavigation,
    initHomeAnimations,
    initTerminalEffects,
    initGames,
    createBinaryRain,
    initParticles
};