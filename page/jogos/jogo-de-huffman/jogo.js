import {
    calcularCustoBits,
    construirArvoreOtima,
    contarFrequencias,
    criarNoFolha,
    criarNoInterno,
    ehParMinimoCorreto,
    gerarCodigos,
    obterDoisMenores
} from "./arvore.js";
import {
    atualizarPainelStatus,
    configurarDropzone,
    desenharArvore,
    limparSaidas,
    mostrarCodigos,
    mostrarErroResultado,
    mostrarMetricas,
    mostrarResultado,
    obterElementos,
    renderizarNos
} from "./visualizacao.js";

const estado = {
    textoAtual: "",
    frequenciasOriginais: {},
    nosAtivos: [],
    idsSelecionados: [],
    proximoId: 1,
    pontuacao: 0,
    tempo: 0,
    intervaloTempo: null,
    dicasAtivas: true
};

export function inicializarJogo() {
    const elementos = obterElementos();

    elementos.botaoIniciar.addEventListener("click", iniciarJogo);
    elementos.botaoDicas.addEventListener("click", alternarDicas);
    elementos.botaoResetar.addEventListener("click", reiniciarJogo);
    elementos.entrada.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            iniciarJogo();
        }
    });

    configurarDropzone(registrarNoSolto);
    atualizarPainelStatus(estado);
}

function iniciarJogo() {
    const elementos = obterElementos();
    const texto = elementos.entrada.value.trim();

    if (!texto) {
        alert("Digite um texto para iniciar.");
        return;
    }

    estado.textoAtual = texto;
    estado.frequenciasOriginais = contarFrequencias(texto);
    estado.nosAtivos = Object.entries(estado.frequenciasOriginais)
        .map(([simbolo, frequencia]) => criarNoFolha(gerarId(), simbolo, frequencia));
    estado.idsSelecionados = [];
    estado.pontuacao = 100;
    estado.tempo = 0;

    reiniciarCronometro();
    limparSaidas();
    atualizarPainelStatus(estado);
    renderizarEstado();
}

function alternarDicas() {
    estado.dicasAtivas = !estado.dicasAtivas;
    atualizarPainelStatus(estado);
    renderizarEstado();
}

function reiniciarJogo() {
    limparIntervalo();

    estado.textoAtual = "";
    estado.frequenciasOriginais = {};
    estado.nosAtivos = [];
    estado.idsSelecionados = [];
    estado.proximoId = 1;
    estado.pontuacao = 0;
    estado.tempo = 0;

    limparSaidas();
    atualizarPainelStatus(estado);
    renderizarEstado();
}

function reiniciarCronometro() {
    limparIntervalo();

    estado.intervaloTempo = setInterval(() => {
        estado.tempo += 1;
        atualizarPainelStatus(estado);
    }, 1000);
}

function limparIntervalo() {
    if (!estado.intervaloTempo) {
        return;
    }

    clearInterval(estado.intervaloTempo);
    estado.intervaloTempo = null;
}

function registrarNoSolto(idNo) {
    if (estado.nosAtivos.length <= 1) {
        return;
    }

    estado.idsSelecionados.push(idNo);

    if (estado.idsSelecionados.length < 2) {
        return;
    }

    const [idA, idB] = estado.idsSelecionados;
    estado.idsSelecionados = [];

    combinarNos(idA, idB);
}

function combinarNos(idA, idB) {
    if (idA === idB) {
        mostrarErroResultado("Selecione dois nos diferentes.");
        return;
    }

    const noA = estado.nosAtivos.find((no) => no.id === idA);
    const noB = estado.nosAtivos.find((no) => no.id === idB);

    if (!noA || !noB) {
        mostrarErroResultado("Nao foi possivel localizar os nos selecionados.");
        return;
    }

    const novoNo = criarNoInterno(gerarId(), noA, noB);
    estado.nosAtivos = estado.nosAtivos.filter((no) => no.id !== idA && no.id !== idB);
    estado.nosAtivos.push(novoNo);

    renderizarEstado();

    if (estado.nosAtivos.length === 1) {
        finalizarJogo();
    }
}

function finalizarJogo() {
    limparIntervalo();

    const raizJogador = estado.nosAtivos[0];
    const custoJogador = calcularCustoBits(raizJogador);

    const idOtimo = (() => {
        let idLocal = 1;
        return () => idLocal++;
    })();

    const raizOtima = construirArvoreOtima(estado.frequenciasOriginais, idOtimo);
    const custoOtimo = raizOtima ? calcularCustoBits(raizOtima) : 0;

    // Aplicar penalidade se não foi a solução ótima
    if (custoJogador > custoOtimo) {
        const excesso = custoJogador - custoOtimo;
        estado.pontuacao = Math.max(0, estado.pontuacao - excesso);
    }

    atualizarPainelStatus(estado);
    desenharArvore(raizJogador);
    mostrarCodigos(gerarCodigos(raizJogador));
    mostrarResultado(custoJogador, custoOtimo);
    mostrarMetricas(calcularMetricas(custoJogador, custoOtimo, estado.textoAtual));
}

function calcularMetricas(bitsHuffman, bitsOtimo, texto) {
    const bitsAscii = texto.length * 8;
    const economia = bitsAscii > 0 ? (1 - bitsHuffman / bitsAscii) * 100 : 0;

    return {
        bitsAscii,
        bitsHuffman,
        bitsOtimo,
        economiaPercentual: Math.max(0, economia).toFixed(1)
    };
}

function renderizarEstado() {
    // Dicas mostram os dois menores pesos como sugestão
    const idsDestaque = estado.dicasAtivas ? obterIdsMenores(estado.nosAtivos) : new Set();

    renderizarNos(estado.nosAtivos, idsDestaque, iniciarArrasteNo);

    if (estado.nosAtivos.length !== 1) {
        desenharArvore(null);
    }
}

function iniciarArrasteNo(evento, idNo) {
    evento.dataTransfer.setData("idNo", String(idNo));
    evento.dataTransfer.effectAllowed = "move";
}

function obterIdsMenores(nos) {
    const doisMenores = obterDoisMenores(nos);
    return new Set(doisMenores.map((no) => no.id));
}

function gerarId() {
    const id = estado.proximoId;
    estado.proximoId += 1;
    return id;
}
