// Pegar o elemento canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurações básicas
const tamanhoQuadrado = 20; // Cada quadrado tem 20 pixels
const larguraGrid = canvas.width / tamanhoQuadrado;
const alturaGrid = canvas.height / tamanhoQuadrado;
const velocidadeJogo = 200; // Atualiza a cada 200 ms

// Variáveis do jogo
let cobra = [{ x: 10, y: 10 }]; // Cobra começa pequena
let direcao = { x: 1, y: 0 }; // Direção atual
let proximaDirecao = { x: 1, y: 0 }; // Próxima direção
let comida = { x: 5, y: 5 }; // Posição da comida
let pontos = 0; // Score
let recorde = 0; // Melhor score
let jogoRodando = false; // Se o jogo está ativo
let intervalDoJogo = null; // Controlar o timing

// Pegar os elementos HTML
const botaoIniciar = document.getElementById("startBtn");
const botaoReiniciar = document.getElementById("restartBtn");
const botaoVoltar = document.getElementById("backToMenuBtn");
const telaInicial = document.getElementById("startScreen");
const telaJogo = document.getElementById("gameArea");
const telaGameOver = document.getElementById("gameOverScreen");
const mostraPontos = document.getElementById("score");
const mostraRecorde = document.getElementById("highscore");

// Conectar os botões às funções
botaoIniciar.addEventListener("click", iniciarJogo);
botaoReiniciar.addEventListener("click", iniciarJogo);
botaoVoltar.addEventListener("click", voltarMenu);

// Quando o jogador pressiona uma tecla
document.addEventListener("keydown", capturarTecla);


// ============== FUNÇÕES ==============

//  Iniciar o jogo
function iniciarJogo() {
  cobra = [{ x: 10, y: 10 }]; // Resetar cobra
  direcao = { x: 1, y: 0 }; // Resetar direção
  proximaDirecao = { x: 1, y: 0 };
  pontos = 0; // Resetar pontos
  jogoRodando = true; // Jogo começou

  // Esconder e mostrar as telas corretas
  telaInicial.style.display = "none";
  telaGameOver.style.display = "none";
  telaJogo.style.display = "flex";

  // Gerar uma comida nova
  gerarComida();

  // Atualizar placar
  atualizarPlacar();

  // Iniciar o loop do jogo
  if (intervalDoJogo) clearInterval(intervalDoJogo);
  intervalDoJogo = setInterval(atualizarJogo, velocidadeJogo);
}

//  Voltar ao menu
function voltarMenu() {
  jogoRodando = false;
  if (intervalDoJogo) clearInterval(intervalDoJogo);

  telaJogo.style.display = "none";
  telaGameOver.style.display = "none";
  telaInicial.style.display = "block";
}

//  Gerar comida em um local aleatório
function gerarComida() {
  let novaComida;
  let cobraTemComida = true;

  // Gerar comida até achar um lugar que não tenha cobra
  while (cobraTemComida) {
    cobraTemComida = false;
    novaComida = {
      x: Math.floor(Math.random() * larguraGrid),
      y: Math.floor(Math.random() * alturaGrid),
    };

    // Verificar se a comida saiu no corpo da cobra
    for (let parte of cobra) {
      if (parte.x === novaComida.x && parte.y === novaComida.y) {
        cobraTemComida = true;
      }
    }
  }

  comida = novaComida;
}

//  Atualizar o jogo a cada 200ms
function atualizarJogo() {
  // Mudar a direção da cobra
  direcao = proximaDirecao;

  // Calcular a posição da cabeça
  let cabeca = {
    x: cobra[0].x + direcao.x,
    y: cobra[0].y + direcao.y,
  };

  // Verificar colisão com as paredes
  if (
    cabeca.x < 0 ||
    cabeca.x >= larguraGrid ||
    cabeca.y < 0 ||
    cabeca.y >= alturaGrid
  ) {
    fimDoJogo();
    return;
  }

  // Adicionar a cabeça nova na cobra
  cobra.unshift(cabeca);

  // Verificar colisão com o próprio corpo
  for (let i = 4; i < cobra.length; i++) {
    if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
      fimDoJogo();
      return;
    }
  }

  // Verificar se comeu a comida
  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos += 1;
    atualizarPlacar();
    gerarComida();
  } else {
    // Se não comeu, remover o rabo (cobra se move)
    cobra.pop();
  }

  // Desenhar o jogo
  desenharJogo();
}

//  Desenhar tudo na tela
function desenharJogo() {
  // Limpar a tela com fundo cinza claro
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenhar a cobra
  for (let i = 0; i < cobra.length; i++) {
    let parte = cobra[i];

    if (i === 0) {
      // Cabeça em rosa escuro
      ctx.fillStyle = "#ff1493";
    } else {
      // Corpo em rosa claro
      ctx.fillStyle = "#ff69b4";
    }

    // Desenhar o retângulo
    ctx.fillRect(
      parte.x * tamanhoQuadrado + 1,
      parte.y * tamanhoQuadrado + 1,
      tamanhoQuadrado - 2,
      tamanhoQuadrado - 2,
    );
  }

  // Desenhar a comida (círculo vermelho)
  let xComida = comida.x * tamanhoQuadrado + tamanhoQuadrado / 2;
  let yComida = comida.y * tamanhoQuadrado + tamanhoQuadrado / 2;
  let raio = tamanhoQuadrado / 2 - 2;

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(xComida, yComida, raio, 0, Math.PI * 2);
  ctx.fill();
}

//  Atualizar o placar na tela
function atualizarPlacar() {
  mostraPontos.textContent = pontos;
  mostraRecorde.textContent = recorde;
}

//  Fim de jogo
function fimDoJogo() {
  jogoRodando = false;

  // Parar o jogo
  if (intervalDoJogo) clearInterval(intervalDoJogo);

  // Atualizar recorde se conseguiu melhorar
  if (pontos > recorde) {
    recorde = pontos;
  }

  // Mostrar resultado
  document.getElementById("finalScore").textContent = pontos;
  document.getElementById("finalHighscore").textContent = recorde;

  // Mostrar tela de game over
  telaJogo.style.display = "none";
  telaGameOver.style.display = "block";
}

//  Controlar a cobra com as setas do teclado
function capturarTecla(evento) {
  // Só funciona enquanto o jogo está rodando
  if (!jogoRodando) return;

  // Capturar as setas
  if (evento.key === "ArrowUp" && direcao.y === 0) {
    proximaDirecao = { x: 0, y: -1 };
    evento.preventDefault();
  } else if (evento.key === "ArrowDown" && direcao.y === 0) {
    proximaDirecao = { x: 0, y: 1 };
    evento.preventDefault();
  } else if (evento.key === "ArrowLeft" && direcao.x === 0) {
    proximaDirecao = { x: -1, y: 0 };
    evento.preventDefault();
  } else if (evento.key === "ArrowRight" && direcao.x === 0) {
    proximaDirecao = { x: 1, y: 0 };
    evento.preventDefault();
  }
}
