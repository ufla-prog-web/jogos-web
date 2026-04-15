// --- DADOS DO JOGO ---
const quizQuestions = [
    // Nível 1
    { level: 1, q: "Qual tag HTML é usada para criar um link?", options: ["<a>", "<link>", "<href>", "<url>"], ans: 0 },
    { level: 1, q: "Como declarar uma variavel mutavel em JS moderno?", options: ["var", "let", "const", "int"], ans: 1 },
    { level: 1, q: "Qual propriedade CSS altera a cor do texto?", options: ["background", "font-color", "color", "text-style"], ans: 2 },
    { level: 1, q: "Em JavaScript, o primeiro indice de um array é:", options: ["1", "-1", "0", "null"], ans: 2 },
    { level: 1, q: "Qual comando SQL extrai dados de um banco?", options: ["GET", "EXTRACT", "PULL", "SELECT"], ans: 3 },
    { level: 1, q: "Qual e a tag HTML para o titulo principal?", options: ["<title>", "<h1>", "<h6>", "<header>"], ans: 1 },
    { level: 1, q: "No JS, qual operador representa o 'E' logico?", options: ["||", "&&", "==", "!"], ans: 1 },
    { level: 1, q: "No Flexbox, como alinhar itens horizontalmente ao centro?", options: ["align-items", "justify-content", "text-align", "float"], ans: 1 },
    { level: 1, q: "Qual clausula SQL filtra registros?", options: ["FILTER", "ORDER BY", "WHERE", "HAVING"], ans: 2 },
    { level: 1, q: "O que o comando 'git clone' faz?", options: ["Apaga repositorio", "Cria branch", "Copia repositorio remoto", "Envia alteracoes"], ans: 2 },

    // Nível 2
    { level: 2, q: "Qual metodo JS converte objeto em JSON?", options: ["JSON.parse()", "JSON.stringify()", "JSON.text()", "Object.toString()"], ans: 1 },
    { level: 2, q: "Em APIs REST, qual metodo cria recursos?", options: ["GET", "POST", "PUT", "DELETE"], ans: 1 },
    { level: 2, q: "No Python, qual estrutura guarda valores unicos?", options: ["List", "Dictionary", "Tuple", "Set"], ans: 3 },
    { level: 2, q: "No SQL, qual comando agrupa linhas?", options: ["GROUP BY", "ORDER BY", "JOIN", "UNION"], ans: 0 },
    { level: 2, q: "Em JS, qual palavra aguarda uma Promise?", options: ["wait", "yield", "await", "defer"], ans: 2 },
    { level: 2, q: "O que e uma 'Foreign Key'?", options: ["Criptografia", "Link entre tabelas", "ID principal", "Indice"], ans: 1 },
    { level: 2, q: "Qual biblioteca Python manipula dataframes?", options: ["Requests", "Django", "Pandas", "Flask"], ans: 2 },
    { level: 2, q: "Qual metodo de Array filtra elementos passando num teste?", options: ["map()", "reduce()", "filter()", "forEach()"], ans: 2 },
    { level: 2, q: "Qual codigo HTTP e pagina nao encontrada?", options: ["200", "404", "500", "403"], ans: 1 },
    { level: 2, q: "Acessar 'nome' em dict Python: p = {'nome': 'Ana'}?", options: ["p.nome", "p->nome", "p['nome']", "p(nome)"], ans: 2 },

    // Nível 3
    { level: 3, q: "Na AWS, qual servico armazena objetos?", options: ["EC2", "S3", "RDS", "Lambda"], ans: 1 },
    { level: 3, q: "Caracteristica de Serverless?", options: ["Servidor fisico", "Apenas frontend", "Sem gerenciar infra", "Apenas JS"], ans: 2 },
    { level: 3, q: "Foco do Databricks?", options: ["Hospedagem", "Big Data", "Interfaces", "Redes"], ans: 1 },
    { level: 3, q: "No n8n, o que inicia o fluxo?", options: ["Endpoint", "Trigger", "Loop", "Banco"], ans: 1 },
    { level: 3, q: "Servico AWS Event-driven?", options: ["S3", "EC2", "Lambda", "VPC"], ans: 2 },
    { level: 3, q: "AWS para banco relacional?", options: ["DynamoDB", "Redshift", "RDS", "SQS"], ans: 2 },
    { level: 3, q: "O que significa CI/CD?", options: ["Code Intern", "Continuous Integration / Deployment", "Cloud Infra", "Center Integration"], ans: 1 },
    { level: 3, q: "Por que usar venv em Python?", options: ["Ficar rapido", "Isolar dependencias", "Rodar nuvem", "Interface"], ans: 1 },
    { level: 3, q: "O que e Prompt Engineering?", options: ["Configurar servidor", "Otimizar texto pro modelo", "Criar banco", "Hardware"], ans: 1 },
    { level: 3, q: "O que e Data Lake?", options: ["Banco transacional", "Repositorio de dados brutos", "Automacao", "Cache"], ans: 1 }
];

// --- ESTADO GLOBAL DO JOGO ---
let score = 0;
let sla = 100;
let combo = 0;
let gameInterval;
let currentLevel = 1;

// Arrays para controlar o sorteio das perguntas
let perguntasPool = []; // Guarda as perguntas que ainda podem cair na rodada
let perguntasAcertadas = []; // Guarda as que o usuario ja acertou (nunca mais voltam)
let perguntaAtual = null;

// Features especiais
let autoCharges = 0;
let hasUsedRollback = false;
let isGridExpanded = false;
let pipelineStage = 0; 

// Selecionando os elementos HTML
const slaEl = document.getElementById('sla-bar');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const careerEl = document.getElementById('career');
const agentChargesEl = document.getElementById('agent-charges');
const rollbackBtn = document.getElementById('rollback-btn');
const board = document.getElementById('game-board');
let cells = document.querySelectorAll('.cell'); 
const startBtn = document.getElementById('start-btn');
const modal = document.getElementById('quiz-modal');
const optionsContainer = document.getElementById('options-container');
const pipelineWarning = document.getElementById('pipeline-warning');
const leaderboard = document.getElementById('leaderboard');
const endTitle = document.getElementById('end-title');

// Botoes do cabecalho
document.getElementById('terminal-btn').addEventListener('click', () => document.body.classList.toggle('terminal'));
document.getElementById('tutorial-btn').addEventListener('click', () => document.getElementById('tutorial-modal').classList.remove('hidden'));
document.getElementById('close-tutorial-btn').addEventListener('click', () => document.getElementById('tutorial-modal').classList.add('hidden'));
rollbackBtn.addEventListener('click', executeRollback);

// Atalho do teclado para usar a feature de automacao (Agente)
document.addEventListener('keydown', (e) => {
    if ((e.key === 'a' || e.key === 'A') && autoCharges > 0 && modal.classList.contains('hidden')) {
        useAgentAction();
    }
});

startBtn.addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

function startGame() {
    // Reseta as variaveis para uma nova partida
    score = 0; sla = 100; combo = 0; currentLevel = 1;
    autoCharges = 0; hasUsedRollback = false; isGridExpanded = false; pipelineStage = 0;
    
    // Inicia o pool com todas as perguntas do banco
    perguntasPool = [...quizQuestions];
    perguntasAcertadas = [];
    
    // Reseta o grid para 3x3 caso tenha sido expandido na partida anterior
    board.className = '';
    board.innerHTML = '';
    for(let i=0; i<9; i++) { board.innerHTML += `<div class="cell" data-index="${i}"></div>`; }
    cells = document.querySelectorAll('.cell');

    updateUI();
    startBtn.classList.add('hidden');
    leaderboard.classList.add('hidden');
    board.classList.remove('hidden');
    
    // Comeca a gerar os elementos
    spawnEntity();
}

function updateUI() {
    slaEl.innerText = `${sla}%`;
    scoreEl.innerText = score;
    comboEl.classList.toggle('hidden', combo < 3);
    agentChargesEl.innerText = `Agentes: ${autoCharges} (Aperte 'A')`;
    
    // Logica de progresso na carreira (Niveis)
    if(score >= 200) careerEl.innerText = "Tech Lead / Arquiteto";
    else if(score >= 80) careerEl.innerText = "Desenvolvedor Pleno";
    else if(score >= 40) careerEl.innerText = "Desenvolvedor Junior";
    else careerEl.innerText = "Estagiario";
    
    currentLevel = score >= 200 ? 3 : (score >= 80 ? 2 : 1);

    // Feature de Auto-Scaling: aumenta o tamanho do tabuleiro
    if (score >= 200 && !isGridExpanded) {
        isGridExpanded = true;
        board.classList.add('grid-4x4');
        for(let i=9; i<16; i++) { 
            const newCell = document.createElement('div');
            newCell.className = 'cell';
            newCell.dataset.index = i;
            board.appendChild(newCell);
        }
        cells = document.querySelectorAll('.cell');
    }

    // Regra do botao de emergencia
    if (sla <= 20 && !hasUsedRollback) rollbackBtn.classList.remove('hidden');
    else rollbackBtn.classList.add('hidden');
}

function executeRollback() {
    hasUsedRollback = true;
    sla = 50;
    score = Math.floor(score / 2); // Custa metade da pontuacao
    updateUI();
}

function spawnEntity() {
    // Limpa a celula anterior
    cells.forEach(c => { c.className = 'cell'; c.onclick = null; });
    
    // Verifica se perdeu por SLA
    if(sla <= 0) return gameOver("Game Over - SLA Zerado");

    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    const rand = Math.random();

    // Sorteia qual elemento vai aparecer na tela
    if (rand < 0.15) {
        randomCell.classList.add('legacy'); 
        randomCell.onclick = handleLegacyCode;
    } else if (rand < 0.25) {
        randomCell.classList.add('agent'); 
        randomCell.onclick = handleAgentClick;
    } else if (rand < 0.30) {
        randomCell.classList.add('pipeline'); 
        randomCell.onclick = handlePipelineClick;
    } else {
        randomCell.classList.add('bug'); 
        randomCell.onclick = handleBugClick;
    }

    // Define o tempo que o usuario tem para clicar (vai ficando mais rapido)
    gameInterval = setTimeout(() => {
        if(randomCell.classList.contains('bug') || randomCell.classList.contains('pipeline')) {
            sla -= (randomCell.classList.contains('pipeline') ? 20 : 10);
            combo = 0;
            updateUI();
        }
        spawnEntity();
    }, Math.max(800, 2000 - (score * 8))); 
}

function handleLegacyCode() {
    clearTimeout(gameInterval);
    cells.forEach(c => c.className = 'cell');
    setTimeout(() => spawnEntity(), 2000); // Trava tudo por 2 segundos
}

function handleAgentClick() {
    clearTimeout(gameInterval);
    autoCharges++;
    updateUI();
    spawnEntity();
}

function useAgentAction() {
    const activeBug = document.querySelector('.bug');
    if (activeBug) {
        clearTimeout(gameInterval);
        autoCharges--;
        score += (10 * currentLevel);
        sla = Math.min(100, sla + 5);
        updateUI();
        spawnEntity();
    }
}

function handlePipelineClick() {
    clearTimeout(gameInterval);
    cells.forEach(c => c.className = 'cell');
    pipelineStage = 3; 
    openQuiz();
}

function handleBugClick() {
    clearTimeout(gameInterval);
    cells.forEach(c => c.className = 'cell');
    pipelineStage = 0;
    openQuiz();
}

// Logica para nao repetir perguntas e garantir que o ciclo acabe antes de repetir
function sorteiaPergunta(nivelDesejado) {
    // Busca no pool as perguntas do nivel pedido
    let opcoes = perguntasPool.filter(q => q.level === nivelDesejado);
    
    // Se o pool esvaziou para este nivel
    if (opcoes.length === 0) {
        // Verifica se tem alguma do nivel que o usuario errou (nao ta nos acertos)
        let errouNesteNivel = quizQuestions.filter(q => q.level === nivelDesejado && !perguntasAcertadas.includes(q));
        
        if (errouNesteNivel.length > 0) {
            // Coloca as que ele errou de volta no pool pra tentar de novo
            perguntasPool.push(...errouNesteNivel);
            opcoes = errouNesteNivel;
        } else {
            // Ele ja acertou TODAS desse nivel. Para nao travar, avanca um nivel se der
            if (nivelDesejado < 3) {
                currentLevel++;
                return sorteiaPergunta(currentLevel); // recursao
            } else {
                // Se chegou no nivel 3 e nao tem mais erro, ele zerou o jogo!
                return null;
            }
        }
    }
    
    // Sorteia a pergunta entre as opcoes viaveis e remove ela do pool momentaneamente
    let sorteada = opcoes[Math.floor(Math.random() * opcoes.length)];
    perguntasPool = perguntasPool.filter(item => item !== sorteada);
    return sorteada;
}

function openQuiz() {
    modal.classList.remove('hidden');
    pipelineWarning.classList.toggle('hidden', pipelineStage === 0);
    
    let levelToFetch = pipelineStage > 0 ? 1 : currentLevel;
    perguntaAtual = sorteiaPergunta(levelToFetch);
    
    // Verifica se a funcao de sorteio detectou vitoria (retornou null)
    if (!perguntaAtual) {
        gameOver("Vitoria! Sistema Estabilizado!");
        return;
    }
    
    let label = pipelineStage > 0 ? `Pergunta ${4 - pipelineStage}/3: ` : "";
    document.getElementById('question-text').innerText = label + perguntaAtual.q;
    optionsContainer.innerHTML = '';
    
    perguntaAtual.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.onclick = () => answerQuestion(index === perguntaAtual.ans);
        optionsContainer.appendChild(btn);
    });
}

function answerQuestion(isCorrect) {
    // Se acertou a pergunta, guarda ela pra nunca mais aparecer no jogo
    if (isCorrect && !perguntasAcertadas.includes(perguntaAtual)) {
        perguntasAcertadas.push(perguntaAtual);
    }

    // Regra do evento de Data Pipeline (Lote de perguntas)
    if (pipelineStage > 0) {
        if (isCorrect) {
            pipelineStage--;
            if (pipelineStage === 0) {
                modal.classList.add('hidden');
                score += 50;
                sla = Math.min(100, sla + 15);
                updateUI();
                checaVitoriaOuContinua();
            } else {
                openQuiz(); // Puxa a proxima do lote
            }
        } else {
            // Errou no meio do processo, pune forte
            modal.classList.add('hidden');
            pipelineStage = 0;
            sla -= 30; 
            combo = 0;
            updateUI();
            checaVitoriaOuContinua();
        }
    } else {
        // Regra do Bug Normal
        modal.classList.add('hidden');
        if (isCorrect) {
            combo++;
            let points = (10 * currentLevel) * (combo >= 3 ? 2 : 1);
            score += points;
            sla = Math.min(100, sla + 5);
        } else {
            combo = 0;
            sla -= 15;
        }
        updateUI();
        checaVitoriaOuContinua();
    }
}

// Funcao auxiliar para validar se o jogo acabou por acertos antes de gerar novo bug
function checaVitoriaOuContinua() {
    if (perguntasAcertadas.length === quizQuestions.length) {
        gameOver("Vitoria Absoluta! Voce respondeu tudo!");
    } else {
        spawnEntity();
    }
}

function gameOver(mensagemTitulo) {
    clearTimeout(gameInterval); // Para a geracao de bugs
    board.classList.add('hidden');
    modal.classList.add('hidden');
    leaderboard.classList.remove('hidden');
    rollbackBtn.classList.add('hidden');
    
    endTitle.innerText = mensagemTitulo;
    saveScore();
}

function saveScore() {
    setTimeout(() => {
        const name = prompt("Partida finalizada! Qual seu nome para o ranking?") || "Anonimo";
        const ranking = JSON.parse(localStorage.getItem('bugHunterRanking')) || [];
        ranking.push({ name, score });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem('bugHunterRanking', JSON.stringify(ranking.slice(0, 5)));
        renderRanking();
    }, 100);
}

function renderRanking() {
    const list = document.getElementById('ranking-list');
    list.innerHTML = '';
    const ranking = JSON.parse(localStorage.getItem('bugHunterRanking')) || [];
    ranking.forEach(r => {
        const li = document.createElement('li');
        li.innerText = `${r.name} - ${r.score} pts`;
        list.appendChild(li);
    });
}