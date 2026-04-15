export class UserEventListener {
  constructor(eventCallbacks = {}) {
    this.eventCallbacks = eventCallbacks;

    window.addEventListener("keydown", (event) => this.handleKeydown(event));
  }

  handleKeydown(event) {
    const callback = this.eventCallbacks[event.code];

    if (!callback) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
    }

    callback(event);
  }
}
