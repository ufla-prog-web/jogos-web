class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.grid = 20;
    this.reset();
  }

  reset() {
    this.snake = new Snake(this.grid);
    this.apple = new Apple(this.grid, this.canvas);
    this.blocks = [];
    this.score = 0;
    this.speed = 150;
    this.running = true;
  }

  update() {
    if (!this.running) return;

    this.snake.move();

    // colisão com parede
    if (this.snake.hitWall(this.canvas)) this.end();

    // colisão com ele mesmo
    if (this.snake.hitSelf()) this.end();

    // colisão com blocos
    if (
      this.blocks.some(
        (b) => b.x === this.snake.head.x && b.y === this.snake.head.y
      )
    )
      this.end();

    // comer maçã
    if (
      this.snake.head.x === this.apple.x &&
      this.snake.head.y === this.apple.y
    ) {
      this.score++;
      document.getElementById("score").textContent = this.score;

      if (this.score % 2 === 0) this.snake.grow();

      this.apple.randomize(this.canvas);
      this.adjustDifficulty();
    }
  }

  adjustDifficulty() {
    if (this.score === 20) this.speed /= 1.2;
    if (this.score === 30) this.speed /= 1.3;
    if (this.score === 50) this.speed /= 1.4;

    if (this.score >= 30 && this.score % 2 === 0) {
      this.blocks.push(new Block(this.grid, this.canvas));
      if (this.score >= 50) this.blocks.push(new Block(this.grid, this.canvas));
    }

    if (this.score >= 60) this.end(true);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.snake.draw(this.ctx);
    this.apple.draw(this.ctx);
    this.blocks.forEach((b) => b.draw(this.ctx));
  }

  loop() {
    this.update();
    this.draw();

    if (this.running) {
      setTimeout(() => this.loop(), this.speed);
    }
  }

  end(win = false) {
    this.running = false;
    document.getElementById("game").classList.remove("active");
    document.getElementById("gameOver").classList.add("active");
  }
}

class Snake {
  constructor(grid) {
    this.grid = grid;
    this.body = [{ x: 200, y: 200 }];
    this.dir = { x: grid, y: 0 };
  }

  get head() {
    return this.body[0];
  }

  move() {
    const newHead = {
      x: this.head.x + this.dir.x,
      y: this.head.y + this.dir.y,
    };

    this.body.unshift(newHead);
    this.body.pop();
  }

  grow() {
    this.body.push({ ...this.body[this.body.length - 1] });
  }

  hitWall(canvas) {
    return (
      this.head.x < 0 ||
      this.head.y < 0 ||
      this.head.x >= canvas.width ||
      this.head.y >= canvas.height
    );
  }

  hitSelf() {
    return this.body
      .slice(1)
      .some((p) => p.x === this.head.x && p.y === this.head.y);
  }

  draw(ctx) {
    ctx.fillStyle = "#0f0";
    this.body.forEach((p) => ctx.fillRect(p.x, p.y, this.grid, this.grid));
  }
}

class Apple {
  constructor(grid, canvas) {
    this.grid = grid;
    this.randomize(canvas);
  }

  randomize(canvas) {
    this.x = Math.floor(Math.random() * (canvas.width / this.grid)) * this.grid;
    this.y =
      Math.floor(Math.random() * (canvas.height / this.grid)) * this.grid;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.grid, this.grid);
  }
}

class Block {
  constructor(grid, canvas) {
    this.grid = grid;
    this.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    this.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
  }

  draw(ctx) {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.x, this.y, this.grid, this.grid);
  }
}

// CONTROLES
const game = new Game();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (game.snake.dir.y === 0) game.snake.dir = { x: 0, y: -game.grid };
      break;
    case "ArrowDown":
      if (game.snake.dir.y === 0) game.snake.dir = { x: 0, y: game.grid };
      break;
    case "ArrowLeft":
      if (game.snake.dir.x === 0) game.snake.dir = { x: -game.grid, y: 0 };
      break;
    case "ArrowRight":
      if (game.snake.dir.x === 0) game.snake.dir = { x: game.grid, y: 0 };
      break;
  }
});

// START + COUNTDOWN
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
  let count = 3;
  const el = document.getElementById("countdown");

  const interval = setInterval(() => {
    el.textContent = count;
    count--;

    if (count < 0) {
      clearInterval(interval);
      document.getElementById("home").classList.remove("active");
      document.getElementById("game").classList.add("active");
      game.loop();
    }
  }, 1000);
});
