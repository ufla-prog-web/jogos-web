/* ─────────────────────────────────────────────────────────────────
   Jogo da Memória
   Embaralhamento: algoritmo de Fisher-Yates
   Dificuldades: 2×2 até 8×8
───────────────────────────────────────────────────────────────── */

// ─── DADOS ────────────────────────────────────────────────────────

const EMOJIS = [
  '🦊','🐼','🦋','🌸','🍄','🎸','🚀','🌊',
  '🦄','🐲','🎯','🍕','⚡','🌈','🎭','🦁',
  '🐙','🌺','🎪','🍦','🔮','🎨','🏔️','🌙',
  '🦚','🐠','🎻','🍇','💎','🌴','🎃','🦜',
];

const DIFFICULTIES = [
  { label: '2×2', cols: 2, rows: 2 },
  { label: '4×4', cols: 4, rows: 4 },
  { label: '4×6', cols: 6, rows: 4 },
  { label: '6×6', cols: 6, rows: 6 },
  { label: '6×8', cols: 8, rows: 6 },
  { label: '8×8', cols: 8, rows: 8 },
];

// ─── ESTADO DO JOGO ───────────────────────────────────────────────

let currentDiff  = 1;   // índice em DIFFICULTIES (padrão: 4×4)
let cards        = [];
let flipped      = [];
let locked       = false;
let moves        = 0;
let matches      = 0;
let totalPairs   = 0;
let timerInterval = null;
let elapsed      = 0;
let gameStarted  = false;
let combo        = 0;

// ─── FISHER-YATES SHUFFLE ─────────────────────────────────────────

/**
 * Embaralha um array usando o algoritmo de Fisher-Yates.
 * Cada permutação tem probabilidade igual — O(n).
 * @param {Array} arr - array original (não é modificado)
 * @returns {Array} novo array embaralhado
 */
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── INTERFACE: BARRA DE DIFICULDADE ─────────────────────────────

function buildDiffBar() {
  const bar = document.getElementById('diffBar');
  bar.innerHTML = '';

  DIFFICULTIES.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'diff-btn' + (i === currentDiff ? ' active' : '');
    btn.textContent = d.label;
    btn.addEventListener('click', () => {
      currentDiff = i;
      buildDiffBar();
      restartGame();
    });
    bar.appendChild(btn);
  });
}

// ─── CRONÔMETRO ───────────────────────────────────────────────────

function formatTime(s) {
  const m  = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    elapsed++;
    const el = document.getElementById('statTime');
    el.textContent = formatTime(elapsed);
    el.className   = 'stat-value mono' + (elapsed > 120 ? ' danger-time' : '');
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// ─── ESTATÍSTICAS ─────────────────────────────────────────────────

function updateStats() {
  document.getElementById('statMoves').textContent   = moves;
  document.getElementById('statMatches').textContent = matches;
  document.getElementById('statPairs').textContent   = totalPairs;
}

// ─── CONTROLE DO JOGO ─────────────────────────────────────────────

function restartGame() {
  stopTimer();

  elapsed     = 0;
  moves       = 0;
  matches     = 0;
  combo       = 0;
  gameStarted = false;
  flipped     = [];
  locked      = false;
  cards       = [];

  const timeEl = document.getElementById('statTime');
  timeEl.textContent = '0:00';
  timeEl.className   = 'stat-value mono';

  document.getElementById('winOverlay').classList.remove('show');
  updateStats();
  buildBoard();
}

// ─── CONSTRUÇÃO DO TABULEIRO ──────────────────────────────────────

function buildBoard() {
  const diff  = DIFFICULTIES[currentDiff];
  const total = diff.cols * diff.rows;
  totalPairs  = total / 2;

  document.getElementById('statPairs').textContent = totalPairs;

  // seleciona e embaralha os emojis usando Fisher-Yates duas vezes:
  // 1ª vez: escolhe aleatoriamente quais emojis entrar no jogo
  // 2ª vez: embaralha o deck completo (pares duplicados)
  const pool = fisherYates(EMOJIS).slice(0, totalPairs);
  const deck = fisherYates([...pool, ...pool]);

  const board = document.getElementById('board');
  board.innerHTML = '';

  // calcula tamanho das cartas de acordo com a tela
  const maxW     = Math.min(window.innerWidth - 48, 900);
  const cardSize = Math.floor((maxW - (diff.cols - 1) * 8) / diff.cols);
  const fontSize = Math.max(14, Math.min(36, Math.floor(cardSize * 0.42)));

  board.style.gridTemplateColumns = `repeat(${diff.cols}, ${cardSize}px)`;
  board.style.gap = '8px';

  // cria cada carta
  cards = deck.map((emoji, idx) => {
    const card = document.createElement('div');
    card.className       = 'card';
    card.style.width     = cardSize + 'px';
    card.style.height    = cardSize + 'px';
    card.dataset.emoji   = emoji;
    card.dataset.index   = idx;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <span class="card-emoji" style="font-size:${fontSize}px">${emoji}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => onCardClick(card));
    board.appendChild(card);
    return card;
  });
}

// ─── LÓGICA DE CLIQUE ─────────────────────────────────────────────

function onCardClick(card) {
  if (locked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  // inicia o cronômetro no primeiro clique
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    updateStats();
    locked = true;
    checkMatch();
  }
}

// ─── VERIFICAÇÃO DE PAR ───────────────────────────────────────────

function checkMatch() {
  const [a, b] = flipped;

  if (a.dataset.emoji === b.dataset.emoji) {
    // ✅ par encontrado
    combo++;
    matches++;
    updateStats();

    setTimeout(() => {
      a.classList.add('matched');
      b.classList.add('matched');
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      flipped = [];
      locked  = false;

      if (combo >= 2) showCombo(combo);
      if (matches === totalPairs) setTimeout(showWin, 400);
    }, 400);

  } else {
    // ❌ não é par
    combo = 0;

    setTimeout(() => {
      a.classList.add('wrong');
      b.classList.add('wrong');

      setTimeout(() => {
        a.classList.remove('flipped', 'wrong');
        b.classList.remove('flipped', 'wrong');
        flipped = [];
        locked  = false;
      }, 500);
    }, 600);
  }
}

// ─── COMBO FLASH ──────────────────────────────────────────────────

function showCombo(n) {
  const LABELS = {
    2: '2× COMBO!',
    3: '3× INCRÍVEL!',
    4: '4× SENSACIONAL!',
    5: '5× ABSURDO!',
  };

  const el = document.getElementById('comboFlash');
  el.textContent = LABELS[Math.min(n, 5)] || `${n}× LENDÁRIO!`;

  // reinicia a animação
  el.classList.remove('pop');
  void el.offsetWidth; // força reflow
  el.classList.add('pop');
}

// ─── TELA DE VITÓRIA ──────────────────────────────────────────────

function showWin() {
  stopTimer();

  // pontuação: favorece menos tentativas e menor tempo
  const score = Math.max(100, Math.floor((totalPairs * 1000) / (moves * (elapsed + 1)) * 100));

  document.getElementById('winMoves').textContent = moves;
  document.getElementById('winTime').textContent  = formatTime(elapsed);
  document.getElementById('winScore').textContent = score;
  document.getElementById('winOverlay').classList.add('show');
}

// ─── REGRAS ───────────────────────────────────────────────────────

function showRules() {
  document.getElementById('rulesOverlay').classList.add('show');
}

function closeRules() {
  document.getElementById('rulesOverlay').classList.remove('show');
}

// ─── RESPONSIVO: RECALCULA AO REDIMENSIONAR ───────────────────────

window.addEventListener('resize', () => {
  if (cards.length > 0) buildBoard();
});

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────

buildDiffBar();
restartGame();