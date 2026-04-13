const gameScreen = document.getElementById('game-screen');
const carminha = document.getElementById('carminha');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

let score = 0;
let isGameOver = false;
let carPosition = 175;
let animationFrameId;
let obstacleIntervalId;

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') keys.ArrowLeft = true;
    if (event.key === 'ArrowRight' || event.key === 'd') keys.ArrowRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') keys.ArrowLeft = false;
    if (event.key === 'ArrowRight' || event.key === 'd') keys.ArrowRight = false;
});

function spawnObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    const randomLeft = Math.floor(Math.random() * 340);
    obstacle.style.left = randomLeft + 'px';
    obstacle.style.top = '-50px';
    
    gameScreen.appendChild(obstacle);
}

function gameLoop() {
    if (isGameOver) return;

    if (keys.ArrowLeft && carPosition > 0) {
        carPosition -= 5;
    }
    if (keys.ArrowRight && carPosition < 350) {
        carPosition += 5;
    }
    carminha.style.left = carPosition + 'px';

    const obstacles = document.querySelectorAll('.obstacle');
    
    const carRect = carminha.getBoundingClientRect();

    obstacles.forEach((obstacle) => {
        let currentTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        obstacle.style.top = (currentTop + 5) + 'px';

        const obsRect = obstacle.getBoundingClientRect();
        
        if (
            carRect.left < obsRect.right &&
            carRect.right > obsRect.left &&
            carRect.top < obsRect.bottom &&
            carRect.bottom > obsRect.top
        ) {
            triggerGameOver();
        }

        if (currentTop > 600) {
            obstacle.remove();
            score += 10;
            scoreElement.innerText = score;
        }
    });

    animationFrameId = requestAnimationFrame(gameLoop);
}

function triggerGameOver() {
    isGameOver = true;
    cancelAnimationFrame(animationFrameId);
    clearInterval(obstacleIntervalId);
    
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    isGameOver = false;
    score = 0;
    scoreElement.innerText = score;
    carPosition = 175;
    carminha.style.left = carPosition + 'px';
    
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obs => obs.remove());
    
    gameOverScreen.classList.add('hidden');
    
    startGame();
}

restartBtn.addEventListener('click', resetGame);

function startGame() {
    startScreen.classList.add('hidden'); 
    
    obstacleIntervalId = setInterval(spawnObstacle, 500);
    gameLoop();
}

startBtn.addEventListener('click', startGame);