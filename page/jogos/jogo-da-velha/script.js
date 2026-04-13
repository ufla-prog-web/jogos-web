const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const resetChampionshipBtn = document.getElementById('resetChampionshipBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

// Estados do Jogo
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let championshipActive = true; // Novo estado para controlar o campeonato todo
let scoreX = 0;
let scoreO = 0;
const WINNING_SCORE = 5; // Limite de vitórias

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Trava o clique se o campeonato acabou ou se a célula tem algo
    if (board[cellIndex] !== '' || !gameActive || !championshipActive) {
        return;
    }

    updateCell(clickedCell, cellIndex);
    checkResult();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        updateScore();
        return;
    }

    if (!board.includes('')) {
        statusElement.innerText = 'Empate (Deu Velha)!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.innerText = `Vez do Jogador: ${currentPlayer}`;
}

function updateScore() {
    // Atualiza pontuação
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.innerText = scoreX;
    } else {
        scoreO++;
        scoreOElement.innerText = scoreO;
    }

    // Verifica se alguém atingiu 5 vitórias (Campeão)
    if (scoreX === WINNING_SCORE || scoreO === WINNING_SCORE) {
        championshipActive = false; // Trava o campeonato
        statusElement.innerHTML = `🏆 JOGADOR ${currentPlayer} É O CAMPEÃO! 🏆`;
        statusElement.classList.add('champion-text'); // Aplica efeito visual
        
        // Esconde o botão de próxima rodada e mostra o de novo campeonato
        restartBtn.classList.add('hidden');
        resetChampionshipBtn.classList.remove('hidden');
    } else {
        statusElement.innerText = `Vitória do Jogador ${currentPlayer} nesta rodada!`;
    }
}

function restartGame() {
    if (!championshipActive) return; // Não deixa reiniciar rodada se já há um campeão

    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X'; 
    gameActive = true;
    statusElement.innerText = `Vez do Jogador: ${currentPlayer}`;
    
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
}

function resetChampionship() {
    // Zera pontuações
    scoreX = 0;
    scoreO = 0;
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
    
    // Destrava o campeonato e remove os efeitos de texto
    championshipActive = true;
    statusElement.classList.remove('champion-text');
    
    // Troca os botões novamente
    restartBtn.classList.remove('hidden');
    resetChampionshipBtn.classList.add('hidden');
    
    // Reinicia o tabuleiro
    restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetChampionshipBtn.addEventListener('click', resetChampionship);
