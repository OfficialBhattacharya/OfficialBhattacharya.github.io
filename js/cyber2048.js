// Cyber 2048 Game Logic
class Cyber2048 {
    constructor() {
        this.grid = [];
        this.tiles = [];
        this.size = 5;
        this.score = 0;
        this.bestScore = 0; // Reset best score every time
        this.gameOver = false;
        this.gameWon = false;
        this.difficulty = 'hard'; // Set to 'hard' for harder gameplay
        this.setup();
        this.addEventListeners();
    }

    setup() {
        // Initialize grid
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                this.grid[y][x] = null;
            }
        }
        
        // Reset game state
        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.tiles = [];
        
        // Update UI
        this.updateScore();
        this.updateBestScore();
        
        // Start game with two tiles
        this.addRandomTile();
        this.addRandomTile();
        
        // Render initial state
        this.renderGrid();
        
        // Hide any game messages
        this.hideMessages();
    }
    
    updateScore() {
        document.querySelector('.score-value').textContent = this.score;
    }
    
    updateBestScore() {
        document.querySelector('.best-value').textContent = this.bestScore;
    }

    // Add a new random tile to the grid
    addRandomTile() {
        // Find all empty cells
        let emptyCells = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.grid[y][x]) {
                    emptyCells.push({ x, y });
                }
            }
        }
        
        // If no empty cells, game is over
        if (emptyCells.length === 0) return;
        
        // Choose a random empty cell
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // Create a new tile with adjusted probabilities based on difficulty
        let value;
        if (this.difficulty === 'hard') {
            // Harder difficulty: More 4s and occasional 8s
            const rand = Math.random();
            if (rand < 0.65) {
                value = 2;
            } else if (rand < 0.9) {
                value = 4;
            } else {
                value = 8;
            }
        } else {
            // Normal difficulty: Mostly 2s with occasional 4s
            value = Math.random() < 0.9 ? 2 : 4;
        }
        
        const tile = { x: cell.x, y: cell.y, value };
        
        // Add the tile to the grid and tiles array
        this.grid[cell.y][cell.x] = tile;
        this.tiles.push(tile);
        
        // Mark the tile as new for animation
        tile.isNew = true;
    }

    // Render the current game state
    renderGrid() {
        const tilesContainer = document.querySelector('.grid-tiles');
        tilesContainer.innerHTML = '';
        
        // Create and position tiles
        this.tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = `tile tile-${tile.value}`;
            if (tile.isNew) {
                tileElement.classList.add('tile-new');
                tile.isNew = false;
            }
            if (tile.mergedFrom) {
                tileElement.classList.add('tile-merged');
                tile.mergedFrom = false;
            }
            
            // Super tile (beyond 2048)
            if (tile.value > 2048) {
                tileElement.classList.add('tile-super');
            }
            
            // Position the tile with correct grid size calculation
            const cellSize = 20; // 100% / 5 cells
            
            // Calculate position with gap adjustments
            tileElement.style.left = (tile.x * cellSize) + '%';
            tileElement.style.top = (tile.y * cellSize) + '%';
            
            // Set the tile's text
            tileElement.textContent = tile.value;
            
            tilesContainer.appendChild(tileElement);
        });
    }
    
    // Move tiles in a direction (0: up, 1: right, 2: down, 3: left)
    move(direction) {
        if (this.gameOver || this.gameWon) return false; // Stop if game is over or won
        
        // Store tile positions for later comparison
        const oldTiles = JSON.stringify(this.tiles);
        
        // Variables to track movement
        let moved = false;
        let score = 0;
        
        // Determine the direction vectors
        const vector = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 },  // Right
            2: { x: 0, y: 1 },  // Down
            3: { x: -1, y: 0 }  // Left
        }[direction];
        
        // Determine traversal order (need to start from the edge)
        const traversals = { x: [], y: [] };
        for (let i = 0; i < this.size; i++) {
            traversals.x.push(i);
            traversals.y.push(i);
        }
        
        // Always traverse from the edge to prevent tiles from getting stuck
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();
        
        // Move tiles
        traversals.y.forEach(y => {
            traversals.x.forEach(x => {
                const cell = { x, y };
                const tile = this.grid[y][x];
                
                if (tile) {
                    const positions = this.findFarthestPosition(cell, vector);
                    const next = this.grid[positions.farthest.y][positions.farthest.x];
                    
                    // Merge tiles if needed
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        const merged = {
                            x: positions.farthest.x,
                            y: positions.farthest.y,
                            value: tile.value * 2,
                            mergedFrom: true
                        };
                        
                        // Remove the old tiles
                        this.grid[y][x] = null;
                        this.grid[next.y][next.x] = null;
                        
                        // Add the merged tile
                        this.grid[merged.y][merged.x] = merged;
                        
                        // Update the tiles array
                        const tileIndex = this.tiles.indexOf(tile);
                        if (tileIndex > -1) this.tiles.splice(tileIndex, 1);
                        
                        const nextIndex = this.tiles.indexOf(next);
                        if (nextIndex > -1) this.tiles.splice(nextIndex, 1);
                        
                        this.tiles.push(merged);
                        
                        // Update score
                        score += merged.value;
                        
                        // Check for win
                        if (merged.value === 2048 && !this.gameWon) {
                            this.gameWon = true;
                            this.showWinMessage();
                        }
                        
                        moved = true;
                    } else {
                        // Move tile
                        if (positions.farthest.x !== x || positions.farthest.y !== y) {
                            this.grid[y][x] = null;
                            this.grid[positions.farthest.y][positions.farthest.x] = tile;
                            tile.x = positions.farthest.x;
                            tile.y = positions.farthest.y;
                            moved = true;
                        }
                    }
                }
            });
        });
        
        // If tiles moved, add a new random tile
        if (moved) {
            this.score += score;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                this.updateBestScore();
            }
            
            this.updateScore();
            
            // In hard mode, add tiles more aggressively based on available space
            if (this.difficulty === 'hard') {
                this.addRandomTile();
                
                // Sometimes add an extra tile to make it more challenging (10% chance)
                if (Math.random() < 0.1) {
                    this.addRandomTile();
                }
            } else {
                this.addRandomTile();
            }
            
            // Check for game over
            if (!this.movesAvailable()) {
                this.gameOver = true;
                this.showGameOverMessage();
            }
        }
        
        this.renderGrid();
        return moved;
    }
    
    // Find the farthest position in a given direction
    findFarthestPosition(cell, vector) {
        let previous;
        let next = { x: cell.x, y: cell.y };
        
        do {
            previous = next;
            next = {
                x: previous.x + vector.x,
                y: previous.y + vector.y
            };
        } while (this.withinBounds(next) && !this.grid[next.y][next.x]);
        
        return {
            farthest: previous,
            next: this.withinBounds(next) ? this.grid[next.y][next.x] : null
        };
    }
    
    // Check if a position is within the grid bounds
    withinBounds(position) {
        return position.x >= 0 && position.x < this.size &&
               position.y >= 0 && position.y < this.size;
    }
    
    // Check if any moves are available
    movesAvailable() {
        // Check for empty cells
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.grid[y][x]) return true;
            }
        }
        
        // Check for possible merges
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const tile = this.grid[y][x];
                if (tile) {
                    // Check adjacent cells
                    for (let direction = 0; direction < 4; direction++) {
                        const vector = {
                            0: { x: 0, y: -1 }, // Up
                            1: { x: 1, y: 0 },  // Right
                            2: { x: 0, y: 1 },  // Down
                            3: { x: -1, y: 0 }  // Left
                        }[direction];
                        
                        const adjX = x + vector.x;
                        const adjY = y + vector.y;
                        
                        if (this.withinBounds({ x: adjX, y: adjY })) {
                            const adjacent = this.grid[adjY][adjX];
                            if (adjacent && adjacent.value === tile.value) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    // Show win message
    showWinMessage() {
        const message = document.querySelector('.game-message');
        message.classList.add('game-won');
        message.querySelector('p').textContent = 'You Win!';
        message.style.opacity = 1;
        message.style.pointerEvents = 'auto';
        this.gameWon = true; // Set game as won to prevent further moves
    }
    
    // Show game over message
    showGameOverMessage() {
        const message = document.querySelector('.game-message');
        message.classList.add('game-over');
        message.querySelector('p').textContent = 'Game Over!';
        message.style.opacity = 1;
        message.style.pointerEvents = 'auto';
    }
    
    // Hide all messages
    hideMessages() {
        const message = document.querySelector('.game-message');
        message.classList.remove('game-won', 'game-over');
        message.style.opacity = 0;
        message.style.pointerEvents = 'none';
    }
    
    // Add event listeners for keyboard and touch controls
    addEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            const keyMap = {
                'ArrowUp': 0,
                'ArrowRight': 1,
                'ArrowDown': 2,
                'ArrowLeft': 3
            };
            
            if (keyMap[event.key] !== undefined) {
                event.preventDefault();
                this.move(keyMap[event.key]);
            }
        });
        
        // New game button
        document.querySelector('.new-game-button').addEventListener('click', () => {
            this.setup();
        });
        
        // Retry button
        document.querySelector('.retry-button').addEventListener('click', () => {
            this.setup();
        });
        
        // Touch controls
        let touchStartX, touchStartY, touchEndX, touchEndY;
        const gridContainer = document.querySelector('.grid-container');
        
        gridContainer.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        
        gridContainer.addEventListener('touchmove', (event) => {
            event.preventDefault();
        }, { passive: false });
        
        gridContainer.addEventListener('touchend', (event) => {
            // Don't process touch events if game is won or over
            if (this.gameWon || this.gameOver) return;
            
            touchEndX = event.changedTouches[0].clientX;
            touchEndY = event.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // Minimum swipe distance
            if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) {
                // Horizontal swipe
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.move(dx > 0 ? 1 : 3);
                } else {
                    this.move(dy > 0 ? 2 : 0);
                }
            }
        });
    }
}

// Initialize game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the game container exists on the page
    const gameContainer = document.getElementById('cyber2048Game');
    if (gameContainer) {
        const game = new Cyber2048();
        
        // For debugging or testing, you can expose the game instance to the global scope
        window.cyber2048Game = game;
    }
}); 