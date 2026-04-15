//DECK
const SUITS = ['C', 'D', 'H', 'S'];
const VALUES = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];

function createDeck() {
    const deck = [];
    for (const s of SUITS)
        for (const v of VALUES)
            deck.push({ suit: s, value: v, img: `assets/images/playingcards/${s}-${v}.png` });
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function drawCard() {
    if (state.deck.length === 0) state.deck = shuffleDeck(createDeck());
    return state.deck.pop();
}

function cardValue(v) {
    if (['11','12','13'].includes(v)) return 10;
    return parseInt(v);
}

function handTotal(cards) {
    let total = 0;
    for (const c of cards) {
        total += cardValue(c.value);
    }
    return total;
}

function playerTotal(p) {
    return handTotal(p.cards) + (p.bonus || 0);
}


//POWERS
const POWERS = {
    'Last Stand':   { desc: 'Se passar de 21, descarta automaticamente a última carta comprada' },
    'Freeze':       { desc: 'O alvo é obrigado a parar automaticamente no próximo turno', needsTarget: true },
    'Future Sight': { desc: 'Revela o valor das próximas 3 cartas do baralho para voce ver' },
    'Burn Card':    { desc: 'Remove uma carta à sua escolha da sua propria mão' },
    'Overclock':    { desc: 'Se seu total estiver entre 18 e 20, ganha +1 ponto bônus' }
};

const POWER_NAMES = Object.keys(POWERS);

function powerImgPath(name) {
    return `assets/images/power-cards/${name.replace(/ /g, '_')}.jpg`;
}

function getRandomPowers() {
    const shuffled = [...POWER_NAMES];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return [shuffled[0], shuffled[1]];
}

// STATE
let state = {
    deck: [],
    players: [],
    currentPlayerIndex: 0,
    targetWins: 3,
    selectedPowerIndex: null
};

// PLAYERS
function createPlayers(names) {
    return names.map(name => {
        const powers = getRandomPowers();
        return {
            name,
            cards: [],
            wins: 0,
            stood: false,
            busted: false,
            frozen: false,
            bonus: 0,
            powers: powers,
            powerUsed: [false, false]
        };
    });
}

// DEAL
function dealInitialCards() {
    state.deck = shuffleDeck(createDeck());
    state.players.forEach(p => {
        p.cards = [drawCard(), drawCard()];
        p.stood = false;
        p.busted = false;
        p.frozen = false;
        p.bonus = 0;

        const newPowers = getRandomPowers();
        p.powers = newPowers;
        p.powerUsed = [false, false];
    });
    state.currentPlayerIndex = 0;
    state.selectedPowerIndex = null;
    renderGame();
}

// TURNS

function nextTurn() {
    const players = state.players;
    const active = players.filter(p => !p.stood && !p.busted);

    if (active.length === 0) {
        calculateWinner();
        return;
    }

    let next = (state.currentPlayerIndex + 1) % players.length;
    let loops = 0;

    while (loops < players.length) {
        const p = players[next];
        if (!p.stood && !p.busted) {
            if (p.frozen) {
                p.stood = true;
                p.frozen = false;
                const frozenIdx = next;
                showMessage(`${p.name} está congelado e é forçado a parar!`, () => {
                    state.currentPlayerIndex = frozenIdx;
                    nextTurn();
                });
                return;
            }
            state.currentPlayerIndex = next;
            state.selectedPowerIndex = null;
            renderGame();
            return;
        }
        next = (next + 1) % players.length;
        loops++;
    }

    calculateWinner();
}

// HIT

function hitCard(targetIndex) {
    const idx = targetIndex !== undefined ? targetIndex : state.currentPlayerIndex;
    const p = state.players[idx];
    const card = drawCard();
    p.cards.push(card);

    const lastStandIdx = p.powers.indexOf('Last Stand');
    if (playerTotal(p) > 21 && lastStandIdx !== -1 && !p.powerUsed[lastStandIdx]) {
        p.cards.pop();
        p.powerUsed[lastStandIdx] = true;
        showMessage(`${p.name} usou Last Stand! Última carta descartada.`, () => {
            renderGame();
            if (targetIndex === undefined) nextTurn();
        });
        return;
    }

    if (playerTotal(p) > 21) p.busted = true;

    renderGame();
    if (targetIndex === undefined) nextTurn();
}

// STAND
function standTurn() {
    state.players[state.currentPlayerIndex].stood = true;
    renderGame();
    nextTurn();
}

// POWERS 
function usePower() {
    const p = state.players[state.currentPlayerIndex];
    if (state.selectedPowerIndex === null) return;
    if (p.powerUsed[state.selectedPowerIndex]) return;

    const power = p.powers[state.selectedPowerIndex];

    if (POWERS[power].needsTarget) {
        showTargetSelector(power);
        return;
    }

    applyPower(power, state.currentPlayerIndex, null);
}

function applyPower(power, playerIndex, targetIndex) {
    const p = state.players[playerIndex];
    const target = targetIndex !== null ? state.players[targetIndex] : null;
    const powerIdx = p.powers.indexOf(power);

    p.powerUsed[powerIdx] = true;
    state.selectedPowerIndex = null;

    switch (power) {
        case 'Last Stand':
            p.powerUsed[powerIdx] = false;
            showMessage('Last Stand é passivo — ativa automaticamente ao estourar!', () => renderGame());
            break;

        case 'Freeze':
            target.frozen = true;
            showMessage(`${target.name} foi congelado! Vai parar no próximo turno.`, () => renderGame());
            break;

        case 'Future Sight':
            const next3 = state.deck.slice(-3).reverse().map(c => cardValue(c.value)).join(', ');
            showMessage(`Valores das próximas cartas do baralho:\n${next3}`, () => renderGame());
            break;


        case 'Burn Card':
            applyBurnCard(playerIndex, powerIdx);
            break;


        case 'Overclock':
            const total = playerTotal(p);
            if (total >= 18 && total <= 20) {
                p.bonus += 1;
                showMessage(`${p.name} usou Overclock! +1 ponto bônus.`, () => renderGame());
            } else {
                p.powerUsed[powerIdx] = false;
                showMessage(`Overclock falhou! Você precisa ter entre 18 e 20 pontos.`, () => renderGame());
            }
            break;
    }
}


function applyBurnCard(playerIndex, powerIdx) {
    const p = state.players[playerIndex];
    if (p.cards.length <= 1) {
        p.powerUsed[powerIdx] = false;
        showMessage('Voce precisa ter pelo menos 2 cartas para descartar uma.', () => renderGame());
        return;
    }

    state._pendingPowerIdx = powerIdx;
    document.getElementById('burn-cards').innerHTML = p.cards.map((c, i) =>
        `<img class="burn-card-option" src="${c.img}" onclick="chooseBurnCard(${playerIndex}, ${i})">`
    ).join('');
    document.getElementById('burn-overlay').classList.add('visible');
}

function chooseBurnCard(playerIndex, cardIndex) {
    const p = state.players[playerIndex];
    p.cards.splice(cardIndex, 1);
    if (playerTotal(p) <= 21) p.busted = false;

    if (state._pendingPowerIdx !== undefined) {
        p.powerUsed[state._pendingPowerIdx] = true;
        state._pendingPowerIdx = undefined;
    }
    document.getElementById('burn-overlay').classList.remove('visible');
    renderGame();
}


// WINNER
function calculateWinner() {
    const players = state.players;
    const valid = players.filter(p => !p.busted);

    let winners = [];
    if (valid.length > 0) {
        const best = Math.max(...valid.map(p => playerTotal(p)));
        winners = valid.filter(p => playerTotal(p) === best);
    }

    winners.forEach(p => p.wins++);

    const champion = players.find(p => p.wins >= state.targetWins);
    if (champion) {
        showFinalWinner(champion);
        return;
    }

    showRoundResult(winners);
}

// UI
function renderGame() {
    renderPlayers();
    renderPowers();

    document.getElementById('remaining-cards').textContent = `${state.deck.length} cartas restantes`;

    const p = state.players[state.currentPlayerIndex];
    const allDone = state.players.every(pl => pl.stood || pl.busted);
    const cantAct = allDone || !p || p.stood || p.busted;
    const hasSelectedPower = state.selectedPowerIndex !== null && !p.powerUsed[state.selectedPowerIndex];

    document.getElementById('btn-hit').disabled = cantAct;
    document.getElementById('btn-stand').disabled = cantAct;
    document.getElementById('btn-power').disabled = cantAct || !hasSelectedPower;

    adjustCardOverlap();
}

function renderPlayers() {
    const container = document.getElementById('players-cards');
    const ci = state.currentPlayerIndex;

    container.innerHTML = state.players.map((p, i) => {
        const isActive = i === ci && !p.stood && !p.busted;
        const statusClass = p.busted ? 'busted' : p.stood ? 'stood' : isActive ? '' : 'inactive';
        const turnLabel = isActive ? `<div class="turn-label"><span>SUA VEZ</span></div>` : '';
        const statusTag = p.busted ? ' ESTOUROU' : p.stood ? ' PAROU' : '';
        const winsText = p.wins === 1 ? '1 VITÓRIA' : `${p.wins} VITÓRIAS`;
        const cards = p.cards.map(c =>
            `<img src="${c.img}" alt="${c.suit}-${c.value}" class="cards">`
        ).join('');

        return `
            <div class="wrapper-player-cards ${statusClass}">
                ${turnLabel}
                <span class="player-name">${p.name}${statusTag}</span>
                <span class="wins-label">${winsText}</span>
                <div class="container-player-cards">${cards}</div>
                <span class="value-count">${playerTotal(p)}</span>
                <span class="value-label">VALOR</span>
            </div>
        `;
    }).join('');
}

function renderPowers() {
    const p = state.players[state.currentPlayerIndex];
    if (!p) return;

    document.getElementById('power-label').textContent = `PODERES DE ${p.name.toUpperCase()}`;

    const powersHtml = p.powers.map((powerName, idx) => {
        const isSelected = state.selectedPowerIndex === idx;
        const isUsed = p.powerUsed[idx];
        const selectedClass = isSelected ? 'selected' : '';
        const usedStyle = isUsed ? 'opacity:0.35;cursor:default' : '';
        const clickHandler = isUsed ? '' : `onclick="selectPower(${idx})"`;
        return `
            <div class="power-wrapper">
                <img
                    src="${powerImgPath(powerName)}"
                    alt="${powerName}"
                    class="power-cards ${selectedClass}"
                    style="${usedStyle}"
                    ${clickHandler}
                >
                <div class="tooltip">
                    <span class="tooltip-name">${powerName}</span>
                    <span class="tooltip-desc">${POWERS[powerName].desc}</span>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('powers-container').innerHTML = powersHtml;
}

function selectPower(index) {
    const p = state.players[state.currentPlayerIndex];
    if (p.powerUsed[index]) return;
    state.selectedPowerIndex = state.selectedPowerIndex === index ? null : index;
    renderGame();
}

// OVERLAY

function showMessage(text, callback) {
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-overlay').classList.add('visible');
    document.getElementById('message-btn').onclick = () => {
        document.getElementById('message-overlay').classList.remove('visible');
        if (callback) callback();
    };
}

function showTargetSelector(power) {
    document.getElementById('target-title').textContent = `${power.toUpperCase()}: ESCOLHER ALVO`;

    const btns = state.players
        .map((p, i) => ({ p, i }))
        .filter(({ i }) => i !== state.currentPlayerIndex)
        .map(({ p, i }) => `<button class="btn-target" onclick="applyPowerTarget(${i})">${p.name}</button>`)
        .join('');

    document.getElementById('target-buttons').innerHTML = btns;
    document.getElementById('target-overlay').classList.add('visible');
}

function applyPowerTarget(targetIndex) {
    const power = state.players[state.currentPlayerIndex].powers[state.selectedPowerIndex];
    document.getElementById('target-overlay').classList.remove('visible');
    applyPower(power, state.currentPlayerIndex, targetIndex);
}

function showRoundResult(winners) {
    let text;
    if (winners.length === 0) {
        text = 'Todos estouraram!\nNinguém vence essa rodada.';
    } else if (winners.length === 1) {
        text = `${winners[0].name} venceu a rodada!\n${playerTotal(winners[0])} pontos.`;
    } else {
        text = `Empate!\n${winners.map(w => w.name).join(' e ')} venceram.`;
    }

    text += '\n\nPlacar: ' + state.players.map(p => `${p.name}: ${p.wins}`).join(' | ');

    document.getElementById('result-text').textContent = text;
    document.getElementById('result-overlay').classList.add('visible');
}

function showFinalWinner(champion) {
    document.getElementById('winner-name').textContent = champion.name;
    document.getElementById('winner-screen').classList.add('visible');
}

//RESET
function resetRound() {
    document.getElementById('result-overlay').classList.remove('visible');
    dealInitialCards();
}

function resetMatch() {
    document.getElementById('winner-screen').classList.remove('visible');
    state.players.forEach(p => { p.wins = 0; });
    dealInitialCards();
}

function backToMenu() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('winner-screen').classList.remove('visible');
    document.getElementById('menu-screen').style.display = 'flex';
    
    state = {
        deck: [],
        players: [],
        currentPlayerIndex: 0,
        targetWins: 3,
        selectedPowerIndex: null,
    };
    
    updateNameInputs();
}

// MENU

function updateNameInputs() {
    const count = parseInt(document.getElementById('player-count').value);
    const container = document.getElementById('player-names');
    let inputs = '';
    for (let i = 0; i < count; i++) {
        inputs += `<input type="text" class="menu-input" placeholder="Jogador ${i + 1}" id="pname-${i}" value="Jogador ${i + 1}">`;
    }
    container.innerHTML = `<span class="menu-label">NOMES DOS JOGADORES</span>${inputs}`;
}

function startGame() {
    const count = parseInt(document.getElementById('player-count').value);
    const names = [];
    for (let i = 0; i < count; i++) {
        const input = document.getElementById(`pname-${i}`);
        names.push(input.value.trim() || `Jogador ${i + 1}`);
    }

    state.targetWins = parseInt(document.getElementById('target-wins').value);
    state.players = createPlayers(names);
    state.deck = shuffleDeck(createDeck());

    document.getElementById('menu-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    dealInitialCards();
}

// CARD OVERLAP 
function adjustCardOverlap() {
    const containers = document.querySelectorAll('.container-player-cards');

    containers.forEach(container => {
        const cards = container.querySelectorAll('.cards');
        const containerWidth = 200;
        const cardWidth = 80;

        let totalWidth = cards.length * cardWidth;
        let requiredOverlap = 0;

        if (totalWidth > containerWidth) {
            let overflow = totalWidth - containerWidth;
            let overlapCount = cards.length - 1;

            requiredOverlap = overflow / overlapCount;

            cards.forEach((card, index) => {
                if (index > 0) {
                    card.style.marginLeft = `-${requiredOverlap}px`;
                }
            });
        } else {
            cards.forEach((card, index) => {
                if (index > 0) {
                    card.style.marginLeft = '0';
                }
            });
        }
    });
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('player-count').addEventListener('change', updateNameInputs);
    updateNameInputs();
});

window.addEventListener('resize', adjustCardOverlap);