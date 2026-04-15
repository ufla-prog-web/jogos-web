export function contarFrequencias(texto) {
    const frequencias = {};

    for (const simbolo of texto) {
        frequencias[simbolo] = (frequencias[simbolo] || 0) + 1;
    }

    return frequencias;
}

export function criarNoFolha(id, simbolo, frequencia) {
    return {
        id,
        simbolo,
        frequencia,
        esquerdo: null,
        direito: null
    };
}

export function criarNoInterno(id, noA, noB) {
    const [esquerdo, direito] = ordenarPar(noA, noB);

    return {
        id,
        simbolo: null,
        frequencia: esquerdo.frequencia + direito.frequencia,
        esquerdo,
        direito
    };
}

export function obterDoisMenores(nos) {
    if (nos.length < 2) {
        return [];
    }

    const ordenados = [...nos].sort(compararNos);
    return [ordenados[0], ordenados[1]];
}

export function ehParMinimoCorreto(nos, idA, idB) {
    if (nos.length < 2) {
        return false;
    }

    const noA = nos.find(no => no.id === idA);
    const noB = nos.find(no => no.id === idB);

    if (!noA || !noB || idA === idB) {
        return false;
    }

    // Encontrar o menor e segundo menor peso
    const ordenados = [...nos].sort(compararNos);
    const menorPeso = ordenados[0].frequencia;
    const segundoMenorPeso = ordenados[1].frequencia;

    // Verificar se os pesos dos nós selecionados correspondem ao menor e segundo menor
    const pesosSelecionados = [noA.frequencia, noB.frequencia].sort((a, b) => a - b);

    return pesosSelecionados[0] === menorPeso && pesosSelecionados[1] === segundoMenorPeso;
}

export function gerarCodigos(raiz) {
    const codigos = {};

    function percorrer(no, caminho) {
        if (!no.esquerdo && !no.direito) {
            codigos[no.simbolo] = caminho || "0";
            return;
        }

        if (no.esquerdo) {
            percorrer(no.esquerdo, `${caminho}0`);
        }

        if (no.direito) {
            percorrer(no.direito, `${caminho}1`);
        }
    }

    percorrer(raiz, "");
    return codigos;
}

export function calcularCustoBits(no, profundidade = 0) {
    if (!no.esquerdo && !no.direito) {
        return no.frequencia * profundidade;
    }

    const custoEsquerdo = no.esquerdo ? calcularCustoBits(no.esquerdo, profundidade + 1) : 0;
    const custoDireito = no.direito ? calcularCustoBits(no.direito, profundidade + 1) : 0;

    return custoEsquerdo + custoDireito;
}

export function construirArvoreOtima(frequencias, gerarId) {
    const fila = new FilaPrioridadeMinima(compararNos);

    for (const [simbolo, frequencia] of Object.entries(frequencias)) {
        fila.inserir(criarNoFolha(gerarId(), simbolo, frequencia));
    }

    if (fila.tamanho() === 0) {
        return null;
    }

    if (fila.tamanho() === 1) {
        return fila.removerMinimo();
    }

    while (fila.tamanho() > 1) {
        const noA = fila.removerMinimo();
        const noB = fila.removerMinimo();
        fila.inserir(criarNoInterno(gerarId(), noA, noB));
    }

    return fila.removerMinimo();
}

function ordenarPar(noA, noB) {
    return compararNos(noA, noB) <= 0 ? [noA, noB] : [noB, noA];
}

function compararNos(a, b) {
    if (a.frequencia !== b.frequencia) {
        return a.frequencia - b.frequencia;
    }

    return a.id - b.id;
}

class FilaPrioridadeMinima {
    constructor(comparador) {
        this.comparador = comparador;
        this.itens = [];
    }

    tamanho() {
        return this.itens.length;
    }

    inserir(valor) {
        this.itens.push(valor);
        this.subir(this.itens.length - 1);
    }

    removerMinimo() {
        if (this.itens.length === 0) {
            return null;
        }

        const minimo = this.itens[0];
        const ultimo = this.itens.pop();

        if (this.itens.length > 0) {
            this.itens[0] = ultimo;
            this.descer(0);
        }

        return minimo;
    }

    subir(indice) {
        let atual = indice;

        while (atual > 0) {
            const pai = Math.floor((atual - 1) / 2);

            if (this.comparador(this.itens[atual], this.itens[pai]) >= 0) {
                break;
            }

            [this.itens[atual], this.itens[pai]] = [this.itens[pai], this.itens[atual]];
            atual = pai;
        }
    }

    descer(indice) {
        let atual = indice;

        while (true) {
            const esquerdo = atual * 2 + 1;
            const direito = atual * 2 + 2;
            let menor = atual;

            if (
                esquerdo < this.itens.length &&
                this.comparador(this.itens[esquerdo], this.itens[menor]) < 0
            ) {
                menor = esquerdo;
            }

            if (
                direito < this.itens.length &&
                this.comparador(this.itens[direito], this.itens[menor]) < 0
            ) {
                menor = direito;
            }

            if (menor === atual) {
                break;
            }

            [this.itens[atual], this.itens[menor]] = [this.itens[menor], this.itens[atual]];
            atual = menor;
        }
    }
}
