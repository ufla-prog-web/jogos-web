// =============================
// ELEMENTOS DO HTML
// =============================
const gameBoard = document.getElementById("gameBoard");
const movesSpan = document.getElementById("moves");
const pairsSpan = document.getElementById("pairs");
const timerSpan = document.getElementById("timer");
const bestScoreSpan = document.getElementById("bestScore");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

// =============================
// DADOS DO JOGO
// =============================
const symbols = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍍", "🍒", "🥝"];
const totalPairs = symbols.length;

// =============================
// VARIÁVEIS DE CONTROLE
// =============================
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let pairsFound = 0;
let gameStarted = false;
let timer = 0;
let timerInterval = null;

// =============================
// EMBARALHAR CARTAS
// =============================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =============================
// FORMATAR TEMPO
// =============================
function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

// =============================
// CRONÔMETRO
// =============================
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timer++;
    timerSpan.textContent = formatTime(timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// =============================
// RECORD LOCAL
// =============================
function loadBestScore() {
  const best = localStorage.getItem("memoryBestScore");
  bestScoreSpan.textContent = best ? best : "--";
}

function saveBestScore() {
  const currentScore = `${moves} jogadas / ${formatTime(timer)}`;
  const saved = localStorage.getItem("memoryBestScore");

  if (!saved) {
    localStorage.setItem("memoryBestScore", currentScore);
    bestScoreSpan.textContent = currentScore;
    return;
  }

  const savedParts = saved.match(/^(\d+)\s+jogadas\s+\/\s+(\d{2}):(\d{2})$/);

  if (!savedParts) {
    localStorage.setItem("memoryBestScore", currentScore);
    bestScoreSpan.textContent = currentScore;
    return;
  }

  const savedMoves = Number(savedParts[1]);
  const savedTime = Number(savedParts[2]) * 60 + Number(savedParts[3]);

  if (moves < savedMoves || (moves === savedMoves && timer < savedTime)) {
    localStorage.setItem("memoryBestScore", currentScore);
    bestScoreSpan.textContent = currentScore;
  }
}

// =============================
// CRIAR TABULEIRO
// =============================
function createBoard() {
  gameBoard.innerHTML = "";
  message.textContent = "";

  cards = shuffle([...symbols, ...symbols]);

  cards.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.textContent = "?";
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

// =============================
// VIRAR CARTA
// =============================
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("matched")) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  this.classList.add("flipped");
  this.textContent = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesSpan.textContent = moves;

  checkMatch();
}

// =============================
// VERIFICAR PAR
// =============================
function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    pairsFound++;
    pairsSpan.textContent = pairsFound;

    resetTurn();

    if (pairsFound === totalPairs) {
      stopTimer();
      message.textContent = `🎉 Parabéns! Você venceu em ${moves} jogadas e ${formatTime(timer)}!`;
      saveBestScore();
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      firstCard.textContent = "?";
      secondCard.textContent = "?";

      resetTurn();
    }, 900);
  }
}

// =============================
// RESETAR TURNO
// =============================
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// =============================
// REINICIAR JOGO
// =============================
function resetGame() {
  stopTimer();

  moves = 0;
  pairsFound = 0;
  timer = 0;
  gameStarted = false;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  movesSpan.textContent = moves;
  pairsSpan.textContent = pairsFound;
  timerSpan.textContent = "00:00";
  message.textContent = "";

  createBoard();
}

// =============================
// EVENTOS
// =============================
restartBtn.addEventListener("click", resetGame);

// =============================
// INÍCIO
// =============================
loadBestScore();
createBoard();