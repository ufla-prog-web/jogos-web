const elementos = {
    entrada: document.getElementById("inputText"),
    botaoIniciar: document.getElementById("btnIniciar"),
    botaoDicas: document.getElementById("btnDicas"),
    botaoResetar: document.getElementById("btnResetar"),
    nos: document.getElementById("nodes"),
    dropzone: document.getElementById("dropzone"),
    arvoreSvg: document.getElementById("tree"),
    resultado: document.getElementById("result"),
    codigos: document.getElementById("codes"),
    metricas: document.getElementById("metrics"),
    pontuacao: document.getElementById("score"),
    tempo: document.getElementById("time")
};

export function obterElementos() {
    return elementos;
}

export function atualizarPainelStatus(estado) {
    elementos.pontuacao.textContent = `Pontuacao: ${estado.pontuacao}`;
    elementos.tempo.textContent = `Tempo: ${estado.tempo}s`;
    elementos.botaoDicas.textContent = estado.dicasAtivas ? "Desativar dicas" : "Ativar dicas";
}

export function limparSaidas() {
    elementos.arvoreSvg.innerHTML = "";
    elementos.codigos.innerHTML = "";
    elementos.metricas.innerHTML = "";
    elementos.resultado.className = "";
    elementos.resultado.textContent = "";
}

export function renderizarNos(nos, idDestacado, iniciarArraste) {
    elementos.nos.innerHTML = "";

    for (const no of nos) {
        const item = document.createElement("div");
        item.className = "node";
        item.draggable = true;
        item.dataset.id = String(no.id);
        item.textContent = formatarNo(no);
        item.addEventListener("dragstart", (evento) => iniciarArraste(evento, no.id));

        if (idDestacado.has(no.id)) {
            item.classList.add("highlight");
        }

        elementos.nos.appendChild(item);
    }
}

export function configurarDropzone(aoSoltarNo) {
    elementos.dropzone.addEventListener("dragover", (evento) => {
        evento.preventDefault();
    });

    elementos.dropzone.addEventListener("drop", (evento) => {
        evento.preventDefault();
        const idBruto = evento.dataTransfer?.getData("idNo");
        const idNo = Number(idBruto);

        if (!Number.isInteger(idNo)) {
            return;
        }

        aoSoltarNo(idNo);
    });
}

export function mostrarCodigos(codigos) {
    const entradas = Object.entries(codigos).sort((a, b) => a[0].localeCompare(b[0]));

    if (entradas.length === 0) {
        elementos.codigos.innerHTML = "";
        return;
    }

    const linhas = entradas
        .map(([simbolo, codigo]) => `<div><strong>${escaparHtml(simbolo)}</strong>: ${codigo}</div>`)
        .join("");

    elementos.codigos.innerHTML = `<h3>Codigos Huffman</h3>${linhas}`;
}

export function mostrarResultado(custoJogador, custoOtimo) {
    if (custoJogador === custoOtimo) {
        elementos.resultado.className = "resultado-otimo";
        elementos.resultado.textContent = `Resultado: otimo (${custoJogador} bits)`;
        return;
    }

    elementos.resultado.className = "resultado-nao-otimo";
    elementos.resultado.textContent = `Resultado: nao otimo (${custoJogador} vs ${custoOtimo} bits)`;
}

export function mostrarErroResultado(mensagem) {
    elementos.resultado.className = "resultado-erro";
    elementos.resultado.textContent = mensagem;
}

export function mostrarMetricas({ bitsAscii, bitsHuffman, bitsOtimo, economiaPercentual }) {
    elementos.metricas.innerHTML = `
        <h3>Metricas</h3>
        <div>Original (ASCII): ${bitsAscii} bits</div>
        <div>Com Huffman: ${bitsHuffman} bits</div>
        <div>Melhor possivel: ${bitsOtimo} bits</div>
        <div>Economia: ${economiaPercentual}%</div>
    `;
}

export function desenharArvore(raiz) {
    elementos.arvoreSvg.innerHTML = "";

    if (!raiz) {
        return;
    }

    const largura = 960;
    const altura = 420;
    const margemX = 48;
    const margemY = 36;
    const niveis = contarNiveis(raiz);
    const passoY = niveis > 1 ? (altura - margemY * 2) / (niveis - 1) : 0;
    const mapaPosicoes = new Map();

    const totalFolhas = contarFolhas(raiz);
    const espacoFolha = totalFolhas > 1 ? (largura - margemX * 2) / (totalFolhas - 1) : 0;
    let indiceFolha = 0;

    function posicionar(no, profundidade) {
        const y = margemY + profundidade * passoY;

        if (!no.esquerdo && !no.direito) {
            const x = margemX + indiceFolha * espacoFolha;
            indiceFolha += 1;
            mapaPosicoes.set(no.id, { x, y });
            return { x, y };
        }

        const posEsquerda = no.esquerdo ? posicionar(no.esquerdo, profundidade + 1) : null;
        const posDireita = no.direito ? posicionar(no.direito, profundidade + 1) : null;
        const x = calcularXInterno(posEsquerda, posDireita, margemX);
        mapaPosicoes.set(no.id, { x, y });
        return { x, y };
    }

    posicionar(raiz, 0);

    desenharArestas(raiz, mapaPosicoes);
    desenharNos(raiz, mapaPosicoes);
}

function desenharArestas(no, mapaPosicoes) {
    if (!no) {
        return;
    }

    const origem = mapaPosicoes.get(no.id);

    if (no.esquerdo) {
        const destinoEsquerdo = mapaPosicoes.get(no.esquerdo.id);
        desenharLinha(origem, destinoEsquerdo);
        desenharArestas(no.esquerdo, mapaPosicoes);
    }

    if (no.direito) {
        const destinoDireito = mapaPosicoes.get(no.direito.id);
        desenharLinha(origem, destinoDireito);
        desenharArestas(no.direito, mapaPosicoes);
    }
}

function desenharNos(no, mapaPosicoes) {
    if (!no) {
        return;
    }

    const posicao = mapaPosicoes.get(no.id);

    const circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("cx", String(posicao.x));
    circulo.setAttribute("cy", String(posicao.y));
    circulo.setAttribute("r", "18");
    circulo.setAttribute("fill", "#12384f");
    circulo.setAttribute("stroke", "#3c86aa");
    circulo.setAttribute("stroke-width", "2");
    elementos.arvoreSvg.appendChild(circulo);

    const texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.setAttribute("x", String(posicao.x));
    texto.setAttribute("y", String(posicao.y + 4));
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("font-size", "11");
    texto.setAttribute("fill", "#e8f4fb");
    texto.textContent = no.simbolo ? `${normalizarSimbolo(no.simbolo)}:${no.frequencia}` : String(no.frequencia);
    elementos.arvoreSvg.appendChild(texto);

    desenharNos(no.esquerdo, mapaPosicoes);
    desenharNos(no.direito, mapaPosicoes);
}

function desenharLinha(origem, destino) {
    const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linha.setAttribute("x1", String(origem.x));
    linha.setAttribute("y1", String(origem.y));
    linha.setAttribute("x2", String(destino.x));
    linha.setAttribute("y2", String(destino.y));
    linha.setAttribute("stroke", "#2f6d8d");
    linha.setAttribute("stroke-width", "2");
    elementos.arvoreSvg.appendChild(linha);
}

function calcularXInterno(posEsquerda, posDireita, margemX) {
    if (posEsquerda && posDireita) {
        return (posEsquerda.x + posDireita.x) / 2;
    }

    if (posEsquerda) {
        return posEsquerda.x + margemX / 2;
    }

    if (posDireita) {
        return posDireita.x - margemX / 2;
    }

    return margemX;
}

function contarFolhas(no) {
    if (!no) {
        return 0;
    }

    if (!no.esquerdo && !no.direito) {
        return 1;
    }

    return contarFolhas(no.esquerdo) + contarFolhas(no.direito);
}

function contarNiveis(no) {
    if (!no) {
        return 0;
    }

    return 1 + Math.max(contarNiveis(no.esquerdo), contarNiveis(no.direito));
}

function formatarNo(no) {
    if (no.simbolo) {
        return `${normalizarSimbolo(no.simbolo)} : ${no.frequencia}`;
    }

    return `No interno : ${no.frequencia}`;
}

function normalizarSimbolo(simbolo) {
    if (simbolo === " ") {
        return "espaco";
    }

    if (simbolo === "\n") {
        return "quebra";
    }

    return simbolo;
}

function escaparHtml(texto) {
    return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
 }
