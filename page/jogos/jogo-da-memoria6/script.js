/**
 * Memory Cosmos – script.js
 * GAC116 · Programação Web · 2026/1
 *
 * Jogo da Memória com tema espacial.
 * Regras: encontre todos os pares de cartas iguais.
 * Sistema de pontuação: estrelas baseadas no nº de jogadas.
 */

'use strict';

/* ── Constantes ─────────────────────────────────────────── */

const ALL_EMOJIS = ['🚀','🌙','🪐','⭐','🛸','☄️','🌌','👽','🌠','🔭','💫','🌍'];

const DIFFICULTIES = {
  easy:   { pairs: 6,  cols: 3, thresholds: [10, 16] },
  medium: { pairs: 8,  cols: 4, thresholds: [14, 22] },
  hard:   { pairs: 12, cols: 4, thresholds: [20, 32] },
};

/* ── Estado do jogo ─────────────────────────────────────── */

let state = {
  difficulty: 'easy',
  flipped:    [],
  matched:    0,
  moves:      0,
  seconds:    0,
  timerID:    null,
  canFlip:    true,
  totalPairs: 0,
};

/* ── Elementos DOM ──────────────────────────────────────── */

const $grid       = document.getElementById('grid');
const $moves      = document.getElementById('moves');
const $time       = document.getElementById('time');
const $pairs      = document.getElementById('pairs');
const $restartBtn = document.getElementById('restart-btn');
const $winOverlay = document.getElementById('win-overlay');
const $winMoves   = document.getElementById('win-moves');
const $winTime    = document.getElementById('win-time');
const $winStars   = document.getElementById('win-stars');
const $playAgain  = document.getElementById('play-again-btn');
const $diffBtns   = document.querySelectorAll('.diff-btn');
const $starsEl    = document.getElementById('stars');

/* ── Inicialização ──────────────────────────────────────── */

function init() {
  const cfg = DIFFICULTIES[state.difficulty];
  state.totalPairs = cfg.pairs;

  clearInterval(state.timerID);
  Object.assign(state, {
    flipped: [],
    matched: 0,
    moves:   0,
    seconds: 0,
    canFlip: true,
    timerID: null,
  });

  $moves.textContent = '0';
  $time.textContent  = '0:00';
  $pairs.textContent = `0/${cfg.pairs}`;
  $winOverlay.classList.remove('active');

  $grid.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;

  const emojis = ALL_EMOJIS.slice(0, cfg.pairs);
  const deck   = shuffle([...emojis, ...emojis]);

  $grid.innerHTML = '';
  deck.forEach((emoji, i) => {
    const card = buildCard(emoji, i);
    $grid.appendChild(card);
    setTimeout(() => card.classList.add('pop-in'), i * 40);
  });
}

/* ── Construção de carta ─────────────────────────────────── */

function buildCard(emoji, index) {
  const card = document.createElement('div');
  card.className     = 'card';
  card.dataset.emoji = emoji;
  card.dataset.idx   = index;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Carta virada para baixo');
  card.setAttribute('tabindex', '0');

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back"  aria-hidden="true"></div>
      <div class="card-face card-front" aria-hidden="true">${emoji}</div>
    </div>`;

  card.addEventListener('click', () => handleFlip(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(card); }
  });

  return card;
}

/* ── Lógica central ─────────────────────────────────────── */

function handleFlip(card) {
  if (!state.canFlip)                     return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (state.flipped.length >= 2)          return;

  if (state.moves === 0 && state.flipped.length === 0) startTimer();

  card.classList.add('flipped');
  card.setAttribute('aria-label', `Carta: ${card.dataset.emoji}`);
  state.flipped.push(card);

  if (state.flipped.length === 2) {
    state.moves++;
    $moves.textContent = state.moves;
    checkMatch();
  }
}

function checkMatch() {
  state.canFlip = false;
  const [a, b] = state.flipped;

  if (a.dataset.emoji === b.dataset.emoji) {
    playTone('match');
    setTimeout(() => {
      [a, b].forEach(c => {
        c.classList.add('matched');
        c.setAttribute('aria-label', `Par encontrado: ${c.dataset.emoji}`);
      });
      state.matched++;
      $pairs.textContent = `${state.matched}/${state.totalPairs}`;
      state.flipped = [];
      state.canFlip = true;
      if (state.matched === state.totalPairs) setTimeout(showWin, 700);
    }, 300);
  } else {
    [a, b].forEach(c => c.classList.add('wrong'));
    playTone('wrong');
    setTimeout(() => {
      [a, b].forEach(c => {
        c.classList.remove('flipped', 'wrong');
        c.setAttribute('aria-label', 'Carta virada para baixo');
      });
      state.flipped = [];
      state.canFlip = true;
    }, 1100);
  }
}

/* ── Timer ──────────────────────────────────────────────── */

function startTimer() {
  state.timerID = setInterval(() => {
    state.seconds++;
    const m = Math.floor(state.seconds / 60);
    const s = state.seconds % 60;
    $time.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

/* ── Tela de vitória ─────────────────────────────────────── */

function showWin() {
  clearInterval(state.timerID);

  const [three, two] = DIFFICULTIES[state.difficulty].thresholds;
  const stars = state.moves <= three ? 3 : state.moves <= two ? 2 : 1;

  $winMoves.textContent = state.moves;
  $winTime.textContent  = $time.textContent;
  $winStars.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  $winStars.setAttribute('aria-label', `${stars} de 3 estrelas`);

  $winOverlay.classList.add('active');
  $winOverlay.focus();

  playTone('win');
  launchConfetti();
}

/* ── Áudio (Web Audio API) ──────────────────────────────── */

function playTone(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = {
      match: [{ f: 523.25, d: .10 }, { f: 659.25, d: .10 }, { f: 783.99, d: .20 }],
      wrong: [{ f: 220,    d: .30 }],
      win:   [{ f: 523.25, d: .09 }, { f: 659.25, d: .09 }, { f: 783.99, d: .09 }, { f: 1046.50, d: .35 }],
    };
    let t = ctx.currentTime;
    notes[type].forEach(({ f, d }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type === 'wrong' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(.15, t);
      gain.gain.exponentialRampToValueAtTime(.001, t + d);
      osc.start(t);
      osc.stop(t + d);
      t += d;
    });
  } catch (_) { /* áudio não disponível */ }
}

/* ── Confetti ────────────────────────────────────────────── */

function launchConfetti() {
  const palette = ['#7c3aed','#06b6d4','#fbbf24','#ec4899','#10b981','#f97316'];
  for (let i = 0; i < 90; i++) {
    const el    = document.createElement('div');
    const size  = Math.random() * 9 + 4;
    const round = Math.random() > .4 ? '50%' : '2px';
    const color = palette[Math.floor(Math.random() * palette.length)];
    const delay = Math.random() * 1.2;
    const dur   = Math.random() * 2 + 2;
    el.style.cssText = `
      position:fixed; width:${size}px; height:${size}px;
      background:${color}; border-radius:${round};
      left:${Math.random() * 100}vw; top:-12px;
      z-index:200; pointer-events:none;
      animation:confettiFall ${dur}s ease-out ${delay}s forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + .5) * 1000);
  }
}

/* ── Campo de estrelas ───────────────────────────────────── */

function buildStarField() {
  for (let i = 0; i < 180; i++) {
    const el   = document.createElement('div');
    const size = Math.random() * 2.4;
    el.className = 'star';
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      --dur:${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay:${(Math.random() * 4).toFixed(1)}s;`;
    $starsEl.appendChild(el);
  }
}

/* ── Utilitários ─────────────────────────────────────────── */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Event Listeners ─────────────────────────────────────── */

$restartBtn.addEventListener('click', init);
$playAgain.addEventListener('click',  init);

$diffBtns.forEach(btn => btn.addEventListener('click', () => {
  $diffBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.difficulty = btn.dataset.diff;
  init();
}));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $winOverlay.classList.contains('active')) init();
});

/* ── Start ───────────────────────────────────────────────── */

buildStarField();
init();
