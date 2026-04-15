const boardDiv = document.getElementById("board");
const restartBtn = document.getElementById("restart-btn");
// script.js - Campo Minado Web

// --- Elementos DOM ---
const mineCountSpan = document.getElementById("mine-count");
const flagCountSpan = document.getElementById("flag-count");
const timerSpan = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");
const newGameBtn = document.getElementById("new-game-btn");
const darkModeBtn = document.getElementById("dark-mode-btn");
const modal = document.getElementById("modal");
const modalMsg = document.getElementById("modal-message");
const modalCloseBtn = document.getElementById("modal-close-btn");
const playAgainBtn = document.getElementById("play-again-btn");

// --- Configurações ---
function getResponsiveDifficulty() {
  const width = window.innerWidth;
  if (width <= 340) {
    // Telas super pequenas (ex: 300-340px)
    return {
      facil: { size: 5, mines: 5 },
      medio: { size: 6, mines: 6 },
      dificil: { size: 7, mines: 7 },
    };
  } else if (width <= 400) {
    return {
      facil: { size: 6, mines: 7 },
      medio: { size: 7, mines: 8 },
      dificil: { size: 8, mines: 12 },
    };
  } else if (width <= 600) {
    return {
      facil: { size: 7, mines: 7 },
      medio: { size: 9, mines: 10 },
      dificil: { size: 12, mines: 16 },
    };
  } else {
    return {
      facil: { size: 8, mines: 10 },
      medio: { size: 10, mines: 15 },
      dificil: { size: 12, mines: 25 },
    };
  }
}

let DIFFICULTY = getResponsiveDifficulty();

// --- Estado do Jogo ---
let board = [];
let size = 8;
let mineCount = 10;
let flagCount = 0;
let revealedCount = 0;
let gameOver = false;
let timer = 0;
let timerInterval = null;
let firstClick = true;

// --- Funções Principais ---
function startGame() {
  DIFFICULTY = getResponsiveDifficulty();
  const diff = difficultySelect.value;
  size = DIFFICULTY[diff].size;
  mineCount = DIFFICULTY[diff].mines;
  flagCount = 0;
  revealedCount = 0;
  gameOver = false;
  timer = 0;
  firstClick = true;
  clearInterval(timerInterval);
  timerSpan.textContent = "0";
  mineCountSpan.textContent = mineCount;
  flagCountSpan.textContent = flagCount;
  board = [];
  for (let r = 0; r < size; r++) {
    board[r] = [];
    for (let c = 0; c < size; c++) {
      board[r][c] = {
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      };
    }
  }
  renderBoard();
  setBoardGrid();
}

// Redimensiona o tabuleiro ao mudar o tamanho da tela
window.addEventListener("resize", () => {
  const prevDiff = DIFFICULTY;
  const newDiff = getResponsiveDifficulty();
  // Só reinicia se mudou o perfil de tamanho
  if (JSON.stringify(prevDiff) !== JSON.stringify(newDiff)) {
    DIFFICULTY = newDiff;
    startGame();
  }
});

function setBoardGrid() {
  boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardDiv.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}

function placeMines(safeRow, safeCol) {
  let placed = 0;
  while (placed < mineCount) {
    let r = Math.floor(Math.random() * size);
    let c = Math.floor(Math.random() * size);
    // Não colocar mina na célula do primeiro clique nem ao redor dela
    if (
      board[r][c].isMine ||
      (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1)
    )
      continue;
    board[r][c].isMine = true;
    placed++;
  }
  // Calcular minas adjacentes
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      board[r][c].adjacentMines = countAdjacentMines(r, c);
    }
  }
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      let nr = row + dr,
        nc = col + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc].isMine)
        count++;
    }
  }
  return count;
}

function renderBoard() {
  boardDiv.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = board[r][c];
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.dataset.row = r;
      cellDiv.dataset.col = c;
      if (cell.isRevealed) {
        cellDiv.classList.add("revealed");
        if (cell.isMine) {
          cellDiv.classList.add("mine");
          cellDiv.textContent = "💣";
        } else if (cell.adjacentMines > 0) {
          cellDiv.classList.add("number" + cell.adjacentMines);
          cellDiv.textContent = cell.adjacentMines;
        }
      } else {
        if (cell.isFlagged) {
          cellDiv.classList.add("flagged");
          cellDiv.textContent = "🚩";
        } else {
          cellDiv.textContent = "";
        }
      }
      cellDiv.onmousedown = (e) => handleCellMouseDown(e, r, c);
      cellDiv.oncontextmenu = (e) => e.preventDefault();
      boardDiv.appendChild(cellDiv);
    }
  }
}

function handleCellMouseDown(e, r, c) {
  if (gameOver) return;
  if (e.button === 0) {
    revealCell(r, c);
  } else if (e.button === 2) {
    toggleFlag(r, c);
  }
}

function revealCell(r, c) {
  const cell = board[r][c];
  if (cell.isRevealed || cell.isFlagged) return;
  if (firstClick) {
    placeMines(r, c);
    startTimer();
    firstClick = false;
  }
  cell.isRevealed = true;
  revealedCount++;
  if (cell.isMine) {
    cell.exploded = true;
    endGame(false, r, c);
    return;
  }
  if (cell.adjacentMines === 0) {
    revealEmptyArea(r, c);
  }
  renderBoard();
  checkWin();
}

function revealEmptyArea(r, c) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      let nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        let neighbor = board[nr][nc];
        if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
          neighbor.isRevealed = true;
          revealedCount++;
          if (neighbor.adjacentMines === 0) {
            revealEmptyArea(nr, nc);
          }
        }
      }
    }
  }
}

function toggleFlag(r, c) {
  const cell = board[r][c];
  if (cell.isRevealed) return;
  if (cell.isFlagged) {
    cell.isFlagged = false;
    flagCount--;
  } else {
    if (flagCount < mineCount) {
      cell.isFlagged = true;
      flagCount++;
    }
  }
  flagCountSpan.textContent = flagCount;
  renderBoard();
}

function checkWin() {
  if (gameOver) return;
  if (revealedCount === size * size - mineCount) {
    endGame(true);
  }
}

function endGame(win, explodedRow, explodedCol) {
  gameOver = true;
  clearInterval(timerInterval);
  // Revelar todas as minas
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = board[r][c];
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    }
  }
  renderBoard();
  // Destacar mina explodida
  if (!win && explodedRow !== undefined && explodedCol !== undefined) {
    const idx = explodedRow * size + explodedCol;
    const cellDiv = boardDiv.children[idx];
    if (cellDiv) cellDiv.classList.add("exploded");
  }
  showModal(win ? "Você venceu!" : "Você perdeu!");
}

function showModal(msg) {
  modalMsg.textContent = msg;
  modal.classList.remove("hidden");
}
function closeModal() {
  modal.classList.add("hidden");
}

function startTimer() {
  timer = 0;
  timerSpan.textContent = "0";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerSpan.textContent = timer;
  }, 1000);
}

function restartGame() {
  closeModal();
  startGame();
}

// --- Dark Mode ---
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  darkModeBtn.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
}

// --- Eventos ---
newGameBtn.onclick = startGame;
restartBtn.onclick = restartGame;
modalCloseBtn.onclick = closeModal;
playAgainBtn.onclick = restartGame;
difficultySelect.onchange = startGame;
darkModeBtn.addEventListener("click", toggleDarkMode);

// --- Inicialização ---
startGame();

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
