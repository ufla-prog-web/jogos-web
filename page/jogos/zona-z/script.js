let moves = 0;
const movesDisplay = document.getElementById("moves");
const size = 8;
const gameArea = document.getElementById("game-area");
const GAME_STATE = {
  PLAYING: "playing",
  WIN: "win",
  LOSE: "lose",
};
const zombie = {
  x: 0,
  y: 0,
};

const survivor = {
  x: size - 1,
  y: size - 1,
};

let gameState = GAME_STATE.PLAYING;

let board = [];

function createGrid() {
  gameArea.innerHTML = "";
  board = [];

  for (let y = 0; y < size; y++) {
    let row = [];

    for (let x = 0; x < size; x++) {
      row.push("empty");

      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${x}-${y}`;

      gameArea.appendChild(cell);
    }

    board.push(row);
  }
}

function render() {
  // limpa todas as células
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.className = "cell";
  });

  // desenha radiação
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === "radiation") {
        const cell = document.getElementById(`cell-${x}-${y}`);
        cell.classList.add("radiation");
      }
    });
  });

  // adiciona o zumbi na posição atual
  const cell = document.getElementById(`cell-${zombie.x}-${zombie.y}`);
  if (cell) cell.classList.add("zombie");

  // adiciona o sobrevivente
  const sCell = document.getElementById(`cell-${survivor.x}-${survivor.y}`);
  if (sCell) sCell.classList.add("survivor");

  movesDisplay.textContent = `Movimentos: ${moves}`;
}

function moveZombie(dx, dy) {
  if (gameState !== GAME_STATE.PLAYING) return;

  const newX = zombie.x + dx;
  const newY = zombie.y + dy;

  if (newX < 0 || newX >= size || newY < 0 || newY >= size) return;

  if (board[newY][newX] === "radiation") return;

  board[zombie.y][zombie.x] = "radiation";

  zombie.x = newX;
  zombie.y = newY;

  moves++;

  moveSurvivor();
  checkWin();
  render();
}

function moveSurvivor() {
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];

  let bestMove = null;
  let maxDist = -1;

  directions.forEach((d) => {
    const nx = survivor.x + d.dx;
    const ny = survivor.y + d.dy;

    // fora do mapa
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) return;

    // nao pode ir pra radiação
    if (board[ny][nx] === "radiation") return;

    // distância do zumbi
    const dist = Math.abs(nx - zombie.x) + Math.abs(ny - zombie.y);

    if (dist > maxDist) {
      maxDist = dist;
      bestMove = { x: nx, y: ny };
    }
  });

  if (bestMove) {
    survivor.x = bestMove.x;
    survivor.y = bestMove.y;
  }
}

function checkWin() {
  if (zombie.x === survivor.x && zombie.y === survivor.y) {
    gameState = GAME_STATE.WIN;
    setTimeout(() => {
      alert(`Você venceu em ${moves} movimentos!`);
    }, 100);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") moveZombie(0, -1);
  if (e.key === "ArrowDown") moveZombie(0, 1);
  if (e.key === "ArrowLeft") moveZombie(-1, 0);
  if (e.key === "ArrowRight") moveZombie(1, 0);
});

document.getElementById("restart-btn").addEventListener("click", () => {
  zombie.x = 0;
  zombie.y = 0;

  survivor.x = size - 1;
  survivor.y = size - 1;

  moves = 0;
  gameState = GAME_STATE.PLAYING;

  createGrid();
  render();
});

createGrid();
render();
