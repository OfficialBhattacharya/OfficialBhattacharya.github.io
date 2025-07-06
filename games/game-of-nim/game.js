// Game of Nim Logic
class GameOfNim {
    constructor() {
        this.sticks = 13;
        this.maxTake = 3;
        this.gameOver = false;
        this.playerTurn = true;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        this.renderSticks();
        this.updateDisplay();
        this.updateStatus("Your turn! Choose 1-3 sticks to remove.");
    }
    
    bindEvents() {
        // Take buttons
        document.querySelectorAll('.take-button').forEach(button => {
            button.addEventListener('click', () => {
                if (!this.gameOver && this.playerTurn) {
                    const sticksToTake = parseInt(button.dataset.sticks);
                    this.playerMove(sticksToTake);
                }
            });
        });
        
        // Restart button
        document.querySelector('.restart-button').addEventListener('click', () => {
            this.restart();
        });
    }
    
    renderSticks() {
        const container = document.querySelector('.sticks-container');
        container.innerHTML = '';
        
        for (let i = 0; i < 13; i++) {
            const stick = document.createElement('div');
            stick.className = 'stick';
            stick.dataset.index = i;
            
            if (i >= this.sticks) {
                stick.classList.add('taken');
            }
            
            container.appendChild(stick);
        }
    }
    
    updateDisplay() {
        document.querySelector('.sticks-count').textContent = this.sticks;
        document.querySelector('.max-take-count').textContent = Math.min(this.maxTake, this.sticks);
        
        // Update button states
        document.querySelectorAll('.take-button').forEach(button => {
            const sticksToTake = parseInt(button.dataset.sticks);
            button.disabled = this.gameOver || !this.playerTurn || sticksToTake > this.sticks;
        });
    }
    
    updateStatus(message) {
        const statusElement = document.querySelector('.game-status');
        statusElement.textContent = message;
        
        // Reset classes
        statusElement.classList.remove('game-over', 'game-won', 'computer-turn');
        
        // Add appropriate class based on game state
        if (this.gameOver) {
            if (this.sticks === 0) {
                if (this.playerTurn) {
                    statusElement.classList.add('game-over');
                } else {
                    statusElement.classList.add('game-won');
                }
            }
        } else if (!this.playerTurn) {
            statusElement.classList.add('computer-turn');
        }
    }
    
    playerMove(sticksToTake) {
        if (sticksToTake > this.sticks || sticksToTake < 1 || sticksToTake > this.maxTake) {
            return;
        }
        
        this.takeSticks(sticksToTake);
        this.playerTurn = false;
        
        if (this.sticks === 0) {
            this.gameOver = true;
            this.updateStatus("You took the last stick! You win!");
            this.updateDisplay();
            return;
        }
        
        this.updateStatus("Computer is thinking...");
        this.updateDisplay();
        
        // Computer move after delay
        setTimeout(() => {
            this.computerMove();
        }, 1000);
    }
    
    computerMove() {
        if (this.gameOver) return;
        
        // Nim strategy: try to leave a multiple of 4 sticks
        let sticksToTake = 1;
        
        // If sticks % 4 == 0, take random 1-3 (bad position)
        // Otherwise, take enough to make it multiple of 4
        if (this.sticks % 4 !== 0) {
            sticksToTake = this.sticks % 4;
        } else {
            // Random move when in losing position
            sticksToTake = Math.floor(Math.random() * Math.min(this.maxTake, this.sticks)) + 1;
        }
        
        // Ensure we don't take more than available
        sticksToTake = Math.min(sticksToTake, this.sticks);
        
        this.takeSticks(sticksToTake);
        this.playerTurn = true;
        
        if (this.sticks === 0) {
            this.gameOver = true;
            this.updateStatus("Computer took the last stick! Computer wins!");
            this.updateDisplay();
            return;
        }
        
        this.updateStatus("Your turn! Choose 1-3 sticks to remove.");
        this.updateDisplay();
    }
    
    takeSticks(count) {
        const sticks = document.querySelectorAll('.stick:not(.taken)');
        
        for (let i = 0; i < count && i < sticks.length; i++) {
            const stick = sticks[i];
            stick.classList.add('taking');
            
            setTimeout(() => {
                stick.classList.remove('taking');
                stick.classList.add('taken');
            }, 300);
        }
        
        this.sticks -= count;
        
        // Update display after animation
        setTimeout(() => {
            this.updateDisplay();
        }, 500);
    }
    
    restart() {
        this.sticks = 13;
        this.gameOver = false;
        this.playerTurn = true;
        
        this.renderSticks();
        this.updateDisplay();
        this.updateStatus("Your turn! Choose 1-3 sticks to remove.");
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameOfNim();
}); 