let player = document.getElementById("player");
let game = document.getElementById("game");
let scoreDisplay = document.getElementById("score");

let playerX = 170;
let score = 0;
let running = true;
let missed = 0;
let missedDisplay = document.getElementById("missed");
let paused = false;

document.addEventListener("keydown", (e) => {
  if (!running || paused) return;

  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 40;
  }

  if (e.key === "ArrowRight" && playerX < 350) {
    playerX += 40;
  }

  player.style.left = playerX + "px";
});

function createItem() {
  if (!running || paused) return;

  let item = document.createElement("div");
  item.classList.add("item");

  let isGood = Math.random() > 0.7;

  item.innerHTML = isGood ? "📦" : "💣";
  item.dataset.type = isGood ? "good" : "bad";

  item.style.left = Math.random() * 360 + "px";

  game.appendChild(item);

  let fall = setInterval(() => {
    if (paused) return;
    let top = item.offsetTop;
    item.style.top = top + 9 + "px";

    if (
      top > 440 &&
      item.offsetLeft > playerX - 30 &&
      item.offsetLeft < playerX + 40
    ) {
      if (item.dataset.type === "good") {
        score++;
      } else {
        score -= 2;
      }

      scoreDisplay.innerText = score;

      item.remove();
      clearInterval(fall);

      checkGame();
    }

    if (top > 500) {
    if (item.dataset.type === "good") {
        missed++;
        missedDisplay.innerText = missed;
    }

    item.remove();
    clearInterval(fall);

    checkGame();
    }

  }, 30);
}

function togglePause() {
  paused = !paused;

  let btn = document.getElementById("pauseBtn");
  let overlay = document.getElementById("overlay");

  btn.innerText = paused ? "▶️" : "⏸️";
  overlay.style.display = paused ? "flex" : "none";
}

function checkGame() {
  if (score >= 10) {
    running = false;
    alert("Você virou o entregador do mês!");
    restartGame();
  }

  if (score <= -5) {
    running = false;
    alert("Você foi demitido!");
    restartGame();
  }

  if (missed > 3) {
    running = false;
    alert("Você deixou muitas encomendas caírem!");
    restartGame();
  }
}

setInterval(createItem, 600);

function restartGame() {
  location.reload();
}
