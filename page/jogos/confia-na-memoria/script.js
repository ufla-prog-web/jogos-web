let sequence = [];
let playerSequence = [];
let gameActive = false;
let level = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;
let currentDifficulty = null;

const difficulties = {
    easy: { name: 'Fácil', maxRounds: 5 },
    medium: { name: 'Médio', maxRounds: 10 },
    hard: { name: 'Difícil', maxRounds: 15 },
    infinite: { name: 'Infinito', maxRounds: Infinity }
};

const colors = {
    red: { element: document.querySelector('.button.red'), sound: 200 },
    green: { element: document.querySelector('.button.green'), sound: 300 },
    yellow: { element: document.querySelector('.button.yellow'), sound: 400 },
    blue: { element: document.querySelector('.button.blue'), sound: 500 },
    orange: { element: document.querySelector('.button.orange'), sound: 350 },
    purple: { element: document.querySelector('.button.purple'), sound: 450 },
    cyan: { element: document.querySelector('.button.cyan'), sound: 550 },
    pink: { element: document.querySelector('.button.pink'), sound: 600 }
};

document.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
    addButtonListeners();
});

function setDifficulty(difficulty) {
    if (!['easy', 'medium', 'hard', 'infinite'].includes(difficulty)) return;
    
    currentDifficulty = difficulty;
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
    
    const maxRounds = difficulties[difficulty].maxRounds;
    const displayText = maxRounds === Infinity ? '∞' : maxRounds;
    document.getElementById('targetRounds').textContent = displayText;
    
    document.getElementById('startBtn').textContent = 'Começar';
    
    updateStatus(`Nível ${difficulties[difficulty].name} selecionado. Clique em COMEÇAR!`);
}

function addButtonListeners() {
    Object.values(colors).forEach(color => {
        color.element.addEventListener('click', onColorClick);
    });
}

function onColorClick(event) {
    if (!gameActive) return;

    const button = event.target;
    const colorKey = Object.keys(colors).find(
        key => colors[key].element === button
    );

    playerSequence.push(colorKey);
    playColor(colorKey);
    checkPlayerMove();
}

function startGame() {
    if (!currentDifficulty) {
        updateStatus('Selecione um nível antes de começar!');
        return;
    }
    
    sequence = [];
    playerSequence = [];
    level = 0;
    gameActive = true;
    nextRound();
}

function nextRound() {
    playerSequence = [];
    level++;
    updateLevel();

    const colorKeys = Object.keys(colors);
    const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    sequence.push(randomColor);

    playSequence();
}

function playSequence() {
    let delay = 600;

    sequence.forEach((color, index) => {
        setTimeout(() => {
            playColor(color);
        }, delay + index * 600);
    });
}

function playColor(colorKey) {
    const color = colors[colorKey];
    color.element.classList.add('active');

    playSound(color.sound);

    setTimeout(() => {
        color.element.classList.remove('active');
    }, 300);
}

function playSound(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function checkPlayerMove() {
    const lastIndex = playerSequence.length - 1;
    const lastPlayerMove = playerSequence[lastIndex];
    const lastSequenceMove = sequence[lastIndex];

    if (lastPlayerMove !== lastSequenceMove) {
        endGame();
        return;
    }

    if (playerSequence.length === sequence.length) {
        const maxRounds = difficulties[currentDifficulty].maxRounds;
        if (level >= maxRounds) {
            winGame();
            return;
        }
        
        setTimeout(() => {
            nextRound();
        }, 1000);
    }
}

function endGame() {
    gameActive = false;
    
    document.getElementById('startBtn').textContent = 'Recomeçar';

    updateHighScore();
    updateStatus(`❌ Erro na rodada ${level}! Recorde: ${highScore}`);
}

function winGame() {
    gameActive = false;
    
    document.getElementById('startBtn').textContent = 'Recomeçar';
    
    const difficultyName = difficulties[currentDifficulty].name;
    updateHighScore();
    updateStatus(`🎉 Você venceu o nível ${difficultyName}! Recorde: ${highScore}`);
}

function updateLevel() {
    document.getElementById('level').textContent = level;
}

function updateHighScore() {
    if (level > highScore) {
        highScore = level;
        localStorage.setItem('simonHighScore', highScore);
    }
    document.getElementById('highScore').textContent = highScore;
}

function loadHighScore() {
    document.getElementById('highScore').textContent = highScore;
}

function updateStatus(message) {
    document.getElementById('status').textContent = message;
}
