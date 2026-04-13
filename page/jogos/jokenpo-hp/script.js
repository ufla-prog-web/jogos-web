// Mapeia as opcoes internas do jogo para os nomes e imagens exibidos na interface.
const choices = {
  pedra: {
    label: "Pedra Filosofal",
    image: "assets/pedra-filosofal.svg"
  },
  papel: {
    label: "Capa da Invisibilidade",
    image: "assets/capa-da-invisibilidade.svg"
  },
  tesoura: {
    label: "Varinha",
    image: "assets/varinha.svg"
  }
};

// Define qual escolha vence qual escolha na logica do jokenpo.
const winningRelations = {
  pedra: "tesoura",
  papel: "pedra",
  tesoura: "papel"
};

// Configuracoes gerais do jogo.
const historyLimit = 5;
const totalWinsKey = "hogwartsTotalWins";
const counterRelations = {
  pedra: "papel",
  papel: "tesoura",
  tesoura: "pedra"
};
const stages = [
  {
    opponent: "Draco Malfoy",
    difficulty: "Aprendiz ambicioso",
    counterChance: 0.24,
    drawChance: 0.26,
    theme: "stage-draco",
    portrait: "assets/draco-malfoy.png"
  },
  {
    opponent: "Harry Potter",
    difficulty: "Duelo equilibrado",
    counterChance: 0.38,
    drawChance: 0.28,
    theme: "stage-harry",
    portrait: "assets/harry-potter.png"
  },
  {
    opponent: "Lord Voldemort",
    difficulty: "Mago das trevas",
    counterChance: 0.56,
    drawChance: 0.24,
    theme: "stage-voldemort",
    portrait: "assets/voldemort.png"
  },
  {
    opponent: "Alvo Dumbledore",
    difficulty: "Boss final",
    counterChance: 0.72,
    drawChance: 0.18,
    theme: "stage-dumbledore",
    portrait: "assets/alvo-dumbledore.png"
  }
];
// Conteudo mostrado no tutorial inicial antes do duelo ser liberado.
const tutorialSteps = [
  {
    title: "Entenda os artefatos",
    text: "Voce podera escolher entre Pedra Filosofal, Capa da Invisibilidade e Varinha. Cada artefato representa uma adaptacao tematica do jokenpo classico."
  },
  {
    title: "Memorize as regras",
    text: "A Pedra Filosofal vence a Varinha, a Varinha vence a Capa da Invisibilidade e a Capa da Invisibilidade vence a Pedra Filosofal."
  },
  {
    title: "Enfrente as quatro fases",
    text: "Voce enfrentara Draco, Harry, Voldemort e por fim Dumbledore. Cada fase e melhor de 3 e os adversarios ficam mais dificeis a cada confronto."
  }
];

// Estado central da aplicacao para controlar placar, rodada e fluxo do tutorial.
const state = {
  playerScore: 0,
  computerScore: 0,
  round: 1,
  stageIndex: 0,
  finished: false,
  history: [],
  gameStarted: false,
  tutorialStep: 0
};

// Referencias para os elementos do HTML usados durante a partida.
const elements = {
  pageShell: document.querySelector(".page-shell"),
  playerScore: document.getElementById("player-score"),
  computerScore: document.getElementById("computer-score"),
  roundCounter: document.getElementById("round-counter"),
  totalWins: document.getElementById("total-wins"),
  playerChoice: document.getElementById("player-choice"),
  computerChoice: document.getElementById("computer-choice"),
  playerIcon: document.getElementById("player-icon"),
  computerIcon: document.getElementById("computer-icon"),
  roundResult: document.getElementById("round-result"),
  roundDetail: document.getElementById("round-detail"),
  historyList: document.getElementById("history-list"),
  finalBanner: document.getElementById("final-banner"),
  finalMessage: document.getElementById("final-message"),
  finalDetail: document.getElementById("final-detail"),
  continueButton: document.getElementById("continue-button"),
  resetButton: document.getElementById("reset-button"),
  resetStatsButton: document.getElementById("reset-stats-button"),
  playerDisplay: document.getElementById("player-display"),
  computerDisplay: document.getElementById("computer-display"),
  choiceButtons: Array.from(document.querySelectorAll(".choice-card")),
  choiceGrid: document.getElementById("choice-grid"),
  introPanel: document.getElementById("intro-panel"),
  startStage: document.getElementById("start-stage"),
  tutorialStage: document.getElementById("tutorial-stage"),
  startButton: document.getElementById("start-button"),
  tutorialNext: document.getElementById("tutorial-next"),
  tutorialSkip: document.getElementById("tutorial-skip"),
  tutorialTitle: document.getElementById("tutorial-title"),
  tutorialText: document.getElementById("tutorial-text"),
  tutorialProgress: document.getElementById("tutorial-progress"),
  stageCounter: document.getElementById("stage-counter"),
  currentOpponent: document.getElementById("current-opponent"),
  opponentDisplayName: document.getElementById("opponent-display-name"),
  campaignItems: Array.from(document.querySelectorAll("#campaign-list li"))
};

// Carrega do localStorage o total acumulado de vitorias do jogador.
function loadTotalWins() {
  const savedWins = Number(localStorage.getItem(totalWinsKey));
  return Number.isNaN(savedWins) ? 0 : savedWins;
}

// Salva no navegador o total de vitorias acumuladas.
function saveTotalWins(totalWins) {
  localStorage.setItem(totalWinsKey, String(totalWins));
}

// Limpa a estatistica persistida para comecar uma apresentacao do zero.
function resetTotalWins() {
  localStorage.removeItem(totalWinsKey);
  updateTotalWinsDisplay(0);
}

// Define o oponente atual da campanha com base na fase.
function getCurrentStage() {
  return stages[state.stageIndex];
}

// Sorteia a jogada do oponente com dificuldade crescente a cada fase.
function getOpponentChoice(playerChoice) {
  const stage = getCurrentStage();
  const roll = Math.random();

  if (roll < stage.counterChance) {
    return counterRelations[playerChoice];
  }

  if (roll < stage.counterChance + stage.drawChance) {
    return playerChoice;
  }

  return winningRelations[playerChoice];
}

// Compara as jogadas da rodada e devolve o resultado completo da disputa.
function getRoundOutcome(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return {
      winner: "draw",
      title: "Empate magico!",
      detail: "Os dois artefatos colidiram com a mesma intensidade. O duelo permanece equilibrado."
    };
  }

  if (winningRelations[playerChoice] === computerChoice) {
    return {
      winner: "player",
      title: buildVictoryMessage(playerChoice, computerChoice),
      detail: "Voce dominou a rodada e fortaleceu sua casa no confronto bruxo."
    };
  }

  return {
    winner: "computer",
    title: buildVictoryMessage(computerChoice, playerChoice),
    detail: `${getCurrentStage().opponent} triunfou nesta rodada e tornou o duelo ainda mais perigoso.`
  };
}

// Gera frases tematicas de acordo com a combinacao vencedora.
function buildVictoryMessage(winnerChoice, loserChoice) {
  if (winnerChoice === "pedra" && loserChoice === "tesoura") {
    return "A Pedra Filosofal superou a Varinha!";
  }

  if (winnerChoice === "tesoura" && loserChoice === "papel") {
    return "A Varinha atravessou os misterios da Capa da Invisibilidade!";
  }

  return "A Capa da Invisibilidade ocultou o poder da Pedra Filosofal!";
}

// Atualiza os valores do placar principal na tela.
function updateScoreboard() {
  elements.playerScore.textContent = state.playerScore;
  elements.computerScore.textContent = state.computerScore;
  elements.roundCounter.textContent = state.round;
}

// Atualiza o painel da campanha com a fase atual, nome do oponente e progresso visual.
function updateStageUI() {
  const stage = getCurrentStage();
  elements.pageShell.classList.remove("stage-draco", "stage-harry", "stage-voldemort", "stage-dumbledore");
  elements.pageShell.classList.add(stage.theme);
  elements.stageCounter.textContent = `${state.stageIndex + 1} / ${stages.length}`;
  elements.currentOpponent.textContent = stage.opponent;
  elements.opponentDisplayName.textContent = stage.opponent;
  elements.computerIcon.innerHTML = `<img src="${stage.portrait}" alt="${stage.opponent}">`;

  elements.campaignItems.forEach((item, index) => {
    item.classList.remove("active", "completed", "boss");

    if (index < state.stageIndex) {
      item.classList.add("completed");
    }

    if (index === state.stageIndex) {
      item.classList.add("active");
    }

    if (index === stages.length - 1) {
      item.classList.add("boss");
    }
  });
}

// Atualiza apenas a area de vitorias totais salvas no navegador.
function updateTotalWinsDisplay(totalWins) {
  elements.totalWins.textContent = totalWins;
}

// Mostra na camara do duelo quais artefatos foram escolhidos.
function renderChoices(playerChoice, computerChoice) {
  const playerData = choices[playerChoice];
  const computerData = choices[computerChoice];

  elements.playerChoice.textContent = playerData.label;
  elements.computerChoice.textContent = computerData.label;
  elements.playerIcon.innerHTML = `<img src="${playerData.image}" alt="${playerData.label}">`;
  elements.computerIcon.innerHTML = `<img src="${computerData.image}" alt="${computerData.label}">`;
  elements.playerDisplay.classList.add("active");
  elements.computerDisplay.classList.add("active");
}

// Remove destaques visuais antigos antes de pintar a rodada atual.
function clearCardStates() {
  elements.playerDisplay.classList.remove("victory", "defeat");
  elements.computerDisplay.classList.remove("victory", "defeat");

  elements.choiceButtons.forEach((button) => {
    button.classList.remove("selected", "winner", "loser");
  });
}

// Destaca a carta escolhida e o lado vencedor do confronto.
function highlightRound(playerChoice, computerChoice, outcome) {
  clearCardStates();

  const selectedButton = elements.choiceButtons.find((button) => button.dataset.choice === playerChoice);
  if (selectedButton) {
    selectedButton.classList.add("selected");
  }

  if (outcome.winner === "player") {
    elements.playerDisplay.classList.add("victory");
    elements.computerDisplay.classList.add("defeat");
    if (selectedButton) {
      selectedButton.classList.add("winner");
    }
  } else if (outcome.winner === "computer") {
    elements.playerDisplay.classList.add("defeat");
    elements.computerDisplay.classList.add("victory");
    if (selectedButton) {
      selectedButton.classList.add("loser");
    }
  }
}

// Mantem um historico curto com as ultimas rodadas jogadas.
function updateHistory(playerChoice, computerChoice, outcome) {
  const historyText = `Rodada ${state.round}: ${choices[playerChoice].label} x ${choices[computerChoice].label} - ${outcome.title}`;
  state.history.unshift(historyText);
  state.history = state.history.slice(0, historyLimit);

  elements.historyList.innerHTML = "";
  state.history.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    elements.historyList.appendChild(listItem);
  });
}

// Encerra a partida quando alguem alcanca duas vitorias.
function finishMatch(winner) {
  const stage = getCurrentStage();
  state.finished = true;
  elements.finalBanner.classList.remove("hidden");
  elements.continueButton.classList.add("hidden");

  if (winner === "player") {
    if (state.stageIndex === stages.length - 1) {
      const totalWins = loadTotalWins() + 1;
      saveTotalWins(totalWins);
      updateTotalWinsDisplay(totalWins);
      elements.finalMessage.textContent = "Voce derrotou Dumbledore e venceu a campanha de Hogwarts!";
      elements.finalDetail.textContent = "Seu nome entrou para a historia do castelo. Reinicie a jornada para enfrentar todos novamente.";
    } else {
      const nextStage = stages[state.stageIndex + 1];
      elements.finalMessage.textContent = `Voce superou ${stage.opponent}!`;
      elements.finalDetail.textContent = `A proxima fase sera contra ${nextStage.opponent}. Cada duelo agora sera mais dificil.`;
      elements.continueButton.textContent = `Avancar para ${nextStage.opponent}`;
      elements.continueButton.classList.remove("hidden");
    }
  } else {
    elements.finalMessage.textContent = `${stage.opponent} venceu esta fase.`;
    elements.finalDetail.textContent = "Sua campanha foi interrompida. Reinicie a jornada para tentar novamente desde Draco.";
  }

  elements.roundDetail.textContent = "A fase foi encerrada. Escolha seu proximo passo para continuar a campanha.";
  toggleChoiceButtons(true);
}

// Bloqueia ou libera as cartas jogaveis conforme o estado do jogo.
function toggleChoiceButtons(disabled) {
  elements.choiceButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

// Atualiza o painel do tutorial com o passo atual.
function updateTutorialContent() {
  const step = tutorialSteps[state.tutorialStep];
  elements.tutorialTitle.textContent = step.title;
  elements.tutorialText.textContent = step.text;
  elements.tutorialProgress.textContent = `Passo ${state.tutorialStep + 1} de ${tutorialSteps.length}`;
  elements.tutorialNext.textContent = state.tutorialStep === tutorialSteps.length - 1 ? "Comecar partida" : "Proximo passo";
}

// Libera a partida depois que o tutorial termina ou e pulado.
function unlockGame() {
  state.gameStarted = true;
  elements.introPanel.classList.add("hidden");
  elements.choiceGrid.classList.remove("locked");
  toggleChoiceButtons(false);
  updateStageUI();
  elements.roundResult.textContent = `A primeira fase comeca contra ${getCurrentStage().opponent}.`;
  elements.roundDetail.textContent = `${getCurrentStage().difficulty}. Escolha seu artefato para iniciar a campanha.`;
}

// Troca a tela inicial pelo tutorial.
function openTutorial() {
  state.gameStarted = false;
  state.tutorialStep = 0;
  elements.startStage.classList.add("hidden");
  elements.tutorialStage.classList.remove("hidden");
  updateTutorialContent();
}

// Avanca o tutorial ate o passo final, quando o jogo e desbloqueado.
function advanceTutorial() {
  if (state.tutorialStep === tutorialSteps.length - 1) {
    unlockGame();
    return;
  }

  state.tutorialStep += 1;
  updateTutorialContent();
}

// Executa uma rodada completa depois da escolha do jogador.
function playRound(playerChoice) {
  if (state.finished || !state.gameStarted) {
    return;
  }

  const stage = getCurrentStage();
  const computerChoice = getOpponentChoice(playerChoice);
  const outcome = getRoundOutcome(playerChoice, computerChoice);

  renderChoices(playerChoice, computerChoice);
  highlightRound(playerChoice, computerChoice, outcome);

  elements.roundResult.textContent = outcome.title;
  elements.roundDetail.textContent = outcome.detail;

  if (outcome.winner === "player") {
    state.playerScore += 1;
  } else if (outcome.winner === "computer") {
    state.computerScore += 1;
  }

  updateScoreboard();
  updateHistory(playerChoice, computerChoice, outcome);

  if (state.playerScore === 2) {
    finishMatch("player");
    return;
  }

  if (state.computerScore === 2) {
    finishMatch("computer");
    return;
  }

  state.round += 1;
  updateScoreboard();
  elements.roundDetail.textContent = `${outcome.detail} ${stage.opponent} continua pressionando. O duelo segue para a rodada ${state.round}.`;
}

// Reseta apenas a fase atual para preparar o proximo oponente da campanha.
function prepareStage() {
  state.playerScore = 0;
  state.computerScore = 0;
  state.round = 1;
  state.finished = false;

  elements.playerChoice.textContent = "Aguardando escolha";
  elements.computerChoice.textContent = "Aguardando escolha";
  elements.playerIcon.textContent = "?";
  elements.finalBanner.classList.add("hidden");
  elements.continueButton.classList.add("hidden");
  elements.finalMessage.textContent = "Prepare-se para a proxima fase!";
  elements.finalDetail.textContent = "A jornada continua no grande salao.";

  clearCardStates();
  elements.playerDisplay.classList.remove("active");
  elements.computerDisplay.classList.remove("active");
  updateScoreboard();
  updateStageUI();
}

// Avanca para a proxima fase da campanha mantendo o fluxo fora do tutorial.
function advanceStage() {
  if (state.stageIndex >= stages.length - 1) {
    return;
  }

  state.stageIndex += 1;
  state.history = [];
  elements.historyList.innerHTML = "<li>Uma nova fase comeca. O grimorio registra um novo oponente.</li>";
  prepareStage();
  elements.roundResult.textContent = `Nova fase: ${getCurrentStage().opponent} entrou no duelo.`;
  elements.roundDetail.textContent = `${getCurrentStage().difficulty}. Escolha seu artefato para continuar a campanha.`;
  toggleChoiceButtons(false);
}

// Restaura todos os estados visuais e logicos para iniciar uma nova campanha.
function resetGame() {
  state.stageIndex = 0;
  state.history = [];
  state.gameStarted = false;
  state.tutorialStep = 0;

  prepareStage();
  elements.roundResult.textContent = "A campanha comeca apos o ritual de abertura.";
  elements.roundDetail.textContent = "Pressione iniciar duelo e percorra o tutorial para liberar as fases.";
  elements.historyList.innerHTML = "<li>As paginas do grimorio ainda estao em branco.</li>";
  elements.introPanel.classList.remove("hidden");
  elements.startStage.classList.remove("hidden");
  elements.tutorialStage.classList.add("hidden");
  elements.choiceGrid.classList.add("locked");
  toggleChoiceButtons(true);
}

// Liga os eventos de clique dos botoes e cartas.
function attachEvents() {
  elements.choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      playRound(button.dataset.choice);
    });
  });

  elements.resetButton.addEventListener("click", resetGame);
  elements.resetStatsButton.addEventListener("click", resetTotalWins);
  elements.continueButton.addEventListener("click", advanceStage);
  elements.startButton.addEventListener("click", openTutorial);
  elements.tutorialNext.addEventListener("click", advanceTutorial);
  elements.tutorialSkip.addEventListener("click", unlockGame);
}

// Ponto de entrada da aplicacao: prepara placar, bloqueia cartas e registra eventos.
function init() {
  prepareStage();
  updateTotalWinsDisplay(loadTotalWins());
  elements.choiceGrid.classList.add("locked");
  toggleChoiceButtons(true);
  attachEvents();
}

init();
