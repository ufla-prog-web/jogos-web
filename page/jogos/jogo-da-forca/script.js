// Lista de palavras que podem ser sorteadas no jogo.
const words = [
  "codigo",
  "bug",
  "dado",
  "rede",
  "site",
  "app",
  "login",
  "variavel",
  "funcao",
  "classe",
  "objeto",
  "metodo",
  "sistema",
  "servidor",
  "cliente",
  "algoritmo",
  "compilador",
  "interface",
  "polimorfismo",
  "encapsulamento",
  "heranca",
  "recursividade",
  "concorrencia",
  "paralelismo",
  "serializacao",
  "abstracao",
  "framework",
  "middleware",
  "criptografia"
];

// Estado principal da partida atual.
let secretWord = "";
let guessedLetters = [];
let wrongLetters = [];
let triesLeft = 6;
let gameOver = false;

// Referências aos elementos da interface no HTML.
const wordEl = document.getElementById("word");
const triesEl = document.getElementById("tries");
const wrongLettersEl = document.getElementById("wrongLetters");
const messageEl = document.getElementById("message");
const letterInput = document.getElementById("letterInput");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");

// Sorteia uma palavra aleatória da lista.
function chooseWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

// Monta e exibe a palavra com letras descobertas e "_" nas ocultas.
function renderWord() {
  const display = secretWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  wordEl.textContent = display;
}

// Atualiza a área de tentativas restantes e letras erradas.
function updateStatus() {
  triesEl.textContent = String(triesLeft);
  wrongLettersEl.textContent = wrongLetters.length ? wrongLetters.join(", ") : "-";
}

// Verifica se o jogador venceu (descobriu todas as letras) ou perdeu.
function checkGameState() {
  const won = secretWord.split("").every((letter) => guessedLetters.includes(letter));

  if (won) {
    messageEl.textContent = "Voce venceu!";
    gameOver = true;
    return;
  }

  if (triesLeft <= 0) {
    messageEl.textContent = `Voce perdeu! Palavra: ${secretWord}`;
    gameOver = true;
  }
}

// Processa uma tentativa do jogador a partir da letra digitada.
function guess() {
  // Ignora qualquer ação quando a partida já terminou.
  if (gameOver) {
    return;
  }

  // Lê a letra, normaliza e limpa o campo para a próxima jogada.
  const letter = letterInput.value.toLowerCase().trim();
  letterInput.value = "";
  letterInput.focus();

  // Valida se foi digitada exatamente uma letra de a-z.
  if (!/^[a-z]$/.test(letter)) {
    messageEl.textContent = "Digite 1 letra (a-z).";
    return;
  }

  // Evita repetir letras já tentadas.
  if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
    messageEl.textContent = "Letra ja tentada.";
    return;
  }

  // Se acertar, guarda em guessedLetters; se errar, reduz tentativas.
  if (secretWord.includes(letter)) {
    guessedLetters.push(letter);
    messageEl.textContent = "Acertou!";
  } else {
    wrongLetters.push(letter);
    triesLeft -= 1;
    messageEl.textContent = "Errou!";
  }

  renderWord();
  updateStatus();
  checkGameState();
}

// Reinicia o jogo para uma nova rodada com estado limpo.
function restart() {
  secretWord = chooseWord();
  guessedLetters = [];
  wrongLetters = [];
  triesLeft = 6;
  gameOver = false;
  messageEl.textContent = "";

  renderWord();
  updateStatus();
  letterInput.value = "";
  letterInput.focus();
}

// Eventos de clique dos botões principais.
guessBtn.addEventListener("click", guess);
restartBtn.addEventListener("click", restart);

// Permite enviar a tentativa pressionando Enter no campo de texto.
letterInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    guess();
  }
});

// Inicia a primeira partida ao carregar a página.
restart();
