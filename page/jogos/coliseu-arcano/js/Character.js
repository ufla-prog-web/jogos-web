const MOVIMENT_KEYS = ["w", "a", "s", "d"];

class Character extends AliveEntity {
  constructor(canvas) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    super("assets/char.png", x, y, 3.5, 1, 1, 100, 500);
    this.keysPressed = new Set();
    this.xp = 0;
    this.lifeStealPercent = 0;
    this.xpToLevelUp = this.level * 2;
    this.armour = 0;

    this.setupMovimentation();
  }

  setupMovimentation() {
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (MOVIMENT_KEYS.includes(key)) {
        this.keysPressed.add(key);
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (MOVIMENT_KEYS.includes(key)) {
        this.keysPressed.delete(key);
      }
    });
  }

  move(canvas) {
    if (this.keysPressed.size === 0) {
      return;
    }

    let dx = 0;
    let dy = 0;

    if (this.keysPressed.has("w")) dy -= 1;
    if (this.keysPressed.has("s")) dy += 1;
    if (this.keysPressed.has("a")) dx -= 1;
    if (this.keysPressed.has("d")) dx += 1;

    super.move(dx, dy, canvas);
  }

  attack(enemies) {
    if (!this.canAttack()) return;

    const closestEnemy = enemies.reduce(
      (closest, enemy) => {
        const distance = this.getDistance(this.position, enemy.position);
        return distance < closest.distance ? { enemy, distance } : closest;
      },
      { enemy: null, distance: Infinity },
    ).enemy;

    if (closestEnemy) {
      const dx = closestEnemy.position.x - this.position.x;
      const dy = closestEnemy.position.y - this.position.y;
      const direction = Math.atan2(dy, dx);
      const projectile = new SwordProjectile(
        this.position.x,
        this.position.y,
        closestEnemy.position.x - this.position.x,
        closestEnemy.position.y - this.position.y,
        direction,
        20,
        this,
      );

      this.lastAttackAt = Date.now();
      return projectile;
    }
  }

  getXpPercent() {
    const percent = this.xp / this.xpToLevelUp;
    return percent;
  }

  stealLife(damage) {
    const newCurrentLife = this.currentLife + damage * this.lifeStealPercent;
    this.currentLife = Math.min(newCurrentLife, this.maxLife);
  }

  hitAliveEntity(aliveEntity, damage) {
    this.stealLife(damage);
    if (aliveEntity.isDead) {
      this.xp += aliveEntity.maxLife / (this.maxLife / 3);
      this.checkLevelUp();
    }
  }

  checkLevelUp() {
    if (this.xp >= this.xpToLevelUp) {
      this.levelUp();
    }
  }

  randomUpgrade() {
    if (Math.round(Math.random())) {
      this.armour += 1;
    } else {
      this.lifeStealPercent += 0.1;
    }
  }

  levelUp() {
    super.levelUp();
    this.xp = this.xp - this.xpToLevelUp;
    this.xpToLevelUp = this.level * 2;
    this.checkLevelUp();
    if (this.level % 5 === 0) {
      this.randomUpgrade();
    }
  }

  takeDamage(amount) {
    super.takeDamage(amount - this.armour);
  }
}
