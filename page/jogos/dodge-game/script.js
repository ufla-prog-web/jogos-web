const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const goalDisplay = document.getElementById("goal");
let blockSpeed = 5;
let spawnRate = 1000;
let gameStarted = false;
let currentDifficulty = "";

let playerX = 130;
let score = 0;
let gameOver = false;
let isInfiniteMode = false;

let winScore

document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  }

  if (e.key === "ArrowRight" && playerX < 260) {
    playerX += 20;
  }

  player.style.left = playerX + "px";
});

function startGame(level) {
  currentDifficulty = level;

  isInfiniteMode = (level === "Infinito");

  document.getElementById("menu").style.display = "none";
  gameStarted = true;

  if (level === "Fácil") {
    blockSpeed = 3;
    spawnRate = 1200;
    winScore = 20;
  }

  if (level === "Médio") {
    blockSpeed = 5;
    spawnRate = 900;
    winScore = 30;
  }

  if (level === "Difícil") {
    blockSpeed = 8;
    spawnRate = 600;
    winScore = 50;
  }

  if (level === "Infinito") {
    blockSpeed = 3;
    spawnRate = 1200;
    winScore = Infinity; 
   }

   const rankingDiv = document.getElementById("ranking");

    if (isInfiniteMode) {
    rankingDiv.style.display = "block";
    loadHighScore();
    } else {
    rankingDiv.style.display = "none";
    }

  goalDisplay.textContent = isInfiniteMode ? "∞" : winScore

  startSpawning();
}

function createBlock() {
  if (gameOver) return;

  const block = document.createElement("div");
  block.classList.add("block");

  let blockX = Math.floor(Math.random() * 7) * 40;
  block.style.left = blockX + "px";

  game.appendChild(block);

  let blockY = 0;

  const moveBlock = setInterval(() => {
    if (gameOver) {
      clearInterval(moveBlock);
      return;
    }

    blockY += blockSpeed;
    block.style.top = blockY + "px";

        const playerRect = player.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();

        if (
        playerRect.left < blockRect.right &&
        playerRect.right > blockRect.left &&
        playerRect.top < blockRect.bottom &&
        playerRect.bottom > blockRect.top
        ) {
        endGame();
        }

    if (blockY > 400) {
      block.remove();
      score++;
      scoreDisplay.textContent = score;
      if (!isInfiniteMode && score >= winScore) {
        winGame();
        }
      clearInterval(moveBlock);
    }

  }, 30);
}

function startSpawning() {
  function spawnLoop() {
    if (gameOver) return;

    createBlock();

    setTimeout(spawnLoop, spawnRate);
  }

  spawnLoop();
}

function restartGame() {
  score = 0;
  gameOver = false;
  playerX = 130;

  scoreDisplay.textContent = score;
  player.style.left = playerX + "px";
  startSpawning();

  document.querySelectorAll(".block").forEach(b => b.remove());
  document.querySelector("#gameOverScreen h2").textContent = "Game Over";
  gameOverScreen.classList.remove("win");

  gameOverScreen.classList.remove("show");
}

function endGame() {
  if (gameOver) return; 

  gameOver = true;

  finalScore.textContent = score;
  gameOverScreen.classList.add("show");
  if (isInfiniteMode) {
    saveHighScore();
    loadHighScore();
    }
}

function backToMenu() {
  location.reload();
}

function saveScore() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.push({
    score: score,
    difficulty: currentDifficulty
  });

  ranking.sort((a, b) => b.score - a.score);

  ranking = ranking.slice(0, 5);

  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function loadHighScore() {
  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";

  let highScore = localStorage.getItem("highScore") || 0;

  const li = document.createElement("li");
  li.textContent = `Recorde: ${highScore} pts`;
  rankingList.appendChild(li);
}

function saveHighScore() {
  if (!isInfiniteMode) return;

  let highScore = localStorage.getItem("highScore") || 0;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }
}

function winGame() {
  if (gameOver) return;

  gameOver = true;

  finalScore.textContent = score;

  gameOverScreen.classList.add("show");
  gameOverScreen.classList.add("win");

  document.querySelector("#gameOverScreen h2").textContent = "🏆 Você venceu!";
}