class Main {
  constructor() {
    this.createCanvas();
    this.character = new Character(this.canvas);
    this.statusUi = new StatusUi(this.character);
    this.ui = new Ui(
      () => this.startGame(),
      () => this.gameLoop(),
    );
    this.enemyFactory = new EnemyFactory();
    this.enemiesList = [];
    this.charProjectilesList = [];
    this.enemiesProjectilesList = [];
    this.gameOver = false;
    this.isRunning = false;
    this.prepareTile();
    this.configPauseListener();

    this.updateCanvas();
    this.showStartScreen();
  }

  prepareTile() {
    this.tile1 = new Image();
    this.tile1.src = "assets/tile_1.png";
    this.tile2 = new Image();
    this.tile2.src = "assets/tile_2.png";
    this.tileSize = 32;

    const cols = Math.ceil(this.canvas.width / this.tileSize);
    const rows = Math.ceil(this.canvas.width / this.tileSize);
    const tales = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * this.tileSize;
        const y = r * this.tileSize;

        const selectedTile = Math.random() < 0.5 ? this.tile1 : this.tile2;
        tales.push({ tile: selectedTile, x, y });
      }
    }
    this.tales = tales;
  }

  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 608;
    canvas.classList.add("canvas");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = ctx;
  }

  configPauseListener() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (this.gameOver || !this.isRunning) return;

        if (this.ui.isPauseMenuVisible) {
          this.ui.hidePauseMenu();
          this.gameLoop();
          return;
        }

        this.showPauseMenu();
      }
    });
  }

  paintTile() {
    this.tales.forEach(({ tile, x, y }) => {
      this.ctx.drawImage(tile, x, y, this.tileSize, this.tileSize);
    });
  }

  spawnEnemy() {
    const enemyQuantity = Math.round(Math.log(this.character.level) * 2) + 1;

    if (this.enemiesList.length >= enemyQuantity) return;

    const x = Math.random() * (this.canvas.width - 32);
    const y = Math.random() * (this.canvas.height - 32);
    const enemy = this.enemyFactory.generateEnemy(x, y);
    enemy.levelUp(this.character.level);
    this.enemiesList.push(enemy);
  }

  characterAttack() {
    const projectile = this.character.attack(this.enemiesList);
    if (projectile) this.charProjectilesList.push(projectile);
  }

  stopGame() {
    clearInterval(this.spawnEnemiesInterval);
    clearInterval(this.updateInterval);
  }

  checkGameOver() {
    if (this.character.isDead && !this.gameOver) {
      this.gameOver = true;
      this.isRunning = false;
      this.stopGame();
      this.showRetryScreen();
    }
  }

  update() {
    const newCharacterProjectilesList = [];
    const newEnemiesProjectilesList = [];
    const newEnemiesList = [];

    this.charProjectilesList.forEach((projectile) => {
      if (!projectile.active) return;

      projectile.move(this.enemiesList, this.canvas);
      newCharacterProjectilesList.push(projectile);
    });

    this.enemiesList.forEach((enemy) => {
      if (enemy.isDead) return;

      const projectile = enemy.attack(this.character, this.canvas);
      if (projectile) newEnemiesProjectilesList.push(projectile);
      newEnemiesList.push(enemy);
    });

    this.enemiesProjectilesList.forEach((projectile) => {
      if (!projectile.active) return;
      projectile.move([this.character], this.canvas);
      newEnemiesProjectilesList.push(projectile);
    });

    this.checkGameOver();

    this.charProjectilesList = newCharacterProjectilesList;
    this.enemiesList = newEnemiesList;
    this.enemiesProjectilesList = newEnemiesProjectilesList;

    this.character.move(this.canvas);
    this.characterAttack();
    this.statusUi.updateStatus();
  }

  updateCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.paintTile();
    this.character.updatePosition(this.ctx);
    this.enemiesList.forEach((enemy) => enemy.updatePosition(this.ctx));
    this.charProjectilesList.forEach((projectile) =>
      projectile.updatePosition(this.ctx),
    );
    this.enemiesProjectilesList.forEach((projectile) =>
      projectile.updatePosition(this.ctx),
    );
    requestAnimationFrame(() => this.updateCanvas());
  }

  gameLoop() {
    this.spawnEnemiesInterval = setInterval(() => this.spawnEnemy(), 1500);
    this.updateInterval = setInterval(() => this.update(), 16);
    this.updateCanvas();
  }

  startGame() {
    this.enemiesList = [];
    this.charProjectilesList = [];
    this.enemiesProjectilesList = [];
    this.character = new Character(this.canvas);
    this.statusUi.character = this.character;
    this.gameOver = false;
    this.ui.hideScreen();
    this.gameLoop();
    this.isRunning = true;
  }

  showStartScreen() {
    this.ui.showStartScreen();
  }

  showRetryScreen() {
    this.ui.showRetryScreen();
  }

  showPauseMenu() {
    this.stopGame();
    this.ui.showPauseMenu(this.character);
  }
}

window.onload = () => {
  new Main();
};
