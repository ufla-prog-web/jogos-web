const tela = document.getElementById('gameCanvas');
const ctx = tela.getContext('2d');

// Elementos da UI
const elementoPontuacao = document.getElementById('score');
const telaInicio = document.getElementById('start-screen');
const telaFimDeJogo = document.getElementById('game-over-screen');
const telaVitoria = document.getElementById('victory-screen');
const elementoPontuacaoFinal = document.getElementById('final-score');
const elementoPontuacaoVitoria = document.getElementById('victory-score');

// Constantes do jogo
const LARGURA_JOGO = tela.width;
const ALTURA_JOGO = tela.height;

// Estados do jogo
const ESTADO = {
    INICIO: 0,
    JOGANDO: 1,
    FIM_DE_JOGO: 2,
    VITORIA: 3
};

let estadoAtual = ESTADO.INICIO;
let pontuacao = 0;
let idAnimacao;

// Controles
const teclas = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// --- CLASSES ---

class Jogador {
    constructor() {
        this.largura = 60;
        this.altura = 30;
        this.x = LARGURA_JOGO / 2 - this.largura / 2;
        this.y = ALTURA_JOGO - this.altura - 20;
        this.velocidade = 10;
        this.cor = '#0f0';
        this.tempoRecarga = 0;
        this.tempoRecargaMaximo = 15; // Frames entre tiros
    }

    desenhar(ctx) {
        ctx.fillStyle = this.cor;
        // Desenha a base (corpo)
        ctx.fillRect(this.x, this.y + 10, this.largura, this.altura - 10);
        // Desenha o canhão
        ctx.fillRect(this.x + this.largura / 2 - 5, this.y, 10, 10);

        // Detalhes extras
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 10, this.y + 15, 10, 5);
        ctx.fillRect(this.x + this.largura - 20, this.y + 15, 10, 5);
    }

    atualizar() {
        // Movimento
        if (teclas.ArrowLeft && this.x > 0) {
            this.x -= this.velocidade;
        }
        if (teclas.ArrowRight && this.x < LARGURA_JOGO - this.largura) {
            this.x += this.velocidade;
        }

        // Timer de tiro
        if (this.tempoRecarga > 0) {
            this.tempoRecarga--;
        }

        // Atirar
        if (teclas.Space && this.tempoRecarga === 0) {
            tiros.push(new Tiro(this.x + this.largura / 2 - 2, this.y, -15, '#ff0'));
            this.tempoRecarga = this.tempoRecargaMaximo;
        }
    }
}

class Tiro {
    constructor(x, y, velocidadeY, cor) {
        this.x = x;
        this.y = y;
        this.largura = 4;
        this.altura = 15;
        this.velocidadeY = velocidadeY;
        this.cor = cor;
        this.marcadoParaRemocao = false;
    }

    desenhar(ctx) {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.y += this.velocidadeY;
        if (this.y < 0 || this.y > ALTURA_JOGO) {
            this.marcadoParaRemocao = true;
        }
    }
}

class Alienigena {
    constructor(x, y, linha) {
        this.largura = 40;
        this.altura = 30;
        this.x = x;
        this.y = y;
        this.marcadoParaRemocao = false;
        this.linha = linha; // 0 ao 4

        // Cores baseadas na linha
        const cores = ['#f0f', '#0ff', '#f00', '#fa0', '#0fa'];
        this.cor = cores[this.linha % cores.length];
    }

    desenhar(ctx) {
        ctx.fillStyle = this.cor;

        // Desenha um alien simpático (estilo pixel art com retângulos)
        // Corpo central
        ctx.fillRect(this.x + 8, this.y + 5, 24, 15);
        // "Orelhas" / Antenas
        ctx.fillRect(this.x + 4, this.y, 4, 5);
        ctx.fillRect(this.x + 32, this.y, 4, 5);
        // Braços
        ctx.fillRect(this.x + 4, this.y + 10, 4, 15);
        ctx.fillRect(this.x + 32, this.y + 10, 4, 15);
        // Pernas
        ctx.fillRect(this.x + 12, this.y + 20, 4, 10);
        ctx.fillRect(this.x + 24, this.y + 20, 4, 10);

        // Olhos (buracos no corpo)
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 12, this.y + 8, 4, 4);
        ctx.fillRect(this.x + 24, this.y + 8, 4, 4);
    }
}

class FrotaAlienigena {
    constructor() {
        this.alienigenas = [];
        this.direcao = 1; // 1 = direita, -1 = esquerda
        this.velocidadeX = 1;
        this.velocidadeY = 30; // O quanto desce ao bater na parede
        this.colunas = 11;
        this.linhas = 5;
        this.espacamento = 15;
        this.deslocamentoX = 50;
        this.deslocamentoY = 50;

        this.criarFrota();
    }

    criarFrota() {
        for (let linha = 0; linha < this.linhas; linha++) {
            for (let coluna = 0; coluna < this.colunas; coluna++) {
                const x = this.deslocamentoX + coluna * (40 + this.espacamento);
                const y = this.deslocamentoY + linha * (30 + this.espacamento);
                this.alienigenas.push(new Alienigena(x, y, linha));
            }
        }
    }

    atualizar() {
        if (this.alienigenas.length === 0) return;

        let bateuNaParede = false;
        let alienigenaMaisBaixoY = 0;

        // Move horizontalmente e confere se bate nas paredes
        this.alienigenas.forEach(alienigena => {
            alienigena.x += this.velocidadeX * this.direcao;

            if (alienigena.x + alienigena.largura >= LARGURA_JOGO - 20 || alienigena.x <= 20) {
                bateuNaParede = true;
            }
            if (alienigena.y + alienigena.altura > alienigenaMaisBaixoY) {
                alienigenaMaisBaixoY = alienigena.y + alienigena.altura;
            }
        });

        // Se bater, inverte direção e move pra baixo
        if (bateuNaParede) {
            this.direcao *= -1;
            this.alienigenas.forEach(alienigena => {
                alienigena.x += this.velocidadeX * this.direcao * 2; // corrige o frame pra nao grudar
                alienigena.y += this.velocidadeY;
            });
            // Aumenta a velocidade progressivamente
            this.velocidadeX += 0.2;
        }

        // Condição de Game Over: se os alienígenas chegarem na base
        if (alienigenaMaisBaixoY >= jogador.y) {
            definirFimDeJogo();
        }
    }

    desenhar(ctx) {
        this.alienigenas.forEach(alienigena => alienigena.desenhar(ctx));
    }
}

// --- VARIÁVEIS GLOBAIS DE INSTÂNCIAS ---
let jogador;
let tiros;
let frota;
let particulas;

// Particulas de explosão
class Particula {
    constructor(x, y, cor) {
        this.x = x;
        this.y = y;
        this.tamanho = Math.random() * 3 + 1;
        this.velocidadeX = Math.random() * 15 - 3;
        this.velocidadeY = Math.random() * 15 - 3;
        this.cor = cor;
        this.vida = 30; // frames de vida
        this.marcadoParaRemocao = false;
    }

    atualizar() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.vida--;
        if (this.vida <= 0) this.marcadoParaRemocao = true;
    }

    desenhar(ctx) {
        ctx.fillStyle = this.cor;
        ctx.globalAlpha = this.vida / 30;
        ctx.fillRect(this.x, this.y, this.tamanho, this.tamanho);
        ctx.globalAlpha = 1.0;
    }
}

function criarExplosao(x, y, cor) {
    for (let i = 0; i < 15; i++) {
        particulas.push(new Particula(x, y, cor));
    }
}

function iniciarJogo() {
    jogador = new Jogador();
    tiros = [];
    frota = new FrotaAlienigena();
    particulas = [];
    pontuacao = 0;
    atualizarPontuacao();
}

// --- DETECÇÃO DE COLISÃO ---
function verificarColisoes() {
    // Tiros vs Alienígenas
    tiros.forEach(tiro => {
        frota.alienigenas.forEach(alienigena => {
            if (!tiro.marcadoParaRemocao && !alienigena.marcadoParaRemocao &&
                tiro.x < alienigena.x + alienigena.largura &&
                tiro.x + tiro.largura > alienigena.x &&
                tiro.y < alienigena.y + alienigena.altura &&
                tiro.altura + tiro.y > alienigena.y) {

                // Colisão ocorreu!
                tiro.marcadoParaRemocao = true;
                alienigena.marcadoParaRemocao = true;

                criarExplosao(alienigena.x + alienigena.largura / 2, alienigena.y + alienigena.altura / 2, alienigena.cor);

                // Pontuação baseada na linha do alienígena
                pontuacao += (5 - alienigena.linha) * 10;
                atualizarPontuacao();

                // Checa se ganhou
                if (frota.alienigenas.length === 1) { // Só restava ele que acabou de ser marcado pra deletar
                    definirVitoria();
                }
            }
        });
    });

    // Limpeza
    tiros = tiros.filter(t => !t.marcadoParaRemocao);
    frota.alienigenas = frota.alienigenas.filter(a => !a.marcadoParaRemocao);
    particulas = particulas.filter(p => !p.marcadoParaRemocao);
}

// --- FUNÇÕES DE ESTADO ---
function atualizarPontuacao() {
    elementoPontuacao.innerText = pontuacao;
}

function mostrarTela(telaAtiva) {
    telaInicio.classList.remove('active');
    telaFimDeJogo.classList.remove('active');
    telaVitoria.classList.remove('active');

    if (telaAtiva) {
        telaAtiva.classList.add('active');
    }
}

function definirFimDeJogo() {
    estadoAtual = ESTADO.FIM_DE_JOGO;
    elementoPontuacaoFinal.innerText = pontuacao;
    mostrarTela(telaFimDeJogo);
}

function definirVitoria() {
    estadoAtual = ESTADO.VITORIA;
    elementoPontuacaoVitoria.innerText = pontuacao;
    mostrarTela(telaVitoria);
}

// --- GAME LOOP ---
function animar() {
    // Fundo
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, LARGURA_JOGO, ALTURA_JOGO);

    if (estadoAtual === ESTADO.JOGANDO) {
        jogador.atualizar();
        jogador.desenhar(ctx);

        tiros.forEach(tiro => {
            tiro.atualizar();
            tiro.desenhar(ctx);
        });

        frota.atualizar();
        frota.desenhar(ctx);

        particulas.forEach(p => {
            p.atualizar();
            p.desenhar(ctx);
        });

        verificarColisoes();
    }

    idAnimacao = requestAnimationFrame(animar);
}

// --- EVENTOS DE TECLADO ---
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') teclas.ArrowLeft = true;
    if (e.code === 'ArrowRight') teclas.ArrowRight = true;
    if (e.code === 'Space') {
        teclas.Space = true;
        e.preventDefault(); // Impede scroll da página

        // Transição de estado com o espaço
        if (estadoAtual === ESTADO.INICIO || estadoAtual === ESTADO.FIM_DE_JOGO || estadoAtual === ESTADO.VITORIA) {
            iniciarJogo();
            estadoAtual = ESTADO.JOGANDO;
            mostrarTela(null);
        }
    }
});

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') teclas.ArrowLeft = false;
    if (e.code === 'ArrowRight') teclas.ArrowRight = false;
    if (e.code === 'Space') teclas.Space = false;
});

// Inicialização
iniciarJogo();
mostrarTela(telaInicio);
requestAnimationFrame(animar);
