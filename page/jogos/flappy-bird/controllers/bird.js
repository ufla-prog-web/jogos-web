import { ScenarioEntity } from "./scenario-entity.js";
import { GameSettings } from "./utils/game-settings.js";

export class Bird extends ScenarioEntity {
  constructor({ posX, posY, assetUrl }) {
    super({
      posX,
      posY,
      assetUrl,
      width: 48,
      height: 34,
      className: "entity--bird",
    });

    this.velocityY = 0;
    this.jumpVelocity = GameSettings.BIRD_JUMP_VELOCITY;
  }

  jump() {
    this.velocityY = this.jumpVelocity;
  }

  update(deltaTime, gameState) {
    this.velocityY += gameState.gravity * deltaTime;
    this.posY += this.velocityY * deltaTime;

    const floorLimit = gameState.height - this.height;
    if (this.posY < 0) {
      this.posY = 0;
      this.velocityY = 0;
    }
    if (this.posY > floorLimit) {
      this.posY = floorLimit;
      this.velocityY = 0;
    }
  }

  render() {
    this.setPosition(this.posX, this.posY);
  }
}
