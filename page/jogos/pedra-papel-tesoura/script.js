let vitorias = 0;
let derrotas = 0;
let empates = 0;

function jogar(escolhaJogador) {

    const opcoes = ['pedra', 'papel', 'tesoura'];
    const escolhaComputador = opcoes[Math.floor(Math.random() * 3)];

    document.getElementById('jogadaJogador').textContent = escolhaJogador;
    document.getElementById('jogadaComputador').textContent = escolhaComputador;

    let resultado = '';

    if (escolhaJogador === escolhaComputador) {
        resultado = 'Empate!';
        empates++;
    } 
    else if (
        (escolhaJogador === 'pedra' && escolhaComputador === 'tesoura') ||
        (escolhaJogador === 'papel' && escolhaComputador === 'pedra') ||
        (escolhaJogador === 'tesoura' && escolhaComputador === 'papel')
    ) {
        resultado = 'Você venceu!';
        vitorias++;
    } 
    else {
        resultado = 'Você perdeu!';
        derrotas++;
    }

    document.getElementById('status').textContent = resultado;

    document.getElementById('vitorias').textContent = "Vitórias: " + vitorias;
    document.getElementById('derrotas').textContent = "Derrotas: " + derrotas;
    document.getElementById('empates').textContent = "Empates: " + empates;
}

function reiniciarJogo() {
    vitorias = 0;
    derrotas = 0;
    empates = 0;

    document.getElementById('status').textContent = '';
    document.getElementById('jogadaJogador').textContent = '-';
    document.getElementById('jogadaComputador').textContent = '-';

    document.getElementById('vitorias').textContent = "Vitórias: 0";
    document.getElementById('derrotas').textContent = "Derrotas: 0";
    document.getElementById('empates').textContent = "Empates: 0";
}