let numero;
let tentativas;
let jogoAtivo;
let modoAtual;
let tempo = 0;
let intervalo;
let input;
let box;
let audioCtx = null;
let tempoIniciado = false; 

window.onload = () => {
    input = document.getElementById("palpite");
    box = document.getElementById("feedback-box");

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") verificar();
    });

    carregarRankings();
    mostrarRanking();
    iniciarAudio();
};
//Sons
function iniciarAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { console.log("Web Audio API não suportada"); }
}

function playBeep(frequency, duration, volume = 0.3) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}

function somClick() {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    playBeep(880, 0.1, 0.2);
}

function somVitoria() {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    playBeep(523.25, 0.2, 0.3);  // Dó
    setTimeout(() => playBeep(659.25, 0.3, 0.3), 200); // Mi
    setTimeout(() => playBeep(783.99, 0.4, 0.3), 500); // Sol
}

//confetes
let confettiActive = false;
let confettiParticles = [];
let confettiAnimation = null;
const canvas = document.getElementById("confettiCanvas");
let ctx = null;

function initConfetti() {
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function startConfetti() {
    if (!ctx) initConfetti();
    if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 3,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            speedX: (Math.random() - 0.5) * 4,
            speedY: Math.random() * 6 + 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }
    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let stillActive = false;
        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;
            if (p.y < canvas.height + 50) stillActive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size/2);
            ctx.restore();
        }
        if (stillActive) {
            confettiAnimation = requestAnimationFrame(draw);
        } else {
            cancelAnimationFrame(confettiAnimation);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    draw();
    setTimeout(() => {
        if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4000);
}

function carregarRankings() {
    const chaves = ["ranking_tempo_facil", "ranking_tempo_dificil", "ranking_tentativas_facil", "ranking_tentativas_dificil"];
    chaves.forEach(chave => {
        if (!localStorage.getItem(chave)) localStorage.setItem(chave, "[]");
    });
}

function salvarRankingTempo(nome) {
    let chave = "ranking_tempo_" + modoAtual;
    let ranking = JSON.parse(localStorage.getItem(chave));
    ranking.push({ nome: nome, tempo: tempo });
    ranking.sort((a, b) => a.tempo - b.tempo);
    ranking = ranking.slice(0, 5);
    localStorage.setItem(chave, JSON.stringify(ranking));
    atualizarRankingGeral();
}

function salvarRankingTentativas(nome) {
    let chave = "ranking_tentativas_" + modoAtual;
    let ranking = JSON.parse(localStorage.getItem(chave));
    ranking.push({ nome: nome, tentativas: tentativas });
    ranking.sort((a, b) => a.tentativas - b.tentativas);
    ranking = ranking.slice(0, 5);
    localStorage.setItem(chave, JSON.stringify(ranking));
    atualizarRankingGeral();
}

function mostrarRankingTempo() {
    let chave = "ranking_tempo_" + modoAtual;
    let ranking = JSON.parse(localStorage.getItem(chave));
    let ul = document.getElementById("rankingTempo");
    if (!ul) return;
    ul.innerHTML = "";
    ranking.forEach(entry => {
        let li = document.createElement("li");
        li.innerHTML = `<span>${entry.nome}</span><span>⏱️ ${entry.tempo}s</span>`;
        ul.appendChild(li);
    });
    if (ranking.length === 0) ul.innerHTML = "<li>✨ Nenhum recorde ainda</li>";
}

function mostrarRankingTentativas() {
    let chave = "ranking_tentativas_" + modoAtual;
    let ranking = JSON.parse(localStorage.getItem(chave));
    let ul = document.getElementById("rankingTentativas");
    if (!ul) return;
    ul.innerHTML = "";
    ranking.forEach(entry => {
        let li = document.createElement("li");
        li.innerHTML = `<span>${entry.nome}</span><span>🎯 ${entry.tentativas} tent</span>`;
        ul.appendChild(li);
    });
    if (ranking.length === 0) ul.innerHTML = "<li>✨ Nenhum recorde ainda</li>";
}

function atualizarRankingGeral() {
    let tempoRank = JSON.parse(localStorage.getItem("ranking_tempo_" + modoAtual));
    let tentRank = JSON.parse(localStorage.getItem("ranking_tentativas_" + modoAtual));
    let mapa = new Map();
    tempoRank.forEach(t => mapa.set(t.nome, { nome: t.nome, tempo: t.tempo, tentativas: Infinity }));
    tentRank.forEach(t => {
        if (mapa.has(t.nome)) mapa.get(t.nome).tentativas = t.tentativas;
        else mapa.set(t.nome, { nome: t.nome, tempo: Infinity, tentativas: t.tentativas });
    });
    let melhores = Array.from(mapa.values());
    let minTempo = Math.min(...melhores.map(m => m.tempo), 999);
    let minTent = Math.min(...melhores.map(m => m.tentativas), 999);
    melhores.forEach(m => {
        let scoreTempo = m.tempo === Infinity ? 999 : m.tempo / minTempo;
        let scoreTent = m.tentativas === Infinity ? 999 : m.tentativas / minTent;
        m.score = scoreTempo + scoreTent;
    });
    melhores.sort((a,b) => a.score - b.score);
    let top5 = melhores.slice(0,5);
    let ul = document.getElementById("ranking");
    if (!ul) return;
    ul.innerHTML = "";
    top5.forEach(entry => {
        let li = document.createElement("li");
        let tempoStr = entry.tempo === Infinity ? "—" : entry.tempo + "s";
        let tentStr = entry.tentativas === Infinity ? "—" : entry.tentativas + " tent";
        li.innerHTML = `<span>${entry.nome}</span><span>${tempoStr} / ${tentStr}</span>`;
        ul.appendChild(li);
    });
    if (top5.length === 0) ul.innerHTML = "<li>🏅 Sem registros</li>";
}

function mostrarRanking() {
    if (modoAtual) {
        mostrarRankingTempo();
        mostrarRankingTentativas();
        atualizarRankingGeral();
    }
}

function iniciar(modo) {
    somClick();
    modoAtual = modo;
    numero = Math.floor(Math.random() * 100) + 1;
    tentativas = 0;
    jogoAtivo = true;
    tempo = 0;
    tempoIniciado = false;    

    document.getElementById("menu").style.display = "none";
    document.getElementById("jogo").style.display = "block";
    document.getElementById("modo").innerText = modo === "facil" ? "Modo Fácil" : "Modo Difícil";

    box.style.display = modo === "facil" ? "flex" : "none";
    if (modo === "facil") box.style.backgroundColor = "#2d3a4e";

    limpar();
    mostrarRanking();
    
    document.getElementById("tempo").innerText = "⏱️ Tempo: 0s";
    if (intervalo) clearInterval(intervalo);
}

function iniciarTempo() {
    if (intervalo) clearInterval(intervalo);
    tempo = 0;
    document.getElementById("tempo").innerText = "⏱️ Tempo: 0s";
    intervalo = setInterval(() => {
        if (jogoAtivo) {
            tempo++;
            document.getElementById("tempo").innerText = `⏱️ Tempo: ${tempo}s`;
        }
    }, 1000);
}

function verificar() {
    if (!jogoAtivo) return;
    somClick();
    let palpite = Number(input.value);
    if (!palpite || palpite < 1 || palpite > 100) {
        document.getElementById("mensagem").innerText = "⚠️ Digite um número entre 1 e 100!";
        return;
    }

    if (!tempoIniciado && tentativas === 0) {
        tempoIniciado = true;
        iniciarTempo();
    }

    tentativas++;
    document.getElementById("tentativas").innerHTML = `📊 Tentativas: ${tentativas}`;

    let diferenca = Math.abs(numero - palpite);

    if (palpite === numero) {
        document.getElementById("mensagem").innerHTML = "🎉 Acertou! 🎉";
        somVitoria();
        startConfetti();
        finalizar();
    } else if (palpite < numero) {
        document.getElementById("mensagem").innerHTML = "📈 Maior! 🔼";
    } else {
        document.getElementById("mensagem").innerHTML = "📉 Menor! 🔽";
    }

    if (modoAtual === "facil") {
        atualizarCor(diferenca);
    }

    input.value = "";
}

function atualizarCor(diferenca) {
    let intensidade = Math.min(1, diferenca / 50);
    let vermelho = Math.floor(255 * intensidade);    
    let verde = Math.floor(255 * (1 - intensidade));  

    box.style.backgroundColor = `rgb(${vermelho}, ${verde}, 0)`;
    if (diferenca <= 5) box.style.boxShadow = "0 0 20px #5ae04e"; 
    else box.style.boxShadow = "none";
}

function finalizar() {
    jogoAtivo = false;
    clearInterval(intervalo);
    document.getElementById("modalOverlay").style.display = "flex";
    input.disabled = true;
}

function confirmarNome() {
    somClick();
    let nome = document.getElementById("nomeJogador").value.trim();
    if (nome === "") nome = "Anônimo";
    salvarRankingTempo(nome);
    salvarRankingTentativas(nome);
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("nomeJogador").value = "";
    mostrarRanking();
    reiniciar();
}

function reiniciar() {
    numero = Math.floor(Math.random() * 100) + 1;
    tentativas = 0;
    jogoAtivo = true;
    tempo = 0;
    tempoIniciado = false;  
    clearInterval(intervalo);
    // NÃO chama iniciarTempo() aqui
    input.disabled = false;
    limpar();
    document.getElementById("mensagem").innerText = "";
    document.getElementById("tentativas").innerHTML = "📊 Tentativas: 0";
    document.getElementById("tempo").innerText = "⏱️ Tempo: 0s";
    if (modoAtual === "facil") box.style.backgroundColor = "#2d3a4e";
}

function limpar() {
    input.value = "";
    document.getElementById("mensagem").innerText = "";
    if (box) {
        box.style.backgroundColor = "#2d3a4e";
        box.style.boxShadow = "none";
        if (modoAtual === "facil") box.style.display = "flex";
        else box.style.display = "none";
    }
}

function voltarMenu() {
    somClick();
    clearInterval(intervalo);
    document.getElementById("menu").style.display = "block";
    document.getElementById("jogo").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
    jogoAtivo = false;
    tempoIniciado = false;
}
