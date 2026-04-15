/**
 * CLUB PENGUIN MEMORY — game.js
 * Jogo da Memória para 2 Jogadores
 * GAC116 - Programação Web 2026/1
 */

document.addEventListener('DOMContentLoaded', () => {

/* ============================================================
   CONFIGURAÇÃO DAS CARTAS — Puffles como imagens
   ============================================================ */
const CARD_PAIRS = [
  { id: 'puffle_azul',     img: 'assets/puffle_azul.png',     label: 'Puffle Azul'     },
  { id: 'puffle_verde',    img: 'assets/puffle_verde.png',    label: 'Puffle Verde'    },
  { id: 'puffle_vermelho', img: 'assets/puffle_vermelho.png', label: 'Puffle Vermelho' },
  { id: 'puffle_preto',    img: 'assets/puffle_preto.png',    label: 'Puffle Preto'    },
  { id: 'puffle_colorido',   img: 'assets/puffle_colorido.png',   label: 'Puffle Colorido'   },
  { id: 'puffle_roxo',     img: 'assets/puffle_roxo.png',     label: 'Puffle Roxo'     },
  { id: 'puffle_amarelo',  img: 'assets/puffle_amarelo.png',  label: 'Puffle Amarelo'  },
  { id: 'puffle_rosa',     img: 'assets/puffle_rosa.png',     label: 'Puffle Rosa'     },
];

/* ============================================================
   IMAGENS DOS PINGUINS POR ESTADO
   ============================================================ */
const PENGUIN_IMGS = {
  1: {
    playing: 'assets/penguin_cientista_jogando.png',
    waiting: 'assets/penguin_cientista_esperando.png',
  },
  2: {
    playing: 'assets/penguin_espiao_jogando.png',
    waiting: 'assets/penguin_espiao_esperando.png',
  },
};

/* ============================================================
   ESTADO DO JOGO
   ============================================================ */
const state = {
  gameId: 0,
  currentPlayer: 1,
  scores: { 1: 0, 2: 0 },
  flipped: [],
  matched: 0,
  totalPairs: CARD_PAIRS.length,
  locked: false,
  cards: [],
};

/* ============================================================
   ELEMENTOS DO DOM
   ============================================================ */
const screens = {
  menu:   document.getElementById('screen-menu'),
  game:   document.getElementById('screen-game'),
  result: document.getElementById('screen-result'),
};

const board       = document.getElementById('board');
const scoreP1     = document.getElementById('score-p1');
const scoreP2     = document.getElementById('score-p2');
const turnP1      = document.getElementById('turn-p1');
const turnP2      = document.getElementById('turn-p2');
const sideP1      = document.getElementById('side-p1');
const sideP2      = document.getElementById('side-p2');
const messageEl   = document.getElementById('message');
const resultTitle = document.getElementById('result-title');
const resultText  = document.getElementById('result-text');
const resultP1    = document.getElementById('result-p1');
const resultP2    = document.getElementById('result-p2');
const imgP1       = document.getElementById('img-p1');
const imgP2       = document.getElementById('img-p2');

/* ============================================================
   NEVE NO MENU (partículas CSS)
   ============================================================ */
function spawnMenuSnow() {
  const container = document.getElementById('menuSnowflakes');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'snowflake-particle';
    const size = 3 + Math.random() * 5;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${5 + Math.random() * 8}s;
      animation-delay: ${-(Math.random() * 10)}s;
      opacity: ${0.4 + Math.random() * 0.5};
    `;
    container.appendChild(el);
  }
}
spawnMenuSnow();

/* ============================================================
   NAVEGAÇÃO ENTRE TELAS
   ============================================================ */
function showScreen(name) {
  Object.values(screens).forEach(el => el.classList.remove('active'));
  screens[name].classList.add('active');
}

/* ============================================================
   EMBARALHAR (Fisher-Yates)
   ============================================================ */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ============================================================
   CRIAR TABULEIRO
   ============================================================ */
function createBoard() {
  board.innerHTML = '';
  const deck = shuffle([...CARD_PAIRS, ...CARD_PAIRS]);
  state.cards = deck;

  deck.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = index;
    cardEl.dataset.id = card.id;
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('aria-label', 'Carta virada');

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front">
          <img src="${card.img}" alt="${card.label}" draggable="false" />
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => handleCardClick(cardEl, index));
    board.appendChild(cardEl);
  });
}

/* ============================================================
   CLIQUE NA CARTA
   ============================================================ */
function handleCardClick(cardEl, index) {
  if (state.locked) return;
  if (cardEl.classList.contains('flipped')) return;
  if (cardEl.classList.contains('matched')) return;

  cardEl.classList.add('flipped');
  state.flipped.push({ el: cardEl, index, id: state.cards[index].id });

  if (state.flipped.length === 2) {
    state.locked = true;
    checkMatch();
  }
}

/* ============================================================
   VERIFICAR PAR
   ============================================================ */
function checkMatch() {
  const [first, second] = state.flipped;
  const currentGameId = state.gameId;

  if (first.id === second.id) {
    setTimeout(() => {
      if (state.gameId !== currentGameId) return;

      first.el.classList.add('matched');
      second.el.classList.add('matched');

      state.scores[state.currentPlayer]++;
      updateScores();
      state.matched++;

      setMessage('Par encontrado! 🎉');

      state.flipped = [];
      state.locked = false;

      if (state.matched === state.totalPairs) {
        setTimeout(endGame, 800);
      }
    }, 500);

  } else {
    setTimeout(() => {
      if (state.gameId !== currentGameId) return;

      first.el.classList.remove('flipped');
      second.el.classList.remove('flipped');

      state.flipped = [];
      state.locked = false;

      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      updateTurnIndicator();
      setMessage('');
    }, 900);
  }
}

/* ============================================================
   ATUALIZAR HUD
   ============================================================ */
function updateScores() {
  scoreP1.textContent = state.scores[1];
  scoreP2.textContent = state.scores[2];
}

function updateTurnIndicator() {
  if (state.currentPlayer === 1) {
    turnP1.textContent = 'Sua vez!';
    turnP2.textContent = '';
    sideP1.classList.add('active');
    sideP2.classList.remove('active');
  } else {
    turnP1.textContent = '';
    turnP2.textContent = 'Sua vez!';
    sideP1.classList.remove('active');
    sideP2.classList.add('active');
  }
  updatePenguinImages();
}

function updatePenguinImages() {
  imgP1.src = state.currentPlayer === 1
    ? PENGUIN_IMGS[1].playing
    : PENGUIN_IMGS[1].waiting;

  imgP2.src = state.currentPlayer === 2
    ? PENGUIN_IMGS[2].playing
    : PENGUIN_IMGS[2].waiting;
}

function setMessage(text) {
  messageEl.textContent = text;
}

/* ============================================================
   FIM DE JOGO
   ============================================================ */
function endGame() {
  const s1 = state.scores[1];
  const s2 = state.scores[2];

  resultP1.textContent = s1;
  resultP2.textContent = s2;

  const rp1 = document.getElementById('rp1');
  const rp2 = document.getElementById('rp2');
  rp1.classList.remove('winner');
  rp2.classList.remove('winner');

  if (s1 > s2) {
    resultTitle.textContent = 'Jogador 1 venceu! 🏆';
    resultText.textContent = `Placar final: ${s1} a ${s2}`;
    rp1.classList.add('winner');
  } else if (s2 > s1) {
    resultTitle.textContent = 'Jogador 2 venceu! 🏆';
    resultText.textContent = `Placar final: ${s2} a ${s1}`;
    rp2.classList.add('winner');
  } else {
    resultTitle.textContent = 'Empate! 🤝';
    resultText.textContent = `Ambos fizeram ${s1} pares`;
  }

  showScreen('result');
}

/* ============================================================
   INICIAR JOGO
   ============================================================ */
function startGame() {
  state.gameId++;
  state.currentPlayer = 1;
  state.scores = { 1: 0, 2: 0 };
  state.flipped = [];
  state.matched = 0;
  state.locked = false;

  updateScores();
  updateTurnIndicator();
  setMessage('');
  createBoard();
  showScreen('game');
}

/* ============================================================
   BOTÕES
   ============================================================ */
document.getElementById('btn-start').addEventListener('click', startGame);
document.querySelectorAll('#btn-restart').forEach(btn =>
  btn.addEventListener('click', startGame)
);
document.querySelectorAll('#btn-menu').forEach(btn =>
  btn.addEventListener('click', () => showScreen('menu'))
);
/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
showScreen('menu');

}); // fim DOMContentLoaded