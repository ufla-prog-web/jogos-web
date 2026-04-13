// Canvas: onde o jogo e desenhado
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tamanho da grade
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 6;
const maxSpeed = 12;

// Estado atual da partida
let isRunning = false;
let isPaused = false;
let isGameOver = false;

let snake = [{ x: 10, y: 10 }];

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let food = generateFood();

let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('highScore').textContent = highScore;

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const statusElement = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Sorteia uma posicao valida para a comida.
// Continua sorteando enquanto cair em cima da cobra.
function generateFood() {
    let newFood;
    let foodOnSnake = true;

    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Garante que a comida não apareça dentro da cobra
        foodOnSnake = snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        );
    }
    
    return newFood;
}

function updateGame() {
    if (!isRunning || isPaused || isGameOver) return;

    // Aplica a direcao solicitada pelo teclado no proximo "tick"
    direction = nextDirection;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Parede = game over
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Corpo = game over
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Adiciona a nova cabeca no inicio do array
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();

        // Aumenta dificuldade de forma gradual
        if (speed < maxSpeed) {
            speed += 0.1;
        }
    } else {
        // Se nao comeu, remove o ultimo segmento para manter o tamanho
        snake.pop();
    }
}

// Renderiza o estado atual do jogo na tela.
function drawGame() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grade de fundo
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00aa00';
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

        // Olhos apenas na cabeca para indicar orientacao da cobra
        if (index === 0) {
            ctx.fillStyle = '#000';
            const eyeSize = 2;
            
            if (direction.x === 1) {
                ctx.fillRect(segment.x * gridSize + 10, segment.y * gridSize + 6, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 10, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (direction.x === -1) {
                ctx.fillRect(segment.x * gridSize + 8, segment.y * gridSize + 6, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 8, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (direction.y === -1) {
                ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 8, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 8, eyeSize, eyeSize);
            } else if (direction.y === 1) {
                ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 10, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 10, eyeSize, eyeSize);
            }
        }
    });

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(
        food.x * gridSize + 1,
        food.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
    );
}

let lastUpdateTime = 0;

// Loop principal: controla tempo de atualizacao e redesenho.
function gameLoop(currentTime = 0) {
    const deltaTime = currentTime - lastUpdateTime;
    const updateInterval = 1000 / speed;

    if (deltaTime >= updateInterval) {
        updateGame();
        lastUpdateTime = currentTime;
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

function handleKeyPress(event) {
    if (!isRunning || isGameOver) return;

    const key = event.key.toUpperCase();

    // Evita que a pagina role ao usar as setas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    // Setas
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }

    // WASD
    switch (key) {
        case 'W':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'S':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'A':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'D':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
        case ' ':
            togglePause();
            break;
    }
}

function startGame() {
    if (isRunning) return;

    isRunning = true;
    isPaused = false;
    isGameOver = false;
    
    updateStatus('Jogando');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    gameLoop();
}

function togglePause() {
    if (!isRunning || isGameOver) return;

    isPaused = !isPaused;
    
    if (isPaused) {
        updateStatus('Pausado');
        pauseBtn.textContent = 'Retomar';
    } else {
        updateStatus('Jogando');
        pauseBtn.textContent = 'Pausar';
        gameLoop();
    }
}

function endGame() {
    isRunning = false;
    isGameOver = true;
    updateStatus('Game Over!');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pausar';

    // Salva recorde no navegador
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
        alert(`🎉 Novo Recorde! Você marcou ${score} pontos!`);
    } else {
        alert(`Game Over! Sua pontuação: ${score}\nRecorde: ${highScore}`);
    }
}

function resetGame() {
    // Volta para o estado inicial
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    speed = 6;
    
    food = generateFood();
    
    isRunning = false;
    isPaused = false;
    isGameOver = false;
    
    updateStatus('Pronto');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pausar';
    
    drawGame();
}

function updateStatus(newStatus) {
    statusElement.textContent = newStatus;
    statusElement.className = 'status';
    
    if (newStatus === 'Jogando') {
        statusElement.classList.add('playing');
    } else if (newStatus === 'Pausado') {
        statusElement.classList.add('paused');
    } else if (newStatus === 'Game Over!') {
        statusElement.classList.add('gameover');
    }
}

// Eventos de interface
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', handleKeyPress);

drawGame();
