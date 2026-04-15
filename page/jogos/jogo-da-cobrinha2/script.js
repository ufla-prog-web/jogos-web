// variaveis vindas do html 
const grid = document.querySelector('#grid');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const startScreen = document.getElementById('screen-start');
const overScreen = document.getElementById('screen-over');

let squares = [];
let snake = [2, 1, 0]; // Índices das divs que formam a cobra
let direction = 1;     // 1 para direita, -1 esquerda, 20 baixo, -20 cima
let appleIndex = 0;
let score = 0;
let level = 1;
let timerId = 0;
let intervalTime = 200;

//  grade de 400 divs (20x20) 
function createBoard() {
    for (let i = 0; i < 400; i++) {
        let square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }
}
createBoard();

// controle por teclado
function control(e) {
    if (e.key === "ArrowUp" && direction !== 20) direction = -20;
    else if (e.key === "ArrowDown" && direction !== -20) direction = 20;
    else if (e.key === "ArrowLeft" && direction !== 1) direction = -1;
    else if (e.key === "ArrowRight" && direction !== -1) direction = 1;
}
document.addEventListener("keydown", control);

// lógica: movimento e colisão
function move() {
    // Checar colisão com bordas e corpo
    if (
        (snake[0] + 20 >= 400 && direction === 20) || 
        (snake[0] - 20 < 0 && direction === -20) ||
        (snake[0] % 20 === 19 && direction === 1) ||
        (snake[0] % 20 === 0 && direction === -1) ||
        squares[snake[0] + direction].classList.contains('snake')
    ) {
        gameOver();
        return clearInterval(timerId);
    }

    // Movimentação visual
    const tail = snake.pop();
    squares[tail].classList.remove('snake');
    snake.unshift(snake[0] + direction);
    
    // Lógica da Maçã 
    if (squares[snake[0]].classList.contains('apple')) {
        squares[snake[0]].classList.remove('apple');
        squares[tail].classList.add('snake');
        snake.push(tail);
        generateApple();
        updateScore();
    }
    
    squares[snake[0]].classList.add('snake');
}

// funcoes auxilires para gerar maçã e atualizar pontuação/nível
function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'));
    squares[appleIndex].classList.add('apple');
}

function updateScore() {
    score += 10;
    scoreEl.innerText = score;
    if (score % 50 === 0) {
        level++;
        levelEl.innerText = level;
        clearInterval(timerId);
        intervalTime *= 0.9; // Aumenta a velocidade
        timerId = setInterval(move, intervalTime);
    }
}

const pauseScreen = document.getElementById('screen-pause');
let isPaused = false;

function togglePause() {
    // Só permite pausar se o jogo já tiver começado 
    // e se não for Game Over 
    if (startScreen.classList.contains('hidden') && overScreen.classList.contains('hidden')) {
        if (isPaused) {
            timerId = setInterval(move, intervalTime);
            pauseScreen.classList.add('hidden'); // Esconde a mensagem
        } else {
            clearInterval(timerId);
            pauseScreen.classList.remove('hidden'); // Mostra a mensagem
        }
        isPaused = !isPaused;
    }
}

// Evento para a tecla Espaço
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); // Evita que a página role para baixo ao apertar espaço
        togglePause();
    }
});

function gameOver() {
    overScreen.classList.remove('hidden');
}

// inicialização e botoes 
document.getElementById('btn-start').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    generateApple(); 
    snake.forEach(index => squares[index].classList.add('snake'));
    timerId = setInterval(move, intervalTime);
});

document.getElementById('btn-restart').addEventListener('click', () => location.reload());