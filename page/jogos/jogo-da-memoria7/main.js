const celulas = document.querySelectorAll('.celula');
const elementoStatus = document.getElementById('status');
const elementoTentativas = document.getElementById('tentativas');
const valorJogador1 = document.getElementById('valorJogador1');
const valorJogador2 = document.getElementById('valorJogador2');
const buttonReiniciar = document.getElementById('buttonReiniciar');

const simbolosBase = ['8', '16', '32', '64', '128', '256', '512', '1024'];
const chaveUltimasTentativas = 'memoriaUltimasTentativas';

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;
let tentativas = 0;

let ultimasTentativasJ1 = null;
let ultimasTentativasJ2 = null;
let proximoJogadorHistorico = 0;

function carregarUltimasTentativas() {
    const salvo = localStorage.getItem(chaveUltimasTentativas);
    if (!salvo) {
        return;
    }
    try {
        const dados = JSON.parse(salvo);
        if (typeof dados.j1 === 'number') ultimasTentativasJ1 = dados.j1;
        if (typeof dados.j2 === 'number') ultimasTentativasJ2 = dados.j2;
        if (dados.proximo === 0 || dados.proximo === 1) proximoJogadorHistorico = dados.proximo;
    } catch {

    }
}

function salvarUltimasTentativas() {
    localStorage.setItem(
        chaveUltimasTentativas,
        JSON.stringify({
            j1: ultimasTentativasJ1,
            j2: ultimasTentativasJ2,
            proximo: proximoJogadorHistorico
        })
    );
}

function atualizarExibicaoUltimasTentativas() {
    valorJogador1.innerText = ultimasTentativasJ1 === null ? '—' : String(ultimasTentativasJ1);
    valorJogador2.innerText = ultimasTentativasJ2 === null ? '—' : String(ultimasTentativasJ2);
}

function registrarUltimaPartidaConcluida() {
    if (proximoJogadorHistorico === 0) {
        ultimasTentativasJ1 = tentativas;
    } else {
        ultimasTentativasJ2 = tentativas;
    }
    proximoJogadorHistorico = proximoJogadorHistorico === 0 ? 1 : 0;
    salvarUltimasTentativas();
    atualizarExibicaoUltimasTentativas();
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function atualizarStatus() {
    elementoStatus.innerText = `Pares encontrados: ${paresEncontrados} de 8`;
}

function atualizarTentativas() {
    elementoTentativas.innerText = `Tentativas: ${tentativas}`;
}

function prepararJogo() {
    cartas = embaralhar([...simbolosBase, ...simbolosBase]).map((simbolo, indice) => ({
        id: indice,
        simbolo,
        revelada: false,
        encontrada: false
    }));

    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;
    paresEncontrados = 0;
    tentativas = 0;
    atualizarStatus();
    atualizarTentativas();

    celulas.forEach((celula, indice) => {
        celula.innerText = cartas[indice].simbolo;
        celula.classList.add('oculta');
        celula.classList.remove('revelada', 'encontrada');
    });
}

function revelarCarta(celula, carta) {
    celula.innerText = carta.simbolo;
    celula.classList.remove('oculta');
    celula.classList.add('revelada');
}

function ocultarCarta(celula) {
    celula.classList.remove('revelada');
    celula.classList.add('oculta');
}

function marcarComoEncontrada(celula) {
    celula.classList.remove('revelada', 'oculta');
    celula.classList.add('encontrada');
}

function aoClicarCelula(evento) {
    const celula = evento.target;
    const indice = parseInt(celula.getAttribute('data-index'), 10);
    const carta = cartas[indice];

    if (bloqueado || carta.encontrada || carta.revelada) {
        return;
    }

    carta.revelada = true;
    revelarCarta(celula, carta);

    if (!primeiraCarta) {
        primeiraCarta = { indice, celula };
        return;
    }

    segundaCarta = { indice, celula };
    bloqueado = true;
    tentativas++;
    atualizarTentativas();

    const carta1 = cartas[primeiraCarta.indice];
    const carta2 = cartas[segundaCarta.indice];

    if (carta1.simbolo === carta2.simbolo) {
        carta1.encontrada = true;
        carta2.encontrada = true;
        marcarComoEncontrada(primeiraCarta.celula);
        marcarComoEncontrada(segundaCarta.celula);
        paresEncontrados++;
        atualizarStatus();

        if (paresEncontrados === simbolosBase.length) {
            elementoStatus.innerText = 'Muito bem! Voce encontrou todos os pares.';
            elementoTentativas.innerText = `Tentativas totais: ${tentativas}`;
            registrarUltimaPartidaConcluida();
        }

        primeiraCarta = null;
        segundaCarta = null;
        bloqueado = false;
        return;
    }

    setTimeout(() => {
        carta1.revelada = false;
        carta2.revelada = false;
        ocultarCarta(primeiraCarta.celula);
        ocultarCarta(segundaCarta.celula);
        primeiraCarta = null;
        segundaCarta = null;
        bloqueado = false;
    }, 700);
}

celulas.forEach((celula) => celula.addEventListener('click', aoClicarCelula));
buttonReiniciar.addEventListener('click', prepararJogo);

carregarUltimasTentativas();
atualizarExibicaoUltimasTentativas();
prepararJogo();