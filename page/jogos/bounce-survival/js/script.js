const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');

// Função para gerar posição aleatória da bola
function getRandomBallPosition() {
    return {
        x: Math.random() * (canvas.width - 40) + 20, // Entre 20 e canvas.width - 20
        y: 50
    };
}

// Elementos do jogo
let ball = {
    x: canvas.width / 2,
    y: 50,
    dx: 2,
    dy: 2,
    radius: 10
};

let paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    speed: 7
};

let score = 0;
let gameRunning = false;
let animationRunning = true;

// Controles
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Desenhar elementos
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Atualizar jogo
function update() {
    // Mover raquete
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // Mover bola
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisão com paredes laterais
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    // Colisão com teto
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Colisão com raquete
    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.dy > 0) {
        // Física: ângulo baseado na posição de impacto
        let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        let center = paddle.x + paddle.width / 2;
        let distanceFromCenter = ball.x - center;
        let maxAngle = Math.PI / 3; // 60 graus máximo
        let angle = (distanceFromCenter / (paddle.width / 2)) * maxAngle;
        
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
        
        // Aumentar velocidade ligeiramente para dificuldade
        speed *= 1.05;
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
        
        score++;
        scoreDisplay.textContent = 'Pontuação: ' + score;
    }

    // Bola sai pela parte inferior (derrota)
    if (ball.y + ball.radius > canvas.height) {
        gameRunning = false;
        alert('Fim de jogo! Pontuação: ' + score);
    }
}

// Loop do jogo
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    if (gameRunning) {
        update();
    }
    requestAnimationFrame(gameLoop);
}

// Reiniciar jogo
resetBtn.addEventListener('click', () => {
    let pos = getRandomBallPosition();
    ball.x = pos.x;
    ball.y = pos.y;
    ball.dx = 2;
    ball.dy = 2;
    paddle.x = canvas.width / 2 - 50;
    score = 0;
    scoreDisplay.textContent = 'Pontuação: 0';
    gameRunning = true;
    startBtn.textContent = '⏸ Pausar Jogo';
    rightPressed = false;
    leftPressed = false;
});

// Iniciar/Pausar jogo
startBtn.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.textContent = '⏸ Pausar Jogo';
    } else {
        gameRunning = false;
        startBtn.textContent = '▶ Retomar Jogo';
    }
});

// Iniciar loop de animação
gameLoop();