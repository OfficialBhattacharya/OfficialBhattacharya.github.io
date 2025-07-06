// Its All in the Cards Game Logic
class CardsGame {
    constructor() {
        this.deck = [];
        this.currentCard = null;
        this.previousCard = null;
        this.score = 0;
        this.streak = 0;
        this.gameStarted = false;
        this.gameOver = false;
        
        this.suits = ['♠', '♥', '♦', '♣'];
        this.values = [
            { display: 'A', value: 1 },
            { display: '2', value: 2 },
            { display: '3', value: 3 },
            { display: '4', value: 4 },
            { display: '5', value: 5 },
            { display: '6', value: 6 },
            { display: '7', value: 7 },
            { display: '8', value: 8 },
            { display: '9', value: 9 },
            { display: '10', value: 10 },
            { display: 'J', value: 11 },
            { display: 'Q', value: 12 },
            { display: 'K', value: 13 }
        ];
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        this.createDeck();
        this.shuffleDeck();
        this.drawFirstCard();
        this.updateDisplay();
    }
    
    createDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.deck.push({
                    suit: suit,
                    display: value.display,
                    value: value.value
                });
            }
        }
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    drawFirstCard() {
        if (this.deck.length > 0) {
            this.currentCard = this.deck.pop();
            this.displayCard(this.currentCard);
        }
    }
    
    drawNextCard() {
        if (this.deck.length > 0) {
            this.previousCard = this.currentCard;
            this.currentCard = this.deck.pop();
            return this.currentCard;
        }
        return null;
    }
    
    displayCard(card) {
        const cardElement = document.querySelector('.current-card');
        cardElement.classList.remove('back');
        
        if (card) {
            cardElement.innerHTML = `${card.display}<span class="suit" style="color: ${card.suit === '♥' || card.suit === '♦' ? '#ff6b6b' : '#000'}">${card.suit}</span>`;
        } else {
            cardElement.classList.add('back');
            cardElement.innerHTML = '';
        }
    }
    
    bindEvents() {
        // Begin game button
        document.querySelector('.begin-game-button').addEventListener('click', () => {
            this.beginGame();
        });
        
        // Prediction buttons
        document.querySelector('.predict-button.higher').addEventListener('click', () => {
            this.makePrediction('higher');
        });
        
        document.querySelector('.predict-button.lower').addEventListener('click', () => {
            this.makePrediction('lower');
        });
    }
    
    beginGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.streak = 0;
        
        // Reset deck and draw first card
        this.createDeck();
        this.shuffleDeck();
        this.drawFirstCard();
        
        this.updateDisplay();
        this.updateButtons();
    }
    
    makePrediction(prediction) {
        if (!this.gameStarted || this.gameOver || this.deck.length === 0) return;
        
        const nextCard = this.drawNextCard();
        if (!nextCard) {
            this.endGame("No more cards! Game Over!");
            return;
        }
        
        // Show card flip animation
        const cardElement = document.querySelector('.current-card');
        cardElement.classList.add('card-flip');
        
        setTimeout(() => {
            this.displayCard(nextCard);
            cardElement.classList.remove('card-flip');
            
            // Check prediction
            let correct = false;
            if (prediction === 'higher' && nextCard.value > this.previousCard.value) {
                correct = true;
            } else if (prediction === 'lower' && nextCard.value < this.previousCard.value) {
                correct = true;
            } else if (nextCard.value === this.previousCard.value) {
                // Same value - both predictions are wrong
                correct = false;
            }
            
            if (correct) {
                this.score += 10;
                this.streak += 1;
                cardElement.classList.add('correct-prediction');
                setTimeout(() => cardElement.classList.remove('correct-prediction'), 500);
            } else {
                this.streak = 0;
                cardElement.classList.add('wrong-prediction');
                setTimeout(() => cardElement.classList.remove('wrong-prediction'), 500);
                
                // End game on wrong prediction
                this.endGame(`Wrong prediction! Final score: ${this.score}`);
                return;
            }
            
            this.updateDisplay();
            
            // Check if deck is empty
            if (this.deck.length === 0) {
                this.endGame(`Congratulations! You completed the deck! Final score: ${this.score}`);
            }
            
        }, 300);
    }
    
    endGame(message) {
        this.gameOver = true;
        this.gameStarted = false;
        alert(message);
        this.updateButtons();
    }
    
    updateDisplay() {
        document.querySelector('.score-value').textContent = this.score;
        document.querySelector('.streak-value').textContent = this.streak;
    }
    
    updateButtons() {
        const beginButton = document.querySelector('.begin-game-button');
        const predictButtons = document.querySelectorAll('.predict-button');
        
        if (this.gameStarted && !this.gameOver) {
            beginButton.textContent = 'New Game';
            beginButton.disabled = false;
            predictButtons.forEach(btn => btn.disabled = false);
        } else {
            beginButton.textContent = this.gameOver ? 'Play Again' : 'Begin the game';
            beginButton.disabled = false;
            predictButtons.forEach(btn => btn.disabled = true);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CardsGame();
}); 