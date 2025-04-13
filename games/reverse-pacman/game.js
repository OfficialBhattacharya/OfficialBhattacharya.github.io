document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.querySelector('.game-board');
    const timerDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.querySelector('.restart-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    const BOARD_SIZE = 15;
    const INITIAL_TIME = 60;
    const GHOST_COUNT = 3;
    
    let gameState = {
        player: { x: 0, y: 0 },
        ghosts: [],
        walls: [],
        score: 0,
        timeLeft: INITIAL_TIME,
        gameActive: false,
        difficulty: 'medium',
        ghostSpeed: 500
    };
    
    // Difficulty settings
    const difficultySettings = {
        easy: {
            ghostSpeed: 800,
            timeLimit: 90
        },
        medium: {
            ghostSpeed: 500,
            timeLimit: 60
        },
        hard: {
            ghostSpeed: 300,
            timeLimit: 45
        }
    };
    
    // Initialize game board
    function initializeBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
        
        // Create cells
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                gameBoard.appendChild(cell);
            }
        }
        
        // Add walls
        addWalls();
    }
    
    // Add walls to create maze-like structure
    function addWalls() {
        // Outer walls
        for (let i = 0; i < BOARD_SIZE; i++) {
            addWall(0, i);
            addWall(BOARD_SIZE - 1, i);
            addWall(i, 0);
            addWall(i, BOARD_SIZE - 1);
        }
        
        // Create a more intricate maze pattern
        const wallPattern = [
            // Central structure
            [3, 3], [3, 4], [3, 5], [3, 9], [3, 10], [3, 11],
            [5, 3], [5, 11], 
            [7, 3], [7, 4], [7, 5], [7, 9], [7, 10], [7, 11],
            [11, 3], [11, 4], [11, 5], [11, 9], [11, 10], [11, 11],
            
            // Vertical paths
            [2, 7], [3, 7], [4, 7], [5, 7], 
            [9, 7], [10, 7], [11, 7], [12, 7],
            
            // Horizontal paths
            [5, 5], [5, 6], [5, 8], [5, 9],
            [9, 5], [9, 6], [9, 8], [9, 9],
            
            // Corners and obstacles
            [2, 2], [2, 12], [12, 2], [12, 12],
            [6, 2], [8, 2], [6, 12], [8, 12],
            [2, 6], [2, 8], [12, 6], [12, 8]
        ];
        
        wallPattern.forEach(([x, y]) => addWall(x, y));
    }
    
    function addWall(x, y) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        cell.classList.add('wall');
        
        // Add visual enhancement to walls
        const wallDecoration = document.createElement('div');
        wallDecoration.className = 'wall-decoration';
        cell.appendChild(wallDecoration);
        
        gameState.walls.push({ x, y });
    }
    
    // Place player and ghosts
    function placeCharacters() {
        // Place player
        const playerCell = document.querySelector('.cell[data-x="7"][data-y="7"]');
        playerCell.classList.add('player');
        gameState.player = { x: 7, y: 7 };
        
        // Place ghosts
        const ghostPositions = [
            { x: 3, y: 3, class: 'ghost-1' },
            { x: 11, y: 3, class: 'ghost-2' },
            { x: 7, y: 11, class: 'ghost-3' }
        ];
        
        gameState.ghosts = ghostPositions.map((pos, index) => ({
            x: pos.x,
            y: pos.y,
            id: index + 1
        }));
        
        ghostPositions.forEach(pos => {
            const cell = document.querySelector(`.cell[data-x="${pos.x}"][data-y="${pos.y}"]`);
            cell.classList.add('ghost', pos.class);
        });
    }
    
    // Move player
    function movePlayer(direction) {
        if (!gameState.gameActive) return;
        
        const newPos = { ...gameState.player };
        
        switch (direction) {
            case 'up':
                newPos.y--;
                break;
            case 'down':
                newPos.y++;
                break;
            case 'left':
                newPos.x--;
                break;
            case 'right':
                newPos.x++;
                break;
        }
        
        if (isValidMove(newPos)) {
            updatePlayerPosition(newPos);
            checkGhostCollision();
        }
    }
    
    // Move ghosts
    function moveGhosts() {
        if (!gameState.gameActive) return;
        
        gameState.ghosts.forEach(ghost => {
            const possibleMoves = getPossibleMoves(ghost);
            if (possibleMoves.length > 0) {
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                updateGhostPosition(ghost, move);
            }
        });
        
        checkGhostCollision();
    }
    
    // Get possible moves for ghost
    function getPossibleMoves(ghost) {
        const moves = [
            { x: ghost.x - 1, y: ghost.y },
            { x: ghost.x + 1, y: ghost.y },
            { x: ghost.x, y: ghost.y - 1 },
            { x: ghost.x, y: ghost.y + 1 }
        ];
        
        return moves.filter(pos => isValidMove(pos));
    }
    
    // Check if move is valid
    function isValidMove(pos) {
        // Check board boundaries
        if (pos.x < 0 || pos.x >= BOARD_SIZE || pos.y < 0 || pos.y >= BOARD_SIZE) {
            return false;
        }
        
        // Check walls
        return !gameState.walls.some(wall => wall.x === pos.x && wall.y === pos.y);
    }
    
    // Update player position with visual effect
    function updatePlayerPosition(newPos) {
        const oldCell = document.querySelector(`.cell[data-x="${gameState.player.x}"][data-y="${gameState.player.y}"]`);
        const newCell = document.querySelector(`.cell[data-x="${newPos.x}"][data-y="${newPos.y}"]`);
        
        // Add movement trail effect
        const trail = document.createElement('div');
        trail.className = 'player-trail';
        oldCell.appendChild(trail);
        
        // Remove trail after animation completes
        setTimeout(() => {
            if (oldCell.contains(trail)) {
                oldCell.removeChild(trail);
            }
        }, 300);
        
        oldCell.classList.remove('player');
        newCell.classList.add('player');
        
        // Add glow effect on new position
        const glow = document.createElement('div');
        glow.className = 'player-glow';
        newCell.appendChild(glow);
        
        // Remove glow after animation
        setTimeout(() => {
            if (newCell.contains(glow)) {
                newCell.removeChild(glow);
            }
        }, 500);
        
        gameState.player = newPos;
    }
    
    // Update ghost position with smoother animation
    function updateGhostPosition(ghost, newPos) {
        const oldCell = document.querySelector(`.cell[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
        const newCell = document.querySelector(`.cell[data-x="${newPos.x}"][data-y="${newPos.y}"]`);
        
        // Add ghost trail
        const trail = document.createElement('div');
        trail.className = 'ghost-trail';
        trail.classList.add(`ghost-trail-${ghost.id}`);
        oldCell.appendChild(trail);
        
        // Remove trail after animation
        setTimeout(() => {
            if (oldCell.contains(trail)) {
                oldCell.removeChild(trail);
            }
        }, 300);
        
        oldCell.classList.remove('ghost', `ghost-${ghost.id}`);
        newCell.classList.add('ghost', `ghost-${ghost.id}`);
        
        ghost.x = newPos.x;
        ghost.y = newPos.y;
    }
    
    // Check for ghost collision with enhanced effects
    // Check for ghost collision
    function checkGhostCollision() {
        gameState.ghosts = gameState.ghosts.filter(ghost => {
            if (ghost.x === gameState.player.x && ghost.y === gameState.player.y) {
                const cell = document.querySelector(`.cell[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
                cell.classList.remove('ghost', `ghost-${ghost.id}`);
                gameState.score++;
                scoreDisplay.textContent = gameState.score;
                
                if (gameState.score === GHOST_COUNT) {
                    endGame(true);
                }
                
                return false;
            }
            return true;
        });
    }
    
    // Start game
    function startGame(difficulty) {
        gameState.difficulty = difficulty;
        gameState.timeLeft = difficultySettings[difficulty].timeLimit;
        gameState.ghostSpeed = difficultySettings[difficulty].ghostSpeed;
        gameState.score = 0;
        gameState.gameActive = true;
        
        timerDisplay.textContent = gameState.timeLeft;
        scoreDisplay.textContent = gameState.score;
        
        initializeBoard();
        placeCharacters();
        
        // Start timer
        gameState.timer = setInterval(() => {
            gameState.timeLeft--;
            timerDisplay.textContent = gameState.timeLeft;
            
            if (gameState.timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
        
        // Start ghost movement
        gameState.ghostInterval = setInterval(moveGhosts, gameState.ghostSpeed);
    }
    
    // End game
    function endGame(won) {
        gameState.gameActive = false;
        clearInterval(gameState.timer);
        clearInterval(gameState.ghostInterval);
        
        setTimeout(() => {
            alert(won ? 'Congratulations! You won!' : 'Time\'s up! Game Over!');
        }, 100);
    }
    
    // Add keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!gameState.gameActive) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                movePlayer('up');
                break;
            case 's':
            case 'arrowdown':
                movePlayer('down');
                break;
            case 'a':
            case 'arrowleft':
                movePlayer('left');
                break;
            case 'd':
            case 'arrowright':
                movePlayer('right');
                break;
        }
    });
    
    // Initialize game with medium difficulty
    startGame('medium');

    // Add event listeners for difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const difficulty = this.dataset.difficulty;
            startGame(difficulty);
        });
    });

    // Add event listener for restart button
    restartButton.addEventListener('click', function() {
        startGame(gameState.difficulty);
    });
}); 