class AliveEntity extends Entity {
  constructor(
    imageSrc,
    x,
    y,
    speed,
    attackSpeed,
    damage,
    maxLife,
    damageCooldown = 1000,
  ) {
    super(imageSrc, x, y, speed);
    this.maxLife = maxLife;
    this.currentLife = maxLife;
    this.damageCooldown = damageCooldown;
    this.lastDamageTime = 0;
    this.isDead = false;
    this.level = 1;
    this.attackSpeed = attackSpeed;
    this.lastAttackAt = 0;
    this.damage = damage;
  }

  takeDamage(amount) {
    const now = Date.now();
    if (now - this.lastDamageTime < this.damageCooldown) return;

    this.currentLife -= amount;
    this.lastDamageTime = now;
    this.isDead = this.currentLife <= 0;
  }

  restoreHealth(amount) {
    this.currentLife = Math.min(this.currentLife + amount, this.maxLife);
  }

  levelUp(quantity = 1) {
    this.level += quantity;
    this.speed = this.speed * Math.pow(1.05, quantity);
    this.attackSpeed = this.attackSpeed * Math.pow(1.05, quantity);
    this.maxLife = Math.round(this.maxLife * Math.pow(1.05, quantity));
    this.damage = this.damage * Math.pow(1.025, quantity);
    this.currentLife = this.maxLife;
  }

  canAttack() {
    const attackCooldown = 1000 / this.attackSpeed;
    return this.lastAttackAt + attackCooldown <= Date.now();
  }

  attack(target) {
    if (!this.canAttack()) return;

    this.hitAliveEntity(target);
    this.lastAttackAt = Date.now();
  }

  hitAliveEntity(target) {
    target.takeDamage(this.damage);
  }
}
