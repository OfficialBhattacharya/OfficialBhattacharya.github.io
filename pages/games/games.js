// Games Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initTicTacToe();
});

function initTicTacToe() {
    const cells = document.querySelectorAll('.cell');
    const boards = document.querySelectorAll('.main-board');
    const gameStatus = document.querySelector('.game-status');
    const restartBtn = document.querySelector('.restart-button');
    
    let gameActive = true;
    let currentPlayer = 'X';
    let nextBoard = null;
    let gameState = {
        boardStates: Array(9).fill().map(() => Array(9).fill('')),
        mainBoardState: Array(9).fill('')
    };
    
    // Add click event to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    // Add restart button event
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    // Initialize the board
    updateBoardHighlights();
    
    function handleCellClick(e) {
        const cell = e.target;
        const boardIndex = parseInt(cell.parentNode.getAttribute('data-board'));
        const cellIndex = parseInt(cell.getAttribute('data-cell'));
        
        // If game is already over or cell is already played, do nothing
        if (!gameActive || gameState.boardStates[boardIndex][cellIndex] !== '') {
            return;
        }

        // Check if the move is valid based on previous move
        if (nextBoard !== null && nextBoard !== boardIndex) {
            // If a specific board is active and player clicked on a different board
            gameStatus.textContent = "Invalid move! You must play on the highlighted board.";
            return;
        }

        // Play the move
        makeMove(boardIndex, cellIndex, currentPlayer);
        
        // Check for game end
        if (checkGameEnd()) return;
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        // Set next board based on the cell clicked
        nextBoard = cellIndex;
        
        // If the nextBoard is full or won, allow any board
        if (isBoardFull(nextBoard) || gameState.mainBoardState[nextBoard] !== '') {
            nextBoard = null;
        }
        
        // Update UI
        updateBoardHighlights();
        gameStatus.textContent = `${currentPlayer}'s turn`;
        
        // If playing against computer
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
        // Update the game state
        gameState.boardStates[boardIndex][cellIndex] = player;
        
        // Update the UI
        const cell = document.querySelector(`.main-board[data-board="${boardIndex}"] .cell[data-cell="${cellIndex}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        // Check if this board is won
        if (checkBoardWin(boardIndex, player)) {
            gameState.mainBoardState[boardIndex] = player;
            highlightBoardWin(boardIndex, player);
        } else if (isBoardFull(boardIndex)) {
            // If board is full but no winner, mark as a draw
            gameState.mainBoardState[boardIndex] = 'draw';
        }
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        const move = findBestMove();
        if (move) {
            setTimeout(() => {
                makeMove(move.board, move.cell, 'O');
                
                // Check for game end
                if (checkGameEnd()) return;
                
                // Switch back to player
                currentPlayer = 'X';
                
                // Set next board based on the cell clicked
                nextBoard = move.cell;
                
                // If the nextBoard is full or won, allow any board
                if (isBoardFull(nextBoard) || gameState.mainBoardState[nextBoard] !== '') {
                    nextBoard = null;
                }
                
                // Update UI
                updateBoardHighlights();
                gameStatus.textContent = `${currentPlayer}'s turn`;
            }, 500);
        }
    }
    
    function findBestMove() {
        // Try to find a winning move for the computer
        for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
            // Skip if we must play in a specific board and this isn't it
            if (nextBoard !== null && boardIndex !== nextBoard) continue;
            
            // Skip if this board is already won or full
            if (gameState.mainBoardState[boardIndex] !== '') continue;
            
            // Try each cell in this board
            const winningMove = findWinningMove(boardIndex, 'O');
            if (winningMove !== null) {
                return { board: boardIndex, cell: winningMove };
            }
        }
        
        // Block player's potential winning move
        for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
            // Skip if we must play in a specific board and this isn't it
            if (nextBoard !== null && boardIndex !== nextBoard) continue;
            
            // Skip if this board is already won
            if (gameState.mainBoardState[boardIndex] !== '') continue;
            
            const blockingMove = findWinningMove(boardIndex, 'X');
            if (blockingMove !== null) {
                return { board: boardIndex, cell: blockingMove };
            }
        }
        
        // Find any valid move
        const validMoves = [];
        for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
            // Skip if we must play in a specific board and this isn't it
            if (nextBoard !== null && boardIndex !== nextBoard) continue;
            
            // Skip if this board is already won
            if (gameState.mainBoardState[boardIndex] !== '') continue;
            
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                if (gameState.boardStates[boardIndex][cellIndex] === '') {
                    validMoves.push({ board: boardIndex, cell: cellIndex });
                }
            }
        }
        
        // Return a random valid move
        return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null;
    }
    
    function findWinningMove(board, player) {
        // Check each cell in this board
        for (let i = 0; i < 9; i++) {
            // Skip if this cell is already taken
            if (gameState.boardStates[board][i] !== '') continue;
            
            // Try this move
            gameState.boardStates[board][i] = player;
            
            // Check if this move would win the board
            const win = checkBoardWin(board, player);
            
            // Undo the move
            gameState.boardStates[board][i] = '';
            
            if (win) {
                return i;
            }
        }
        
        return null;
    }
    
    function checkBoardWin(boardIndex, player) {
        const board = gameState.boardStates[boardIndex];
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }
    
    function isBoardFull(boardIndex) {
        return gameState.boardStates[boardIndex].every(cell => cell !== '');
    }
    
    function checkGameEnd() {
        // Check for ultimate win
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
        
        // Check for a draw (all boards are either won or full)
        const allBoardsFinished = gameState.mainBoardState.every(state => state !== '');
        if (allBoardsFinished) {
            gameStatus.textContent = 'Game ended in a draw!';
            gameActive = false;
            return true;
        }
        
        return false;
    }
    
    function checkUltimateWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            return pattern.every(index => gameState.mainBoardState[index] === player);
        });
    }
    
    function highlightBoardWin(boardIndex, player) {
        const board = document.querySelector(`.main-board[data-board="${boardIndex}"]`);
        board.style.backgroundColor = player === 'X' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 51, 102, 0.2)';
        
        // Disable all cells in this board
        const cells = board.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.disabled = true;
        });
    }
    
    function updateBoardHighlights() {
        // Remove active class from all boards
        boards.forEach(board => {
            board.classList.remove('active');
        });
        
        // Add active class to the next board (if specified)
        if (nextBoard !== null) {
            boards[nextBoard].classList.add('active');
        } else {
            // If any board is allowed, highlight all valid boards
            boards.forEach((board, index) => {
                if (gameState.mainBoardState[index] === '') {
                    board.classList.add('active');
                }
            });
        }
    }
    
    function restartGame() {
        // Reset game state
        gameState = {
            boardStates: Array(9).fill().map(() => Array(9).fill('')),
            mainBoardState: Array(9).fill('')
        };
        
        gameActive = true;
        currentPlayer = 'X';
        nextBoard = null;
        
        // Reset UI
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.disabled = false;
        });
        
        boards.forEach(board => {
            board.style.backgroundColor = '';
        });
        
        updateBoardHighlights();
        gameStatus.textContent = 'X starts! Click any cell to begin';
    }
} 