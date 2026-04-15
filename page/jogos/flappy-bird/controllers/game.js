import { birdFrames, gameBackground, pipeSprite } from "../assets/index.js";
import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { hasBirdPipeCollision } from "./utils/collision-check.js";
import { GameStatus } from "./utils/game-status.js";
import { UserEventListener } from "./utils/user-event-listener.js";
import { GameSettings } from "./utils/game-settings.js";

export class Game {
  constructor() {
    this.stage = document.querySelector(".game-stage");
    this.viewport = document.getElementById("game-viewport");
    this.deathOverlay = document.getElementById("game-death-overlay");
    this.pauseButton = document.getElementById("game-pause-button");
    this.restartButton = document.getElementById("game-restart-button");
    this.statusLabel = document.getElementById("game-status-label");
    this.scoreValue = document.querySelector(".score-board__value");

    this.state = {
      score: 0,
      gravity: GameSettings.GRAVITY,
      width: 0,
      height: 0,
      status: GameStatus.RUNNING,
      lastFrameTime: 0,
    };

    this.birds = [];
    this.pipes = [];
    this.entities = [];
    this.userEventListener = null;
    this.resizeBound = false;
    this.controlsBound = false;
  }

  setupScene() {
    if (!this.stage || !this.viewport) {
      throw new Error("Game stage not found.");
    }

    this.state.width =
      this.stage.clientWidth - GameSettings.STAGE_HORIZONTAL_PADDING;
    this.state.height = this.viewport.clientHeight;

    this.viewport.style.backgroundImage = `url(${gameBackground})`;

    const bird = new Bird({
      posX: 90,
      posY: this.state.height * 0.38,
      assetUrl: birdFrames[0],
    });

    const pipeBottom = new Pipe({
      posX: this.state.width * 0.72,
      posY: this.state.height - GameSettings.PIPE_BOTTOM_INITIAL_OFFSET,
      assetUrl: pipeSprite,
      speed: GameSettings.PIPE_SPEED,
      isTop: false,
    });

    const pipeTop = new Pipe({
      posX: this.state.width * 0.72,
      posY: GameSettings.PIPE_TOP_INITIAL_Y,
      assetUrl: pipeSprite,
      speed: GameSettings.PIPE_SPEED,
      isTop: true,
    });

    this.birds = [bird];
    this.pipes = [pipeTop, pipeBottom];
    this.entities = [...this.pipes, ...this.birds];

    if (!this.userEventListener) {
      this.userEventListener = new UserEventListener({
        Space: () => {
          if (this.state.status !== GameStatus.RUNNING) {
            return;
          }

          const currentBird = this.birds[0];

          if (currentBird) {
            currentBird.jump();
          }
        },
      });
    }

    this.entities.forEach((entity) => {
      this.viewport.appendChild(entity.element);
      entity.render();
    });

    if (!this.controlsBound) {
      this.bindControls();
      this.controlsBound = true;
    }

    if (!this.resizeBound) {
      this.bindResize();
      this.resizeBound = true;
    }

    this.syncGameUI();
  }

  start() {
    this.state.status = GameStatus.RUNNING;
    this.setupScene();
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  loop(timestamp) {
    if (this.state.status === GameStatus.END_GAME) {
      return;
    }

    if (this.state.status !== GameStatus.RUNNING) {
      this.state.lastFrameTime = 0;
      this.render();
      requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
      return;
    }

    if (this.state.lastFrameTime === 0) {
      this.state.lastFrameTime = timestamp;
    }

    const deltaTime = (timestamp - this.state.lastFrameTime) / 1000;
    this.state.lastFrameTime = timestamp;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
  }

  update(deltaTime) {
    if (this.state.status !== GameStatus.RUNNING) {
      return;
    }

    this.entities.forEach((entity) => entity.update(deltaTime, this.state));

    let roundScore = 0;

    this.pipes.forEach((pipe) => {
      if (pipe.wasRecycledThisFrame) {
        roundScore += 1;
        pipe.wasRecycledThisFrame = false;
      }
    });

    this.state.score += Math.floor(roundScore / 2);

    const bird = this.birds[0];

    if (hasBirdPipeCollision(bird, this.pipes)) {
      this.endGame();
    }
  }

  endGame() {
    this.state.status = GameStatus.END_GAME;
    this.syncGameUI();
  }

  pauseGame() {
    if (this.state.status !== GameStatus.RUNNING) {
      return;
    }

    this.state.status = GameStatus.PAUSE;
    this.syncGameUI();
  }

  continueGame() {
    if (this.state.status !== GameStatus.PAUSE) {
      return;
    }

    this.state.status = GameStatus.RUNNING;
    this.syncGameUI();
  }

  restartGame() {
    if (this.state.status !== GameStatus.END_GAME) {
      return;
    }

    this.resetGameState();
    this.start();
  }

  resetGameState() {
    this.entities.forEach((entity) => entity.element.remove());

    this.state = {
      score: 0,
      gravity: GameSettings.GRAVITY,
      width: 0,
      height: 0,
      status: GameStatus.RUNNING,
      lastFrameTime: 0,
    };

    this.birds = [];
    this.pipes = [];
    this.entities = [];

    if (this.scoreValue) {
      this.scoreValue.textContent = "0";
    }

    this.syncGameUI();
  }

  render() {
    this.entities.forEach((entity) => entity.render());
    this.syncGameUI();
  }

  syncDeathOverlay() {
    if (!this.deathOverlay) {
      return;
    }

    this.deathOverlay.classList.toggle(
      "is-visible",
      this.state.status === GameStatus.END_GAME,
    );
  }

  syncControls() {
    if (this.pauseButton) {
      this.pauseButton.disabled = this.state.status === GameStatus.END_GAME;
      this.pauseButton.textContent =
        this.state.status === GameStatus.PAUSE ? "Continuar" : "Pausar";
    }

    if (this.restartButton) {
      this.restartButton.disabled = this.state.status !== GameStatus.END_GAME;
    }

    if (this.statusLabel) {
      this.statusLabel.textContent = this.state.status;
    }
  }

  syncGameUI() {
    this.syncDeathOverlay();
    this.syncControls();

    if (this.scoreValue) {
      this.scoreValue.textContent = String(this.state.score);
    }
  }

  bindControls() {
    if (this.pauseButton) {
      this.pauseButton.addEventListener("click", () => {
        if (this.state.status === GameStatus.RUNNING) {
          this.pauseGame();
          return;
        }

        if (this.state.status === GameStatus.PAUSE) {
          this.continueGame();
        }
      });
    }

    if (this.restartButton) {
      this.restartButton.addEventListener("click", () => this.restartGame());
    }
  }

  bindResize() {
    window.addEventListener("resize", () => {
      this.state.width =
        this.stage.clientWidth - GameSettings.STAGE_HORIZONTAL_PADDING;
      this.state.height = this.viewport.clientHeight;
    });
  }
}

const game = new Game();
game.start();
