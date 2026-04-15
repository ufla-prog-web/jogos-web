class Mage extends AliveEntity {
  constructor(imageSrc, x, y, speed, attackSpeed, damage, maxLife) {
    super(imageSrc, x, y, speed, attackSpeed, damage, maxLife, 100);
  }

  attack(target) {
    if (!this.canAttack()) return;
    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    const direction = Math.atan2(dy, dx);
    const projectile = new FireBall(
      this.position.x,
      this.position.y,
      target.position.x - this.position.x,
      target.position.y - this.position.y,
      direction,
      30,
      this,
    );

    this.lastAttackAt = Date.now();
    return projectile;
  }
}
