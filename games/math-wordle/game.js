// Math Wordle Game Logic
class MathWordle {
    constructor() {
        this.currentRow = 0;
        this.currentCell = 0;
        this.gameOver = false;
        this.won = false;
        this.maxRows = 6;
        this.maxCells = 8;
        this.currentGuess = '';
        this.targetExpression = '';
        this.targetResult = 0;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        this.generateTargetExpression();
        this.updateStatus(`Find the calculation that equals ${this.targetResult}!`);
    }
    
    generateTargetExpression() {
        const expressions = [
            // Simple addition
            { expr: '12+34=46', result: 46 },
            { expr: '25+17=42', result: 42 },
            { expr: '38+29=67', result: 67 },
            { expr: '44+28=72', result: 72 },
            { expr: '15+36=51', result: 51 },
            
            // Simple subtraction
            { expr: '85-27=58', result: 58 },
            { expr: '73-19=54', result: 54 },
            { expr: '94-37=57', result: 57 },
            { expr: '62-28=34', result: 34 },
            { expr: '81-45=36', result: 36 },
            
            // Simple multiplication
            { expr: '12×7=84', result: 84 },
            { expr: '15×4=60', result: 60 },
            { expr: '18×3=54', result: 54 },
            { expr: '13×6=78', result: 78 },
            { expr: '16×5=80', result: 80 },
            
            // Simple division
            { expr: '84÷12=7', result: 7 },
            { expr: '96÷8=12', result: 12 },
            { expr: '72÷9=8', result: 8 },
            { expr: '63÷7=9', result: 9 },
            { expr: '56÷8=7', result: 7 },
            
            // Mixed operations
            { expr: '5+3×4=17', result: 17 },
            { expr: '24÷6+8=12', result: 12 },
            { expr: '9×2-7=11', result: 11 },
            { expr: '36÷4+5=14', result: 14 },
            { expr: '7+8×2=23', result: 23 },
        ];
        
        const randomIndex = Math.floor(Math.random() * expressions.length);
        const selected = expressions[randomIndex];
        this.targetExpression = selected.expr;
        this.targetResult = selected.result;
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button events
        document.querySelectorAll('.key').forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button.textContent));
        });
        
        // Restart button
        document.querySelector('.wordle-restart-button').addEventListener('click', () => this.restart());
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        const key = e.key;
        
        if (key === 'Enter') {
            this.submitGuess();
        } else if (key === 'Backspace') {
            this.deleteLetter();
        } else if (this.isValidInput(key)) {
            this.addLetter(key);
        }
    }
    
    handleButtonClick(buttonText) {
        if (this.gameOver) return;
        
        if (buttonText === 'Enter') {
            this.submitGuess();
        } else if (buttonText === 'Backspace') {
            this.deleteLetter();
        } else if (this.isValidInput(buttonText)) {
            this.addLetter(buttonText);
        }
    }
    
    isValidInput(char) {
        return /[0-9+\-×÷=]/.test(char);
    }
    
    addLetter(letter) {
        if (this.currentCell < this.maxCells) {
            const cell = document.querySelector(`.wordle-row:nth-child(${this.currentRow + 1}) .wordle-cell:nth-child(${this.currentCell + 1})`);
            cell.textContent = letter;
            this.currentGuess += letter;
            this.currentCell++;
        }
    }
    
    deleteLetter() {
        if (this.currentCell > 0) {
            this.currentCell--;
            const cell = document.querySelector(`.wordle-row:nth-child(${this.currentRow + 1}) .wordle-cell:nth-child(${this.currentCell + 1})`);
            cell.textContent = '';
            this.currentGuess = this.currentGuess.slice(0, -1);
        }
    }
    
    submitGuess() {
        if (this.currentCell !== this.maxCells) {
            this.updateStatus('Please complete the expression!');
            return;
        }
        
        if (!this.isValidExpression(this.currentGuess)) {
            this.updateStatus('Please enter a valid mathematical expression!');
            return;
        }
        
        this.checkGuess();
        
        if (this.currentGuess === this.targetExpression) {
            this.won = true;
            this.gameOver = true;
            this.updateStatus('Congratulations! You found the calculation!');
        } else if (this.currentRow === this.maxRows - 1) {
            this.gameOver = true;
            this.updateStatus(`Game Over! The answer was: ${this.targetExpression}`);
        } else {
            this.currentRow++;
            this.currentCell = 0;
            this.currentGuess = '';
            this.updateStatus(`Find the calculation that equals ${this.targetResult}!`);
        }
    }
    
    isValidExpression(expr) {
        // Basic validation for mathematical expressions
        if (!expr.includes('=')) return false;
        
        const parts = expr.split('=');
        if (parts.length !== 2) return false;
        
        const leftSide = parts[0];
        const rightSide = parts[1];
        
        // Check if right side is a number
        if (!/^\d+$/.test(rightSide)) return false;
        
        // Check if left side has valid format
        if (!/^[\d+\-×÷]+$/.test(leftSide)) return false;
        
        try {
            // Convert to JavaScript operators for evaluation
            const jsExpression = leftSide.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(jsExpression);
            return result == parseInt(rightSide);
        } catch (e) {
            return false;
        }
    }
    
    checkGuess() {
        const targetArray = this.targetExpression.split('');
        const guessArray = this.currentGuess.split('');
        const feedback = new Array(this.maxCells).fill('absent');
        const targetUsed = new Array(this.maxCells).fill(false);
        
        // First pass: check for correct positions
        for (let i = 0; i < this.maxCells; i++) {
            if (guessArray[i] === targetArray[i]) {
                feedback[i] = 'correct';
                targetUsed[i] = true;
            }
        }
        
        // Second pass: check for present but wrong position
        for (let i = 0; i < this.maxCells; i++) {
            if (feedback[i] === 'absent') {
                for (let j = 0; j < this.maxCells; j++) {
                    if (!targetUsed[j] && guessArray[i] === targetArray[j]) {
                        feedback[i] = 'present';
                        targetUsed[j] = true;
                        break;
                    }
                }
            }
        }
        
        // Apply feedback to cells
        for (let i = 0; i < this.maxCells; i++) {
            const cell = document.querySelector(`.wordle-row:nth-child(${this.currentRow + 1}) .wordle-cell:nth-child(${i + 1})`);
            cell.classList.add(feedback[i]);
            
            // Update keyboard
            const key = document.querySelector(`.key:contains('${guessArray[i]}')`);
            if (key) {
                key.classList.remove('absent', 'present', 'correct');
                key.classList.add(feedback[i]);
            }
        }
        
        // Update keyboard buttons
        guessArray.forEach((letter, index) => {
            const keys = document.querySelectorAll('.key');
            keys.forEach(key => {
                if (key.textContent === letter) {
                    key.classList.remove('absent', 'present', 'correct');
                    key.classList.add(feedback[index]);
                }
            });
        });
    }
    
    updateStatus(message) {
        document.querySelector('.wordle-status').textContent = message;
    }
    
    restart() {
        this.currentRow = 0;
        this.currentCell = 0;
        this.gameOver = false;
        this.won = false;
        this.currentGuess = '';
        
        // Clear all cells
        document.querySelectorAll('.wordle-cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('correct', 'present', 'absent');
        });
        
        // Clear keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
        
        // Generate new target
        this.generateTargetExpression();
        this.updateStatus(`Find the calculation that equals ${this.targetResult}!`);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MathWordle();
}); 