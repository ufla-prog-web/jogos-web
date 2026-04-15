let jogosOriginais = [];
let jogosFiltrados = [];

const listaJogos = document.getElementById("lista-jogos");
const campoBusca = document.getElementById("campo-busca");
const filtroSemestre = document.getElementById("filtro-semestre");
const filtroTurma = document.getElementById("filtro-turma");
const ordenacao = document.getElementById("ordenacao");
const btnLimpar = document.getElementById("btn-limpar");
const btnTema = document.getElementById("btn-tema");
const btnApenasFavoritos = document.getElementById("btn-apenas-favoritos");
const btnTopo = document.getElementById("btn-topo");

const totalJogos = document.getElementById("total-jogos");
const totalExibidos = document.getElementById("total-exibidos");
const totalFavoritos = document.getElementById("total-favoritos");
const resultadoInfo = document.getElementById("resultado-info");
const modoInfo = document.getElementById("modo-info");
const mensagemErro = document.getElementById("mensagem-erro");

const modalJogoElemento = document.getElementById("modalJogo");
const modalJogo = new bootstrap.Modal(modalJogoElemento);

const modalImagem = document.getElementById("modal-imagem");
const modalNome = document.getElementById("modal-nome");
const modalDescricao = document.getElementById("modal-descricao");
const modalAutores = document.getElementById("modal-autores");
const modalSemestre = document.getElementById("modal-semestre");
const modalTurma = document.getElementById("modal-turma");
const modalLink = document.getElementById("modal-link");
const modalLinkTexto = document.getElementById("modal-link-texto");
const modalFavorito = document.getElementById("modal-favorito");

const secaoDestaques = document.getElementById("secao-destaques");
const listaDestaques = document.getElementById("lista-destaques");

const CHAVE_TEMA = "mostra_jogos_tema";
const CHAVE_FAVORITOS = "mostra_jogos_favoritos";

let mostrarSomenteFavoritos = false;
let jogoAtualModal = null;

function obterFavoritos() {
    return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
    atualizarContadorFavoritos();
}

function atualizarContadorFavoritos() {
    totalFavoritos.textContent = obterFavoritos().length;
}

function alternarFavorito(link) {
    const favoritos = obterFavoritos();
    const indice = favoritos.indexOf(link);

    if (indice >= 0) {
        favoritos.splice(indice, 1);
    } else {
        favoritos.push(link);
    }

    salvarFavoritos(favoritos);
    aplicarFiltros();

    if (jogoAtualModal && jogoAtualModal.link === link) {
        atualizarBotaoFavoritoModal(link);
    }
}

function ehFavorito(link) {
    return obterFavoritos().includes(link);
}

function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.classList.remove("d-none");
}

function esconderErro() {
    mensagemErro.classList.add("d-none");
    mensagemErro.textContent = "";
}

function normalizarTexto(valor) {
    return (valor || "").toString().toLowerCase().trim();
}

function popularFiltros() {
    const semestres = [...new Set(jogosOriginais.map(jogo => jogo.semestre).filter(Boolean))];
    const turmas = [...new Set(jogosOriginais.map(jogo => jogo.turma).filter(Boolean))];

    semestres.sort((a, b) => b.localeCompare(a, "pt-BR"));
    turmas.sort((a, b) => a.localeCompare(b, "pt-BR"));

    filtroSemestre.innerHTML = `<option value="">Todos</option>`;
    filtroTurma.innerHTML = `<option value="">Todas</option>`;

    semestres.forEach(semestre => {
        filtroSemestre.innerHTML += `<option value="${semestre}">${semestre}</option>`;
    });

    turmas.forEach(turma => {
        filtroTurma.innerHTML += `<option value="${turma}">${turma}</option>`;
    });
}

function compararSemestres(a, b) {
    const [anoA, periodoA] = (a || "0/0").split("/").map(Number);
    const [anoB, periodoB] = (b || "0/0").split("/").map(Number);

    if (anoA !== anoB) return anoA - anoB;
    return periodoA - periodoB;
}

function aplicarOrdenacao() {
    const tipo = ordenacao.value;

    jogosFiltrados.sort((a, b) => {
        switch (tipo) {
            case "nome-asc":
                return a.nome.localeCompare(b.nome, "pt-BR");
            case "nome-desc":
                return b.nome.localeCompare(a.nome, "pt-BR");
            case "semestre-asc":
                return compararSemestres(a.semestre, b.semestre);
            case "semestre-desc":
                return compararSemestres(b.semestre, a.semestre);
            case "turma-asc":
                return (a.turma || "").localeCompare(b.turma || "", "pt-BR");
            default:
                return 0;
        }
    });
}

function atualizarIndicadores() {
    totalJogos.textContent = jogosOriginais.length;
    totalExibidos.textContent = jogosFiltrados.length;
    resultadoInfo.textContent = `${jogosFiltrados.length} jogo(s) encontrado(s)`;
    modoInfo.textContent = mostrarSomenteFavoritos ? "Exibindo apenas favoritos" : "Exibindo todos";
}

function escaparAspasSimples(texto) {
    return String(texto).replace(/'/g, "\\'");
}

function criarCardJogo(jogo, indice) {
    const favorito = ehFavorito(jogo.link);
    const imagem = jogo.imagem ? `assets/img/${jogo.imagem}` : "assets/img/sem-imagem.png";
    const delay = (indice % 12) * 0.05;

    const descricaoOriginal = jogo.descricao || "";
    const descricaoLimitada = descricaoOriginal.length > 120
            ? descricaoOriginal.substring(0, 120).split(" ").slice(0, -1).join(" ") + "..."
            : descricaoOriginal;
    
    return `
        <div class="col game-col">
            <article class="game-card" style="animation-delay: ${delay}s;">
                <div class="game-image-wrapper">
                    <img
                        src="${imagem}"
                        alt="Imagem do jogo ${jogo.nome}"
                        class="game-image"
                        onerror="this.src='assets/img/sem-imagem.png'"
                    >

                    <button
                        class="details-btn"
                        onclick="abrirModalPorLink('${escaparAspasSimples(jogo.link)}')"
                    >
                        <i class="fa-solid fa-circle-info me-1"></i>
                        Detalhes
                    </button>

                    <button
                        class="favorite-btn ${favorito ? "active" : ""}"
                        onclick="alternarFavorito('${escaparAspasSimples(jogo.link)}')"
                        title="Favoritar jogo"
                    >
                        <i class="fa-${favorito ? "solid" : "regular"} fa-star"></i>
                    </button>
                </div>

                <div class="game-body">
                    <div class="game-tags">
                        ${jogo.semestre ? `<span class="game-tag semestre"><i class="fa-solid fa-calendar-days me-1"></i>${jogo.semestre}</span>` : ""}
                        ${jogo.turma ? `<span class="game-tag turma"><i class="fa-solid fa-users me-1"></i>Turma ${jogo.turma}</span>` : ""}
                    </div>

                    <h3 class="game-title">${jogo.nome}</h3>

                    <p class="game-description">${descricaoLimitada}</p>

                    <div class="game-meta">
                        <i class="fa-solid fa-user-group me-2"></i>
                        <strong>Autor:</strong> ${jogo.autores || "Não informado"}
                    </div>

                    <div class="card-actions">
                        <a href="${jogo.link}" target="_blank" class="btn-play flex-fill">
                            <i class="fa-solid fa-play me-2"></i>
                            Jogar
                        </a>

                        <button
                            class="btn btn-outline-primary btn-outline-details"
                            onclick="abrirModalPorLink('${escaparAspasSimples(jogo.link)}')"
                        >
                            <i class="fa-solid fa-eye me-2"></i>
                            Ver mais
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderizarJogos() {
    esconderErro();

    if (jogosFiltrados.length === 0) {
        listaJogos.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fa-solid fa-face-frown-open"></i>
                    <h3 class="mb-2">Nenhum jogo encontrado</h3>
                    <p class="mb-0">
                        Tente alterar a busca ou limpar os filtros para visualizar mais resultados.
                    </p>
                </div>
            </div>
        `;
        atualizarIndicadores();
        return;
    }

    listaJogos.innerHTML = jogosFiltrados.map((jogo, indice) => criarCardJogo(jogo, indice)).join("");
    atualizarIndicadores();
}

function aplicarFiltros() {
    const termo = normalizarTexto(campoBusca.value);
    const semestreSelecionado = filtroSemestre.value;
    const turmaSelecionada = filtroTurma.value;

    jogosFiltrados = jogosOriginais.filter(jogo => {
        const correspondeTexto =
            normalizarTexto(jogo.nome).includes(termo) ||
            normalizarTexto(jogo.descricao).includes(termo) ||
            normalizarTexto(jogo.autores).includes(termo);

        const correspondeSemestre = !semestreSelecionado || jogo.semestre === semestreSelecionado;
        const correspondeTurma = !turmaSelecionada || jogo.turma === turmaSelecionada;
        const correspondeFavorito = !mostrarSomenteFavoritos || ehFavorito(jogo.link);

        return correspondeTexto && correspondeSemestre && correspondeTurma && correspondeFavorito;
    });

    aplicarOrdenacao();
    renderizarJogos();
}

function limparFiltros() {
    campoBusca.value = "";
    filtroSemestre.value = "";
    filtroTurma.value = "";
    ordenacao.value = "nome-asc";
    mostrarSomenteFavoritos = false;
    atualizarBotaoFavoritos();
    aplicarFiltros();
}

function atualizarBotaoFavoritos() {
    if (mostrarSomenteFavoritos) {
        btnApenasFavoritos.classList.remove("btn-frost");
        btnApenasFavoritos.classList.add("btn-warning");
        btnApenasFavoritos.innerHTML = `<i class="fa-solid fa-star me-1"></i> Mostrando favoritos`;
    } else {
        btnApenasFavoritos.classList.remove("btn-warning");
        btnApenasFavoritos.classList.add("btn-frost");
        btnApenasFavoritos.innerHTML = `<i class="fa-solid fa-star me-1"></i> Favoritos`;
    }
}

function aplicarTemaInicial() {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA) || "light";
    document.documentElement.setAttribute("data-theme", temaSalvo);
    atualizarIconeTema(temaSalvo);
}

function atualizarIconeTema(tema) {
    btnTema.innerHTML = tema === "dark"
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
}

function alternarTema() {
    const temaAtual = document.documentElement.getAttribute("data-theme");
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", novoTema);
    localStorage.setItem(CHAVE_TEMA, novoTema);
    atualizarIconeTema(novoTema);
}

function atualizarBotaoFavoritoModal(link) {
    const favorito = ehFavorito(link);

    modalFavorito.className = favorito ? "btn btn-warning" : "btn btn-outline-warning";
    modalFavorito.innerHTML = favorito
        ? `<i class="fa-solid fa-star me-2"></i> Remover dos favoritos`
        : `<i class="fa-regular fa-star me-2"></i> Favoritar`;
}

function abrirModalJogo(jogo) {
    jogoAtualModal = jogo;

    const imagem = jogo.imagem ? `assets/img/${jogo.imagem}` : "assets/img/sem-imagem.png";

    modalImagem.src = imagem;
    modalImagem.alt = `Imagem do jogo ${jogo.nome}`;
    modalImagem.onerror = function () {
        this.src = "assets/img/sem-imagem.png";
    };

    modalNome.textContent = jogo.nome || "";
    modalDescricao.textContent = jogo.descricao || "Sem descrição informada.";
    modalAutores.textContent = jogo.autores || "Não informado";
    modalSemestre.textContent = jogo.semestre || "Sem semestre";
    modalTurma.textContent = jogo.turma ? `Turma ${jogo.turma}` : "Sem turma";
    modalLink.href = jogo.link || "#";
    modalLinkTexto.textContent = jogo.link || "-";

    atualizarBotaoFavoritoModal(jogo.link);
    modalJogo.show();
}

function abrirModalPorLink(link) {
    const jogo = jogosOriginais.find(item => item.link === link);
    if (jogo) abrirModalJogo(jogo);
}

async function carregarJogos() {
    try {
        const resposta = await fetch("assets/json/jogos.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo assets/json/jogos.json.");
        }

        const dados = await resposta.json();

        if (!dados.jogos || !Array.isArray(dados.jogos)) {
            throw new Error("O arquivo JSON não está no formato esperado.");
        }
        jogosOriginais = dados.jogos;
        popularFiltros();
        atualizarContadorFavoritos();
        renderizarDestaques();
        aplicarFiltros();
    } catch (erro) {
        console.error(erro);
        mostrarErro(erro.message);
    }
}

function controlarBotaoTopo() {
    if (window.scrollY > 300) {
        btnTopo.classList.add("show");
    } else {
        btnTopo.classList.remove("show");
    }
}

function jogoEhDestaque(jogo) {
    return String(jogo.destaque || "").toLowerCase().trim() === "sim";
}

function criarCardDestaque(jogo) {
    const imagem = jogo.imagem ? `assets/img/${jogo.imagem}` : "assets/img/sem-imagem.png";

    return `
        <div class="col-12 col-lg-6">
            <article class="featured-card">
                <img
                    src="${imagem}"
                    alt="Imagem do jogo ${jogo.nome}"
                    class="featured-image"
                    onerror="this.src='assets/img/sem-imagem.png'"
                >

                <div class="featured-overlay">
                    <div class="featured-top">
                        <span class="featured-star">
                            <i class="fa-solid fa-star"></i>
                            Destaque
                        </span>

                        ${jogo.semestre ? `<span class="game-tag semestre"><i class="fa-solid fa-calendar-days me-1"></i>${jogo.semestre}</span>` : ""}
                        ${jogo.turma ? `<span class="game-tag turma"><i class="fa-solid fa-users me-1"></i>Turma ${jogo.turma}</span>` : ""}
                    </div>

                    <h3 class="featured-title">${jogo.nome}</h3>

                    <p class="featured-description">
                        ${jogo.descricao || "Sem descrição informada."}
                    </p>

                    <div class="featured-meta">
                        <i class="fa-solid fa-user-group me-2"></i>
                        <strong>Autor:</strong> ${jogo.autores || "Não informado"}
                    </div>

                    <div class="featured-actions">
                        <a href="${jogo.link}" target="_blank" class="btn-play">
                            <i class="fa-solid fa-play me-2"></i>
                            Jogar agora
                        </a>

                        <button
                            class="btn btn-outline-primary btn-outline-details"
                            onclick="abrirModalPorLink('${escaparAspasSimples(jogo.link)}')"
                        >
                            <i class="fa-solid fa-eye me-2"></i>
                            Ver detalhes
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderizarDestaques() {
    const jogosDestaque = jogosOriginais.filter(jogoEhDestaque);

    if (!jogosDestaque.length) {
        listaDestaques.innerHTML = `
            <div class="col-12">
                <div class="featured-empty">
                    <i class="fa-regular fa-star me-2"></i>
                    Nenhum jogo em destaque no momento.
                </div>
            </div>
        `;
        return;
    }

    listaDestaques.innerHTML = jogosDestaque.map(criarCardDestaque).join("");
}

campoBusca.addEventListener("input", aplicarFiltros);
filtroSemestre.addEventListener("change", aplicarFiltros);
filtroTurma.addEventListener("change", aplicarFiltros);

ordenacao.addEventListener("change", () => {
    aplicarOrdenacao();
    renderizarJogos();
});

btnLimpar.addEventListener("click", limparFiltros);
btnTema.addEventListener("click", alternarTema);

btnApenasFavoritos.addEventListener("click", () => {
    mostrarSomenteFavoritos = !mostrarSomenteFavoritos;
    atualizarBotaoFavoritos();
    aplicarFiltros();
});

modalFavorito.addEventListener("click", () => {
    if (jogoAtualModal) {
        alternarFavorito(jogoAtualModal.link);
    }
});

btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", controlarBotaoTopo);

aplicarTemaInicial();
atualizarBotaoFavoritos();
carregarJogos();

window.alternarFavorito = alternarFavorito;
window.abrirModalPorLink = abrirModalPorLink;