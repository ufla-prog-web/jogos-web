// Variáveis de estado
let pontuacao = 0;
let tempoRestante = 45;
let jogoAtivo = false;
let timerInterval;
let spawnInterval;

// O "Cardápio" do jogo
const cardapio = [
    { id: 'burger', classe: 'item-burger', emoji: '🍔' },
    { id: 'fries', classe: 'item-fries', emoji: '🍟' },
    { id: 'soda', classe: 'item-soda', emoji: '🥤' }
];

let filaPedidos = []; // Vai guardar a ordem que o jogador precisa seguir

// Mapeamento do DOM
const elPontuacao = document.getElementById('pontuacao');
const elTempo = document.getElementById('tempo');
const elTabuleiro = document.getElementById('tabuleiro-jogo');
const elMensagem = document.getElementById('mensagem-tela');
const btnIniciar = document.getElementById('btn-iniciar');
const elPainelPedidos = document.getElementById('painel-pedidos');
const elPedidoAtual = document.getElementById('pedido-atual');
const elFilaVisual = document.getElementById('fila-visual');

function iniciarJogo() {
    if (jogoAtivo) return;

    pontuacao = 0;
    tempoRestante = 45;
    jogoAtivo = true;
    filaPedidos = [];

    elPontuacao.textContent = pontuacao;
    elTempo.textContent = tempoRestante;
    elMensagem.style.display = 'none';
    elPainelPedidos.style.display = 'block';

    btnIniciar.disabled = true;
    btnIniciar.style.backgroundColor = '#ccc';
    btnIniciar.style.cursor = 'not-allowed';

    limparTabuleiro();

    // Cria a fila inicial de 5 pedidos
    for(let i = 0; i < 5; i++) {
        adicionarPedidoNaFila();
    }
    atualizarTelaFila();

    timerInterval = setInterval(atualizarTempo, 1000);
    // Spawna um LOTE de itens a cada 1.5 segundos
    spawnInterval = setInterval(gerarLotePedidos, 1500);

    // Dá um spawn imediato para não começar com a tela vazia
    gerarLotePedidos();
}

function atualizarTempo() {
    tempoRestante--;
    elTempo.textContent = tempoRestante;
    if (tempoRestante <= 0) finalizarJogo();
}

// Sorteia um item do cardápio e coloca no final da fila
function adicionarPedidoNaFila() {
    const itemSorteado = cardapio[Math.floor(Math.random() * cardapio.length)];
    filaPedidos.push(itemSorteado);
}

// Atualiza a parte superior da tela mostrando o que precisa ser clicado
function atualizarTelaFila() {
    // O primeiro item da fila é o alvo atual
    elPedidoAtual.textContent = filaPedidos[0].emoji;

    // Os próximos itens
    let restoFila = "";
    for(let i = 1; i < filaPedidos.length; i++) {
        restoFila += filaPedidos[i].emoji + " ";
    }
    elFilaVisual.textContent = restoFila;
}

// Gera vários itens de uma vez espalhados pela tela
function gerarLotePedidos() {
    if (!jogoAtivo) return;

    // Vai aparecer entre 3 e 6 itens de uma vez
    const quantidadeNoLote = Math.floor(Math.random() * 4) + 3;

    // Garante que o item alvo atual (filaPedidos[0]) esteja sempre no lote para o jogo não travar
    criarItemNaTela(filaPedidos[0]);

    for (let i = 1; i < quantidadeNoLote; i++) {
        const itemSorteado = cardapio[Math.floor(Math.random() * cardapio.length)];
        criarItemNaTela(itemSorteado);
    }
}

// Função auxiliar que cuida do visual e do clique de cada item na tela
function criarItemNaTela(dadosItem) {
    const pedidoDiv = document.createElement('div');
    pedidoDiv.classList.add('pedido', dadosItem.classe);

    pedidoDiv.textContent = dadosItem.emoji;

    // Guardamos qual é o tipo desse item escondido no HTML
    pedidoDiv.dataset.tipo = dadosItem.id;

    const maxX = elTabuleiro.clientWidth - 70;
    const maxY = elTabuleiro.clientHeight - 70;
    pedidoDiv.style.left = Math.floor(Math.random() * maxX) + 'px';
    pedidoDiv.style.top = Math.floor(Math.random() * maxY) + 'px';

    pedidoDiv.addEventListener('mousedown', function() {
        if (!jogoAtivo) return;

        // Verifica se o item clicado é igual ao primeiro da Fila
        if (this.dataset.tipo === filaPedidos[0].id) {
            pontuacao += 15;
            elPontuacao.textContent = pontuacao;
            elTabuleiro.removeChild(this); // Remove da tela

            // Tira o primeiro da fila e coloca um novo no final
            filaPedidos.shift();
            adicionarPedidoNaFila();
            atualizarTelaFila();
        } else {
            pontuacao -= 5;
            if(pontuacao < 0) pontuacao = 0; // Não deixa ficar negativo
            elPontuacao.textContent = pontuacao;

            // Efeito visual de erro
            this.classList.add('erro-clique');
            setTimeout(() => {
                if(elTabuleiro.contains(this)) this.classList.remove('erro-clique');
            }, 300);
        }
    });

    elTabuleiro.appendChild(pedidoDiv);

    // Some automaticamente depois de um tempo para a tela não lotar
    setTimeout(() => {
        if (elTabuleiro.contains(pedidoDiv)) {
            elTabuleiro.removeChild(pedidoDiv);
        }
    }, 3500);
}

function limparTabuleiro() {
    const pedidos = document.querySelectorAll('.pedido');
    pedidos.forEach(p => p.remove());
}

function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    limparTabuleiro();

    elPainelPedidos.style.display = 'none';
    elMensagem.style.display = 'block';
    elMensagem.innerHTML = `Fim do Expediente!<br>Sua lanchonete fez <b>${pontuacao}</b> pontos.`;

    btnIniciar.disabled = false;
    btnIniciar.style.backgroundColor = '#1e90ff';
    btnIniciar.style.cursor = 'pointer';
    btnIniciar.textContent = "Jogar Novamente";
}