const canvas = document.getElementById('field');
const ctx    = canvas.getContext('2d');

const W = 780, H = 480;
canvas.width  = W;
canvas.height = H;

const fieldImg = new Image();
fieldImg.src = './field.jpg';

const GOAL_H  = 80;
const GOAL_Y  = (H - GOAL_H) / 2;
const GOAL_D  = 14;   // profundidade do gol
const PR      = 18;   // raio do jogador
const BR      = 12;   // raio da bola
const MATCH_T = 150;  // segundos

let scoreBlue, scoreRed, timeLeft, running, lastTs, timerAcc, cooldown;

const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))
    e.preventDefault();
});
document.addEventListener('keyup', e => keys[e.code] = false);

const p1   = { x:0, y:0, vx:0, vy:0, color:'#4da6ff' };
const p2   = { x:0, y:0, vx:0, vy:0, color:'#ff4d4d' };
const ball = { x:0, y:0, vx:0, vy:0 };

function reset() {
  p1.x = W*0.25; p1.y = H/2; p1.vx = 0; p1.vy = 0;
  p2.x = W*0.75; p2.y = H/2; p2.vx = 0; p2.vy = 0;
  ball.x = W/2;  ball.y = H/2; ball.vx = 0; ball.vy = 0;
}

function updateHUD() {
  document.getElementById('score-blue').textContent = scoreBlue;
  document.getElementById('score-red').textContent  = scoreRed;
  const m = String(Math.floor(timeLeft / 60)).padStart(2,'0');
  const s = String(Math.floor(timeLeft % 60)).padStart(2,'0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

function startGame() {
  scoreBlue = 0; scoreRed = 0;
  timeLeft  = MATCH_T;
  timerAcc  = 0;
  cooldown  = 0;
  running   = true;

  reset();
  updateHUD();

  document.getElementById('start-screen').classList.add('hidden');
  lastTs = performance.now();
  requestAnimationFrame(loop);
}

function loop(ts) {
  if (!running) return;
  const dt = Math.min((ts - lastTs) / 1000, 0.05);
  lastTs = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  // Pausa pós-gol
  if (cooldown > 0) {
    cooldown -= dt;
    if (cooldown <= 0) {
      document.getElementById('goal-screen').classList.add('hidden');
      reset();
    }
    return;
  }

  timerAcc += dt;
  if (timerAcc >= 1) {
    timerAcc -= 1;
    timeLeft  = Math.max(0, timeLeft - 1);
    updateHUD();
    if (timeLeft === 0) { endMatch(); return; }
  }

  movePlayer(p1,
    (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0),
    (keys['KeyS'] ? 1 : 0) - (keys['KeyW'] ? 1 : 0)
  );

  movePlayer(p2,
    (keys['ArrowRight'] ? 1 : 0) - (keys['ArrowLeft'] ? 1 : 0),
    (keys['ArrowDown']  ? 1 : 0) - (keys['ArrowUp']   ? 1 : 0)
  );

  step(p1, dt); 
  step(p2, dt); 
  step(ball, dt);

  // Fricção da bola
  ball.vx *= 0.988;
  ball.vy *= 0.988;

  wallBounce(p1, PR);
  wallBounce(p2, PR);
  ballWall();

  collide(p1, PR, ball, BR);
  collide(p2, PR, ball, BR);
  collide(p1, PR, p2,   PR);

  checkGoal();
}

function movePlayer(p, ax, ay) {
  const len = Math.hypot(ax, ay) || 1;
  const spd = 1;
  p.vx = p.vx * 0.8 + (ax / len) * spd;
  p.vy = p.vy * 0.8 + (ay / len) * spd;
}

function step(e, dt) {
  e.x += e.vx * dt * 60;
  e.y += e.vy * dt * 60;
}

function wallBounce(p, r) {
  if (p.x < r)     { p.x = r;     p.vx =  Math.abs(p.vx) * 0.5; }
  if (p.x > W - r) { p.x = W - r; p.vx = -Math.abs(p.vx) * 0.5; }
  if (p.y < r)     { p.y = r;     p.vy =  Math.abs(p.vy) * 0.5; }
  if (p.y > H - r) { p.y = H - r; p.vy = -Math.abs(p.vy) * 0.5; }
}

function ballWall() {
  const inGoal = ball.y > GOAL_Y && ball.y < GOAL_Y + GOAL_H;

  if (ball.y < BR)     { ball.y = BR;     ball.vy =  Math.abs(ball.vy) * 0.7; }
  if (ball.y > H - BR) { ball.y = H - BR; ball.vy = -Math.abs(ball.vy) * 0.7; }

  if (ball.x < BR && !inGoal) {
    ball.x = BR; ball.vx = Math.abs(ball.vx) * 0.7;
  }
  if (ball.x > W - BR && !inGoal) {
    ball.x = W - BR; ball.vx = -Math.abs(ball.vx) * 0.7;
  }
}

function collide(a, ra, b, rb) {
  const dx   = b.x - a.x, dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const min  = ra + rb;
  if (dist >= min || dist === 0) return;

  const nx = dx / dist, ny = dy / dist;
  const overlap = (min - dist) / 2;
  a.x -= nx * overlap; a.y -= ny * overlap;
  b.x += nx * overlap; b.y += ny * overlap;

  const dvx = b.vx - a.vx, dvy = b.vy - a.vy;
  const dot  = dvx * nx + dvy * ny;
  if (dot >= 0) return;

  const imp = dot * 0.75;
  a.vx += imp * nx; a.vy += imp * ny;
  b.vx -= imp * nx; b.vy -= imp * ny;
}

function checkGoal() {
  if (ball.x < -GOAL_D && ball.y > GOAL_Y && ball.y < GOAL_Y + GOAL_H) {
    scoreRed++;
    showGoal('Vermelho marcou!');
  }

  if (ball.x > W + GOAL_D && ball.y > GOAL_Y && ball.y < GOAL_Y + GOAL_H) {
    scoreBlue++;
    showGoal('Azul marcou!');
  }
}

function showGoal(msg) {
  updateHUD();
  document.getElementById('goal-msg').textContent = msg;
  document.getElementById('goal-screen').classList.remove('hidden');
  cooldown = 2;
}

function endMatch() {
  running = false;
  let msg;
  if (scoreBlue > scoreRed)      msg = 'Azul Venceu!';
  else if (scoreRed > scoreBlue) msg = 'Vermelho Venceu!';
  else                           msg = 'Empate!';
  document.getElementById('end-msg').textContent = msg;
  document.getElementById('end-screen').classList.remove('hidden');
}

function draw() {
  if (fieldImg.complete && fieldImg.naturalWidth > 0) {
    ctx.drawImage(fieldImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#2d8a45';
    ctx.fillRect(0, 0, W, H);
  }

  drawGoals();
  drawCircle(ball.x, ball.y, BR, 'white', '#333');
  drawCircle(p1.x,   p1.y,   PR, p1.color, 'white');
  drawCircle(p2.x,   p2.y,   PR, p2.color, 'white');

  ctx.fillStyle = 'white';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('1', p1.x, p1.y);
  ctx.fillText('2', p2.x, p2.y);
}

function drawCircle(x, y, r, fill, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawGoals() {
  ctx.fillStyle = 'rgba(77,166,255,0.3)';
  ctx.fillRect(-GOAL_D, GOAL_Y, GOAL_D, GOAL_H);
  ctx.strokeStyle = '#4da6ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(-GOAL_D, GOAL_Y, GOAL_D, GOAL_H);

  ctx.fillStyle = 'rgba(255,77,77,0.3)';
  ctx.fillRect(W, GOAL_Y, GOAL_D, GOAL_H);
  ctx.strokeStyle = '#ff4d4d';
  ctx.lineWidth = 3;
  ctx.strokeRect(W, GOAL_Y, GOAL_D, GOAL_H);
}