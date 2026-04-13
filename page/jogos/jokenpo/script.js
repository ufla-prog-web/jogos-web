const images = ["img/pedra.png", "img/papel.png", "img/tesoura.png"];

let playerChoise = 0;

let playerPoints = 0;
let cpuPoints = 0;

function choosePlay(option) {
    playerChoise = option;

    document.getElementById("playerImg").src = images[option];

    const buttons = document.querySelectorAll(".optionButtons button");
    buttons.forEach(button => button.classList.remove("selected"));

    if (buttons[option]) {
        buttons[option].classList.add("selected");
    }
}

function result(player, cpu) {
    if (player === cpu) return "Empate";
    
    if (
        (player === 0 && cpu === 2) ||
        (player === 1 && cpu === 0) ||
        (player === 2 && cpu === 1)
    ) {
        playerPoints++;
        return "Você venceu!";
    } else {
        cpuPoints++;
        return "Você perdeu :(";
    }
}

function setMessageValue(message) {
    const msg = document.getElementById("message");

    const classMap = {
        "Você venceu!": "win",
        "Você perdeu :(": "lose",
        "Empate": "draw"
    };

    const className = classMap[message] || "";

    msg.textContent = message;

    msg.classList.remove("win", "lose", "draw");

    if (className) {
        msg.classList.add(className);
    }

    return msg;
}

function play() {
    const cpuImage = document.getElementById("cpuImg");
    const playButton = document.getElementById("btnPlay");

    const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;
    const limit = Math.ceil(selectedMode / 2);

    playButton.disabled = true;

    let time = 100;
    let totalTime = 0;
    const duration = 2000;

    function changeImage() {
        const index = Math.floor(Math.random() * images.length);
        cpuImage.src = images[index];

        totalTime += time;

        if (totalTime < duration) {
            time += 20;
            setTimeout(changeImage, time);
        } else {
            const finalIndex = Math.floor(Math.random() * images.length);
            cpuImage.src = images[finalIndex];

            const res = result(playerChoise, finalIndex);

            document.getElementById("playerPoints").textContent = playerPoints;
            document.getElementById("cpuPoints").textContent = cpuPoints;

            const msg = setMessageValue(res);

            setTimeout(() => {
                msg.classList.remove("win", "lose", "draw");
                msg.textContent = "Escolha sua jogada";
            }, 1500);

            if (playerPoints === limit || cpuPoints === limit) {
                const messageEl = document.getElementById("message");
                if (playerPoints === limit) {
                    messageEl.textContent = "🎉 Você ganhou o jogo!";
                } else {
                    messageEl.textContent = "😢 CPU ganhou o jogo!";
                }

                playButton.disabled = true;

                playButton.style.display = "none";
                document.getElementById("btnReset").style.display = "inline-block";
            } else {
                playButton.disabled = false;
            }
        }
    }

    changeImage();
}

function resetGame() {
    playerPoints = 0;
    cpuPoints = 0;

    document.getElementById("playerPoints").textContent = 0;
    document.getElementById("cpuPoints").textContent = 0;

    const btnPlay = document.getElementById("btnPlay");
    btnPlay.style.display = "inline-block";
    btnPlay.disabled = false;

    document.getElementById("btnReset").style.display = "none";
}