/**
 * Main JavaScript file
 * Handles all interactive functionality for the portfolio
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        // emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your EmailJS Public API Key
    }
    
    initNavigation();
    initHomeAnimations();
    initTerminalEffects();
    initGames();
    initArt();
    initScrollAnimations();
    initResponsiveFeatures();
    initAnalytics();
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
    initFaultyNeonSignboard();
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

function initFaultyNeonSignboard() {
    const words = document.querySelectorAll('.text-line[data-word]');
    if (!words.length) return;
    
    // Array to store faulty letter info for each word
    const faultyLetters = [];
    
    // Select one random letter from each word to be faulty
    words.forEach((word, wordIndex) => {
        const letters = word.querySelectorAll('.neon-letter');
        if (letters.length === 0) return;
        
        // Choose a random letter (avoid first and last for better visual effect)
        const availableIndices = [];
        for (let i = 1; i < letters.length - 1; i++) {
            availableIndices.push(i);
        }
        
        const randomIndex = availableIndices.length > 0 
            ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
            : Math.floor(Math.random() * letters.length);
            
        const faultyLetter = letters[randomIndex];
        
        faultyLetters.push({
            element: faultyLetter,
            wordIndex: wordIndex,
            letterIndex: randomIndex,
            isCurrentlyFaulty: false
        });
    });
    
    // Function to handle the faulty animation cycle for a specific letter
    function startFaultyCycle(letterInfo) {
        // Wait 3 seconds before going faulty
        setTimeout(() => {
            // Start faulty state - dim the letter
            letterInfo.element.classList.add('faulty');
            letterInfo.isCurrentlyFaulty = true;
            
            // After 2 seconds of being dim, add sparking effect
            setTimeout(() => {
                letterInfo.element.classList.remove('faulty');
                letterInfo.element.classList.add('sparking');
                
                // After sparking effect (2s), restore to normal and restart cycle
                setTimeout(() => {
                    letterInfo.element.classList.remove('sparking');
                    letterInfo.isCurrentlyFaulty = false;
                    
                    // Restart the cycle
                    startFaultyCycle(letterInfo);
                }, 2000);
            }, 2000);
        }, 3000);
    }
    
    // Start the faulty cycle for each letter with a slight delay between them
    faultyLetters.forEach((letterInfo, index) => {
        // Add a small random delay (0-5 seconds) so they don't all start at the same time
        const initialDelay = Math.random() * 5000;
        setTimeout(() => {
            startFaultyCycle(letterInfo);
        }, initialDelay);
    });
    
    console.log('Faulty neon signboard initialized with', faultyLetters.length, 'faulty letters');
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
 * Art viewer functionality
 */
function initArt() {
    const artPages = document.querySelectorAll('.art-page');
    const artImages = document.querySelectorAll('.art-image');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentPageSpan = document.querySelector('.current-page');
    
    // Modal elements
    const modal = document.getElementById('artModal');
    const modalImage = document.getElementById('modalImage');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const modalCurrentPage = document.getElementById('modalCurrentPage');
    const modalTotalPages = document.getElementById('modalTotalPages');
    const closeModal = document.querySelector('.close-modal');
    
    if (!artPages.length) return;
    
    let currentPage = 0;
    const totalPages = artPages.length;
    
    // Check if we're running from file:// protocol
    const isFileProtocol = window.location.protocol === 'file:';
    
    // Track image loading errors
    let imageErrorCount = 0;
    
    // Add error handling for image loading
    artImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            console.warn(`Failed to load art image ${index + 1}:`, this.src);
            imageErrorCount++;
            
            if (isFileProtocol) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'art-error';
                errorDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--accent-color); font-family: var(--header-font); text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #ff9800;"></i>
                        <h3 style="margin-bottom: 1rem;">Image Loading Issue</h3>
                        <p style="margin-bottom: 1rem; max-width: 400px; line-height: 1.4;">
                            The art images cannot be loaded when opening the file directly. 
                            Please use a local server to view the full content.
                        </p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">
                            Run: <code style="background: rgba(0,255,157,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">npm start</code> or use a local server
                        </p>
                    </div>
                `;
                this.parentNode.appendChild(errorDiv);
                this.style.display = 'none';
            }
            
            // Show fallback content if multiple images fail to load
            if (imageErrorCount >= 2) {
                const fallbackContent = document.getElementById('artFallback');
                const artViewer = document.querySelector('.art-viewer');
                if (fallbackContent && artViewer) {
                    artViewer.style.display = 'none';
                    fallbackContent.style.display = 'block';
                }
            }
        });
        
        img.addEventListener('load', function() {
            console.log(`Successfully loaded art image ${index + 1}`);
        });
    });
    
    // Show server notice if running from file protocol
    if (isFileProtocol) {
        const serverNotice = document.getElementById('serverNotice');
        if (serverNotice) {
            serverNotice.style.display = 'block';
        }
    }
    
    // Initialize
    showPage(currentPage);
    
    // Navigation button events
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    }
    
    // Add click event to images for modal
    artImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            openModal(index);
        });
    });
    
    // Modal events
    if (closeModal) {
        closeModal.addEventListener('click', closeModalHandler);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalHandler();
            }
        });
    }
    
    if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
                updateModalImage();
            }
        });
    }
    
    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
                updateModalImage();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                showPage(currentPage);
                updateModalImage();
            } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
                updateModalImage();
            } else if (e.key === 'Escape') {
                closeModalHandler();
            }
        }
    });
    
    function showPage(pageIndex) {
        // Update main viewer
        artPages.forEach((page, index) => {
            page.classList.toggle('active', index === pageIndex);
        });
        
        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = pageIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = pageIndex === totalPages - 1;
        }
        
        // Update page indicator
        if (currentPageSpan) {
            currentPageSpan.textContent = pageIndex + 1;
        }
        
        // Update modal navigation buttons
        if (modalPrevBtn) {
            modalPrevBtn.disabled = pageIndex === 0;
        }
        if (modalNextBtn) {
            modalNextBtn.disabled = pageIndex === totalPages - 1;
        }
        
        // Update modal page indicator
        if (modalCurrentPage) {
            modalCurrentPage.textContent = pageIndex + 1;
        }
        if (modalTotalPages) {
            modalTotalPages.textContent = totalPages;
        }
        
        // Add slide animation effect
        artPages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.transform = 'translateX(0)';
                page.style.opacity = '1';
            } else if (index < pageIndex) {
                page.style.transform = 'translateX(-100%)';
                page.style.opacity = '0';
            } else {
                page.style.transform = 'translateX(100%)';
                page.style.opacity = '0';
            }
        });
    }
    
    function openModal(pageIndex) {
        if (!modal || !modalImage) return;
        
        currentPage = pageIndex;
        showPage(currentPage);
        updateModalImage();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add open animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        }, 10);
    }
    
    function closeModalHandler() {
        if (!modal) return;
        
        modal.style.opacity = '0';
        modalImage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    function updateModalImage() {
        if (!modalImage || !artImages[currentPage]) return;
        
        modalImage.src = artImages[currentPage].src;
        modalImage.alt = artImages[currentPage].alt;
        
        // Add loading effect
        modalImage.style.opacity = '0';
        modalImage.onload = () => {
            modalImage.style.opacity = '1';
        };
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const artViewer = document.querySelector('.art-viewer');
    if (artViewer) {
        artViewer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        artViewer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && currentPage > 0) {
                    // Swipe right - previous page
                    currentPage--;
                    showPage(currentPage);
                } else if (deltaX < 0 && currentPage < totalPages - 1) {
                    // Swipe left - next page
                    currentPage++;
                    showPage(currentPage);
                }
            }
        }, false);
    }
    
    // Add modal swipe support
    if (modal) {
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && currentPage > 0) {
                    // Swipe right - previous page
                    currentPage--;
                    showPage(currentPage);
                    updateModalImage();
                } else if (deltaX < 0 && currentPage < totalPages - 1) {
                    // Swipe left - next page
                    currentPage++;
                    showPage(currentPage);
                    updateModalImage();
                }
            }
        }, false);
    }
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
    
    // Enhanced mobile scrolling for blog sections
    if (window.innerWidth <= 768) {
        initMobileBlogScrolling();
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
            
            // Reinitialize mobile blog scrolling if needed
            if (window.innerWidth <= 768) {
                initMobileBlogScrolling();
            }
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
 * Initialize enhanced mobile scrolling for blog sections
 */
function initMobileBlogScrolling() {
    const topicArticles = document.querySelectorAll('.topic-articles');
    
    topicArticles.forEach(container => {
        // Clear any existing event listeners by cloning the node
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);
        
        // Ensure proper touch scrolling with enhanced settings
        newContainer.style.webkitOverflowScrolling = 'touch';
        newContainer.style.overflowY = 'auto';
        newContainer.style.overflowX = 'hidden';
        newContainer.style.overscrollBehavior = 'contain';
        newContainer.style.touchAction = 'pan-y';
        newContainer.style.scrollBehavior = 'smooth';
        
        // Force hardware acceleration for better performance
        newContainer.style.transform = 'translateZ(0)';
        newContainer.style.willChange = 'scroll-position';
        
        // Enhanced mobile/iOS specific handling
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            newContainer.style.webkitOverflowScrolling = 'touch';
            newContainer.style.transform = 'translate3d(0,0,0)'; // Force hardware acceleration
            newContainer.style.backfaceVisibility = 'hidden';
        }
        
        // Better Android handling
        if (/Android/.test(navigator.userAgent)) {
            newContainer.style.overscrollBehaviorY = 'contain';
            newContainer.style.scrollbarWidth = 'thin';
        }
        
        let isScrolling = false;
        let startY = 0;
        let currentY = 0;
        
        // Enhanced touch event handling
        newContainer.addEventListener('touchstart', function(e) {
            isScrolling = false;
            startY = e.touches[0].clientY;
            newContainer.style.transition = 'none';
            e.stopPropagation();
        }, { passive: true });
        
        newContainer.addEventListener('touchmove', function(e) {
            currentY = e.touches[0].clientY;
            const deltaY = startY - currentY;
            
            const scrollTop = newContainer.scrollTop;
            const scrollHeight = newContainer.scrollHeight;
            const height = newContainer.clientHeight;
            const maxScroll = scrollHeight - height;
            
            // Allow scrolling within the container bounds
            if ((scrollTop <= 0 && deltaY < 0) || (scrollTop >= maxScroll && deltaY > 0)) {
                // At boundary, prevent further scrolling
                e.preventDefault();
            } else {
                // Allow natural scrolling within bounds
                isScrolling = true;
            }
            
            e.stopPropagation();
        }, { passive: false });
        
        newContainer.addEventListener('touchend', function(e) {
            if (isScrolling) {
                newContainer.style.transition = 'opacity 0.15s ease';
            }
            e.stopPropagation();
        }, { passive: true });
        
        // Add visual feedback when scrolling
        let scrollTimeout;
        newContainer.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            newContainer.classList.add('scrolling');
            
            scrollTimeout = setTimeout(() => {
                newContainer.classList.remove('scrolling');
            }, 100);
        }, { passive: true });
        
        // Handle focus for accessibility
        newContainer.addEventListener('focus', function() {
            newContainer.style.outline = '2px solid rgba(0, 255, 157, 0.5)';
        });
        
        newContainer.addEventListener('blur', function() {
            newContainer.style.outline = 'none';
        });
        
        // Make scrollable containers focusable for keyboard navigation
        if (!newContainer.hasAttribute('tabindex')) {
            newContainer.setAttribute('tabindex', '0');
        }
        
        // Add aria-label for screen readers
        if (!newContainer.hasAttribute('aria-label')) {
            const topicCard = newContainer.closest('.blog-topic-card');
            const topicTitle = topicCard ? topicCard.querySelector('.topic-title')?.textContent : 'Blog articles';
            newContainer.setAttribute('aria-label', `Scrollable list of ${topicTitle} articles`);
        }
    });
    
    // Fix blog section overflow issues
    const blogSection = document.querySelector('.blog');
    if (blogSection) {
        blogSection.style.overflow = 'visible';
        blogSection.style.overflowY = 'visible';
        blogSection.style.overflowX = 'hidden';
    }
    
    // Ensure parent containers don't interfere with scrolling
    const topicContents = document.querySelectorAll('.topic-content');
    topicContents.forEach(content => {
        content.style.overflow = 'visible';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.minHeight = '0';
        content.style.position = 'relative';
    });
    
    // Ensure blog topic cards have proper structure
    const blogTopicCards = document.querySelectorAll('.blog-topic-card');
    blogTopicCards.forEach(card => {
        card.style.overflow = 'hidden';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
    });
    
    // Ensure main blog container has proper styling
    const blogTopicsGrid = document.querySelector('.blog-topics-grid');
    if (blogTopicsGrid) {
        blogTopicsGrid.style.overflow = 'visible';
    }
    
    console.log('Enhanced mobile blog scrolling initialized for', topicArticles.length, 'containers');
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

/**
 * Analytics functionality
 */
function initAnalytics() {
    // Initialize basic visitor tracking
    initVisitorTracking();
    
    // Load preview stats for main page
    loadAnalyticsPreview();
    
    // Initialize quick newsletter form
    initQuickNewsletterForm();
    
    // Auto-refresh preview stats every 30 seconds
    setInterval(loadAnalyticsPreview, 30000);
}

function initVisitorTracking() {
    // Track this page visit
    const sessionId = generateSessionId();
    const visitorId = getOrCreateVisitorId();
    
    trackVisit(sessionId, visitorId);
    
    // Get user location for geographic tracking
    getUserLocation().then(location => {
        if (location) {
            updateVisitWithLocation(sessionId, location);
        }
    });
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
}

function trackVisit(sessionId, visitorId) {
    const visits = JSON.parse(localStorage.getItem('site_visits') || '[]');
    const now = new Date();
    
    const visit = {
        sessionId,
        visitorId,
        timestamp: now.toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        page: 'home'
    };
    
    visits.push(visit);
    localStorage.setItem('site_visits', JSON.stringify(visits));
}

async function getUserLocation() {
    try {
        // Uncomment and add your API key to enable real location tracking
        // const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_IP_GEOLOCATION_API_KEY');
        // if (response.ok) {
        //     const data = await response.json();
        //     return {
        //         country: data.country_name,
        //         city: data.city,
        //         region: data.state_prov,
        //         countryCode: data.country_code2
        //     };
        // }
        console.log('Using mock location data (API key not configured)');
    } catch (error) {
        console.log('Real location detection unavailable, using mock data');
    }
    
    // Fallback to mock location data
    const locations = [
        { country: 'India', city: 'Mumbai', region: 'Maharashtra', countryCode: 'IN' },
        { country: 'United States', city: 'New York', region: 'New York', countryCode: 'US' },
        { country: 'United Kingdom', city: 'London', region: 'England', countryCode: 'GB' },
        { country: 'Germany', city: 'Berlin', region: 'Berlin', countryCode: 'DE' },
        { country: 'Canada', city: 'Toronto', region: 'Ontario', countryCode: 'CA' }
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

function updateVisitWithLocation(sessionId, location) {
    const visits = JSON.parse(localStorage.getItem('site_visits') || '[]');
    const visit = visits.find(v => v.sessionId === sessionId);
    if (visit) {
        visit.location = location;
        localStorage.setItem('site_visits', JSON.stringify(visits));
    }
}

async function loadAnalyticsPreview() {
    try {
        // Try to load from CSV files
        const [visitorStats, geoData, subscriberData] = await Promise.all([
            loadCSVData('visitor_stats.csv'),
            loadCSVData('geographic_data.csv'),
            loadCSVData('newsletter_subscribers.csv')
        ]);

        // Get latest stats
        const latestStats = visitorStats[visitorStats.length - 1];
        const totalVisitors = parseInt(latestStats?.total_visitors) || 376;
        const uniqueCountries = geoData?.length || 15;
        const subscriberCount = subscriberData?.length || 54;

        // Update preview elements
        updatePreviewStat('previewTotalVisitors', totalVisitors);
        updatePreviewStat('previewCountries', uniqueCountries);
        updatePreviewStat('previewSubscribers', subscriberCount);

    } catch (error) {
        console.log('CSV data not available, using fallback data');
        // Fallback to localStorage and mock data
        const visits = JSON.parse(localStorage.getItem('site_visits') || '[]');
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        const totalVisitors = visits.length || 376;
        const uniqueCountries = new Set(
            visits.filter(v => v.location && v.location.country)
                  .map(v => v.location.country)
        ).size || 15;
        const subscriberCount = subscribers.length || 54;
        
        updatePreviewStat('previewTotalVisitors', totalVisitors);
        updatePreviewStat('previewCountries', uniqueCountries);
        updatePreviewStat('previewSubscribers', subscriberCount);
    }
}

async function loadCSVData(filename) {
    try {
        const response = await fetch(`userAnalytics/data/${filename}`);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        throw new Error(`Failed to load ${filename}`);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }

    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function updatePreviewStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Add loading class
        element.classList.add('loading-stat');
        
        // Update value after brief delay
        setTimeout(() => {
            element.textContent = value.toLocaleString();
            element.classList.remove('loading-stat');
        }, 500 + Math.random() * 1000);
    }
}

function initQuickNewsletterForm() {
    const form = document.getElementById('quickNewsletterForm');
    const emailInput = document.getElementById('quickEmailInput');
    const submitButton = document.getElementById('quickSubscribeButton');
    const messageElement = document.getElementById('quickFormMessage');
    
    if (!form || !emailInput || !submitButton || !messageElement) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            showQuickMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        setQuickLoading(true);
        
        try {
            // Store subscription locally
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            
            // Check if already subscribed
            if (subscribers.find(sub => sub.email === email)) {
                showQuickMessage('You are already subscribed!', 'error');
                return;
            }
            
            // Add new subscriber
            const newSubscriber = {
                email: email,
                timestamp: new Date().toISOString(),
                source: 'Homepage Quick Signup',
                status: 'active',
                country: 'Unknown'
            };
            
            subscribers.push(newSubscriber);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
            // Try to update CSV data
            try {
                await updateNewsletterCSV(newSubscriber);
            } catch (error) {
                console.log('Could not update CSV, stored locally only');
            }
            
            // Optional: Send email via EmailJS (requires API setup)
            // await sendQuickNewsletterEmail(email);
            
            showQuickMessage('Successfully subscribed! Welcome to the newsletter.', 'success');
            emailInput.value = '';
            
            // Update subscriber count in preview
            loadAnalyticsPreview();
            
        } catch (error) {
            console.error('Subscription error:', error);
            showQuickMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            setQuickLoading(false);
        }
    });
}

async function sendQuickNewsletterEmail(email) {
    // Uncomment and configure EmailJS to enable email notifications
    // if (typeof emailjs === 'undefined') {
    //     console.log('EmailJS not loaded, subscription stored locally only');
    //     return;
    // }
    // 
    // const templateParams = {
    //     user_email: email,
    //     timestamp: new Date().toISOString(),
    //     source: 'Homepage Quick Newsletter Signup'
    // };
    //
    // return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams); // Replace with your EmailJS Service and Template IDs
    
    console.log('Email notification disabled (API not configured)');
}

async function updateNewsletterCSV(newSubscriber) {
    // In a real implementation, this would make an API call to update the server-side CSV
    // For now, we'll simulate the update by storing it in a special localStorage key
    const csvUpdates = JSON.parse(localStorage.getItem('csv_updates_newsletter') || '[]');
    
    const csvRow = {
        email: newSubscriber.email.replace(/,/g, ''), // Remove commas to avoid CSV issues
        timestamp: newSubscriber.timestamp,
        source: newSubscriber.source,
        status: newSubscriber.status,
        country: newSubscriber.country
    };
    
    csvUpdates.push(csvRow);
    localStorage.setItem('csv_updates_newsletter', JSON.stringify(csvUpdates));
    
    console.log('Newsletter CSV update queued:', csvRow);
}

async function updateVisitorCSV(newVisitData) {
    // Similar function for updating visitor data
    const csvUpdates = JSON.parse(localStorage.getItem('csv_updates_visitors') || '[]');
    csvUpdates.push(newVisitData);
    localStorage.setItem('csv_updates_visitors', JSON.stringify(csvUpdates));
    console.log('Visitor CSV update queued:', newVisitData);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setQuickLoading(loading) {
    const submitButton = document.getElementById('quickSubscribeButton');
    if (submitButton) {
        submitButton.disabled = loading;
        if (loading) {
            submitButton.innerHTML = '<div class="loading-spinner"></div>';
            submitButton.style.opacity = '0.7';
        } else {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            submitButton.style.opacity = '1';
        }
    }
}

function showQuickMessage(message, type) {
    const messageElement = document.getElementById('quickFormMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `quick-form-message ${type}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Export functions for potential external use
window.portfolioApp = {
    initNavigation,
    initHomeAnimations,
    initTerminalEffects,
    initGames,
    initArt,
    createBinaryRain,
    initParticles
};