// 1. MAPEAMENTO DO HTML (DOM)
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startBtn = document.getElementById('start-btn');
const rankingList = document.getElementById('ranking-list');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const progressiveCheckbox = document.getElementById('progressive-mode');

// 2. VARIÁVEIS DE ESTADO DO JOGO
let score = 0;
let lives = 3;
let isGameOver = false;
let spawnTimeout;
let topScores = []; // Guarda o ranking local

// 3. FUNÇÕES DE CONFIGURAÇÃO E PONTUAÇÃO
function getBaseTime() {
    let selectedTime = 1000; // Padrão: Médio
    difficultyRadios.forEach(radio => {
        if (radio.checked) {
            selectedTime = parseInt(radio.value);
        }
    });
    return selectedTime;
}

function getPointsPerHit() {
    let baseTime = getBaseTime();
    let points = 10; // Fácil

    if (baseTime === 1000) {
        points = 15; // Médio
    } else if (baseTime === 750) {
        points = 20; // Difícil
    }

    // Bônus se a aceleração contínua estiver ativada
    if (progressiveCheckbox.checked) {
        points += 5;
    }

    return points;
}

// 4. LÓGICA PRINCIPAL DO JOGO
function startGame() {
    score = 0;
    lives = 3;
    isGameOver = false;
    updateHUD();
    gameArea.innerHTML = '';
    startBtn.disabled = true;

    spawnNextTarget(); // Começa a gerar os alvos
}

function spawnNextTarget() {
    if (isGameOver) return;

    createTarget();

    let baseTime = getBaseTime();
    
    // Calcula a velocidade com que o PRÓXIMO alvo vai aparecer
    let currentSpeed = progressiveCheckbox.checked 
        ? Math.max(300, baseTime - (score * 5)) 
        : baseTime;
    
    spawnTimeout = setTimeout(spawnNextTarget, currentSpeed);
}

function createTarget() {
    const target = document.createElement('div');
    target.classList.add('target');

    // Define o tamanho do alvo
    const targetSize = 50;
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;

    // Sorteia posição X e Y na arena
    const maxX = gameArea.clientWidth - targetSize;
    const maxY = gameArea.clientHeight - targetSize;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

    // Calcula quanto tempo ESTE alvo fica na tela
    let baseTime = getBaseTime();
    let currentLifespan = progressiveCheckbox.checked 
        ? Math.max(300, baseTime - (score * 5)) 
        : baseTime;

    // Temporizador de Erro (Perda de Vida)
    const missTimeout = setTimeout(() => {
        if (!isGameOver && gameArea.contains(target)) { 
            target.remove();
            loseLife();
        }
    }, currentLifespan);

    // Evento de Acerto (Clique)
    target.addEventListener('mousedown', () => {
        if (isGameOver || !gameArea.contains(target)) return; 
        
        clearTimeout(missTimeout); 
        target.remove();
        score += getPointsPerHit(); 
        updateHUD();
    });

    gameArea.appendChild(target);
}

// 5. FUNÇÕES DE APOIO E FIM DE JOGO
function loseLife() {
    lives--;
    updateHUD();
    
    if (lives <= 0 && !isGameOver) {
        gameOver();
    }
}

function updateHUD() {
    scoreElement.innerText = score;
    livesElement.innerText = lives;
}

function gameOver() {
    isGameOver = true;
    clearTimeout(spawnTimeout);
    gameArea.innerHTML = '';
    startBtn.disabled = false;
    
    atualizarRanking();
    
    setTimeout(() => {
        alert(`Fim de jogo! Sua precisão rendeu uma pontuação de: ${score}`);
    }, 100);
}

function atualizarRanking() {
    topScores.push(score);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 5);

    rankingList.innerHTML = '';
    topScores.forEach((pontuacao, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}º Lugar: ${pontuacao} pontos`;
        rankingList.appendChild(li);
    });
}

startBtn.addEventListener('click', startGame);