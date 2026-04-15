const MAX_LEVEL = 10;
const ACTIVE_FLASH_MS = 320;
const WRONG_FLASH_MS = 320;
const NOTE_AUDIO_PATHS = {
  do: "assets/sounds/do.mp3",
  re: "assets/sounds/re.mp3",
  mi: "assets/sounds/mi.mp3",
  fa: "assets/sounds/fa.mp3",
};
const NOTE_CONFIG = {
  do: { label: "Do", frequency: 261.63 },
  re: { label: "Re", frequency: 293.66 },
  mi: { label: "Mi", frequency: 329.63 },
  fa: { label: "Fa", frequency: 349.23 },
};
const NOTE_KEYS = Object.keys(NOTE_CONFIG);

const state = {
  sequence: [],
  playerSequence: [],
  level: 0,
  score: 0,
  bestScore: Number(localStorage.getItem("genius-musical-best-score") || 0),
  acceptingInput: false,
  isPlayingSequence: false,
  gameStarted: false,
  audioContext: null,
  audioCache: new Map(),
};

const elements = {
  levelValue: document.getElementById("levelValue"),
  scoreValue: document.getElementById("scoreValue"),
  bestScoreValue: document.getElementById("bestScoreValue"),
  statusMessage: document.getElementById("statusMessage"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  noteButtons: Array.from(document.querySelectorAll(".note-button")),
  gameBoard: document.getElementById("gameBoard"),
};
const noteButtonsByNote = new Map(
  elements.noteButtons.map((button) => [button.dataset.note, button]),
);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function init() {
  elements.bestScoreValue.textContent = String(state.bestScore);
  setButtonsEnabled(false);
  setStatus("Clique em Iniciar para começar.");
  syncHud();

  elements.startButton.addEventListener("click", startGame);
  elements.restartButton.addEventListener("click", startGame);

  elements.noteButtons.forEach((button) => {
    button.addEventListener("click", () => handlePlayerMove(button.dataset.note));
  });
}

function syncHud() {
  elements.levelValue.textContent = String(state.level);
  elements.scoreValue.textContent = String(state.score);
  elements.bestScoreValue.textContent = String(state.bestScore);
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function setButtonsEnabled(enabled) {
  elements.noteButtons.forEach((button) => {
    button.disabled = !enabled;
    button.classList.toggle("disabled", !enabled);
  });
}

function ensureAudioContext() {
  if (!state.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }
}

function playTone(note) {
  ensureAudioContext();

  const context = state.audioContext;
  const oscillator = context.createOscillator();
  const harmonicOscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = NOTE_CONFIG[note].frequency;
  harmonicOscillator.type = "sine";
  harmonicOscillator.frequency.value = NOTE_CONFIG[note].frequency * 2;

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.34, context.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.48);

  oscillator.connect(gainNode);
  harmonicOscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  harmonicOscillator.start();
  oscillator.stop(context.currentTime + 0.5);
  harmonicOscillator.stop(context.currentTime + 0.5);
}

function playNoteAudio(note) {
  const existingAudio = state.audioCache.get(note);

  if (existingAudio) {
    existingAudio.pause();
    existingAudio.currentTime = 0;
    existingAudio.play().catch(() => {
      playTone(note);
    });
    return;
  }

  const audio = new Audio(NOTE_AUDIO_PATHS[note]);
  audio.preload = "auto";
  state.audioCache.set(note, audio);

  audio.addEventListener("canplaythrough", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {
      playTone(note);
    });
  }, { once: true });

  audio.addEventListener("error", () => {
    state.audioCache.delete(note);
    playTone(note);
  }, { once: true });

  audio.load();
}

function flashButton(note, className = "active") {
  const button = noteButtonsByNote.get(note);
  if (!button) {
    return;
  }

  button.classList.add(className);
  window.setTimeout(() => {
    button.classList.remove(className);
  }, className === "wrong" ? WRONG_FLASH_MS : ACTIVE_FLASH_MS);
}

function randomNote() {
  const index = Math.floor(Math.random() * NOTE_KEYS.length);
  return NOTE_KEYS[index];
}

async function startGame() {
  ensureAudioContext();

  state.sequence = [];
  state.playerSequence = [];
  state.level = 0;
  state.score = 0;
  state.acceptingInput = false;
  state.isPlayingSequence = false;
  state.gameStarted = true;

  syncHud();
  setButtonsEnabled(false);
  setStatus("Memorize a sequência quando ela aparecer.");
  elements.startButton.disabled = true;
  elements.restartButton.disabled = true;

  await sleep(250);
  await nextRound();
}

async function nextRound() {
  state.playerSequence = [];
  state.level += 1;
  state.sequence.push(randomNote());
  syncHud();

  if (state.level > MAX_LEVEL) {
    finishGame(true);
    return;
  }

  setButtonsEnabled(false);
  state.acceptingInput = false;
  state.isPlayingSequence = true;
  setStatus(`Nível ${state.level}: observe a sequência.`);

  await playSequence();

  if (!state.gameStarted) {
    return;
  }

  state.isPlayingSequence = false;
  state.acceptingInput = true;
  setButtonsEnabled(true);
  setStatus("Sua vez: repita a ordem exata.");
}

async function playSequence() {
  for (const note of state.sequence) {
    playNoteAudio(note);
    flashButton(note);
    await sleep(620);
  }

  await sleep(180);
}

function handlePlayerMove(note) {
  if (!state.gameStarted || !state.acceptingInput || state.isPlayingSequence) {
    return;
  }

  state.playerSequence.push(note);
  playNoteAudio(note);
  flashButton(note);

  const currentIndex = state.playerSequence.length - 1;
  const expectedNote = state.sequence[currentIndex];

  if (note !== expectedNote) {
    flashButton(note, "wrong");
    finishGame(false);
    return;
  }

  if (state.playerSequence.length === state.sequence.length) {
    state.acceptingInput = false;
    setButtonsEnabled(false);
    state.score += state.level * 10;
    syncHud();

    if (state.level >= MAX_LEVEL) {
      window.setTimeout(() => finishGame(true), 650);
      return;
    }

    setStatus("Sequência correta. Preparando o próximo nível...");
    window.setTimeout(() => {
      if (state.gameStarted) {
        nextRound();
      }
    }, 900);
    return;
  }

  setStatus(`Correto. Falta ${(state.sequence.length - state.playerSequence.length)} nota(s).`);
}

function finishGame(won) {
  state.gameStarted = false;
  state.acceptingInput = false;
  state.isPlayingSequence = false;
  setButtonsEnabled(false);
  elements.startButton.disabled = false;
  elements.restartButton.disabled = false;

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    localStorage.setItem("genius-musical-best-score", String(state.bestScore));
    elements.bestScoreValue.textContent = String(state.bestScore);
  }

  if (won) {
    setStatus(`Você venceu! Pontuação final: ${state.score}. Clique em Reiniciar para jogar de novo.`);
  } else {
    setStatus(`Game over. Pontuação final: ${state.score}. Clique em Reiniciar para tentar novamente.`);
  }

  elements.gameBoard.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(-3px)" },
      { transform: "translateX(3px)" },
      { transform: "translateX(0)" },
    ],
    {
      duration: 280,
      iterations: 1,
    },
  );
}

init();
