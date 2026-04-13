// ============================================================
// Constants
// ============================================================

const ALL_EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🐬', '🦄', '🐧', '🦀'
];

const DIFFICULTY_CONFIG = {
  easy:   { rows: 4, cols: 4, pairs: 8,  label: 'Fácil'   },
  medium: { rows: 4, cols: 6, pairs: 12, label: 'Médio'   },
  hard:   { rows: 6, cols: 6, pairs: 18, label: 'Difícil' },
};

// ============================================================
// State
// ============================================================

let state = {
  difficulty:    'medium',
  cards:         [],
  flippedCards:  [],
  moves:         0,
  matches:       0,
  totalPairs:    0,
  timerSeconds:  0,
  timerInterval: null,
  isLocked:      false,
  gameStarted:   false,
};

// ============================================================
// DOM References (cached on DOMContentLoaded)
// ============================================================

let gameBoard;
let movesEl;
let matchesEl;
let timerEl;
let winOverlay;
let winMovesEl;
let winTimeEl;
let winDifficultyEl;
let difficultySelect;

// ============================================================
// Utilities
// ============================================================

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairCount) {
  const emojis = ALL_EMOJIS.slice(0, pairCount);
  const pairs = [...emojis, ...emojis];
  const shuffled = shuffle(pairs);
  return shuffled.map((emoji, index) => ({
    id:        index,
    emoji,
    pairId:    emojis.indexOf(emoji),
    isFlipped: false,
    isMatched: false,
  }));
}

function computeCardSize(cols) {
  const availableWidth = Math.min(window.innerWidth - 32, 720);
  const maxByViewport  = Math.floor((availableWidth - (cols - 1) * 12) / cols);
  return Math.min(maxByViewport, 110);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ============================================================
// Display Helpers
// ============================================================

function updateMovesDisplay() {
  movesEl.textContent = state.moves;
}

function updateMatchesDisplay() {
  matchesEl.textContent = `${state.matches} / ${state.totalPairs}`;
}

function updateTimerDisplay() {
  timerEl.textContent = formatTime(state.timerSeconds);
}

// ============================================================
// Timer
// ============================================================

function startTimer() {
  state.gameStarted = true;
  state.timerInterval = setInterval(() => {
    state.timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

// ============================================================
// Board Rendering
// ============================================================

function renderBoard() {
  const config   = DIFFICULTY_CONFIG[state.difficulty];
  const cardSize = computeCardSize(config.cols);

  gameBoard.innerHTML = '';
  gameBoard.style.setProperty('--grid-cols', config.cols);
  gameBoard.style.setProperty('--card-size', cardSize + 'px');

  state.cards.forEach(card => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.id = card.id;
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', 'Carta virada para baixo');
    wrapper.setAttribute('tabindex', '0');

    wrapper.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">🂠</div>
        <div class="card-face card-front">${card.emoji}</div>
      </div>
    `;

    wrapper.addEventListener('click', onCardClick);
    wrapper.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onCardClick({ currentTarget: wrapper });
      }
    });

    gameBoard.appendChild(wrapper);
  });
}

// ============================================================
// Card Click Handler
// ============================================================

function onCardClick(event) {
  const wrapper = event.currentTarget;
  const cardId  = parseInt(wrapper.dataset.id, 10);
  const card    = state.cards[cardId];

  // Guard: board locked during mismatch animation
  if (state.isLocked) return;

  // Guard: already matched
  if (card.isMatched) return;

  // Guard: same card clicked twice
  if (state.flippedCards.includes(wrapper)) return;

  // Start timer on very first flip
  if (!state.gameStarted) startTimer();

  // Flip card face-up
  card.isFlipped = true;
  wrapper.classList.add('flipped');
  wrapper.setAttribute('aria-label', `Carta: ${card.emoji}`);
  state.flippedCards.push(wrapper);

  // Wait for second card
  if (state.flippedCards.length < 2) return;

  // Two cards face-up: evaluate
  state.moves++;
  updateMovesDisplay();

  const [firstWrapper, secondWrapper] = state.flippedCards;
  const firstCard  = state.cards[parseInt(firstWrapper.dataset.id, 10)];
  const secondCard = state.cards[parseInt(secondWrapper.dataset.id, 10)];

  if (firstCard.pairId === secondCard.pairId) {
    // MATCH
    firstCard.isMatched  = true;
    secondCard.isMatched = true;
    firstWrapper.classList.add('matched');
    secondWrapper.classList.add('matched');
    firstWrapper.setAttribute('aria-label',  `Par encontrado: ${firstCard.emoji}`);
    secondWrapper.setAttribute('aria-label', `Par encontrado: ${secondCard.emoji}`);

    state.matches++;
    updateMatchesDisplay();
    state.flippedCards = [];

    if (state.matches === state.totalPairs) {
      handleWin();
    }
  } else {
    // MISMATCH — lock and flip back after delay
    state.isLocked = true;
    setTimeout(() => {
      firstCard.isFlipped  = false;
      secondCard.isFlipped = false;
      firstWrapper.classList.remove('flipped');
      secondWrapper.classList.remove('flipped');
      firstWrapper.setAttribute('aria-label', 'Carta virada para baixo');
      secondWrapper.setAttribute('aria-label', 'Carta virada para baixo');
      state.flippedCards = [];
      state.isLocked = false;
    }, 1000);
  }
}

// ============================================================
// Win Handler
// ============================================================

function handleWin() {
  stopTimer();
  winMovesEl.textContent      = state.moves;
  winTimeEl.textContent       = formatTime(state.timerSeconds);
  winDifficultyEl.textContent = DIFFICULTY_CONFIG[state.difficulty].label;

  // Brief delay so the last card's flip animation finishes first
  setTimeout(() => {
    winOverlay.classList.remove('hidden');
    document.getElementById('btn-play-again').focus();
  }, 600);
}

// ============================================================
// Game Init / Restart
// ============================================================

function initGame() {
  stopTimer();

  const config = DIFFICULTY_CONFIG[state.difficulty];

  state = {
    difficulty:    state.difficulty,
    cards:         buildDeck(config.pairs),
    flippedCards:  [],
    moves:         0,
    matches:       0,
    totalPairs:    config.pairs,
    timerSeconds:  0,
    timerInterval: null,
    isLocked:      false,
    gameStarted:   false,
  };

  winOverlay.classList.add('hidden');
  updateMovesDisplay();
  updateMatchesDisplay();
  updateTimerDisplay();
  renderBoard();
}

// ============================================================
// Bootstrap
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  gameBoard        = document.getElementById('game-board');
  movesEl          = document.getElementById('stat-moves');
  matchesEl        = document.getElementById('stat-matches');
  timerEl          = document.getElementById('stat-timer');
  winOverlay       = document.getElementById('win-overlay');
  winMovesEl       = document.getElementById('win-moves');
  winTimeEl        = document.getElementById('win-time');
  winDifficultyEl  = document.getElementById('win-difficulty');
  difficultySelect = document.getElementById('difficulty');

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  difficultySelect.addEventListener('change', () => {
    state.difficulty = difficultySelect.value;
    initGame();
  });

  window.addEventListener('resize', () => {
    const config   = DIFFICULTY_CONFIG[state.difficulty];
    const cardSize = computeCardSize(config.cols);
    gameBoard.style.setProperty('--card-size', cardSize + 'px');
  });

  initGame();
});
