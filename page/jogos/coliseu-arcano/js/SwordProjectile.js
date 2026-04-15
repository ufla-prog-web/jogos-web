class SwordProjectile extends Projectile {
  constructor(x, y, targetX, targetY, direction, damage, owner) {
    super(
      "assets/sword.png",
      x,
      y,
      4,
      targetX,
      targetY,
      direction,
      damage,
      owner,
    );
  }
}
