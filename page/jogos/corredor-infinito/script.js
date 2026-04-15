const jogador = document.getElementById("jogador");
const cenario = document.getElementById("cenario");
const placarTxt = document.getElementById("placar");

let pY = 0;
let velY = 0;
let pulando = false;
let pontos = 0;
let jogoAtivo = false;

let velocidadeBase = 6;
let intervaloGeracao = 1350;

function aplicarGravidade() {
    if (!jogoAtivo) return;

    velY -= 0.6;
    pY += velY;

    if (pY <= 0) {
        pY = 0;
        velY = 0;
        pulando = false;
    }

    jogador.style.bottom = (pY + 4) + "px";

    if (pulando) {
        jogador.style.transform = "rotate(-10deg)";
    } else {
        jogador.style.transform = "rotate(0deg)";
    }

    requestAnimationFrame(aplicarGravidade);
}

function gerarObstaculo() {
    if (!jogoAtivo) return;

    const obs = document.createElement("div");
    obs.classList.add("obstaculo");

    let alturaAleatoria = Math.floor(Math.random() * 50) + 25;
    obs.style.height = alturaAleatoria + "px";

    let obsX = 800;
    obs.style.left = obsX + "px";
    cenario.appendChild(obs);

    let moverObs = setInterval(() => {
        if (!jogoAtivo) {
            clearInterval(moverObs);
            return;
        }

        obsX -= velocidadeBase;
        obs.style.left = obsX + "px";

        if (obsX > 80 && obsX < 115 && pY < alturaAleatoria) {
            gameOver();
            clearInterval(moverObs);
        }

        if (obsX < -30) {
            obs.remove();
            pontos++;
            atualizarPlacar();
            clearInterval(moverObs);
        }
    }, 20);

    let tempoProximo = Math.random() * (intervaloGeracao / 2) + (intervaloGeracao / 2);
    setTimeout(gerarObstaculo, tempoProximo);
}

function atualizarPlacar() {
    placarTxt.innerText = pontos.toString().padStart(3, '0');

    if (pontos > 0 && pontos % 10 === 0) {
        velocidadeBase += 0.8;
        if (intervaloGeracao > 600) intervaloGeracao -= 100;

        placarTxt.style.color = "#00a2ff";
        setTimeout(() => placarTxt.style.color = "white", 500);
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "w") {
        if (jogoAtivo && !pulando) {
            velY = 13;
            pulando = true;
        } else if (!jogoAtivo) {
            reiniciar();
        }
    }
});

function gameOver() {
    jogoAtivo = false;
    document.getElementById("tela-over").style.display = "block";
    jogador.style.backgroundColor = "#ff4d4d";
}

function reiniciar() {
    location.reload();
}

function comecarJogo() {
    jogoAtivo = true;

    document.getElementById("tela-start").style.display = "none";

    aplicarGravidade();
    gerarObstaculo();
}