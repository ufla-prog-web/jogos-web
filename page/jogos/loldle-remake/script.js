let championsData = [];
let targetChampion = null;
let guessedChampions = [];

// Puxa o arquivo JSON com os dados dos campeões
fetch('champions.json')
    .then(response => response.json())
    .then(data => {
        championsData = data;
        initGame(); // Assim que conseguir carregar os dados, já inicia a partida
    });

function initGame() {
    // Sorteia um número aleatório baseado na quantidade de campeões que temos
    const randomIndex = Math.floor(Math.random() * championsData.length);
    targetChampion = championsData[randomIndex]; // Salva o campeão sorteado como nosso alvo
    
    // Zera tudo pra começar uma partida nova e limpa
    guessedChampions = [];
    document.getElementById('guesses-container').innerHTML = ''; // Limpa as tentativas velhas do HTML
    document.getElementById('win-message').classList.add('hidden'); // Esconde o aviso de "Vitória"
    document.getElementById('guess-input').value = '';
    
    // Libera os botões e a caixa de texto de novo, caso estivessem travados da última partida
    document.getElementById('guess-btn').disabled = false;
    document.getElementById('guess-input').disabled = false;
}

function handleGuess() {
    const inputField = document.getElementById('guess-input');
    const input = inputField.value; // Pega o texto que a pessoa digitou
    
    // Procura na nossa lista se esse campeão existe. 
    // toLowerCase() para padronizar um pouco a entrada
    const guessedChamp = championsData.find(c => c.name.toLowerCase() === input.toLowerCase());

    // Alerta de campeão que não existe
    if (!guessedChamp) {
        alert('Campeão não encontrado! Vê se você digitou o nome certinho.');
        return;
    }

    // Se existe, adiciona na lista de tentativas e manda desenhar os itens na tela
    guessedChampions.push(guessedChamp.name);
    renderGuess(guessedChamp);
    
    // Limpa a caixa de texto para facilitar para o jogador
    inputField.value = '';

    // Verifica se ele acertou
    if (guessedChamp.name === targetChampion.name) {
        document.getElementById('win-message').classList.remove('hidden'); // Mostra a div de vitória
        document.getElementById('guess-btn').disabled = true; // Trava os botões pra acabar o jogo
        document.getElementById('guess-input').disabled = true;
    }
}

// Função simples pra ver se acertou o atributo. Se for igual, cor correta. Se não, errado.
function compareAttribute(guessed, target) {
    if (guessed.toLowerCase() === target.toLowerCase()) {
        return 'correct';
    }
    return 'wrong';
}

// Função separada pro ano de lançamento por conta das setas
function compareYear(guessedYear, targetYear) {
    if (guessedYear === targetYear) {
        return 'correct';
    }
    
    // Retorna a seta correspondente
    if (guessedYear < targetYear) {
        return 'wrong up-arrow';
    } else {
        return 'wrong down-arrow';
    }
}

function renderGuess(champ) {
    const container = document.getElementById('guesses-container');
    
    // Cria uma div nova que vai ser a linha inteira daquele palpite
    const row = document.createElement('div');
    row.classList.add('guess-row');

    // Vai criando bloquinho por bloquinho (nome, gênero, rota, etc) e adicionando a linha
    row.appendChild(createTile(champ.name, champ.name === targetChampion.name ? 'correct' : 'wrong'));
    row.appendChild(createTile(champ.gender, compareAttribute(champ.gender, targetChampion.gender)));
    row.appendChild(createTile(champ.resource, compareAttribute(champ.resource, targetChampion.resource)));
    row.appendChild(createTile(champ.genre, compareAttribute(champ.genre, targetChampion.genre)));
    row.appendChild(createTile(champ.attackType, compareAttribute(champ.attackType, targetChampion.attackType)));
    row.appendChild(createTile(champ.releaseDate, compareYear(champ.releaseDate, targetChampion.releaseDate)));
    row.appendChild(createTile(champ.region, compareAttribute(champ.region, targetChampion.region)));
    row.appendChild(createTile(champ.lane, compareAttribute(champ.lane, targetChampion.lane)));

    // Coloca a linha recém-criada no topo da div mãe, assim o último palpite fica sempre em cima
    container.prepend(row); 
}

function createTile(text, statusClass) {
    // Cria a div que vai guardar o texto de cada atributo
    const tile = document.createElement('div');
    tile.classList.add('tile');
    
    // Como a classe pode vir com espaço (tipo "wrong up-arrow"), eu separo e adiciono uma por uma
    const classes = statusClass.split(' ');
    classes.forEach(c => tile.classList.add(c));
    
    tile.innerText = text; // Joga o texto dentro do bloquinho
    return tile; // Devolve o bloquinho pronto pra função renderGuess usar
}

// Leitor de eventos
document.getElementById('guess-btn').addEventListener('click', handleGuess);
document.getElementById('play-again-btn').addEventListener('click', initGame);