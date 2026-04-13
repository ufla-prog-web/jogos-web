const CASES = [
  {
    id: "ARQ-203",
    title: "Eventos estranhos no Hospital Saint Mercy",
    location: "Hospital Saint Mercy",
    description:
      "Uma enfermaria desativada voltou a registrar ruídos, quedas de energia e desmaios. Nenhuma câmera conseguiu manter gravação contínua por mais de alguns minutos naquele corredor.",
    clues: [
      "Equipamentos eletrônicos da ala desativada falham sempre no mesmo horário, apesar de não haver problema na rede elétrica do hospital.",
      "Pacientes internados em setores próximos relatam sensação repentina de medo e um frio incomum ao passar pelo corredor interditado.",
      "Funcionários afirmam ouvir objetos sendo arrastados e sussurros vindos de quartos vazios, especialmente quando mencionam uma antiga paciente.",
      "Sal grosso espalhado na entrada de um dos quartos interrompeu as manifestações por algumas horas."
    ],
    monster: "Fantasma",
    weapon: "Sal e queima dos restos mortais"
  },
  {
    id: "ARQ-204",
    title: "Sombras na Floresta Black Pine",
    location: "Reserva Black Pine",
    description:
      "Três campistas desapareceram em menos de duas semanas. Equipes de busca encontraram apenas barracas rasgadas, marcas profundas em árvores e trilhas que terminavam abruptamente no meio da mata.",
    clues: [
      "As vítimas desapareceram longe das trilhas principais, e nenhuma delas conseguiu fazer uma ligação ou pedido de socorro antes de sumir.",
      "Equipes de busca encontraram marcas profundas em árvores altas demais para terem sido feitas por um animal comum da região.",
      "Um sobrevivente relatou ter ouvido estalos e passos rápidos circulando o acampamento, mas nunca conseguiu ver claramente o que o perseguia.",
      "Os ataques acontecem em áreas isoladas da floresta, e relatos antigos da região dizem que a criatura teme fogo."
    ],
    monster: "Wendigo",
    weapon: "Fogo"
  },
  {
    id: "ARQ-205",
    title: "O homem no Hotel Redwood",
    location: "Hotel Redwood",
    description:
      "Hóspedes afirmam ter visto conhecidos agindo de forma cruel e completamente fora do normal. Em dois casos, a pessoa vista em um corredor apareceu, ao mesmo tempo, em outro ponto do prédio.",
    clues: [
      "Testemunhas juram ter encontrado familiares ou conhecidos no hotel, embora essas pessoas comprovadamente estivessem em outros lugares naquele momento.",
      "Os relatos descrevem pequenos detalhes errados na aparência dos suspeitos, como jeito de andar, voz ou comportamento frio demais.",
      "Resíduos estranhos semelhantes a pele descartada foram encontrados perto das saídas de ar do prédio.",
      "Uma faca de prata deixada no quarto de uma vítima pareceu assustar a criatura antes de ela fugir."
    ],
    monster: "Metamorfo",
    weapon: "Prata"
  },
  {
    id: "ARQ-206",
    title: "Caos na Rodovia 19",
    location: "Rodovia 19, saída de Cold Creek",
    description:
      "Motoristas relatam uma mulher pedindo carona na beira da estrada. Horas depois, os condutores sofrem acidentes violentos no mesmo trecho onde a passageira desapareceu do banco traseiro.",
    clues: [
      "Todos os acidentes ocorreram depois que os motoristas disseram ter visto uma mulher sozinha na estrada durante a madrugada.",
      "Os veículos envolvidos apresentam marcas de umidade e lama, mesmo em noites secas e sem passagem por áreas alagadas.",
      "Sobreviventes afirmam que a passageira desapareceu sem abrir a porta do carro, pouco antes do acidente.",
      "Pesquisas antigas indicam que uma mulher morreu afogada perto dali, e círculos de sal dificultaram novas aparições no acostamento."
    ],
    monster: "Fantasma",
    weapon: "Sal e queima dos restos mortais"
  },
  {
    id: "ARQ-207",
    title: "A Casa Harlow",
    location: "Casa Harlow, periferia de Briar Falls",
    description:
      "Moradores vizinhos ouviram gritos em latim, viram velas acesas em janelas lacradas e relataram comportamento violento e súbito em membros da mesma família.",
    clues: [
      "Os moradores da casa passaram a apresentar mudanças bruscas de personalidade, crises de violência e conhecimento de fatos que não poderiam saber.",
      "Símbolos religiosos foram danificados ou queimados sem explicação, e a família se recusa a entrar em certos cômodos da casa.",
      "Vizinhos ouviram frases em latim e gritos vindos do porão durante a madrugada, mesmo quando todos juravam estar dormindo.",
      "Um dos afetados reagiu de forma extrema à água benta e ao início de um ritual de exorcismo."
    ],
    monster: "Demônio",
    weapon: "Faca demoníaca"
  },
  {
    id: "ARQ-208",
    title: "Mortes no vestiário de Grayford High",
    location: "Escola Grayford High",
    description:
      "Dois atletas foram encontrados mortos após o treino noturno. Não havia sinais de luta, apenas grande perda de sangue e marcas incomuns no pescoço.",
    clues: [
      "As vítimas pareciam saudáveis poucas horas antes da morte, mas foram encontradas extremamente pálidas e sem sinais de confronto.",
      "Não havia sangue suficiente na cena para explicar o estado dos corpos, como se parte dele tivesse sido retirada de propósito.",
      "Colegas disseram que um novo grupo de estudantes evita atividades ao ar livre durante o dia e nunca aparece na cantina.",
      "As marcas no pescoço e a necessidade de eliminar a criatura com decapitação apontam para predadores bem conhecidos entre caçadores."
    ],
    monster: "Vampiro",
    weapon: "Decapitação"
  },
  {
    id: "ARQ-209",
    title: "Noites em Miller's Farm",
    location: "Fazenda Miller",
    description:
      "Animais começaram a aparecer mutilados e, poucos dias depois, moradores da região foram atacados perto dos celeiros. Os sobreviventes relatam não se lembrar do que aconteceu durante a noite.",
    clues: [
      "Os ataques ocorrem sempre à noite, e algumas vítimas relatam apagões de memória nas horas que antecedem o incidente.",
      "Roupas rasgadas e marcas de sangue foram encontradas espalhadas pelo campo sem que nenhum corpo estivesse por perto.",
      "A violência dos ataques aumenta em noites próximas à lua cheia, e moradores da região passaram a esconder ferimentos recentes.",
      "Armas comuns não causaram efeito duradouro, mas projéteis de prata são mencionados em registros antigos sobre a criatura."
    ],
    monster: "Lobisomem",
    weapon: "Prata"
  },
  {
    id: "ARQ-210",
    title: "O Quarto 714",
    location: "Hotel Ashbury",
    description:
      "Hóspedes que dormem no quarto 714 entram em coma ou desaparecem durante a madrugada. Os poucos que acordaram descrevem uma realidade perfeita demais para ser verdadeira.",
    clues: [
      "As vítimas não apresentam sinais de luta, apenas um estado de inconsciência profunda e incomum.",
      "Sobreviventes relatam sonhos extremamente realistas nos quais conseguem viver versões ideais de suas próprias vidas.",
      "Os afetados parecem definhar lentamente enquanto permanecem presos nesse estado, como se algo estivesse se alimentando deles.",
      "Registros de caçadores descrevem uma criatura que induz ilusões e pode ser morta com uma lâmina de prata."
    ],
    monster: "Djinn",
    weapon: "Lâmina de prata"
  },
  {
    id: "ARQ-211",
    title: "Canções em Hollow Creek",
    location: "Igreja de Hollow Creek",
    description:
      "O coral da igreja passou a ouvir uma voz adicional durante ensaios noturnos. Desde então, moradores começaram a confessar crimes antigos e depois tiraram a própria vida.",
    clues: [
      "Moradores da cidade passaram a ter episódios intensos de culpa, paranoia e colapsos emocionais sem causa médica aparente.",
      "Durante ensaios noturnos, membros do coral juram ouvir uma voz extra nas músicas, embora ninguém consiga identificar sua origem.",
      "Símbolos estranhos foram encontrados entalhados sob bancos e perto do altar, escondidos da vista dos fiéis.",
      "Água benta, símbolos de proteção e um ritual em latim provocaram reação imediata da entidade."
    ],
    monster: "Demônio",
    weapon: "Faca demoníaca"
  },
  {
    id: "ARQ-212",
    title: "Desaparecimentos no Lago Wren",
    location: "Lago Wren",
    description:
      "Pescadores e casais desaparecem perto do píer principal. Testemunhas juram ter visto uma mulher de vestido antigo surgindo da água e chamando homens pelo nome.",
    clues: [
      "Os desaparecimentos acontecem próximos ao lago, sempre em horários de pouco movimento e sem sinais claros de luta.",
      "Objetos das vítimas reaparecem dias depois cobertos de lama escura e vegetação do fundo da água.",
      "Testemunhas relatam ter visto uma mulher com roupas antigas à margem do lago, embora nenhuma pegada permaneça no local.",
      "Pesquisas locais apontam para uma morte violenta ocorrida ali décadas atrás, e linhas de sal no píer reduziram as manifestações."
    ],
    monster: "Fantasma",
    weapon: "Sal e queima dos restos mortais"
  }
];

const MONSTER_ICONS = {
  "Fantasma": "👻",
  "Wendigo": "🔥",
  "Metamorfo": "🪞",
  "Demônio": "😈",
  "Vampiro": "🩸",
  "Lobisomem": "🐺",
  "Djinn": "🌀"
};

const WEAPON_ICONS = {
  "Sal e queima dos restos mortais": "⚱️",
  "Fogo": "🔥",
  "Prata": "🥈",
  "Faca demoníaca": "🔯",
  "Decapitação": "🪓",
  "Lâmina de prata": "🗡️"
};

const MONSTERS = [...new Set(CASES.map((gameCase) => gameCase.monster))].map((name) => ({
  name,
  icon: MONSTER_ICONS[name] || "✦"
}));

const WEAPONS = [...new Set(CASES.map((gameCase) => gameCase.weapon))].map((name) => ({
  name,
  icon: WEAPON_ICONS[name] || "✦"
}));

const HUNTER_MANUAL = [
  {
    title: "Fantasma",
    weakness: "Sal e queima dos restos mortais",
    note: "Espíritos presos a traumas, mortes violentas ou assuntos inacabados. Costumam causar frio intenso, interferência elétrica, movimentação de objetos e aparições breves ligadas ao local ou à pessoa assombrada."
  },
  {
    title: "Wendigo",
    weakness: "Fogo",
    note: "Predador canibal associado a florestas e regiões isoladas. Age com grande velocidade, força incomum, hábitos noturnos e costuma arrastar vítimas para longe antes de se alimentar."
  },
  {
    title: "Metamorfo",
    weakness: "Prata",
    note: "Criatura capaz de copiar perfeitamente a aparência humana, embora costume falhar em detalhes de comportamento, memória ou rotina. A troca de forma pode deixar resíduos biológicos, como pele descartada."
  },
  {
    title: "Demônio",
    weakness: "Faca demoníaca",
    note: "Entidade infernal ligada a possessões, força anormal, conhecimento impossível e comportamento violento. Água benta, símbolos sagrados, latim e armadilhas do diabo costumam revelar ou conter a manifestação."
  },
  {
    title: "Vampiro",
    weakness: "Decapitação",
    note: "Predador que se alimenta de sangue e costuma agir em grupo ou manter ninhos. As vítimas aparecem pálidas, exauridas e com marcas de mordida."
  },
  {
    title: "Lobisomem",
    weakness: "Prata",
    note: "Criatura ligada a transformações periódicas, surtos de violência e lapsos de memória. Os ataques geralmente ocorrem à noite e deixam ferimentos brutais, enquanto armas comuns têm pouca eficácia."
  },
  {
    title: "Djinn",
    weakness: "Lâmina de prata",
    note: "Criatura que imobiliza a vítima e a aprisiona em uma ilusão profundamente desejada, enquanto drena sua vitalidade no mundo real. Casos costumam envolver coma, desaparecimento ou comportamento catatônico."
  }
];

const STORAGE_KEY = "cacadaSobrenaturalSolvedCount";
const SCORE_STORAGE_KEY = "cacadaSobrenaturalTotalScore";
const SOLVED_CASES_STORAGE_KEY = "cacadaSobrenaturalSolvedCases";

const state = {
  currentCase: null,
  selectedMonster: "",
  selectedWeapon: "",
  solvedCount: 0,
  totalScore: 0,
  roundScore: 0,
  solvedCaseCodes: [],
  revealedClues: 0,
  failedAttempts: 0,
  feedback: "",
  status: "idle"
};

const elements = {
  startButton: document.getElementById("start-button"),
  headerRestartButton: document.getElementById("header-restart-button"),
  tutorialPanel: document.getElementById("tutorial-panel"),
  tutorialStartButton: document.getElementById("tutorial-start-button"),
  gameBoard: document.getElementById("game-board"),
  solvedCount: document.getElementById("solved-count"),
  scoreCount: document.getElementById("score-count"),
  caseCode: document.getElementById("case-code"),
  caseTitle: document.getElementById("case-title"),
  caseDescription: document.getElementById("case-description"),
  caseLocation: document.getElementById("case-location"),
  phaseLabel: document.getElementById("phase-label"),
  historyLog: document.getElementById("history-log"),
  cluesContainer: document.getElementById("clues-container"),
  clueCounter: document.getElementById("clue-counter"),
  monsterOptions: document.getElementById("monster-options"),
  weaponOptions: document.getElementById("weapon-options"),
  checkButton: document.getElementById("check-button"),
  restartButton: document.getElementById("restart-button"),
  attemptFeedback: document.getElementById("attempt-feedback"),
  mistakeOverlay: document.getElementById("mistake-overlay"),
  mistakeMessage: document.getElementById("mistake-message"),
  mistakeContinueButton: document.getElementById("mistake-continue-button"),
  campaignOverlay: document.getElementById("campaign-overlay"),
  campaignStamp: document.getElementById("campaign-stamp"),
  campaignTitle: document.getElementById("campaign-title"),
  campaignMessage: document.getElementById("campaign-message"),
  campaignSolvedCount: document.getElementById("campaign-solved-count"),
  campaignScoreCount: document.getElementById("campaign-score-count"),
  campaignRestartButton: document.getElementById("campaign-restart-button"),
  resultPanel: document.getElementById("result-panel"),
  resultStamp: document.getElementById("result-stamp"),
  resultTitle: document.getElementById("result-title"),
  resultMessage: document.getElementById("result-message"),
  playerDecision: document.getElementById("player-decision"),
  roundScore: document.getElementById("round-score"),
  manualContent: document.getElementById("manual-content")
};

function init() {
  // Restaura a estatística persistida e prepara a interface inicial.
  loadSolvedCount();
  loadTotalScore();
  loadSolvedCases();
  updateSolvedCountDisplay();
  updateTotalScoreDisplay();
  bindEvents();
  renderManual();
}

function bindEvents() {
  elements.startButton.addEventListener("click", showTutorial);
  elements.headerRestartButton.addEventListener("click", resetCampaign);
  elements.tutorialStartButton.addEventListener("click", startGame);
  elements.checkButton.addEventListener("click", verifyResult);
  elements.restartButton.addEventListener("click", restartGame);
  elements.mistakeContinueButton.addEventListener("click", continueAfterMistake);
  elements.campaignRestartButton.addEventListener("click", resetCampaign);
}

function loadSolvedCount() {
  const savedValue = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
  state.solvedCount = Number.isNaN(savedValue) ? 0 : savedValue;
}

function updateSolvedCountDisplay() {
  elements.solvedCount.textContent = String(state.solvedCount);
}

function loadTotalScore() {
  const savedValue = Number.parseInt(localStorage.getItem(SCORE_STORAGE_KEY), 10);
  state.totalScore = Number.isNaN(savedValue) ? 0 : savedValue;
}

function updateTotalScoreDisplay() {
  elements.scoreCount.textContent = String(state.totalScore);
}

function loadSolvedCases() {
  const savedValue = localStorage.getItem(SOLVED_CASES_STORAGE_KEY);
  state.solvedCaseCodes = savedValue ? JSON.parse(savedValue) : [];
}

function saveSolvedCases() {
  localStorage.setItem(SOLVED_CASES_STORAGE_KEY, JSON.stringify(state.solvedCaseCodes));
}

function startGame() {
  resetSelections();
  state.currentCase = drawCase();
  state.roundScore = 0;
  state.failedAttempts = 0;
  elements.startButton.disabled = true;
  elements.headerRestartButton.disabled = false;

  elements.tutorialPanel.classList.add("hidden");
  elements.gameBoard.classList.remove("hidden");
  elements.resultPanel.classList.add("hidden");
  elements.mistakeOverlay.classList.add("hidden");
  elements.campaignOverlay.classList.add("hidden");
  elements.resultPanel.classList.remove("success", "failure");

  if (!state.currentCase) {
    state.status = "completed";
    state.revealedClues = 0;
    renderFeedback("success");
    updatePhase("Arquivo concluído");
    elements.checkButton.disabled = true;
    openCampaignCompletionModal();
    elements.gameBoard.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  state.status = "investigating";
  state.revealedClues = 1;
  state.feedback = "Monte sua primeira hipótese. Se errar, uma nova pista será revelada.";

  renderCase();
  renderClues();
  renderOptions();
  renderHistory();
  renderFeedback("warning");
  updatePhase("Investigação em andamento");
  updateCheckButtonState();

  // Leva o usuário ao dossiê assim que a investigação começa.
  elements.gameBoard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showTutorial() {
  state.status = "tutorial";
  elements.gameBoard.classList.add("hidden");
  elements.resultPanel.classList.add("hidden");
  elements.tutorialPanel.classList.remove("hidden");
  elements.tutorialPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showHomeScreen() {
  state.status = "idle";
  state.currentCase = null;
  elements.gameBoard.classList.add("hidden");
  elements.resultPanel.classList.add("hidden");
  elements.tutorialPanel.classList.add("hidden");
  elements.mistakeOverlay.classList.add("hidden");
  elements.campaignOverlay.classList.add("hidden");
}

function drawCase() {
  const availableCases = CASES.filter((gameCase) => !state.solvedCaseCodes.includes(gameCase.id));
  if (availableCases.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * availableCases.length);
  return availableCases[randomIndex];
}

function renderCase() {
  const currentCase = state.currentCase;
  elements.caseCode.textContent = currentCase.id;
  elements.caseTitle.textContent = currentCase.title;
  elements.caseDescription.textContent = currentCase.description;
  elements.caseLocation.textContent = currentCase.location;
}



function renderClues() {
  elements.cluesContainer.innerHTML = "";
  elements.clueCounter.textContent = `${state.revealedClues}/${state.currentCase.clues.length} pistas liberadas`;

  state.currentCase.clues.slice(0, state.revealedClues).forEach((clue, index) => {
    const clueCard = document.createElement("article");
    clueCard.className = "clue-card";
    clueCard.style.animationDelay = `${index * 110}ms`;
    clueCard.innerHTML = `<strong>Pista ${index + 1}</strong><p>${clue}</p>`;
    elements.cluesContainer.appendChild(clueCard);
  });

  if (state.revealedClues < state.currentCase.clues.length) {
    const remainingClues = state.currentCase.clues.length - state.revealedClues;
    const placeholder = document.createElement("article");
    placeholder.className = "clue-placeholder";
    placeholder.innerHTML = `<strong>Arquivo parcialmente selado.</strong><p>${remainingClues} pista(s) ainda permanecem bloqueadas e serão liberadas se a hipótese atual falhar.</p>`;
    elements.cluesContainer.appendChild(placeholder);
  }
}

function renderOptions() {
  createOptionButtons(elements.monsterOptions, MONSTERS, state.selectedMonster, registerMonsterChoice);
  createOptionButtons(elements.weaponOptions, WEAPONS, state.selectedWeapon, registerWeaponChoice);
}

function createOptionButtons(container, options, selectedValue, onSelect) {
  container.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `option-button${selectedValue === option.name ? " selected" : ""}`;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(selectedValue === option.name));
    button.innerHTML = `
      <span class="icon" aria-hidden="true">${option.icon}</span>
      <span>${option.name}</span>
    `;
    button.addEventListener("click", () => onSelect(option.name));
    container.appendChild(button);
  });
}

function registerMonsterChoice(monster) {
  state.selectedMonster = monster;
  renderOptions();
  renderHistory();
  updatePhase(state.selectedWeapon ? "Hipóteses completas" : "Criatura selecionada");
  updateCheckButtonState();
}

function registerWeaponChoice(weapon) {
  state.selectedWeapon = weapon;
  renderOptions();
  renderHistory();
  updatePhase(state.selectedMonster ? "Hipóteses completas" : "Forma de combate selecionada");
  updateCheckButtonState();
}

function updateCheckButtonState() {
  const isReady = Boolean(state.selectedMonster && state.selectedWeapon);
  elements.checkButton.disabled = !isReady;
}

function renderHistory() {
  if (!state.currentCase) {
    const entries = [
      "Todos os casos disponiveis foram resolvidos.",
      `Casos resolvidos neste dossiê: ${state.solvedCaseCodes.length}.`,
      `Pontuacao total: ${state.totalScore}.`
    ];
    elements.historyLog.innerHTML = entries.map((entry) => `<li>${entry}</li>`).join("");
    return;
  }

  const entries = [
    "Um novo caso sobrenatural surgiu.",
    `Pistas liberadas até agora: ${state.revealedClues} de ${state.currentCase.clues.length}.`,
    state.failedAttempts > 0
      ? `Hipóteses incorretas registradas: ${state.failedAttempts}.`
      : "Nenhuma hipótese incorreta foi registrada até o momento.",
    state.selectedMonster
      ? `Criatura suspeita registrada: ${state.selectedMonster}.`
      : "Nenhuma criatura foi marcada como suspeita até o momento.",
    state.selectedWeapon
      ? `Forma de combate escolhida: ${state.selectedWeapon}.`
      : "Nenhuma forma de combate foi definida para o confronto."
  ];

  elements.historyLog.innerHTML = entries.map((entry) => `<li>${entry}</li>`).join("");
}

function updatePhase(text) {
  elements.phaseLabel.textContent = text;
}

function renderFeedback(type = "warning") {
  elements.attemptFeedback.className = `attempt-feedback ${type}`;
  elements.attemptFeedback.textContent = state.feedback;
}

function calculateRoundScore() {
  const totalClues = state.currentCase.clues.length;
  const remainingWeight = totalClues - state.revealedClues;
  return 25 + remainingWeight * 25;
}

function verifyResult() {
  // A vitória só acontece quando criatura e forma de combate correspondem ao caso sorteado.
  const currentCase = state.currentCase;
  const correctMonster = state.selectedMonster === currentCase.monster;
  const correctWeapon = state.selectedWeapon === currentCase.weapon;
  const victory = correctMonster && correctWeapon;

  if (victory) {
    state.status = "won";
    state.roundScore = calculateRoundScore();
    state.solvedCount += 1;
    state.totalScore += state.roundScore;
    if (!state.solvedCaseCodes.includes(state.currentCase.id)) {
      state.solvedCaseCodes.push(state.currentCase.id);
      saveSolvedCases();
    }
    localStorage.setItem(STORAGE_KEY, String(state.solvedCount));
    localStorage.setItem(SCORE_STORAGE_KEY, String(state.totalScore));
    updateSolvedCountDisplay();
    updateTotalScoreDisplay();
    state.feedback = "Hipótese confirmada. A criatura foi identificada e neutralizada com a estratégia correta.";
    renderFeedback("success");
    renderResult(true);
    updatePhase("Caso encerrado com sucesso");
    elements.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

    if (state.solvedCaseCodes.length === CASES.length) {
      state.status = "completed";
      openCampaignCompletionModal();
    }

    return;
  }

  state.failedAttempts += 1;

  if (state.revealedClues < currentCase.clues.length) {
    state.revealedClues += 1;
    state.feedback = "Hipótese incorreta. Uma nova pista foi adicionada ao caso para orientar a próxima tentativa.";
    elements.mistakeMessage.textContent = "A análise estava incorreta. Novos registros foram cruzados e mais uma pista foi liberada antes da próxima tentativa.";
    renderClues();
    renderHistory();
    renderFeedback("warning");
    updatePhase("Hipótese incorreta | nova pista liberada");
    resetSelections();
    renderOptions();
    updateCheckButtonState();
    elements.mistakeOverlay.classList.remove("hidden");
    return;
  }

  state.status = "lost";
  state.roundScore = 0;
  state.feedback = "Todas as pistas foram liberadas e a hipótese final ainda estava incorreta. A ameaça escapou.";
  renderFeedback("failure");
  renderResult(false);
  updatePhase("Investigação inconclusiva");
  elements.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResult(victory) {
  elements.mistakeOverlay.classList.add("hidden");
  elements.resultPanel.classList.remove("hidden");
  elements.resultPanel.classList.toggle("success", victory);
  elements.resultPanel.classList.toggle("failure", !victory);

  elements.resultStamp.textContent = victory ? "Ameaça neutralizada" : "Falha operacional";
  elements.resultTitle.textContent = victory
    ? "Você resolveu o caso e derrotou a criatura!"
    : "A investigação falhou. O mal continua à solta.";
  elements.resultMessage.textContent = victory
    ? "As evidências foram interpretadas corretamente e a resposta final fechou o caso com precisão."
    : "Parte da análise estava incorreta. Revise as evidências e descubra como combater a ameaça.";
  elements.playerDecision.textContent = `${state.selectedMonster} + ${state.selectedWeapon}`;
  elements.roundScore.textContent = `${state.roundScore} pontos`;

  elements.checkButton.disabled = true;
}

function renderManual() {
  // O manual é montado no carregamento para ser exibido no tutorial antes do primeiro caso.
  elements.manualContent.innerHTML = HUNTER_MANUAL.map(
    (entry) => `
      <article class="manual-card">
        <span class="meta-label">Fraqueza confirmada</span>
        <strong>${entry.title} | ${entry.weakness}</strong>
        <p>${entry.note}</p>
      </article>
    `
  ).join("");
}

function restartGame() {
  elements.mistakeOverlay.classList.add("hidden");
  elements.campaignOverlay.classList.add("hidden");
  startGame();
}

function continueAfterMistake() {
  elements.mistakeOverlay.classList.add("hidden");
  elements.cluesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCampaignCompletionModal() {
  elements.campaignStamp.textContent = "Arquivo encerrado";
  elements.campaignTitle.textContent = "Parabéns, todos os casos foram resolvidos.";
  elements.campaignSolvedCount.textContent = String(state.solvedCaseCodes.length);
  elements.campaignScoreCount.textContent = `${state.totalScore} pontos`;
  elements.campaignMessage.textContent = "Você concluiu todos os casos. Parabéns por sua dedicação e habilidade!";
  elements.campaignRestartButton.textContent = "Reiniciar";
  elements.campaignOverlay.classList.remove("hidden");
}

function resetCampaign() {
  state.solvedCount = 0;
  state.totalScore = 0;
  state.roundScore = 0;
  state.solvedCaseCodes = [];
  state.currentCase = null;
  state.status = "idle";
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCORE_STORAGE_KEY);
  localStorage.removeItem(SOLVED_CASES_STORAGE_KEY);
  updateSolvedCountDisplay();
  updateTotalScoreDisplay();
  elements.startButton.disabled = false;
  elements.headerRestartButton.disabled = true;
  showHomeScreen();
}

function resetSelections() {
  state.selectedMonster = "";
  state.selectedWeapon = "";
}

init();
