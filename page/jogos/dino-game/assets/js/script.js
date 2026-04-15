const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');

// --- IMAGENS ---
const godzilaImg = new Image();
godzilaImg.src = 'assets/images/godzila.png';

const tower1Img = new Image();
tower1Img.src = 'assets/images/tower1.png';

const tower2Img = new Image();
tower2Img.src = 'assets/images/tower2.png';

const tower3Img = new Image();
tower3Img.src = 'assets/images/tower3.png';

const tower4Img = new Image();
tower4Img.src = 'assets/images/tower4.png';

const explosionImg = new Image();
explosionImg.src = 'assets/images/explosion-sheet.png';

// --- VARIÁVEIS DO ESTADO ---
let gameState = 'START'; // START, PLAYING, EXPLODING, GAME_OVER
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let obstacles = [];
const gravity = 0.6;
let explosionFrame = 0;

const player = { 
    x: 50, 
    y: 200, 
    w: 40, 
    h: 40, 
    dy: 0, 
    jumpForce: 16, 
    grounded: false 
};

// --- CONTROLES ---
function handleJump() {
    if (gameState === 'PLAYING' && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        handleJump();
    }
});

// Suporte para Celular / Mouse
document.addEventListener("touchstart", (e) => {
    if (e.target.tagName !== 'BUTTON') {
        handleJump();
    }
}, { passive: true });

document.addEventListener("mousedown", (e) => {
    if (e.target.tagName !== 'BUTTON') {
        handleJump();
    }
});

// --- FUNÇÃO PARA INICIAR JOGO ---
function startGame() {
    gameState = 'PLAYING';
    menu.style.display = 'none';
    score = 0;
    obstacles = [];
    player.y = 200;
    explosionFrame = 0;

    document.getElementById('high-score').innerText = 'High: ' + Math.floor(highScore);
    animate();
}

// --- LÓGICA DE COLISÃO ---
function checkCollision(player, obstacle) {
    const pPadX = 10;
    const pPadY = 10;
    const oPadX = 15;
    const oPadY = 10;

    return player.x + pPadX < obstacle.x + obstacle.w - oPadX &&
        player.x + player.w - pPadX > obstacle.x + oPadX &&
        player.y + pPadY < obstacle.y + obstacle.h - oPadY &&
        player.y + player.h - pPadY > obstacle.y + oPadY;
}

// --- LOOP PRINCIPAL DO JOGO ---
function animate() {
    if (gameState === 'START' || gameState === 'GAME_OVER') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'PLAYING') {
        // --- Atualiza Jogador ---
        player.dy += gravity;
        player.y += player.dy;

        if (player.y + player.h > canvas.height) {
            player.y = canvas.height - player.h;
            player.dy = 0;
            player.grounded = true;
        }

        // --- Spawn de Obstáculos ---
        let podeSpawnar = true;
        if (obstacles.length > 0) {
            let ultimoObstaculo = obstacles[obstacles.length - 1];
            if (canvas.width - ultimoObstaculo.x < 300) {
                podeSpawnar = false;
            }
        }

        if (Math.random() < 0.04 && podeSpawnar) {
            let altura = Math.floor(Math.random() * 70) + 40; 
            
            let randomBuilding;
            const rand = Math.random();
            if (rand < 0.3) randomBuilding = tower1Img;
            else if (rand < 0.6) randomBuilding = tower2Img;
            else if (rand < 0.9) randomBuilding = tower3Img;
            else randomBuilding = tower4Img;
            
            let aspect = 1;
            if (randomBuilding.width && randomBuilding.height) {
                aspect = randomBuilding.width / randomBuilding.height;
            }
            let larguraReal = altura * aspect;

            obstacles.push({ x: canvas.width, y: canvas.height - altura, w: larguraReal, h: altura, img: randomBuilding });
        }

        let currentSpeed = 3 + Math.floor(score / 100) * 0.5;

        // --- Move Obstáculos e Checa Colisão ---
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= currentSpeed; 

            if (checkCollision(player, obs)) {
                gameState = 'EXPLODING'; 
                break;
            }

            if (obs.x + obs.w < 0) {
                obstacles.splice(i, 1);
            }
        }

        score += 0.1;
        document.getElementById('score').innerText = 'Score: ' + Math.floor(score);
    }

    // --- Desenha Obstáculos ---
    obstacles.forEach((obs) => {
        if (obs.img && obs.img.complete) {
            ctx.drawImage(obs.img, obs.x, obs.y, obs.w, obs.h);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
    });

    // --- Desenha Jogador ou Animação de Explosão ---
    if (gameState === 'EXPLODING') {
        const frameW = 32; 
        const frameH = 32;
        const totalFrames = 7;
        const currentFrame = Math.floor(explosionFrame);

        if (explosionImg.complete && currentFrame < totalFrames){
            ctx.drawImage(
                explosionImg, 
                currentFrame * frameW, 0, frameW, frameH, 
                player.x - 20, player.y - 40, player.w + 60, player.h + 40 
            );
        }

        explosionFrame += 0.25; 

        if (currentFrame >= totalFrames) {
            gameState = 'GAME_OVER';
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('dinoHighScore', highScore);
            }

            menu.style.display = 'block';
            menu.innerHTML = '<h1>GAME OVER</h1><p>Score: ' + Math.floor(score) + '</p><p style="color: #FF6B6B; font-weight: bold; margin-bottom: 20px; font-size: 1.3rem;">High Score: ' + Math.floor(highScore) + '</p><button onclick="startGame()">De Novo!</button>';
        }
    } else {
        // --- Desenha Jogador Normal ---
        if (godzilaImg.complete) {
            ctx.drawImage(godzilaImg, player.x, player.y, player.w, player.h);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x, player.y, player.w, player.h);
        }
    }

    // --- Continua Loop Próximo Frame ---
    if (gameState !== 'GAME_OVER') {
        requestAnimationFrame(animate);
    }
}