class CollisionCheck {
  hasBirdPipeCollision(bird, pipes) {
    if (!bird || !Array.isArray(pipes) || pipes.length === 0) {
      return false;
    }

    return pipes.some((pipe) => this.#checkCollision(bird, pipe));
  }

  #checkCollision(entityA, entityB) {
    const entityARight = entityA.posX + entityA.width;
    const entityABottom = entityA.posY + entityA.height;

    const entityBRight = entityB.posX + entityB.width;
    const entityBBottom = entityB.posY + entityB.height;

    const overlapX = entityA.posX < entityBRight && entityARight > entityB.posX;
    const overlapY =
      entityA.posY < entityBBottom && entityABottom > entityB.posY;

    return overlapX && overlapY;
  }
}

const collisionCheck = new CollisionCheck();

export function hasBirdPipeCollision(bird, pipes) {
  return collisionCheck.hasBirdPipeCollision(bird, pipes);
}
