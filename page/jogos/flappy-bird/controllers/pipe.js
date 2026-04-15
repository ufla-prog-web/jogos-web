import { ScenarioEntity } from "./scenario-entity.js";
import { GameSettings } from "./utils/game-settings.js";

export class Pipe extends ScenarioEntity {
  constructor({
    posX,
    posY,
    assetUrl,
    speed = GameSettings.PIPE_SPEED,
    isTop = false,
  }) {
    super({
      posX,
      posY,
      assetUrl,
      width: 84,
      height: 320,
      className: "entity--pipe",
    });

    this.speed = speed;
    this.isTop = isTop;
    this.wasRecycledThisFrame = false;
  }

  update(deltaTime, gameState) {
    this.posX -= this.speed * deltaTime;

    if (this.posX + this.width < 0) {
      this.posX = gameState.width + 50;
      this.posY = this.isTop
        ? GameSettings.PIPE_TOP_INITIAL_Y -
          Math.random() * GameSettings.PIPE_VERTICAL_RANDOMNESS
        : gameState.height -
          GameSettings.PIPE_BOTTOM_INITIAL_OFFSET -
          Math.random() * GameSettings.PIPE_VERTICAL_RANDOMNESS;
      this.wasRecycledThisFrame = true;
    }
  }

  render() {
    const verticalScale = this.isTop ? -1 : 1;
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px) scaleY(${verticalScale})`;
  }
}
