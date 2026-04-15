let altura = 150;
let gravidade = -5;
let empuxo = 10;
let isMouseDown = false;

let firstMouseDown = false;
let isGameOver = false;

var background = document.getElementById('background')

background.onmousedown = () => {
    isMouseDown = true;
    firstMouseDown = true;
};

background.onmouseup = () => isMouseDown = false;

let tempoDesdeUltimoPredio = Date.now();
let tempoDesdeUltimoPassarinho = Date.now();
let startTime = Date.now();

const predios = [];
const passarinhos = [];

let i = 1;

const boneco = document.getElementById('boneco');

// loop do jogo
function infiniteLoop() {

    if (isGameOver) return;
    
    boneco.style.bottom = altura + 'px';

    // evita loop começar sem interação inicial
    if (firstMouseDown) {
        // pressionando mouse, avião sobe, soltado ele desce
        if (isMouseDown) {
            altura += empuxo;
        } else {
            altura += gravidade;
        }
    }

    // impede o avião de sumir
    if (altura > 750) altura = 750; 
    if (altura < 0) altura = 0;

    // gera predios
    if(Date.now() - tempoDesdeUltimoPredio > 2000){
        if(i < 3){
            i += 1;
        } else i = 1;
        console.log("predio novo");
        tempoDesdeUltimoPredio = Date.now();

        let novoPredio = document.createElement("img");
        novoPredio.className = "predio";       
        novoPredio.src = `./assets/predio${i}.png`;
        
        novoPredio.posicaoX = -100;
        novoPredio.style.right = novoPredio.posicaoX + 'px';

        background.appendChild(novoPredio);
        predios.push(novoPredio);
    }

    if((Date.now() - 1000) - tempoDesdeUltimoPassarinho > 2000){
        console.log("passarinho novo");
        tempoDesdeUltimoPassarinho = Date.now();

        let novoPassarinho = document.createElement("img");
        novoPassarinho.className = "passarinho";       
        novoPassarinho.src = `./assets/bird.png`;
        
        novoPassarinho.posicaoX = -100;
        novoPassarinho.style.right = novoPassarinho.posicaoX + 'px';

        let randomHeight = Math.floor(Math.random() * (800 - 500 + 1)) + 500;
        novoPassarinho.style.bottom = randomHeight + 'px';
        novoPassarinho.style.position = 'absolute';

        background.appendChild(novoPassarinho);
        passarinhos.push(novoPassarinho);
    }

    // move buildings to the left
    for (let j = 0; j < predios.length; j++) {
        let predioAtual = predios[j];
        
        predioAtual.posicaoX += 5; // velocidade do game
        predioAtual.style.right = predioAtual.posicaoX + 'px';

        // verifica colisão
        const bonecoRect = boneco.getBoundingClientRect();
        const predioRect = predioAtual.getBoundingClientRect();

        if (
            bonecoRect.left - 40 < predioRect.right &&
            bonecoRect.right - 40 > predioRect.left &&
            bonecoRect.top - 40 < predioRect.bottom &&
            bonecoRect.bottom - 40 > predioRect.top
        ) {
            return gameOver(bonecoRect);
        }

        if (predioAtual.posicaoX > window.innerWidth + 200) {
            predioAtual.remove();
            predios.splice(j, 1);
            j--;
        }
    }

    // move birds to the left
    for (let j = 0; j < passarinhos.length; j++) {
        let passarinhoAtual = passarinhos[j];
        
        passarinhoAtual.posicaoX += 5; // velocidade do game
        passarinhoAtual.style.right = passarinhoAtual.posicaoX + 'px';

        // verifica colisão
        const bonecoRect = boneco.getBoundingClientRect();
        const passarinhoRect = passarinhoAtual.getBoundingClientRect();

        if (
            bonecoRect.left - 40 < passarinhoRect.right &&
            bonecoRect.right - 40 > passarinhoRect.left &&
            bonecoRect.top - 40 < passarinhoRect.bottom - 30 &&
            bonecoRect.bottom - 40 > passarinhoRect.top + 30
        ) {
            return gameOver(bonecoRect);
        }

        if (passarinhoAtual.posicaoX > window.innerWidth + 200) {
            passarinhoAtual.remove();
            passarinhos.splice(j, 1);
            j--;
        }
    }

    requestAnimationFrame(infiniteLoop);
}

function gameOver(rect) {
    isGameOver = true;
    boneco.style.display = 'none';

    let explosion = document.createElement("img");
    explosion.src = './assets/boom.gif';
    explosion.style.position = "absolute";
    explosion.style.height = '250px'
    explosion.style.top = (rect.top - 80) + 'px';
    explosion.style.left = (rect.left + 20) + 'px';
    explosion.style.zIndex = "1001";

    document.body.appendChild(explosion);

    let background = document.createElement("img");
    background.src = "./assets/explosion-background.jpg"
    background.style.height = '100vh'
    background.style.width = '100vw'
    background.style.zIndex = '999'
    background.style.position = 'absolute'
    background.style.top = '0%'
    background.style.background = "white"

    let btnRestart = document.createElement("button");
    btnRestart.innerText = "Reiniciar";
    btnRestart.style.position = "absolute";
    btnRestart.style.backgroundColor = "darkorange"
    btnRestart.style.color = 'darkred'
    btnRestart.style.top = "55%";
    btnRestart.style.left = "50%";
    btnRestart.style.transform = "translate(-50%, -50%)";
    btnRestart.style.padding = "10px 20px";
    btnRestart.style.fontSize = "20px";
    btnRestart.style.zIndex = "1000";
    
    let gameOverText = document.createElement("span");
    gameOverText.textContent = `booooom\nvocê 'durou': ${(Date.now() - startTime)/1000} segundos`
    gameOverText.style.whiteSpace = "pre-line"; // Faz o \n funcionar
    gameOverText.style.fontSize = "50px";
    gameOverText.style.fontWeight = "800";
    gameOverText.style.position = "absolute";
    gameOverText.style.color = "white";
    gameOverText.style.backgroundColor = "orange";
    gameOverText.style.textAlign = 'center'
    gameOverText.style.top = "40%";
    gameOverText.style.left = "50%";
    gameOverText.style.transform = "translate(-50%, -50%)";
    gameOverText.style.zIndex = "1000"
    

    setTimeout(() => {
        explosion.remove();
    }, 700);

    btnRestart.onclick = () => {
        // reseta o estado do jogo
        altura = 150;
        isGameOver = false;
        firstMouseDown = false;
        isMouseDown = false;
        
        // limpa os prédios da tela e do array
        predios.forEach(p => p.remove());
        predios.length = 0;
        
        passarinhos.forEach(p => p.remove());
        passarinhos.length = 0;

        boneco.style.display = 'block';

        btnRestart.remove();
        if(explosion) explosion.remove();
        if(background) background.remove()
        if(gameOverText) gameOverText.remove();

        tempoDesdeUltimoPredio = Date.now();
        startTime = Date.now();
        infiniteLoop(); // reinicia o loop
    };
    
    document.body.appendChild(btnRestart);
    document.body.appendChild(gameOverText);
    setTimeout(() => {
        document.body.appendChild(background);
    }, 200);
}

infiniteLoop();
