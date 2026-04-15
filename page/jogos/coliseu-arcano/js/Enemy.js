class Enemy extends AliveEntity {
  constructor(imageSrc, x, y, speed, attackSpeed, damage, maxLife) {
    super(imageSrc, x, y, speed, attackSpeed, damage, maxLife, 100);
  }

  attack(character, canvas) {
    const dx = character.position.x - this.position.x;
    const dy = character.position.y - this.position.y;
    const distance = this.getDistance(this.position, character.position);

    if (distance > 2) {
      const moveX = dx / distance;
      const moveY = dy / distance;
      this.move(moveX, moveY, canvas);
    }

    if (this.checkCollision(character)) {
      super.attack(character);
    }
  }
}
