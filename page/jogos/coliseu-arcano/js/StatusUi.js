class StatusUi {
  constructor(character) {
    this.character = character;
    this.createStatusContainer();
    this.createStatusHeader();
    this.createXpBar();
    this.updateStatus();
  }

  createLifeBar() {
    const lifeBar = document.createElement("div");
    lifeBar.classList.add("life-bar");

    const currentLife = document.createElement("div");
    currentLife.classList.add("current-life");

    lifeBar.appendChild(currentLife);
    this.statusContainer.appendChild(lifeBar);
    this.lifeBar = lifeBar;
    this.currentLife = currentLife;
    this.maxLifeBarWidth = 608;
  }

  createLifeIndicators() {
    const lifeIndicator = document.createElement("div");
    lifeIndicator.classList.add("status-indicator");
    this.statusContainer.appendChild(lifeIndicator);
    this.lifeIndicator = lifeIndicator;
  }

  createLifeHud() {
    this.createLifeBar();
    this.createLifeIndicators();
    this.lifeHud = document.createElement("div");
    this.lifeHud.appendChild(this.lifeBar);
    this.lifeHud.appendChild(this.lifeIndicator);
    this.statusHeader.appendChild(this.lifeHud);
  }

  createLevelIndicator() {
    this.levelIndicator = document.createElement("div");
    this.levelIndicator.classList.add("status-indicator");
    this.statusHeader.appendChild(this.levelIndicator);
  }

  createStatusHeader() {
    this.statusHeader = document.createElement("div");
    this.statusHeader.classList.add("status-header");

    this.createLifeHud();
    this.createLevelIndicator();

    this.statusContainer.appendChild(this.statusHeader);
  }

  createStatusContainer() {
    const statusContainer = document.createElement("div");
    statusContainer.classList.add("status-container");
    document.body.appendChild(statusContainer);
    this.statusContainer = statusContainer;
  }

  createXpBar() {
    const xpBar = document.createElement("div");
    xpBar.classList.add("xp-bar");

    const currentXp = document.createElement("div");
    currentXp.classList.add("current-xp");

    xpBar.appendChild(currentXp);
    this.statusContainer.appendChild(xpBar);
    this.xpBar = xpBar;
    this.currentXp = currentXp;
  }

  updateStatus() {
    const formattedCurrentLife = this.character.currentLife.toLocaleString(
      "pt-BR",
      {
        maximumFractionDigits: 0,
      },
    );

    this.lifeIndicator.textContent = `${formattedCurrentLife} / ${this.character.maxLife}`;
    this.lifeBar.style.width = `${Math.min(this.character.maxLife * 2, this.maxLifeBarWidth)}px`;
    const lifePercentage =
      (this.character.currentLife / this.character.maxLife) * 100;
    this.currentLife.style.width = `${lifePercentage}%`;
    this.currentXp.style.width = `${this.character.getXpPercent() * 100}%`;
    this.levelIndicator.textContent = `Nível ${this.character.level}`;
  }
}
