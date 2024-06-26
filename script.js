// script.js

const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const multiplayerButton = document.getElementById('multiplayerButton');
const aiButton = document.getElementById('aiButton');

let isXTurn = true;
let boardState = Array(9).fill(null);
let isMultiplayer = true;

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

multiplayerButton.addEventListener('click', () => startGame(true));
aiButton.addEventListener('click', () => startGame(false));
restartButton.addEventListener('click', restartGame);

function startGame(multiplayer) {
    isMultiplayer = multiplayer;
    restartGame();
    gameStatus.textContent = `Player X's turn`;
    board.style.display = 'grid';
}

function handleClick(event) {
    const cell = event.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] !== null || checkWin()) {
        return;
    }

    boardState[cellIndex] = isXTurn ? 'X' : 'O';
    cell.textContent = boardState[cellIndex];
    cell.style.cursor = 'default';

    if (checkWin()) {
        gameStatus.textContent = `${isXTurn ? 'X' : 'O'} wins!`;
    } else if (boardState.every(cell => cell !== null)) {
        gameStatus.textContent = 'It\'s a tie!';
    } else {
        isXTurn = !isXTurn;
        gameStatus.textContent = `Player ${isXTurn ? 'X' : 'O'}'s turn`;
        if (!isMultiplayer && !isXTurn) {
            setTimeout(aiMove, 500); // Delay AI move for a better user experience
        }
    }
}

function aiMove() {
    const emptyCells = boardState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    cells[randomIndex].style.cursor = 'default';

    if (checkWin()) {
        gameStatus.textContent = 'O wins!';
    } else if (boardState.every(cell => cell !== null)) {
        gameStatus.textContent = 'It\'s a tie!';
    } else {
        isXTurn = !isXTurn;
        gameStatus.textContent = `Player X's turn`;
    }
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return boardState[index] !== null && boardState[index] === boardState[pattern[0]];
        });
    });
}

function restartGame() {
    isXTurn = true;
    boardState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.cursor = 'pointer';
    });
    gameStatus.textContent = 'Choose Game Mode';
    board.style.display = 'none'; // Hide the board when restarting
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
