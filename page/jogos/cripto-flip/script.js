let listaMoedas = [];
let moedaAtual = null;
let moedaProxima = null;
let pontuacao = 0;
let processandoJogada = false;

const displayPontuacao = document.getElementById('pontuacaoAtual');
const displayMensagem = document.getElementById('mensagemStatus');
const divAreaJogo = document.getElementById('areaJogo');
const divAreaReinicio = document.getElementById('areaReinicio');
const displayPontuacaoFinal = document.getElementById('pontuacaoFinal');
const displayLoading = document.getElementById('loading');

const imgMoedaAtual = document.getElementById('imagemMoedaAtual');
const txtNomeMoedaAtual = document.getElementById('nomeMoedaAtual');
const txtPrecoMoedaAtual = document.getElementById('precoMoedaAtual');

const imgMoedaProxima = document.getElementById('imagemMoedaProxima');
const txtNomeMoedaProxima = document.getElementById('nomeMoedaProxima');
const txtPrecoMoedaProxima = document.getElementById('precoMoedaProxima');

const botaoMaior = document.getElementById('botaoMaior');
const botaoMenor = document.getElementById('botaoMenor');
const botaoReiniciar = document.getElementById('botaoReiniciar');


function formatarValorMoeda(valor) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(valor);
}


async function buscarMoedas() {
    try {
        divAreaJogo.style.display = 'none';
        displayLoading.style.display = 'block';
        
        const resposta = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        
        listaMoedas = await resposta.json();
                
        iniciarNovaRodada(true);
        
        displayLoading.style.display = 'none';
        divAreaJogo.style.display = 'flex';
        
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        displayMensagem.textContent = 'Erro ao carregar dados.';
        displayMensagem.className = 'errado';
    }
}

function selecionarMoedaAleatoria(moedaAExcluir = null) {
    let indiceAleatorio = Math.floor(Math.random() * listaMoedas.length);
    let moedaSelecionada = listaMoedas[indiceAleatorio];
    
    while (moedaAExcluir && moedaSelecionada.id === moedaAExcluir.id) {
        indiceAleatorio = Math.floor(Math.random() * listaMoedas.length);
        moedaSelecionada = listaMoedas[indiceAleatorio];
    }
    
    return moedaSelecionada;
}

function atualizarInterface() {
    displayPontuacao.textContent = pontuacao;
    
    // Atualiza Card 1
    if(moedaAtual.image) {
        imgMoedaAtual.src = moedaAtual.image;
    }
    txtNomeMoedaAtual.textContent = `${moedaAtual.name} (${moedaAtual.symbol.toUpperCase()})`;
    txtPrecoMoedaAtual.textContent = formatarValorMoeda(moedaAtual.current_price);
    
    // Atualiza Card 2
    if(moedaProxima.image) {
        imgMoedaProxima.src = moedaProxima.image;
    }
    txtNomeMoedaProxima.textContent = `${moedaProxima.name} (${moedaProxima.symbol.toUpperCase()})`;
    txtPrecoMoedaProxima.textContent = '?';
    txtPrecoMoedaProxima.classList.add('oculto');
    
    displayMensagem.className = '';
}

function iniciarNovaRodada(primeiraRodada = false) {
    if (primeiraRodada) {
        pontuacao = 0;
        moedaAtual = selecionarMoedaAleatoria();
    } else {
        moedaAtual = moedaProxima;
    }
    
    moedaProxima = selecionarMoedaAleatoria(moedaAtual);
    atualizarInterface();
}

function exibirPrecoRevelado() {
    txtPrecoMoedaProxima.textContent = formatarValorMoeda(moedaProxima.current_price);
    txtPrecoMoedaProxima.classList.remove('oculto');
}

function verificarJogada(escolheuMaior) {
    if (processandoJogada) return;
    processandoJogada = true;
    
    exibirPrecoRevelado();
    
    const valorAtual = moedaAtual.current_price;
    const valorProximo = moedaProxima.current_price;
    
    let acertou = false;
    
    if (escolheuMaior && valorProximo >= valorAtual) {
        acertou = true;
    } else if (!escolheuMaior && valorProximo <= valorAtual) {
        acertou = true;
    } 
    
    if (acertou) {
        pontuacao++;
        displayMensagem.textContent = 'Você Acertou! Preparando a próxima...';
        displayMensagem.className = 'correto';
        
        setTimeout(() => {
            displayMensagem.textContent = 'Acerte se o valor da próxima moeda é maior ou menor!';
            iniciarNovaRodada();
            processandoJogada = false;
        }, 1500);
    } else {
        displayMensagem.textContent = '❌ Você Errou!';
        displayMensagem.className = 'errado';
        
        setTimeout(() => {
            finalizarJogo();
        }, 1500);
    }
}

function finalizarJogo() {
    divAreaJogo.style.display = 'none';
    divAreaReinicio.style.display = 'block';
    displayPontuacaoFinal.textContent = pontuacao;
    displayMensagem.textContent = 'Fim de Jogo!';
}

function reiniciarJogo() {
    divAreaReinicio.style.display = 'none';
    divAreaJogo.style.display = 'flex';
    displayMensagem.textContent = 'Carregando novas moedas...';
    processandoJogada = false;
    iniciarNovaRodada(true);
}

botaoMaior.addEventListener('click', () => verificarJogada(true));
botaoMenor.addEventListener('click', () => verificarJogada(false));
botaoReiniciar.addEventListener('click', reiniciarJogo);

buscarMoedas();