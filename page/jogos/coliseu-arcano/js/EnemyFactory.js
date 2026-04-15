class EnemyFactory {
  constructor() {
    this.enemiesOptions = new Map([
      [
        1,
        {
          image: "assets/ghost.png",
          maxLife: 40,
          speed: 1.5,
          attackSpeed: 1,
          damage: 15,
          class: Enemy,
        },
      ],
      [
        2,
        {
          image: "assets/mage.png",
          maxLife: 30,
          speed: 0,
          attackSpeed: 1.5,
          damage: 5,
          class: Mage,
        },
      ],
      [
        3,
        {
          image: "assets/orc.png",
          maxLife: 100,
          speed: 0.75,
          attackSpeed: 3,
          damage: 40,
          class: Orc,
        },
      ],
    ]);
  }

  generateEnemy(x, y) {
    const variant = Math.round(Math.random() * 2) + 1;
    const {
      image,
      maxLife,
      speed,
      attackSpeed,
      damage,
      class: Class,
    } = this.enemiesOptions.get(variant);
    return new Class(image, x, y, speed, attackSpeed, damage, maxLife);
  }
}
