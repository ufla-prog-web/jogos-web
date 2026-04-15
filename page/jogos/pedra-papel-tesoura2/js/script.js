let pontosUsuario = 0;
let pontosComputador = 0;

//Math.random() foi utilizada para gerar um número aleatório (entre 0 e 1), que ao ser multiplicado por 3 e arredondado com Math.floor(), produz um valor inteiro entre 0 e 2. Esse valor é utilizado como índice para selecionar aleatoriamente uma opção (pedra, papel ou tesoura) dentro do array de opcoes.
function escolhaComputador() {
  const opcoes = ["pedra", "papel", "tesoura"];
  const indice = Math.floor(Math.random() * 3);
  return opcoes[indice];
}

function jogar(escolhaUsuario) {
  const escolhaPC = escolhaComputador();

  document.getElementById("usuario").innerText = "Sua escolha: " + escolhaUsuario;
  document.getElementById("computador").innerText = "Computador: " + escolhaPC;

  let resultado = "";

  if (escolhaUsuario === escolhaPC) {
    resultado = "Empate!";
  } else if (
    (escolhaUsuario === "pedra" && escolhaPC === "tesoura") ||
    (escolhaUsuario === "tesoura" && escolhaPC === "papel") ||
    (escolhaUsuario === "papel" && escolhaPC === "pedra")
  ) {
    resultado = "Você venceu!";
    pontosUsuario++;
  } else {
    resultado = "Computador venceu!";
    pontosComputador++;
  }

  document.getElementById("vencedor").innerText = "Resultado: " + resultado;
  atualizarPlacar();
}

function atualizarPlacar() {
  document.getElementById("pontosUsuario").innerText = pontosUsuario;
  document.getElementById("pontosComputador").innerText = pontosComputador;
}

function reiniciar() {
  pontosUsuario = 0;
  pontosComputador = 0;

  document.getElementById("usuario").innerText = "Sua escolha: -";
  document.getElementById("computador").innerText = "Computador: -";
  document.getElementById("vencedor").innerText = "Resultado: -";

  atualizarPlacar();
}
