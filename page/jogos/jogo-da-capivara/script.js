const capivara = document.querySelector('.capivara');
const jacare = document.querySelector('.jacare');
const clouds = document.querySelector('.clouds');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const capivaraGameOver = document.querySelector('.capivara-game-over');

const pointsDisplay = document.getElementById('points-val');

let isStarted = false;
let isGameOver = false;
let animationFrameId;

let pontos = 0;
let podeMarcarPonto = true; 

let record = localStorage.getItem('capivaraRecord') || 0;

const gameLoop = () => {
    const jacarePosition = jacare.offsetLeft;
    const capivaraPosition = +window.getComputedStyle(capivara).bottom.replace('px','');

    // Lógica de Colisão
    if(jacarePosition <= 180 && capivaraPosition < 50 && jacarePosition > 0){
        gameOver(jacarePosition, capivaraPosition);
        return; 
    } 

    // Lógica de Pontuação 
    if (jacarePosition < 0 && podeMarcarPonto) {
        pontos += 20;
        pointsDisplay.innerHTML = pontos;
        podeMarcarPonto = false; 
    }

    if (jacarePosition > 200) {
        podeMarcarPonto = true;
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

const startGame = () => {
    isStarted = true;
    startScreen.style.display = 'none';
    
    jacare.style.animationPlayState = 'running';
    clouds.style.animationPlayState = 'running';

    animationFrameId = requestAnimationFrame(gameLoop);
}

const gameOver = (posicaoJacareAtual, posicaoCapivaraAtual) => {
    cancelAnimationFrame(animationFrameId); 
    isGameOver = true;

    jacare.style.animationPlayState = 'paused';
    clouds.style.animationPlayState = 'paused';
    
    jacare.style.animation = 'none';
    jacare.style.left = `${posicaoJacareAtual}px`; 

    capivara.style.animation = 'none'; 
    capivara.style.display = 'none'; 

    // Segurança: Só tenta mexer na imagem morta se ela existir no HTML
    if (capivaraGameOver) {
        capivaraGameOver.style.bottom = `${posicaoCapivaraAtual}px`; 
        capivaraGameOver.style.display = 'block'; 
    }

    if (pontos > record) {
        record = pontos;
        localStorage.setItem('capivaraRecord', record);
    }

    // Atualiza os textos e mostra a tela final
    document.getElementById('current-score').innerHTML = pontos; 
    document.getElementById('high-score').innerHTML = record;
    gameOverScreen.style.display = 'block';
}

const jump = () => {
    if (isGameOver) return;
    if (!capivara.classList.contains('jump')) {
        capivara.classList.add('jump');
        
        setTimeout(() => {
            capivara.classList.remove('jump');
        }, 800);
    }
}

document.addEventListener('keydown', () => {
    if (isGameOver) {
        location.reload();
        return; 
    }
    if (!isStarted) {
        startGame();
    } else {
        jump();
    }
});