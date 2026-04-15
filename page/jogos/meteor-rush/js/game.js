(function () {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const panelTitle = document.getElementById("panel-title");
  const panelText = document.getElementById("panel-text");
  const startBtn = document.getElementById("start-btn");
  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");

  const W = canvas.width;
  const H = canvas.height;

  let state = "menu";
  let score = 0;
  let lives = 3;
  let lastShot = 0;
  const shotCooldown = 220;

  const player = {
    x: W / 2,
    y: H - 56,
    w: 52,
    h: 20,
    speed: 320,
    vx: 0,
  };

  let bullets = [];
  let meteors = [];
  let stars = [];
  let spawnAcc = 0;
  let difficulty = 1;

  const keys = new Set();

  function resizeStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }

  function resetGame() {
    score = 0;
    lives = 3;
    bullets = [];
    meteors = [];
    spawnAcc = 0;
    difficulty = 1;
    player.x = W / 2;
    player.vx = 0;
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = "Pontos: " + score;
    livesEl.textContent = "Vidas: " + lives;
  }

  function showOverlay(title, text, btnLabel) {
    panelTitle.textContent = title;
    panelText.innerHTML = text;
    startBtn.textContent = btnLabel;
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function spawnMeteor() {
    const r = 14 + Math.random() * 18 * difficulty;
    meteors.push({
      x: r + Math.random() * (W - 2 * r),
      y: -r,
      r,
      vy: 60 + Math.random() * 100 + difficulty * 35,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 4,
    });
  }

  function shoot(now) {
    if (now - lastShot < shotCooldown) return;
    lastShot = now;
    bullets.push({ x: player.x, y: player.y - 8, vy: -420, r: 4 });
  }

  function rectCircle(rx, ry, rw, rh, cx, cy, cr) {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < cr * cr;
  }

  function update(dt, now) {
    if (state !== "play") return;

    let move = 0;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) move -= 1;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) move += 1;
    player.x += move * player.speed * dt;
    player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));

    spawnAcc += dt;
    const interval = Math.max(0.35, 1.1 - difficulty * 0.08);
    if (spawnAcc >= interval) {
      spawnAcc = 0;
      spawnMeteor();
    }

    difficulty = 1 + Math.floor(score / 150) * 0.15;

    bullets.forEach((b) => {
      b.y += b.vy * dt;
    });
    bullets = bullets.filter((b) => b.y > -20);

    meteors.forEach((m) => {
      m.y += m.vy * dt;
      m.rot += m.vr * dt;
    });

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dx = b.x - m.x;
        const dy = b.y - m.y;
        if (dx * dx + dy * dy < (m.r + b.r) * (m.r + b.r)) {
          meteors.splice(i, 1);
          bullets.splice(j, 1);
          score += Math.round(10 + m.r);
          updateHud();
          break;
        }
      }
    }

    meteors = meteors.filter((m) => {
      if (m.y - m.r > H + 40) return false;
      if (
        rectCircle(
          player.x - player.w / 2,
          player.y - player.h / 2,
          player.w,
          player.h,
          m.x,
          m.y,
          m.r * 0.85
        )
      ) {
        lives -= 1;
        updateHud();
        if (lives <= 0) {
          state = "over";
          showOverlay(
            "Fim de jogo",
            "Pontuação final: <strong>" +
              score +
              "</strong><br /><br />Gabriel Andrade — Meteor Rush",
            "Jogar de novo"
          );
        }
        return false;
      }
      return true;
    });
  }

  function drawPlayer() {
    const px = player.x - player.w / 2;
    const py = player.y - player.h / 2;
    const g = ctx.createLinearGradient(px, py, px, py + player.h);
    g.addColorStop(0, "#5eead4");
    g.addColorStop(1, "#0d9488");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(player.x, py);
    ctx.lineTo(px + player.w, py + player.h);
    ctx.lineTo(px, py + player.h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(165, 243, 252, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawMeteor(m) {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.rot);
    const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, m.r);
    grd.addColorStop(0, "#fca5a5");
    grd.addColorStop(0.5, "#b91c1c");
    grd.addColorStop(1, "#450a0a");
    ctx.fillStyle = grd;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const rr = m.r * (0.75 + Math.sin(i * 2.1) * 0.2);
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = "#050810";
    ctx.fillRect(0, 0, W, H);

    const t = performance.now() / 1000;
    stars.forEach((s) => {
      const a = 0.35 + Math.sin(t * 2 + s.tw) * 0.25;
      ctx.fillStyle = "rgba(226, 232, 240, " + a + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    bullets.forEach((b) => {
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    meteors.forEach(drawMeteor);
    drawPlayer();
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt, now);
    draw();
    requestAnimationFrame(loop);
  }

  startBtn.addEventListener("click", () => {
    if (state === "menu" || state === "over") {
      resetGame();
      state = "play";
      hideOverlay();
    }
  });

  window.addEventListener("keydown", (e) => {
    keys.add(e.key);
    if (e.key === " " && state === "play") {
      e.preventDefault();
      shoot(performance.now());
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key));

  canvas.addEventListener("pointerdown", (e) => {
    if (state !== "play") return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const cx = (e.clientX - rect.left) * sx;
    if (cx < player.x - 8) keys.add("ArrowLeft");
    else if (cx > player.x + 8) keys.add("ArrowRight");
    shoot(performance.now());
  });
  canvas.addEventListener("pointerup", () => {
    keys.delete("ArrowLeft");
    keys.delete("ArrowRight");
  });
  canvas.addEventListener("pointerleave", () => {
    keys.delete("ArrowLeft");
    keys.delete("ArrowRight");
  });

  resizeStars();
  showOverlay(
    "Meteor Rush",
    "Por <strong>Gabriel Andrade</strong>.<br /><br />← → ou A D para mover. Espaço ou toque para atirar.",
    "Começar"
  );
  requestAnimationFrame(loop);
})();
