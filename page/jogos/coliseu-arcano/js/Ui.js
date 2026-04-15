class Ui {
  constructor(onStart, onComeBackToGame) {
    this.createUiContainer();
    this.createStartButton(onStart);
    this.createCharacterInfo();
    this.createPauseMenu(onComeBackToGame, onStart);
  }

  createUiContainer() {
    const uiContainer = document.createElement("div");
    uiContainer.classList.add("ui-container");
    this.uiContainer = uiContainer;
  }

  createStartButton(onStart) {
    const startButton = document.createElement("button");
    startButton.classList.add("start-button");
    startButton.addEventListener("click", onStart);
    this.startButton = startButton;
  }

  createCharacterInfoAttribute() {
    const container = document.createElement("div");
    container.classList.add("character-info-attribute");
    const label = document.createElement("span");
    label.classList.add("label");
    const value = document.createElement("span");
    const separatorNode = document.createTextNode(": ");
    container.appendChild(label);
    container.appendChild(separatorNode);
    container.appendChild(value);

    return {
      container,
      label,
      value,
    };
  }

  createCharacterInfo() {
    const characterInfoContainer = document.createElement("div");
    characterInfoContainer.classList.add("character-container");

    let statusMapping = new Map([
      ["level", { textLabel: "Nível", formatter: (value) => value }],
      ["maxLife", { textLabel: "Vida Máxima", formatter: (value) => value }],
      [
        "currentLife",
        {
          textLabel: "Vida Atual",
          formatter: (value) => {
            return value.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            });
          },
        },
      ],
      [
        "attackSpeed",
        {
          textLabel: "Velocidade de Ataque",
          formatter: (value) =>
            value.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        },
      ],
      [
        "speed",
        {
          textLabel: "Velocidade",
          formatter: (value) =>
            value.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            }),
        },
      ],
      ["armour", { textLabel: "Armadura", formatter: (value) => value }],
      [
        "lifeStealPercent",
        {
          textLabel: "Roubo de Vida",
          formatter: (value) =>
            value.toLocaleString("pt-BR", {
              style: "percent",
              maximumFractionDigits: 0,
            }),
        },
      ],
    ]);

    const newMap = new Map();

    statusMapping = statusMapping.forEach((configs, key) => {
      const { container, label, value } = this.createCharacterInfoAttribute();
      label.textContent = configs.textLabel;
      characterInfoContainer.appendChild(container);
      newMap.set(key, { ...configs, value, label, container });
    });

    this.characterInfo = characterInfoContainer;
    this.characterStatusMapping = newMap;
  }

  createPauseMenu(onComeBackToGame, onStart) {
    const pauseMenu = document.createElement("div");
    pauseMenu.classList.add("pause-menu");

    const continueButton = document.createElement("button");
    continueButton.classList.add("continue-button");
    continueButton.textContent = "Continuar";
    continueButton.addEventListener("click", () => {
      this.hidePauseMenu();
      onComeBackToGame();
    });

    const restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Reiniciar";
    restartButton.addEventListener("click", () => {
      this.hidePauseMenu();
      onStart();
    });

    const pauseMenuFooter = document.createElement("div");
    pauseMenuFooter.classList.add("pause-menu-footer");

    pauseMenuFooter.appendChild(restartButton);
    pauseMenuFooter.appendChild(continueButton);

    pauseMenu.appendChild(this.characterInfo);
    pauseMenu.appendChild(pauseMenuFooter);
    this.pauseMenu = pauseMenu;
    this.isPauseMenuVisible = false;
  }

  fillCharacterInfo(character) {
    this.characterStatusMapping.forEach(({ formatter, value }, key) => {
      const attributeValue = character[key];
      value.textContent = formatter(attributeValue);
    });
  }

  showPauseMenu(character) {
    this.fillCharacterInfo(character);
    this.uiContainer.appendChild(this.pauseMenu);
    document.body.appendChild(this.uiContainer);
    this.isPauseMenuVisible = true;
  }

  hidePauseMenu() {
    this.uiContainer.removeChild(this.pauseMenu);
    if (this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }
    this.isPauseMenuVisible = false;
  }

  showStartScreen() {
    this.startButton.textContent = "Iniciar Jogo";
    document.body.appendChild(this.uiContainer);
    this.uiContainer.appendChild(this.startButton);
  }

  hideScreen() {
    this.uiContainer.removeChild(this.startButton);
    if (this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }
  }

  showRetryScreen() {
    this.startButton.textContent = "Reiniciar Jogo";
    document.body.appendChild(this.uiContainer);
    this.uiContainer.appendChild(this.startButton);
  }
}
