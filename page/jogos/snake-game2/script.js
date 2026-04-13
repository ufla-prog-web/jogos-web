// =============================================
// CONFIGURAÇÕES DO CANVAS
// =============================================

// Pegando o elemento canvas do HTML
const canvas = document.getElementById('canvas');

// Contexto 2D: é por aqui que desenhamos no canvas
const ctx = canvas.getContext('2d');

// Tamanho de cada célula do grid (em pixels)
const TAMANHO_CELULA = 20;

// Número de colunas e linhas do grid
const COLUNAS = canvas.width / TAMANHO_CELULA;   // 400 / 20 = 20
const LINHAS  = canvas.height / TAMANHO_CELULA;  // 400 / 20 = 20


// =============================================
// REFERÊNCIAS AOS ELEMENTOS HTML
// =============================================

const telaMenu     = document.getElementById('tela-menu');
const telaJogo     = document.getElementById('tela-jogo');
const telaGameOver = document.getElementById('tela-game-over');

const btnJogar     = document.getElementById('btn-jogar');
const btnReiniciar = document.getElementById('btn-reiniciar');

const elementoPontuacao      = document.getElementById('pontuacao');
const elementoRecorde        = document.getElementById('recorde');
const elementoPontuacaoFinal = document.getElementById('pontuacao-final');


// =============================================
// VARIÁVEIS DO JOGO
// =============================================

let cobra;        // Array de segmentos da cobra [{x, y}, ...]
let direcao;      // Direção atual do movimento {x, y}
let proximaDirecao; // Direção que será aplicada no próximo frame
let fruta;        // Posição da fruta {x, y}
let pontuacao;    // Pontuação atual
let recorde;      // Maior pontuação já atingida
let intervalo;    // Referência ao setInterval (game loop)
let velocidade;   // Intervalo em ms entre cada frame (menor = mais rápido)


// =============================================
// INICIALIZAÇÃO DO JOGO
// =============================================

// Carrega o recorde salvo no localStorage (persiste entre sessões)
recorde = Number(localStorage.getItem('recorde')) || 0;
elementoRecorde.textContent = recorde;

// Função chamada ao clicar em "Jogar" ou "Jogar novamente"
function iniciarJogo() {
  // Posição inicial da cobra: 3 segmentos no centro do grid
  cobra = [
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 },
  ];

  // Começa movendo para a direita
  direcao       = { x: 1, y: 0 };
  proximaDirecao = { x: 1, y: 0 };

  // Pontuação zerada
  pontuacao = 0;
  elementoPontuacao.textContent = pontuacao;

  // Velocidade inicial: 150ms por frame
  velocidade = 150;

  // Gera a primeira fruta
  gerarFruta();

  // Troca para a tela do jogo
  mostrarTela(telaJogo);

  // Inicia o game loop
  clearInterval(intervalo); // garante que não há loop duplicado
  intervalo = setInterval(atualizarJogo, velocidade);
}


// =============================================
// GAME LOOP
// =============================================

// Essa função é chamada repetidamente pelo setInterval
function atualizarJogo() {
  moverCobra();
  desenharJogo();
}


// =============================================
// TROCA DE TELAS
// =============================================

// Esconde todas as telas e mostra apenas a desejada
function mostrarTela(tela) {
  telaMenu.classList.add('escondida');
  telaJogo.classList.add('escondida');
  telaGameOver.classList.add('escondida');

  tela.classList.remove('escondida');
}


// =============================================
// GERAÇÃO DA FRUTA
// =============================================

// Coloca a fruta em uma posição aleatória do grid,
// garantindo que não apareça em cima da cobra
function gerarFruta() {
  let posicao;

  do {
    posicao = {
      x: Math.floor(Math.random() * COLUNAS),
      y: Math.floor(Math.random() * LINHAS),
    };
  } while (cobra.some(function(segmento) {
    return segmento.x === posicao.x && segmento.y === posicao.y;
  }));

  fruta = posicao;
}


// =============================================
// MOVIMENTAÇÃO DA COBRA
// =============================================

function moverCobra() {
  // Aplica a direção que o jogador escolheu
  direcao = proximaDirecao;

  // Calcula a posição da nova cabeça com base na direção atual
  const novaCabeca = {
    x: cobra[0].x + direcao.x,
    y: cobra[0].y + direcao.y,
  };

  // Verifica colisão com as paredes
  if (
    novaCabeca.x < 0 ||
    novaCabeca.x >= COLUNAS ||
    novaCabeca.y < 0 ||
    novaCabeca.y >= LINHAS
  ) {
    encerrarJogo();
    return;
  }

  // Verifica colisão com o próprio corpo
  const bateuNoCorpo = cobra.some(function(segmento) {
    return segmento.x === novaCabeca.x && segmento.y === novaCabeca.y;
  });

  if (bateuNoCorpo) {
    encerrarJogo();
    return;
  }

  // Adiciona a nova cabeça no início da cobra
  cobra.unshift(novaCabeca);

  // Verifica se a cobra comeu a fruta
  if (novaCabeca.x === fruta.x && novaCabeca.y === fruta.y) {
    // Aumenta a pontuação
    pontuacao += 10;
    elementoPontuacao.textContent = pontuacao;

    // Atualiza o recorde se necessário
    if (pontuacao > recorde) {
      recorde = pontuacao;
      elementoRecorde.textContent = recorde;
      localStorage.setItem('recorde', recorde);
    }

    // Gera uma nova fruta
    gerarFruta();

    // Aumenta a velocidade a cada 50 pontos
    aumentarVelocidade();
  } else {
    // Se não comeu, remove o último segmento (a cobra se move sem crescer)
    cobra.pop();
  }
}


// =============================================
// VELOCIDADE CRESCENTE
// =============================================

function aumentarVelocidade() {
  // A cada 50 pontos, reduz o intervalo em 10ms (até o mínimo de 60ms)
  const novaVelocidade = Math.max(60, 150 - Math.floor(pontuacao / 50) * 10);

  // Só reinicia o loop se a velocidade realmente mudou
  if (novaVelocidade !== velocidade) {
    velocidade = novaVelocidade;
    clearInterval(intervalo);
    intervalo = setInterval(atualizarJogo, velocidade);
  }
}


// =============================================
// ENCERRAR JOGO (GAME OVER)
// =============================================

function encerrarJogo() {
  // Para o game loop
  clearInterval(intervalo);

  // Exibe a pontuação final na tela de game over
  elementoPontuacaoFinal.textContent = pontuacao;

  // Mostra a tela de game over
  mostrarTela(telaGameOver);
}


// =============================================
// DESENHO DO JOGO
// =============================================

function desenharJogo() {
  // Limpa o canvas inteiro
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  desenharCobra();
  desenharFruta();
}

// Desenha cada segmento da cobra
function desenharCobra() {
  cobra.forEach(function(segmento, indice) {
    // Cabeça tem cor diferente dos outros segmentos
    if (indice === 0) {
      ctx.fillStyle = '#c084fc'; // roxo claro para a cabeça
    } else {
      ctx.fillStyle = '#7c3aed'; // roxo escuro para o corpo
    }

    // Desenha o retângulo do segmento (com 1px de margem para criar efeito de grid)
    ctx.fillRect(
      segmento.x * TAMANHO_CELULA + 1,
      segmento.y * TAMANHO_CELULA + 1,
      TAMANHO_CELULA - 2,
      TAMANHO_CELULA - 2
    );
  });
}

// Desenha a fruta
function desenharFruta() {
  ctx.fillStyle = '#fb923c'; // laranja
  ctx.fillRect(
    fruta.x * TAMANHO_CELULA + 1,
    fruta.y * TAMANHO_CELULA + 1,
    TAMANHO_CELULA - 2,
    TAMANHO_CELULA - 2
  );
}


// =============================================
// CONTROLE DO TECLADO
// =============================================

document.addEventListener('keydown', function(evento) {
  // Impede que as setas do teclado rolem a página
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(evento.key)) {
    evento.preventDefault();
  }

  switch (evento.key) {
    case 'ArrowUp':
      // Impede de inverter a direção (não pode ir para cima se está indo para baixo)
      if (direcao.y !== 1) proximaDirecao = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direcao.y !== -1) proximaDirecao = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direcao.x !== 1) proximaDirecao = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direcao.x !== -1) proximaDirecao = { x: 1, y: 0 };
      break;
  }
});


// =============================================
// EVENTOS DOS BOTÕES
// =============================================

btnJogar.addEventListener('click', iniciarJogo);
btnReiniciar.addEventListener('click', iniciarJogo);
