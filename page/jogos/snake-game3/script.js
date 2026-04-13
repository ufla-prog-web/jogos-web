const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

const boardSize = 25;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 0, y: 0};
let score = 0;
let level = 1;
let foodsEaten = 0;
let speed = 300;
let gameRunning = false;
let paused = false;

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.left = `${j * 20}px`;
            cell.style.top = `${i * 20}px`;
            board.appendChild(cell);
        }
    }
}

function draw() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');

    snake.forEach((segment, index) => {
        const cellIndex = segment.y * boardSize + segment.x;
        if (cells[cellIndex]) {
            if (index === 0) {
                cells[cellIndex].classList.add('snake-head');
            } else {
                cells[cellIndex].classList.add('snake-body');
            }
        }
    });

    const foodIndex = food.y * boardSize + food.x;
    if (cells[foodIndex]) cells[foodIndex].classList.add('food');
}

function move() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        foodsEaten++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        generateFood();
        if (foodsEaten % 6 === 0) {
            level++;
            levelDisplay.textContent = `Nível: ${level}`;
            speed = Math.max(100, speed - 50);
        }
    } else {
        snake.pop();
    }
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * boardSize);
        food.y = Math.floor(Math.random() * boardSize);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function changeDirection(event) {
    if (!gameRunning) return;

    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = {x: 0, y: -1};
        event.preventDefault();
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = {x: 0, y: 1};
        event.preventDefault();
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = {x: -1, y: 0};
        event.preventDefault();
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = {x: 1, y: 0};
        event.preventDefault();
    }
}

function gameLoop() {
    if (gameRunning && !paused) {
        move();
        draw();
        setTimeout(gameLoop, speed);
    }
}
function pauseGame() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Continuar' : 'Pausar';
    if (!paused) {
        gameLoop();
    }
}
function startGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    score = 0;
    level = 1;
    foodsEaten = 0;
    speed = 300;
    paused = false;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    levelDisplay.textContent = `Nível: ${level}`;
    gameRunning = true;
    gameOverDiv.style.display = 'none';
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';
    pauseBtn.textContent = 'Pausar';
    restartBtn.style.display = 'inline';
    generateFood();
    draw();
    gameLoop();
}

function pauseGame() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Continuar' : 'Pausar';
    if (!paused) {
        gameLoop();
    }
}

function gameOver() {
    gameRunning = false;
    paused = false;
    finalScore.textContent = `Pontuação Final: ${score}`;
    gameOverDiv.style.display = 'block';
    pauseBtn.style.display = 'none';
    restartBtn.style.display = 'inline';
}

function restartGame() {
    startGame();
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);
document.addEventListener('keydown', changeDirection);

createBoard();