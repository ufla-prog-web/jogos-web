const TAM_BLOCO = 60; 
let jogadorIndex = 0;
let faseAtual = 0;
let pontos = 0;
let gameRunning = false; 
let jogador = { x: 1, y: 1, drawX: TAM_BLOCO, drawY: TAM_BLOCO };
let inimigo = [];
let fruta = [];

const canvas = document.getElementById("tela-game");
const ctx = canvas.getContext("2d");

const imgPersonagens = [new Image(), new Image(), new Image()];
imgPersonagens[0].src = "icecream1.png";
imgPersonagens[1].src = "icecream2.png";
imgPersonagens[2].src = "icecream3.png";

const imgFruta = new Image(); 
imgFruta.src = "fruit.png";

const imgInimigo = new Image(); 
imgInimigo.src = "enemy.png";

const imgBlocoGelo = new Image(); 
imgBlocoGelo.src = "ice.png";

const imgLimiteMapa = new Image(); 
imgLimiteMapa.src = "wall.png";

const fases = [
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,3,0,0,0,3,0,0,0,3,0,0,1],
        [1,0,2,0,0,0,2,0,0,0,2,0,0,0,0,1],
        [1,3,0,0,0,3,0,0,0,3,0,0,0,3,0,1],
        [1,0,0,0,2,0,0,4,0,0,2,0,0,0,0,1],
        [1,0,3,0,0,0,2,0,0,0,0,0,3,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,2,0,3,0,2,0,3,0,2,0,3,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,2,0,3,0,2,0,4,0,2,0,3,0,2,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,3,0,2,0,3,0,2,0,3,0,2,0,3,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

function selecionarPersonagem(i){
    jogadorIndex = i;
    for(let j = 0; j < 3; j++) {
        document.getElementById("per" + j).classList.remove("selecionado");
    }
    document.getElementById("per" + i).classList.add("selecionado");
}

function inicioGame(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "flex"; 
    
    restartGame(); 
}

function restartGame() {
    faseAtual = 0;
    pontos = 0;
    document.getElementById("telas").style.display = "none";
    carregarFase();
    
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
    }
}

function carregarFase(){
    inimigo = [];
    fruta = [];
    jogador = { x: 1, y: 1, drawX: 1 * TAM_BLOCO, drawY: 1 * TAM_BLOCO }; 

    let mapa = fases[faseAtual];
    let startDirs = [
        {dx: 1, dy: 0}, {dx: -1, dy: 0}, 
        {dx: 0, dy: 1}, {dx: 0, dy: -1}
    ];

    for(let y=0; y<mapa.length; y++){
        for(let x=0; x<mapa[y].length; x++){
            if(mapa[y][x] === 3) fruta.push({x, y});
            if(mapa[y][x] === 4) {
                let dir = startDirs[Math.floor(Math.random() * startDirs.length)];
                inimigo.push({x, y, dx: dir.dx, dy: dir.dy});
            }
        }
    }

    document.getElementById("frutas").innerText = fruta.length;
    document.getElementById("fase").innerText = faseAtual + 1;
    document.getElementById("pontos").innerText = pontos;
}

function final(ehVitoria) {
    gameRunning = false;
    const tela = document.getElementById("telas");
    const titulo = document.getElementById("tela-titulo");
    const telaPontos = document.getElementById("tela-pontos");

    tela.style.display = "flex";
    tela.className = ehVitoria ? "vitoria card" : "gameover card";
    titulo.innerText = ehVitoria ? "VOCÊ VENCEU!" : "GAME OVER";
    telaPontos.innerText = "Pontuação final: " + pontos;
}

document.addEventListener("keydown", mover);

function mover(e){
    if(!gameRunning) return;

    let nx = jogador.x;
    let ny = jogador.y;

    if(e.key === "ArrowUp") ny--;
    if(e.key === "ArrowDown") ny++;
    if(e.key === "ArrowLeft") nx--;
    if(e.key === "ArrowRight") nx++;

    let mapa = fases[faseAtual];

    if(ny >= 0 && ny < mapa.length && nx >= 0 && nx < mapa[0].length) {
        if(mapa[ny][nx] !== 1 && mapa[ny][nx] !== 2){
            jogador.x = nx;
            jogador.y = ny;
        }
    }
}

function desenharMapa(){
    let mapa = fases[faseAtual];
    for(let y=0; y<mapa.length; y++){
        for(let x=0; x<mapa[y].length; x++){
            if(mapa[y][x] === 1) ctx.drawImage(imgLimiteMapa, x*TAM_BLOCO, y*TAM_BLOCO, TAM_BLOCO, TAM_BLOCO);
            if(mapa[y][x] === 2) ctx.drawImage(imgBlocoGelo, x*TAM_BLOCO, y*TAM_BLOCO, TAM_BLOCO, TAM_BLOCO);
        }
    }
}

function desenharFruta(){
    for(let i = fruta.length - 1; i >= 0; i--){
        let f = fruta[i];
        ctx.drawImage(imgFruta, f.x*TAM_BLOCO + 5, f.y*TAM_BLOCO + 5, TAM_BLOCO - 10, TAM_BLOCO - 10);

        if(jogador.x === f.x && jogador.y === f.y){
            fruta.splice(i, 1);
            pontos += 10;
        }
    }
    document.getElementById("pontos").innerText = pontos;
    document.getElementById("frutas").innerText = fruta.length;
}

function desenharInimigo(){
    let mapa = fases[faseAtual];

    inimigo.forEach(e => {
        let velocidade = 0.05;
        let nextX = e.x + (e.dx * velocidade);
        let nextY = e.y + (e.dy * velocidade);

        let checkX = Math.floor(nextX + (e.dx > 0 ? 0.9 : (e.dx < 0 ? 0.1 : 0.5)));
        let checkY = Math.floor(nextY + (e.dy > 0 ? 0.9 : (e.dy < 0 ? 0.1 : 0.5)));

        if (mapa[checkY] && (mapa[checkY][checkX] === 1 || mapa[checkY][checkX] === 2)) {
            e.x = Math.round(e.x);
            e.y = Math.round(e.y);

            let direcoes = [
                {dx: 1, dy: 0}, {dx: -1, dy: 0},
                {dx: 0, dy: 1}, {dx: 0, dy: -1}
            ];
            
            let possiveis = direcoes.filter(dir => {
                if (dir.dx === -e.dx && dir.dy === -e.dy) return false;
                let ty = Math.round(e.y) + dir.dy;
                let tx = Math.round(e.x) + dir.dx;
                return mapa[ty] && mapa[ty][tx] !== 1 && mapa[ty][tx] !== 2;
            });

            if (possiveis.length > 0) {
                let novaDir = possiveis[Math.floor(Math.random() * possiveis.length)];
                e.dx = novaDir.dx;
                e.dy = novaDir.dy;
            } else {
                e.dx *= -1;
                e.dy *= -1;
            }
        } else {
            e.x = nextX;
            e.y = nextY;
        }

        ctx.drawImage(imgInimigo, e.x*TAM_BLOCO, e.y*TAM_BLOCO, TAM_BLOCO, TAM_BLOCO);

        if(Math.abs(e.x - jogador.x) < 0.6 && Math.abs(e.y - jogador.y) < 0.6){
            final(false);
        }
    });
}

function desenharJogador(){
    jogador.drawX += (jogador.x * TAM_BLOCO - jogador.drawX) * 0.3;
    jogador.drawY += (jogador.y * TAM_BLOCO - jogador.drawY) * 0.3;

    let emMovimento = Math.abs(jogador.x * TAM_BLOCO - jogador.drawX) > 1 || Math.abs(jogador.y * TAM_BLOCO - jogador.drawY) > 1;
    let angulo = emMovimento ? Math.sin(Date.now() / 50) * 0.25 : 0; 

    ctx.save();
    ctx.translate(jogador.drawX + TAM_BLOCO/2, jogador.drawY + TAM_BLOCO/2);
    ctx.rotate(angulo);
    
    ctx.drawImage(
        imgPersonagens[jogadorIndex],
        -TAM_BLOCO/2 + 5,
        -TAM_BLOCO/2 + 5,
        TAM_BLOCO - 10,
        TAM_BLOCO - 10
    );
    ctx.restore();
}

function gameLoop(){
    if(!gameRunning) return; 

    ctx.clearRect(0, 0, 960, 480);

    desenharMapa();
    desenharFruta();
    desenharInimigo();
    desenharJogador();

    if(fruta.length === 0){
        faseAtual++;
        if(faseAtual >= fases.length){
            final(true);
            return;
        }
        carregarFase();
    }

    requestAnimationFrame(gameLoop);
}