class FireBall extends Projectile {
  constructor(x, y, targetX, targetY, direction, damage, owner) {
    super(
      "assets/fire_ball.png",
      x,
      y,
      3,
      targetX,
      targetY,
      direction,
      damage,
      owner,
    );
  }
}
