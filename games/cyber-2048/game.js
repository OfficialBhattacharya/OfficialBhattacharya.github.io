// Cyber 2048 Game Logic
class Cyber2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('cyber2048-best') || 0;
        this.gameOver = false;
        this.won = false;
        this.size = 4;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        this.grid = this.createEmptyGrid();
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        
        // Add initial tiles
        this.addRandomTile();
        this.addRandomTile();
        
        this.updateDisplay();
        this.updateScore();
    }
    
    createEmptyGrid() {
        const grid = [];
        for (let i = 0; i < this.size; i++) {
            grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    }
    
    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch events for mobile
        let startX, startY;
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    this.move('left');
                } else {
                    this.move('right');
                }
            } else {
                if (diffY > 0) {
                    this.move('up');
                } else {
                    this.move('down');
                }
            }
            
            startX = startY = null;
        });
        
        // New game button
        document.querySelector('.new-game-button').addEventListener('click', () => {
            this.initializeGame();
            this.hideGameMessage();
        });
        
        // Retry button
        document.querySelector('.retry-button').addEventListener('click', () => {
            this.initializeGame();
            this.hideGameMessage();
        });
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.move('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.move('right');
                break;
        }
    }
    
    move(direction) {
        const previousGrid = this.grid.map(row => [...row]);
        let moved = false;
        
        switch (direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            this.updateScore();
            
            if (this.checkWin()) {
                this.showGameMessage('You Win!', 'Keep playing to get an even higher score!');
                this.won = true;
            } else if (this.checkGameOver()) {
                this.showGameMessage('Game Over!', `Final Score: ${this.score}`);
                this.gameOver = true;
            }
        }
    }
    
    moveLeft() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            
            // Merge tiles
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            
            // Fill with zeros
            while (row.length < this.size) {
                row.push(0);
            }
            
            // Check if row changed
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== row[j]) {
                    moved = true;
                }
                this.grid[i][j] = row[j];
            }
        }
        return moved;
    }
    
    moveRight() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            
            // Merge tiles from right
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            
            // Fill with zeros at the beginning
            while (row.length < this.size) {
                row.unshift(0);
            }
            
            // Check if row changed
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== row[j]) {
                    moved = true;
                }
                this.grid[i][j] = row[j];
            }
        }
        return moved;
    }
    
    moveUp() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            // Merge tiles
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            
            // Fill with zeros
            while (column.length < this.size) {
                column.push(0);
            }
            
            // Check if column changed
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }
    
    moveDown() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            // Merge tiles from bottom
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            
            // Fill with zeros at the beginning
            while (column.length < this.size) {
                column.unshift(0);
            }
            
            // Check if column changed
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }
    
    checkWin() {
        if (this.won) return false;
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                
                // Check right neighbor
                if (j < this.size - 1 && this.grid[i][j + 1] === current) {
                    return false;
                }
                
                // Check bottom neighbor
                if (i < this.size - 1 && this.grid[i + 1][j] === current) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    updateDisplay() {
        const container = document.querySelector('.grid-tiles');
        container.innerHTML = '';
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    
                    if (this.grid[i][j] > 2048) {
                        tile.classList.add('tile-super');
                    }
                    
                    tile.style.left = `${j * 75}px`;
                    tile.style.top = `${i * 75}px`;
                    tile.textContent = this.grid[i][j];
                    
                    container.appendChild(tile);
                }
            }
        }
    }
    
    updateScore() {
        document.querySelector('.score-value').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('cyber2048-best', this.bestScore);
        }
        
        document.querySelector('.best-value').textContent = this.bestScore;
    }
    
    showGameMessage(title, message) {
        const messageElement = document.querySelector('.game-message');
        messageElement.querySelector('p').innerHTML = `<strong>${title}</strong><br>${message}`;
        messageElement.classList.add('game-over');
    }
    
    hideGameMessage() {
        const messageElement = document.querySelector('.game-message');
        messageElement.classList.remove('game-over');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Cyber2048();
}); 