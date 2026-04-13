const gameArea = document.getElementById("gameArea");
const playerEl = document.getElementById("player");
const overlayEl = document.getElementById("overlay");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const stateEl = document.getElementById("state");
const starsEl = document.getElementById("stars");

const game = {
  running: false,
  over: false,
  score: 0,
  lives: 3,
  keys: {},
  bullets: [],
  enemies: [],
  animationId: null,
  lastFrameTime: 0,
  lastShotTime: 0,
  lastEnemySpawnTime: 0,
  startTime: 0,
  enemySpawnDelay: 850,
  enemySpawnMinDelay: 320,
  playerSpeed: 680,
  bulletSpeed: 540,
  enemyBaseSpeed: 50,
  width: 0,
  height: 0,
  player: {
    x: 0,
    y: 0,
    width: 56,
    height: 56
  }
};

function setMessage(text) {
  messageEl.textContent = text;
}

function updateHUD() {
  scoreEl.textContent = String(game.score);
  livesEl.textContent = String(game.lives);
  stateEl.textContent = game.over ? "Game Over" : game.running ? "Jogando" : "Pronto";

  if (game.startTime) {
    const seconds = Math.floor((performance.now() - game.startTime) / 1000);
    timeEl.textContent = `${seconds}s`;
  } else {
    timeEl.textContent = "0s";
  }
}

function buildStars() {
  starsEl.innerHTML = "";

  for (let i = 0; i < 45; i += 1) {
    const star = document.createElement("div");
    const size = Math.random() * 3 + 1;

    star.className = "star";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;

    starsEl.appendChild(star);
  }
}

function updateBounds() {
  game.width = gameArea.clientWidth;
  game.height = gameArea.clientHeight;
  game.player.width = playerEl.offsetWidth || 56;
  game.player.height = playerEl.offsetHeight || 56;
}

function placePlayerAtStart() {
  updateBounds();
  game.player.x = game.width / 2 - game.player.width / 2;
  game.player.y = game.height - game.player.height - 18;
  renderPlayer();
}

function renderPlayer() {
  playerEl.style.left = `${game.player.x}px`;
  playerEl.style.top = `${game.player.y}px`;
  playerEl.style.transform = "none";
}

function resetEntities() {
  game.bullets.forEach((bullet) => bullet.el.remove());
  game.enemies.forEach((enemy) => enemy.el.remove());
  game.bullets = [];
  game.enemies = [];
}

function createBullet() {
  const bulletEl = document.createElement("div");
  bulletEl.className = "bullet";

  const bullet = {
    x: game.player.x + game.player.width / 2 - 3,
    y: game.player.y - 8,
    width: 6,
    height: 18,
    el: bulletEl
  };

  bulletEl.style.left = `${bullet.x}px`;
  bulletEl.style.top = `${bullet.y}px`;

  gameArea.appendChild(bulletEl);
  game.bullets.push(bullet);
}

function createEnemy() {
  const enemyEl = document.createElement("div");
  enemyEl.className = "enemy";

  const size = 36 + Math.random() * 18;
  const speedBoost = Math.min(game.score * 0.8, 120);

  const enemy = {
    x: Math.random() * (game.width - size),
    y: -size,
    width: size,
    height: size,
    speed: game.enemyBaseSpeed + Math.random() * 80 + speedBoost,
    el: enemyEl
  };

  enemyEl.style.width = `${size}px`;
  enemyEl.style.height = `${size}px`;
  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;

  gameArea.appendChild(enemyEl);
  game.enemies.push(enemy);
}

function createExplosion(x, y, size) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  explosion.style.width = `${size}px`;
  explosion.style.height = `${size}px`;

  gameArea.appendChild(explosion);
  setTimeout(() => explosion.remove(), 350);
}

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function loseLife(reason) {
  if (game.over) return;

  game.lives -= 1;
  setMessage(reason);
  updateHUD();

  if (game.lives <= 0) {
    endGame();
  }
}

function updatePlayer(deltaSeconds) {
  let dx = 0;
  let dy = 0;

  if (game.keys.ArrowLeft) dx -= 1;
  if (game.keys.ArrowRight) dx += 1;
  if (game.keys.ArrowUp) dy -= 1;
  if (game.keys.ArrowDown) dy += 1;

  game.player.x += dx * game.playerSpeed * deltaSeconds;
  game.player.y += dy * game.playerSpeed * deltaSeconds;

  if (game.player.x < 0) game.player.x = 0;
  if (game.player.x > game.width - game.player.width) {
    game.player.x = game.width - game.player.width;
  }

  if (game.player.y < 0) game.player.y = 0;
  if (game.player.y > game.height - game.player.height) {
    game.player.y = game.height - game.player.height;
  }

  renderPlayer();
}

function updateBullets(deltaSeconds) {
  const nextBullets = [];

  for (const bullet of game.bullets) {
    bullet.y -= game.bulletSpeed * deltaSeconds;

    if (bullet.y + bullet.height < 0) {
      bullet.el.remove();
      continue;
    }

    bullet.el.style.top = `${bullet.y}px`;
    nextBullets.push(bullet);
  }

  game.bullets = nextBullets;
}

function updateEnemies(deltaSeconds) {
  const playerRect = {
    x: game.player.x,
    y: game.player.y,
    width: game.player.width,
    height: game.player.height
  };

  const nextEnemies = [];

  for (const enemy of game.enemies) {
    enemy.y += enemy.speed * deltaSeconds;

    if (rectsCollide(enemy, playerRect)) {
      createExplosion(enemy.x - 4, enemy.y - 4, enemy.width + 10);
      enemy.el.remove();
      loseLife("Sua nave foi atingida!");
      continue;
    }

    if (enemy.y > game.height) {
      enemy.el.remove();
      loseLife("Um inimigo passou pela sua defesa!");
      continue;
    }

    enemy.el.style.top = `${enemy.y}px`;
    nextEnemies.push(enemy);
  }

  game.enemies = nextEnemies;
}

function handleBulletEnemyCollisions() {
  const bulletsToRemove = new Set();
  const enemiesToRemove = new Set();

  for (let i = 0; i < game.bullets.length; i += 1) {
    const bullet = game.bullets[i];

    for (let j = 0; j < game.enemies.length; j += 1) {
      const enemy = game.enemies[j];

      if (enemiesToRemove.has(j)) continue;
      if (rectsCollide(bullet, enemy)) {
        bulletsToRemove.add(i);
        enemiesToRemove.add(j);

        createExplosion(enemy.x - 2, enemy.y - 2, enemy.width + 6);
        game.score += 10;
        setMessage("Inimigo destruído!");
        break;
      }
    }
  }

  if (bulletsToRemove.size === 0 && enemiesToRemove.size === 0) {
    return;
  }

  game.bullets = game.bullets.filter((bullet, index) => {
    if (!bulletsToRemove.has(index)) return true;
    bullet.el.remove();
    return false;
  });

  game.enemies = game.enemies.filter((enemy, index) => {
    if (!enemiesToRemove.has(index)) return true;
    enemy.el.remove();
    return false;
  });

  updateHUD();
}

function tryShoot(now) {
  if (!game.running || game.over) return;
  if (now - game.lastShotTime < 180) return;

  game.lastShotTime = now;
  createBullet();
}

function maybeSpawnEnemy(now) {
  if (now - game.lastEnemySpawnTime < game.enemySpawnDelay) return;

  game.lastEnemySpawnTime = now;
  createEnemy();

  if (game.enemySpawnDelay > game.enemySpawnMinDelay) {
    game.enemySpawnDelay -= 3;
  }
}

function gameLoop(now) {
  if (!game.running) return;

  if (!game.lastFrameTime) {
    game.lastFrameTime = now;
  }

  const deltaSeconds = Math.min((now - game.lastFrameTime) / 1000, 0.032);
  game.lastFrameTime = now;

  updatePlayer(deltaSeconds);
  updateBullets(deltaSeconds);
  updateEnemies(deltaSeconds);
  handleBulletEnemyCollisions();
  maybeSpawnEnemy(now);
  updateHUD();

  game.animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
  resetEntities();
  updateBounds();
  placePlayerAtStart();

  game.running = true;
  game.over = false;
  game.score = 0;
  game.lives = 3;
  game.lastFrameTime = 0;
  game.lastShotTime = 0;
  game.lastEnemySpawnTime = 0;
  game.startTime = performance.now();
  game.enemySpawnDelay = 850;

  overlayEl.classList.add("hidden");
  setMessage("Jogo iniciado. Defenda a galáxia!");
  updateHUD();

  cancelAnimationFrame(game.animationId);
  game.animationId = requestAnimationFrame(gameLoop);
}

function showStartOverlay(title, text, buttonText) {
  overlayEl.innerHTML = `
    <h2>${title}</h2>
    <p>${text}</p>
    <button id="playBtnDynamic" class="btn primary">${buttonText}</button>
  `;

  const dynamicBtn = document.getElementById("playBtnDynamic");
  dynamicBtn.addEventListener("click", startGame);
  overlayEl.classList.remove("hidden");
}

function endGame() {
  game.running = false;
  game.over = true;
  cancelAnimationFrame(game.animationId);

  showStartOverlay(
    "Game Over",
    `Sua pontuação final foi ${game.score}. Clique abaixo para jogar novamente.`,
    "Jogar novamente"
  );

  setMessage("Fim de jogo!");
  updateHUD();
}

function restartGame() {
  cancelAnimationFrame(game.animationId);
  game.running = false;
  game.over = false;
  game.score = 0;
  game.lives = 3;
  game.startTime = 0;
  game.lastFrameTime = 0;
  game.lastShotTime = 0;
  game.lastEnemySpawnTime = 0;
  game.enemySpawnDelay = 850;

  resetEntities();
  placePlayerAtStart();

  showStartOverlay(
    "Galaxy Defender",
    "Controle a nave, destrua os inimigos e sobreviva o máximo possível. Você perde 1 vida quando um inimigo atinge sua nave ou passa pela defesa.",
    "Iniciar jogo"
  );

  setMessage("Jogo reiniciado.");
  updateHUD();
}

document.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
    event.preventDefault();
  }

  game.keys[event.code] = true;

  if (event.code === "Space") {
    tryShoot(performance.now());
  }
});

document.addEventListener("keyup", (event) => {
  game.keys[event.code] = false;
});

restartBtn.addEventListener("click", restartGame);
playBtn.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  if (!game.running) {
    placePlayerAtStart();
  } else {
    updateBounds();
  }
});

buildStars();
placePlayerAtStart();
updateHUD();