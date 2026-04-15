export class ScenarioEntity {
  constructor({
    posX = 0,
    posY = 0,
    assetUrl = "",
    width = 0,
    height = 0,
    className = "",
  } = {}) {
    if (new.target === ScenarioEntity) {
      throw new Error(
        "ScenarioEntity is abstract and cannot be instantiated directly.",
      );
    }

    this.posX = posX;
    this.posY = posY;
    this.assetUrl = assetUrl;
    this.width = width;
    this.height = height;
    this.className = className;

    this.element = this.createElement();
  }

  createElement() {
    const image = document.createElement("img");
    image.className = `scenario-entity ${this.className}`.trim();
    image.src = this.assetUrl;
    image.alt = "";
    image.draggable = false;
    image.style.width = `${this.width}px`;
    image.style.height = `${this.height}px`;
    return image;
  }

  setPosition(x, y) {
    this.posX = x;
    this.posY = y;
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
  }

  update() {
    throw new Error("Subclasses must implement update().");
  }

  render() {
    throw new Error("Subclasses must implement render().");
  }
}
