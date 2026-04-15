class Entity {
  constructor(imageSrc, x, y, speed) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.position = { x, y };
    this.prevPosition = { x, y };
    this.speed = speed;
    this.size = 32;
  }

  updatePosition(ctx) {
    const roundedX = Math.floor(this.position.x);
    const roundedY = Math.floor(this.position.y);

    ctx.drawImage(
      this.image,
      0,
      0,
      16,
      16,
      roundedX,
      roundedY,
      this.size,
      this.size,
    );
  }

  xOutOfCanvas(newX, canvas) {
    return newX < 0 || newX > canvas.width - this.size;
  }

  yOutOfCanvas(newY, canvas) {
    return newY < 0 || newY > canvas.height - this.size;
  }

  move(dx, dy, canvas) {
    const newX = this.position.x + dx * this.speed;
    const newY = this.position.y + dy * this.speed;

    if (!this.xOutOfCanvas(newX, canvas)) this.position.x = newX;
    if (!this.yOutOfCanvas(newY, canvas)) this.position.y = newY;
  }

  checkCollision(entity) {
    return (
      this.position.x < entity.position.x + entity.size &&
      this.position.x + this.size > entity.position.x &&
      this.position.y < entity.position.y + entity.size &&
      this.position.y + this.size > entity.position.y
    );
  }

  getDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
