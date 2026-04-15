function handleAfterFix() {
  const lines = clearLines();

  totalLinesCleared += lines;

  if (totalLinesCleared >= level * 10) {
    level++;
    increaseDifficulty();
  }

  if (lines > 0) {
    combo++;
    updateScore(basePoints[lines], combo);
  } else {
    combo = 0;
    comboElement.style.display = "none";
  }

  movingPiece = nextPiece;
  nextPiece = getRandomPiece();
  drawNextPiece();
  drawBoard();
}

function increaseDifficulty() {
  dropInterval *= 0.8;
  dropInterval = Math.max(dropInterval, 100);
  console.log(`Level: ${level}, Drop Interval: ${dropInterval}ms`);
}

function checkGameOver() {
  return movingPiece.colides();
}

function pauseGame() {
  if (!started || gameOver) return;

  paused = !paused;
  pausedModal.style.display = paused ? "block" : "none";
  pausedBackground.style.display = paused ? "block" : "none";
}

function startGame() {
  if (started || gameOver) return;

  paused = false;
  started = true;
  startModal.style.display = "none";
  startBackground.style.display = "none";
  drawBoard();
}

function updateScore(points, currentCombo = combo) {
  if (points === 0) {
    score = 0;
  }

  score += points * (currentCombo > 1 ? currentCombo : 1);
  scoreElement.textContent = score;

  if (currentCombo) {
    comboElement.textContent = `${currentCombo}X`;
    comboElement.style.display = "block";
  }

  console.log(`Score: ${score}`);
  console.log(`Combo: ${currentCombo}`);
}

function restartGame() {
  if (!paused || !started) return;

  updateScore(0, 0);
  combo = 0;
  gameOver = false;
  paused = false;
  level = 1;
  dropInterval = 500;
  totalLinesCleared = 0;

  board.forEach(row => row.fill(0));
  movingPiece = getRandomPiece();
  nextPiece = getRandomPiece();
  drawBoard();
  drawNextPiece();

  startBackground.style.display = "none";
  pausedBackground.style.display = "none";
  gameOverBackground.style.display = "none";

  pausedModal.style.display = "none";
  startModal.style.display = "none";
  gameOverModal.style.display = "none";
  comboElement.style.display = "none";
}

function endGame() {
  if (score) {
    saveScore(score);
  }

  score = 0;
  gameOver = true;
  paused = true;
  pausedModal.style.display = "none";
  pausedBackground.style.display = "none";
  gameOverModal.style.display = "block";
  gameOverBackground.style.display = "block";
}

function gameLoop(time = 0) {
  if (paused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = time - lastDropTime;

  if (deltaTime > dropInterval) {
    movingPiece.moveDown();
    lastDropTime = time;
  }

  drawBoard();
  requestAnimationFrame(gameLoop);
}

function initializeGame() {
  mainPage.style.display = "flex";
  landingPage.style.display = "none";

  if (started) {
    restartGame();
    return;
  }

  nextPiece = getRandomPiece();
  movingPiece = getRandomPiece();

  createBoard();
  createNextBoard();
  drawBoard();
  drawNextPiece();

  startGame();
  requestAnimationFrame(gameLoop);
}

function showLandingPage() {
  mainPage.style.display = "none";
  landingPage.style.display = "flex";
  endGame();

  loadRanking();
}

function saveScore(score) {
  const ranking = JSON.parse(localStorage.getItem("tetrisRanking")) || [];
  ranking.push({ score, date: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("tetrisRanking", JSON.stringify(ranking));
  return ranking;
}

function loadRanking() {
  const ranking = JSON.parse(localStorage.getItem("tetrisRanking")) || [];
  rankingList.innerHTML = "";

  ranking.slice(0, 10).forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.score} - ${entry.date}`;
    rankingList.appendChild(listItem);
  });

  if (ranking.length === 0) {
    rankingTitle.textContent = "Jogue para ver as melhores pontuações!";
  }
}

startButton.addEventListener("click", () => initializeGame());
loadRanking();