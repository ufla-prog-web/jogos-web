class Orc extends Enemy {
  constructor(imageSrc, x, y, speed, attackSpeed, damage, maxLife) {
    super(imageSrc, x, y, speed, attackSpeed, damage, maxLife, 100);
    this.size = 48;
  }
}
