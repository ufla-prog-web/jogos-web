class Projectile extends Entity {
  constructor(
    imageSrc,
    x,
    y,
    speed,
    targetX,
    targetY,
    direction,
    damage,
    owner,
  ) {
    super(imageSrc, x, y, speed);
    this.direction = direction;
    this.imageDirection = Math.atan2(targetY, targetX) + Math.PI / 2;
    this.active = true;
    this.damage = damage;
    this.targetX = targetX;
    this.targetY = targetY;
    this.owner = owner;
  }

  updatePosition(ctx) {
    const roundedX = Math.floor(this.position.x);
    const roundedY = Math.floor(this.position.y);

    ctx.save();
    ctx.translate(roundedX + this.size / 2, roundedY + this.size / 2);
    ctx.rotate(this.imageDirection);
    ctx.drawImage(
      this.image,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size,
    );
    ctx.restore();
  }

  move(enemies, canvas) {
    const dx = Math.cos(this.direction);
    const dy = Math.sin(this.direction);
    const newX = this.position.x + dx * this.speed;
    const newY = this.position.y + dy * this.speed;

    if (this.xOutOfCanvas(newX, canvas) || this.yOutOfCanvas(newY, canvas)) {
      this.active = false;
      return;
    }

    super.move(dx, dy, canvas);
    for (const enemy of enemies) {
      if (this.checkCollision(enemy)) {
        enemy.takeDamage(this.damage);
        this.owner.hitAliveEntity(enemy, this.damage);
        this.active = false;
        return;
      }
    }
  }
}
