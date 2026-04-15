// ===== CONFIGURAÇÃO DO JOGO =====

const EMOJIS = ['🐶', '🐱', '🦊', '🐸', '🦁', '🐧', '🦋', '🌸'];

// ===== VARIÁVEIS DE ESTADO =====
let cartas = [];           // lista de todas as cartas embaralhadas
let cartaVirada1 = null;   // primeira carta clicada
let cartaVirada2 = null;   // segunda carta clicada
let esperando = false;     // bloqueia cliques enquanto compara
let tentativas = 0;        // número de tentativas feitas
let paresAcertados = 0;    // número de pares encontrados
let segundos = 0;          // tempo em segundos
let intervaloTimer = null; // referência do setInterval

// ===== ELEMENTOS DO DOM =====
const tabuleiro       = document.getElementById('tabuleiro');
const elTentativas    = document.getElementById('tentativas');
const elPares         = document.getElementById('pares');
const elTempo         = document.getElementById('tempo');
const overlayVitoria  = document.getElementById('overlayVitoria');
const modalInfo       = document.getElementById('modalInfo');
const btnReiniciar    = document.getElementById('btnReiniciar');
const btnReiniciarModal = document.getElementById('btnReiniciarModal');

// ===== FUNÇÕES AUXILIARES =====

// Embaralha um array usando Fisher-Yates
function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Atualiza o contador de tempo na tela
function atualizarTempo() {
  elTempo.textContent = segundos + 's';
}

// Inicia o timer
function iniciarTimer() {
  clearInterval(intervaloTimer);
  segundos = 0;
  atualizarTempo();
  intervaloTimer = setInterval(() => {
    segundos++;
    atualizarTempo();
  }, 1000);
}

// Para o timer
function pararTimer() {
  clearInterval(intervaloTimer);
}

// Atualiza o HUD (tentativas e pares)
function atualizarHUD() {
  elTentativas.textContent = tentativas;
  elPares.textContent = paresAcertados + ' / ' + EMOJIS.length;
}

// ===== CRIAÇÃO DAS CARTAS =====

function criarCartas() {
  // Duplica os emojis para ter pares e embaralha
  const pares = embaralhar([...EMOJIS, ...EMOJIS]);

  // Limpa o tabuleiro anterior
  tabuleiro.innerHTML = '';
  cartas = [];

  pares.forEach((emoji, indice) => {
    // Estrutura HTML de cada carta:
    // <div class="carta">
    //   <div class="carta-interna">
    //     <div class="carta-verso">?</div>
    //     <div class="carta-frente">🐶</div>
    //   </div>
    // </div>

    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.emoji = emoji;   // guarda o emoji como dado da carta
    carta.dataset.indice = indice;

    const interna = document.createElement('div');
    interna.classList.add('carta-interna');

    const verso = document.createElement('div');
    verso.classList.add('carta-verso');
    verso.textContent = '?';

    const frente = document.createElement('div');
    frente.classList.add('carta-frente');
    frente.textContent = emoji;

    interna.appendChild(verso);
    interna.appendChild(frente);
    carta.appendChild(interna);

    // Adiciona o evento de clique
    carta.addEventListener('click', aoClicarCarta);

    tabuleiro.appendChild(carta);
    cartas.push(carta);
  });
}

// ===== LÓGICA DO CLIQUE =====

function aoClicarCarta() {
  // Ignora se: está esperando, carta já está virada ou já foi acertada
  if (esperando) return;
  if (this.classList.contains('virada')) return;
  if (this.classList.contains('acertada')) return;

  // Vira a carta
  this.classList.add('virada');

  // Primeira carta clicada
  if (!cartaVirada1) {
    cartaVirada1 = this;
    return;
  }

  // Segunda carta clicada
  cartaVirada2 = this;
  tentativas++;
  atualizarHUD();

  // Compara as duas cartas
  compararCartas();
}

// ===== COMPARAÇÃO DE CARTAS =====

function compararCartas() {
  const saoIguais = cartaVirada1.dataset.emoji === cartaVirada2.dataset.emoji;

  if (saoIguais) {
    // Par encontrado!
    cartaVirada1.classList.add('acertada');
    cartaVirada2.classList.add('acertada');
    paresAcertados++;
    atualizarHUD();
    resetarSelecao();

    // Verifica vitória
    if (paresAcertados === EMOJIS.length) {
      pararTimer();
      setTimeout(mostrarVitoria, 500);
    }
  } else {
    // Par errado: aguarda e desvira
    esperando = true;
    setTimeout(() => {
      cartaVirada1.classList.remove('virada');
      cartaVirada2.classList.remove('virada');
      resetarSelecao();
    }, 900);
  }
}

function resetarSelecao() {
  cartaVirada1 = null;
  cartaVirada2 = null;
  esperando = false;
}

// ===== VITÓRIA =====

function mostrarVitoria() {
  modalInfo.textContent =
    'Parabéns! Você concluiu em ' + tentativas + ' tentativas e ' + segundos + ' segundos.';
  overlayVitoria.classList.add('visivel');
}

// ===== REINICIAR =====

function reiniciarJogo() {
  // Zera estado
  tentativas = 0;
  paresAcertados = 0;
  cartaVirada1 = null;
  cartaVirada2 = null;
  esperando = false;

  // Esconde vitória
  overlayVitoria.classList.remove('visivel');

  // Recria cartas e reinicia timer
  criarCartas();
  atualizarHUD();
  iniciarTimer();
}

// ===== EVENTOS DOS BOTÕES =====
btnReiniciar.addEventListener('click', reiniciarJogo);
btnReiniciarModal.addEventListener('click', reiniciarJogo);

// ===== INICIALIZAÇÃO =====
reiniciarJogo();
