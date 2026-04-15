const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 36;

const LOCK_FLASH_DURATION = 140;
const LEVEL_FLASH_DURATION = 700;

const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800];

const PIECES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const COLORS = {
  I: "#00d1ff",
  O: "#ffd60a",
  T: "#9b5de5",
  S: "#2ec4b6",
  Z: "#ff595e",
  J: "#3a86ff",
  L: "#ff9f1c",
};

const boardCanvas = document.getElementById("board");
const boardCtx = boardCanvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

const scoreNode = document.getElementById("score");
const linesNode = document.getElementById("lines");
const levelNode = document.getElementById("level");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const app = document.querySelector(".app");
const boardWrap = document.querySelector(".board-wrap");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const touchControls = document.querySelector(".touch-controls");

let board = [];
let bag = [];
let currentPiece = null;
let nextPieceType = null;

let score = 0;
let clearedLines = 0;
let level = 1;
let dropInterval = 900;
let dropCounter = 0;
let lastTimestamp = 0;

let isRunning = false;
let isPaused = false;
let isGameOver = false;
let animationId = null;

let lockFlashTimer = 0;
let levelFlashTimer = 0;
let levelClassTimeoutId = null;

let audioCtx = null;

function ensureAudioReady() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playTone(frequency, duration, type = "square", volume = 0.03, detune = 0, delay = 0) {
  if (!audioCtx || audioCtx.state !== "running") {
    return;
  }

  const startAt = audioCtx.currentTime + delay;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.detune.setValueAtTime(detune, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function playSound(effect) {
  switch (effect) {
    case "start":
      playTone(523, 0.08, "triangle", 0.025);
      playTone(659, 0.11, "triangle", 0.03, 0, 0.06);
      break;
    case "move":
      playTone(220, 0.035, "square", 0.012);
      break;
    case "rotate":
      playTone(400, 0.05, "triangle", 0.02);
      break;
    case "hardDrop":
      playTone(150, 0.045, "sawtooth", 0.02, -300);
      break;
    case "lock":
      playTone(180, 0.06, "square", 0.024);
      break;
    case "lineClear":
      playTone(600, 0.08, "triangle", 0.03);
      playTone(900, 0.12, "triangle", 0.03, 0, 0.07);
      break;
    case "levelUp":
      playTone(520, 0.09, "triangle", 0.03);
      playTone(780, 0.1, "triangle", 0.03, 0, 0.08);
      playTone(1040, 0.14, "triangle", 0.03, 0, 0.16);
      break;
    case "pause":
      playTone(280, 0.07, "sine", 0.02);
      break;
    case "resume":
      playTone(360, 0.07, "sine", 0.02);
      break;
    case "gameOver":
      playTone(260, 0.09, "sawtooth", 0.025);
      playTone(190, 0.18, "sawtooth", 0.025, 0, 0.1);
      break;
    default:
      break;
  }
}

function triggerLockAnimation() {
  lockFlashTimer = LOCK_FLASH_DURATION;
  boardWrap.classList.remove("board-hit");
  void boardWrap.offsetWidth;
  boardWrap.classList.add("board-hit");
}

function triggerLevelUpAnimation() {
  levelFlashTimer = LEVEL_FLASH_DURATION;
  app.classList.remove("level-up");
  levelNode.classList.remove("level-pop");
  void app.offsetWidth;
  app.classList.add("level-up");
  levelNode.classList.add("level-pop");

  if (levelClassTimeoutId) {
    clearTimeout(levelClassTimeoutId);
  }

  levelClassTimeoutId = setTimeout(() => {
    app.classList.remove("level-up");
    levelNode.classList.remove("level-pop");
  }, LEVEL_FLASH_DURATION);
}

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function cloneMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function takeNextType() {
  if (bag.length === 0) {
    bag = Object.keys(PIECES);
    shuffle(bag);
  }
  return bag.pop();
}

function createPiece(type) {
  const matrix = cloneMatrix(PIECES[type]);
  const x = Math.floor((COLS - matrix[0].length) / 2);
  return { type, matrix, x, y: 0 };
}

function drawCell(ctx, x, y, color, size) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x * size + 1, y * size + 1, size - 2, size - 2);
}

function drawBoard() {
  boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

  boardCtx.fillStyle = "#0e1726";
  boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

  boardCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  boardCtx.lineWidth = 1;
  for (let x = 1; x < COLS; x += 1) {
    boardCtx.beginPath();
    boardCtx.moveTo(x * BLOCK_SIZE, 0);
    boardCtx.lineTo(x * BLOCK_SIZE, boardCanvas.height);
    boardCtx.stroke();
  }
  for (let y = 1; y < ROWS; y += 1) {
    boardCtx.beginPath();
    boardCtx.moveTo(0, y * BLOCK_SIZE);
    boardCtx.lineTo(boardCanvas.width, y * BLOCK_SIZE);
    boardCtx.stroke();
  }

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        drawCell(boardCtx, x, y, COLORS[cell], BLOCK_SIZE);
      }
    });
  });
}

function getGhostY(piece) {
  let ghostY = piece.y;
  while (!collides(piece.matrix, piece.x, ghostY + 1)) {
    ghostY += 1;
  }
  return ghostY;
}

function drawPiece(piece, alpha = 1) {
  boardCtx.globalAlpha = alpha;
  piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawCell(boardCtx, piece.x + x, piece.y + y, COLORS[piece.type], BLOCK_SIZE);
      }
    });
  });
  boardCtx.globalAlpha = 1;
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  nextCtx.fillStyle = "#fffaf2";
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  if (!nextPieceType) {
    return;
  }

  const matrix = PIECES[nextPieceType];
  const cellSize = 30;
  const shapeWidth = matrix[0].length * cellSize;
  const shapeHeight = matrix.length * cellSize;
  const offsetX = Math.floor((nextCanvas.width - shapeWidth) / 2 / cellSize);
  const offsetY = Math.floor((nextCanvas.height - shapeHeight) / 2 / cellSize);

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawCell(nextCtx, offsetX + x, offsetY + y, COLORS[nextPieceType], cellSize);
      }
    });
  });
}

function collides(matrix, offsetX, offsetY) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) {
        continue;
      }

      const boardX = offsetX + x;
      const boardY = offsetY + y;

      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
        return true;
      }

      if (boardY >= 0 && board[boardY][boardX]) {
        return true;
      }
    }
  }

  return false;
}

function mergePiece() {
  currentPiece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        const boardY = currentPiece.y + y;
        if (boardY >= 0) {
          board[boardY][currentPiece.x + x] = currentPiece.type;
        }
      }
    });
  });
}

function clearCompletedLines() {
  let linesInMove = 0;

  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (board[y].every((cell) => cell !== null)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(null));
      linesInMove += 1;
      y += 1;
    }
  }

  if (linesInMove > 0) {
    clearedLines += linesInMove;
    score += LINE_CLEAR_POINTS[linesInMove] * level;
    level = Math.floor(clearedLines / 10) + 1;
    dropInterval = Math.max(120, 900 - (level - 1) * 65);
  }

  return linesInMove;
}

function spawnPiece() {
  const type = nextPieceType || takeNextType();
  currentPiece = createPiece(type);
  nextPieceType = takeNextType();

  if (collides(currentPiece.matrix, currentPiece.x, currentPiece.y)) {
    gameOver();
  }

  drawNextPiece();
}

function rotateMatrix(matrix) {
  const rotated = matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse());
  return rotated;
}

function tryRotate() {
  if (!isRunning || isPaused || isGameOver || !currentPiece) {
    return;
  }

  const rotated = rotateMatrix(currentPiece.matrix);
  const originalX = currentPiece.x;

  const kicks = [0, -1, 1, -2, 2];
  for (let i = 0; i < kicks.length; i += 1) {
    const kick = kicks[i];
    if (!collides(rotated, originalX + kick, currentPiece.y)) {
      currentPiece.matrix = rotated;
      currentPiece.x = originalX + kick;
      playSound("rotate");
      return;
    }
  }
}

function movePiece(dx) {
  if (!isRunning || isPaused || isGameOver || !currentPiece) {
    return;
  }

  const nextX = currentPiece.x + dx;
  if (!collides(currentPiece.matrix, nextX, currentPiece.y)) {
    currentPiece.x = nextX;
    playSound("move");
  }
}

function softDrop(fromInput = false) {
  if (!isRunning || isPaused || isGameOver || !currentPiece) {
    return;
  }

  const nextY = currentPiece.y + 1;
  if (!collides(currentPiece.matrix, currentPiece.x, nextY)) {
    currentPiece.y = nextY;
    if (fromInput) {
      score += 1;
    }
    return;
  }

  mergePiece();
  triggerLockAnimation();
  playSound("lock");

  const previousLevel = level;
  const linesInMove = clearCompletedLines();

  if (linesInMove > 0) {
    playSound("lineClear");
  }

  if (level > previousLevel) {
    triggerLevelUpAnimation();
    playSound("levelUp");
  }

  spawnPiece();
}

function hardDrop() {
  if (!isRunning || isPaused || isGameOver || !currentPiece) {
    return;
  }

  let distance = 0;
  while (!collides(currentPiece.matrix, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y += 1;
    distance += 1;
  }

  score += distance * 2;
  playSound("hardDrop");
  softDrop();
}

function updateHud() {
  scoreNode.textContent = String(score);
  linesNode.textContent = String(clearedLines);
  levelNode.textContent = String(level);

  if (isPaused) {
    pauseBtn.textContent = "Retomar";
  } else {
    pauseBtn.textContent = "Pausar";
  }
}

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function render() {
  drawBoard();

  if (currentPiece && !isGameOver) {
    const ghostY = getGhostY(currentPiece);
    drawPiece({ ...currentPiece, y: ghostY }, 0.22);
    drawPiece(currentPiece, 1);
  }

  if (lockFlashTimer > 0) {
    const alpha = (lockFlashTimer / LOCK_FLASH_DURATION) * 0.18;
    boardCtx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  }

  if (levelFlashTimer > 0) {
    const pulse = 0.08 + Math.abs(Math.sin(performance.now() / 80)) * 0.12;
    boardCtx.fillStyle = `rgba(255, 214, 10, ${pulse.toFixed(3)})`;
    boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  }

  updateHud();
}

function tick(timestamp = 0) {
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (isRunning && !isPaused && !isGameOver) {
    dropCounter += delta;

    if (dropCounter >= dropInterval) {
      softDrop();
      dropCounter = 0;
    }
  }

  if (lockFlashTimer > 0) {
    lockFlashTimer = Math.max(0, lockFlashTimer - delta);
    if (lockFlashTimer === 0) {
      boardWrap.classList.remove("board-hit");
    }
  }

  if (levelFlashTimer > 0) {
    levelFlashTimer = Math.max(0, levelFlashTimer - delta);
  }

  render();
  animationId = requestAnimationFrame(tick);
}

function gameOver() {
  isGameOver = true;
  isRunning = false;
  playSound("gameOver");
  showOverlay("Game Over", "Pressione Reiniciar para tentar novamente.");
}

function resetGameState() {
  board = createBoard();
  bag = [];
  currentPiece = null;
  nextPieceType = takeNextType();

  score = 0;
  clearedLines = 0;
  level = 1;
  dropInterval = 900;
  dropCounter = 0;
  lastTimestamp = 0;

  isRunning = false;
  isPaused = false;
  isGameOver = false;
  lockFlashTimer = 0;
  levelFlashTimer = 0;

  if (levelClassTimeoutId) {
    clearTimeout(levelClassTimeoutId);
    levelClassTimeoutId = null;
  }

  boardWrap.classList.remove("board-hit");
  app.classList.remove("level-up");
  levelNode.classList.remove("level-pop");

  hideOverlay();
  drawNextPiece();
  updateHud();
}

function startGame() {
  if (isGameOver) {
    return;
  }

  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    if (!currentPiece) {
      spawnPiece();
    }
    hideOverlay();
    playSound("start");
  }
}

function togglePause() {
  if (!isRunning || isGameOver) {
    return;
  }

  isPaused = !isPaused;
  if (isPaused) {
    playSound("pause");
    showOverlay("Pausado", "Pressione P ou o botão Pausar para continuar.");
  } else {
    playSound("resume");
    hideOverlay();
  }
}

function restartGame() {
  resetGameState();
  isRunning = true;
  spawnPiece();
  playSound("start");
}

function handleKeyDown(event) {
  ensureAudioReady();
  const key = event.key;

  if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "Spacebar", "x", "X"].includes(key)) {
    event.preventDefault();
  }

  if (key === "p" || key === "P") {
    togglePause();
    return;
  }

  if (key === "r" || key === "R") {
    restartGame();
    return;
  }

  if (!isRunning || isPaused || isGameOver) {
    return;
  }

  switch (key) {
    case "ArrowLeft":
      movePiece(-1);
      break;
    case "ArrowRight":
      movePiece(1);
      break;
    case "ArrowDown":
      softDrop(true);
      break;
    case "ArrowUp":
    case "x":
    case "X":
      tryRotate();
      break;
    case " ":
    case "Spacebar":
      hardDrop();
      break;
    default:
      break;
  }
}

function handleTouchAction(action) {
  if (action === "left") {
    movePiece(-1);
  } else if (action === "right") {
    movePiece(1);
  } else if (action === "down") {
    softDrop(true);
  } else if (action === "rotate") {
    tryRotate();
  } else if (action === "drop") {
    hardDrop();
  }
}

function bindControls() {
  document.addEventListener("keydown", handleKeyDown);

  startBtn.addEventListener("click", () => {
    ensureAudioReady();
    startGame();
  });

  pauseBtn.addEventListener("click", () => {
    ensureAudioReady();
    togglePause();
  });

  restartBtn.addEventListener("click", () => {
    ensureAudioReady();
    restartGame();
  });

  touchControls.addEventListener("click", (event) => {
    ensureAudioReady();
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const { action } = button.dataset;
    if (action) {
      handleTouchAction(action);
    }
  });
}

function init() {
  resetGameState();
  bindControls();

  showOverlay("Pressione Iniciar", "Use teclado ou botões de toque.");
  render();

  if (!animationId) {
    animationId = requestAnimationFrame(tick);
  }
}

init();
