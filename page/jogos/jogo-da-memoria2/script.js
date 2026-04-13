const CONFIG = {
    difficulties: {
        4: { size: 4, name: 'Fácil' },
        6: { size: 6, name: 'Médio' },
        8: { size: 8, name: 'Difícil' },
        10: { size: 10, name: 'Insano' }
    },
    defaultDifficulty: 4,
    emojis: [
        '🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎳', '🎴', '🀄', '🧩', '🎀', '🎁', '🎊',
        '🎈', '🎉', '✨', '🎃', '🎄', '🎅', '👻', '👽', '👾', '🤖', '🧠', '👑', '💎', '💰', '🏆', '🥇',
        '🥈', '🥉', '🚀', '🛸', '🚁', '🚂', '🚗', '🚓', '🚑', '🚒', '🚜', '🚲', '⚓', '⛵', '🚤', '🚢',
        '⛰️', '🌋', '🏞️', '🏜️', '🏝️', '🏛️', '⛩️', '🕋', '🛰️', '💡', '💣', '🔑', '🛡️', '⚙️', '🧪', '🧲' // 52 emojis
    ]
};

const gameState = {
    currentDifficulty: CONFIG.defaultDifficulty,
    gridSize: 4,
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 8,
    moves: 0,
    timerStarted: false,
    timerInterval: null,
    elapsedSeconds: 0,
    gameOver: false,
    gameWon: false,
    rankingOpen: false
};

const DOM = {
    gameBoard: document.getElementById('gameBoard'),
    movesDisplay: document.getElementById('moves'),
    timerDisplay: document.getElementById('timer'),
    pairsDisplay: document.getElementById('pairs'),
    totalPairsDisplay: document.getElementById('total-pairs')
};

function initGame() {
    resetGameState();
    // A dificuldade é definida pelos botões do menu agora
    generateCards();
    renderBoard();
    updateDisplay(); // Garante que o display comece em 0
    showMenuModal();
}

function resetGameState() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.elapsedSeconds = 0;
    gameState.timerStarted = false;
    gameState.gameWon = false;
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.gameOver = false;
    gameState.gridSize = CONFIG.difficulties[gameState.currentDifficulty].size;
    gameState.totalPairs = (gameState.gridSize * gameState.gridSize) / 2;
}

function generateCards() {
    const totalCards = gameState.gridSize * gameState.gridSize;
    const pairsNeeded = totalCards / 2;
    const selectedEmojis = CONFIG.emojis.slice(0, pairsNeeded);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    gameState.cards = shuffleArray(cardPairs).map((emoji, index) => ({
        id: index,
        emoji: emoji,
        matched: false,
        flipped: false
    }));
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderBoard() {
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.setAttribute('data-size', gameState.gridSize);
    
    gameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.id = `card-${card.id}`;

        const innerElement = document.createElement('div');
        innerElement.className = 'card-inner';
        innerElement.textContent = card.emoji;
        cardElement.appendChild(innerElement);

        cardElement.addEventListener('click', () => handleCardClick(card.id));
        
        DOM.gameBoard.appendChild(cardElement);
    });
}

function handleCardClick(cardId) {
    // Bloqueia cliques se jogo acabou ou se já tem 2 cartas viradas
    if (gameState.gameOver || gameState.gameWon) return;
    if (gameState.flippedCards.length >= 2) return;
    
    const card = gameState.cards[cardId];
    
    // Bloqueia se já está virada ou já é um par
    if (card.flipped || card.matched) return;
    
    // Inicia o timer no primeiro clique
    if (!gameState.timerStarted) {
        startTimer();
    }

    // Vira a carta
    card.flipped = true;
    gameState.flippedCards.push(card);
    
    // Atualiza visual
    updateCardVisual(cardId);
    
    // Se virou a segunda carta, verifica
    if (gameState.flippedCards.length === 2) {
        checkMatch();
    }
}

function updateCardVisual(cardId) {
    const cardElement = document.getElementById(`card-${cardId}`);
    cardElement.classList.add('flipped');
}

function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    
    // Bloqueia cliques enquanto verifica
    disableAllCards();
    
    // Aguarda um pouco antes de verificar (pra ver as duas cartas)
    setTimeout(() => {
        if (card1.emoji === card2.emoji) {
            // ENCONTROU PAR!
            card1.matched = true;
            card2.matched = true;
            gameState.matchedPairs++;
            
            // Marca como matched visualmente
            document.getElementById(`card-${card1.id}`).classList.add('matched');
            document.getElementById(`card-${card2.id}`).classList.add('matched');
            
            // Verifica se ganhou
            if (gameState.matchedPairs === gameState.totalPairs) {
                endGameVictory();
            }
        } else {
            // NÃO é par - vira de volta
            card1.flipped = false;
            card2.flipped = false;
            document.getElementById(`card-${card1.id}`).classList.remove('flipped');
            document.getElementById(`card-${card2.id}`).classList.remove('flipped');
        }

        // Incrementa movimentos e atualiza o display (lógica centralizada)
        gameState.moves++;
        updateDisplay();

        // Reseta o array de cartas viradas
        gameState.flippedCards = [];
        
        // Reabilita o clique nas cartas não combinadas
        enableAllCards();

    }, 1000);
}

function updateDisplay() {
    DOM.movesDisplay.textContent = gameState.moves;
    DOM.timerDisplay.textContent = formatTime(gameState.elapsedSeconds);
    DOM.pairsDisplay.textContent = gameState.matchedPairs;
    DOM.totalPairsDisplay.textContent = gameState.totalPairs;
}

function showMenuModal() {
    document.getElementById('menuModal').classList.add('active');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.remove('active');
}

function startTimer() {
    gameState.timerStarted = true;
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedSeconds++;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Adiciona um zero à esquerda se for menor que 10
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(secs).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

function disableAllCards() {
    document.querySelectorAll('.card').forEach(el => {
        el.style.pointerEvents = 'none';
    });
}

function enableAllCards() {
    document.querySelectorAll('.card').forEach(el => {
        el.style.pointerEvents = 'auto';
    });
}

function calculateScore() {
    // Exemplo: 10000 / (tempo em segundos + movimentos)
    const denominator = gameState.elapsedSeconds + gameState.moves;
    if (denominator === 0) return 0;
    return Math.round(10000 / denominator);
}

function saveScore() {
    const score = {
        time: formatTime(gameState.elapsedSeconds),
        moves: gameState.moves,
        difficulty: gameState.gridSize,
        difficultyName: CONFIG.difficulties[gameState.currentDifficulty].name,
        date: new Date().toLocaleDateString('pt-BR'),
        score: calculateScore()
    };
    
    let scores = JSON.parse(localStorage.getItem('memoryScores')) || [];
    scores.push(score);
    localStorage.setItem('memoryScores', JSON.stringify(scores));
}

function endGameVictory() {
    gameState.gameWon = true;
    gameState.gameOver = true;
    stopTimer();
    
    saveScore();

    // Atualiza o número de movimentos no modal
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('finalTime').textContent = formatTime(gameState.elapsedSeconds);
    
    // Exibe o modal de vitória
    setTimeout(() => document.getElementById('victoryModal').classList.add('active'), 500);
}

function renderRankingContent(difficulty = gameState.currentDifficulty) {
    const scores = JSON.parse(localStorage.getItem('memoryScores')) || [];
    
    // Filtra por dificuldade, ordena por score (maior primeiro) e pega o top 5
    const filteredScores = scores
        .filter(s => s.difficulty === difficulty)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    
    if (filteredScores.length === 0) {
        rankingList.innerHTML = '<p style="text-align: center; color: var(--text-tertiary);">Nenhum score nesta dificuldade.</p>';
    } else {
        filteredScores.forEach((score, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <div class="ranking-position">${index + 1}º</div>
                <div class="ranking-info">
                    <div class="ranking-name">Score: ${score.score}</div>
                    <div class="ranking-date">${score.date}</div>
                </div>
                <div class="ranking-stats">
                    <div class="ranking-stat">
                        <span class="ranking-stat-label">Tempo</span>
                        <span class="ranking-stat-value">${score.time}</span>
                    </div>
                    <div class="ranking-stat">
                        <span class="ranking-stat-label">Movimentos</span>
                        <span class="ranking-stat-value">${score.moves}</span>
                    </div>
                </div>
            `;
            rankingList.appendChild(item);
        });
    }
    
    // Atualiza o título do modal com a dificuldade selecionada
    document.getElementById('rankingDifficulty').textContent = CONFIG.difficulties[difficulty].name;
}

function toggleRankingPanel() {
    gameState.rankingOpen = !gameState.rankingOpen;
    document.body.classList.toggle('ranking-open', gameState.rankingOpen);
    document.getElementById('rankingPanel').classList.toggle('active', gameState.rankingOpen);

    if (gameState.rankingOpen) {
        renderRankingContent();
    }
}

function attachEventListeners() {
    const restartBtn = document.getElementById('restartBtn');
    const resetBtn = document.getElementById('resetBtn');
    const menuBtn = document.getElementById('menuBtn');
    const rankingBtn = document.getElementById('rankingBtn');

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            document.getElementById('victoryModal').classList.remove('active');
            resetGameState();
            generateCards();
            renderBoard();
            updateDisplay();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetGameState();
            generateCards();
            renderBoard();
            updateDisplay();
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', showMenuModal);
    }

    if (rankingBtn) {
        rankingBtn.addEventListener('click', toggleRankingPanel);
    }

    document.querySelectorAll('.btn-difficulty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = parseInt(e.currentTarget.getAttribute('data-difficulty'));
            gameState.currentDifficulty = difficulty;
            
            resetGameState();
            generateCards();
            renderBoard();
            updateDisplay();
            closeMenuModal();
        });
    });

    document.getElementById('closeRankingBtn').addEventListener('click', toggleRankingPanel);

    // Filtros de dificuldade no ranking
    document.querySelectorAll('.ranking-filters .btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = parseInt(e.currentTarget.getAttribute('data-difficulty'));
            renderRankingContent(difficulty);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando jogo...');
    initGame();
    attachEventListeners();
});