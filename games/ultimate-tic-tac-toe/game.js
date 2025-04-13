// Ultimate Tic-Tac-Toe game logic
document.addEventListener('DOMContentLoaded', function() {
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

        // Check if move is valid
        if (!isValidMove(boardIndex, cellIndex)) return;

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
        if (!gameActive) return;

        // Find best move
        const move = findBestMove();
        if (move) {
            makeMove(move.board, move.cell, 'O');
            
            if (checkGameEnd()) return;

            isPlayerTurn = true;
            gameStatus.textContent = "Your turn!";
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
}); 