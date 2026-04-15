var CURR_CANVAS_WIDTH;
var CURR_CANVAS_HEIGHT;
var CURR_LEVEL_ROWS;
var CURR_LEVEL_COLS;
var CURR_LEVEL_TARGET;

const LEVELS = []
const TILE = 35;
const E = 0;
const B = 1;
const T = 2;
const S = 3;
const P = 4;

const COLORS = {
    bg: '#000000',
    wall: '#424242',
    wallDark: '#252525',
    block: '#4a7c30',
    blockDark: '#2d5018',
    trail: '#9aff5f',
    trailDark: '#9aff5f',
    playerColors: ['#9aff5f', '#ffcc00', '#ff6a00', '#ff2512'],
    playerEye: '#ffffff',
    packColor: '#cd9f61',
    packDarkColor: '#c08f4f',
    empty: '#000000',
    apple: '#ff0000',
    appleStem: '#8B4513',
    appleLeaf: '#228B22'
};

LEVELS_STRING = [
`
###################
#........#........#
#........#.......T#
###............####
#.................#
#.................#
#..S...P..####....#
#..######.######..#
#.......#.#.......#
#.......###.......#
###..#######..#####
#.................#
#............P....#
#..........PPP....#
###################
`,
`
###################
#..#.#....#..#....#
#..#.#.T..#..######
#########.#..#....#
#....#..#.####....#
#....#..#....######
#########....#.#..#
#....#..#....#.#..#
#########.#########
#....#....#..#....#
######....#..#....#
#.#..#....#########
#.#..####.#..#..#.#
#.#..#..#S#..#..#.#
###################
`,
`
###################
#.................#
#.................#
#.................#
#...P.............#
#..###......###...#
#.................#
#.................#
#....S.......T....#
#########.#..#.####
###################
#.................#
#.................#
#.................#
###################
`,
    `
###################
#.................#
#...P.............#
#...P.............#
#...P.............#
#...PPP...........#
#...PPP.P.........#
#..PPPP.PP.......T#
#..PPPP.PP.......P#
#..PPPPPPP.....P.P#
#..PPPPPPP...P.P.P#
#.PPPPPPPPP..P.P.P#
#SPPPPPPPPP..P.PPP#
#PPPPPPPPPPPPP.PPP#
###################
`,
    `
###################
#...#....#....#...#
#.................#
##.###.####.###...#
#....#...#....#...#
#....#........#...#
###.##...#....##.##
#........####.#...#
#....#####....#...#
#....#........#...#
#........####.##.##
#.##.#...#....#...#
#.#..###.#........#
#....#T..#S#..#...#
###################
`,
    `
#############
#......P....#
#.######....#
#...........#
#.....P.....#
####..P.....#
#.....##....#
#...........#
#......#..#.#
#......#.#..#
#.S....#.#T.#
#############
`,
    `
###################
#..#...........#..#
#..#.....T.....#..#
#..#....###....#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#...........#..#
#..#.....S.....#..#
###################
`,
    `
###################
#.................#
#.................#
#.................#
#...P........P....#
#..###......###...#
#.................#
#...S........T....#
#########.##.#.####
###################
#.................#
#.................#
#.................#
###################
`,
    `
###################
#.................#
#...............P.#
#............####.#
#.................#
#.......#...#.#...#
#..S....#...#.#T..#
#.###############.#
#.###############.#
#.#...#...#...#...#
#...#...#...#...#.#
###################
#.................#
#.................#
###################
`,
    `
###################
#.................#
#.................#
#.................#
#.................#
#.T..........P....#
####.##.....###...#
#######.....###...#
#.................#
#.................#
#...S.............#
#..#############..#
###################
#.................#
###################
`
]

function generateLevels() {
    for (let ii = 0; ii < LEVELS_STRING.length; ii++) {
        LEVELS_STRING[ii] = LEVELS_STRING[ii].trim()

        let level = [];
        let start;
        let target;
        let rows = 1;
        let cols = null;

        let level_line = []
        for (let i = 0; i < LEVELS_STRING[ii].length; i++) {
            if (LEVELS_STRING[ii][i] == '\n') {
                if (cols === null) cols = i;
                rows++;
                level.push(level_line);
                level_line = [];
            }

            if (LEVELS_STRING[ii][i] === '#')
                level_line.push(B);

            else if (LEVELS_STRING[ii][i] === '.')
                level_line.push(E);

            else if (LEVELS_STRING[ii][i] === 'T') {
                level_line.push(T);
                target = [level_line.length - 1, level.length];
            }

            else if (LEVELS_STRING[ii][i] === 'P')
                level_line.push(P);

            else if (LEVELS_STRING[ii][i] === 'S') {
                level_line.push(S);
                start = [level_line.length - 1, level.length];
            }
        }

        if (level_line.length > 0) {
            level.push(level_line);
        }

        LEVELS.push({
            map: level,
            start: start,
            cols: cols,
            rows: rows,
            target: target
        });
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const levelSelect = document.getElementById('level-select');

let map, player, trail, playerJumpLevel, gameOver, won, currentLevelIdx = 0;

function deepCopy(arr) { return arr.map(r => [...r]); }

function initLevel(idx) {
    if (LEVELS.length === 0) {
        generateLevels();
    }

    const lvl = LEVELS[idx];

    CURR_LEVEL_ROWS = lvl.rows
    CURR_LEVEL_COLS = lvl.cols
    CURR_CANVAS_WIDTH = TILE * lvl.cols;
    CURR_CANVAS_HEIGHT = TILE * lvl.rows;
    CURR_LEVEL_TARGET = lvl.target

    // console.log(`CURR_LEVEL_ROWS ${CURR_LEVEL_ROWS}`);
    // console.log(`CURR_LEVEL_COLS ${CURR_LEVEL_COLS}`);
    // console.log(`CURR_CANVAS_WIDTH ${CURR_CANVAS_WIDTH}`);
    // console.log(`CURR_CANVAS_HEIGHT ${CURR_CANVAS_HEIGHT}`);
    // console.log(`CURR_LEVEL_TARGET ${CURR_LEVEL_TARGET}`);

    const canvas = document.getElementById('canvas');
    canvas.width = CURR_CANVAS_WIDTH;
    canvas.height = CURR_CANVAS_HEIGHT;
    playerJumpLevel = 0;

    map = deepCopy(lvl.map);
    const [sx, sy] = lvl.start;
    player = { x: sx, y: sy };
    trail = new Set();
    gameOver = false;
    won = false;
}

function isSolid(x, y) {
    if (x < 0 || x >= CURR_LEVEL_COLS || y < 0 || y >= CURR_LEVEL_ROWS) return true;
    return (map[y][x] === B || map[y][x] === S) || (trail.has(`${x},${y},h`) || trail.has(`${x},${y},v`));
}

function isPack(x, y) {
    if (x < 0 || x >= CURR_LEVEL_COLS || y < 0 || y >= CURR_LEVEL_ROWS) return false;
    return map[y][x] === P;
}

function isSolidOrPack(x, y) {
    if (x < 0 || x >= CURR_LEVEL_COLS || y < 0 || y >= CURR_LEVEL_ROWS) return true;
    return (map[y][x] === B || map[y][x] === S || map[y][x] === P) || (trail.has(`${x},${y},h`) || trail.has(`${x},${y},v`));
}

function returnPlayerJumpLevel(x, y) {
    let count = -1;
    let foundFloorOrHorizontalTrail = false;

    while (foundFloorOrHorizontalTrail === false) {
        y = y + 1;

        if ((map[y][x] === B || map[y][x] === P) || trail.has(`${x},${y},h`)) {
            foundFloorOrHorizontalTrail = true;
        }

        count = count + 1;
    }

    return count;
}

function hasFloorBelow(x, y) {
    return isSolid(x, y + 1) || isPack(x, y + 1);
}

function getCell(x, y) {
    if (x < 0 || x >= CURR_LEVEL_COLS || y < 0 || y >= CURR_LEVEL_ROWS) return B;
    return map[y][x];
}

function movePlayer(dx, dy) {
    if (gameOver || won) return;

    let px = player.x, py = player.y;
    const nx = px + dx;
    const ny = py + dy;
    const nextPlayerJumpLevel = returnPlayerJumpLevel(px, player.y + dy)
    console.log("nextPlayerJumpLevel: " + nextPlayerJumpLevel);

    if (dy === -1) {
        if (nextPlayerJumpLevel <= 3 && !isSolid(nx, ny) && !isPack(nx, ny)) {
            // console.log(`posicao do player x:${player.x}, y:${player.y}`);
            playerJumpLevel = nextPlayerJumpLevel
            trail.add(`${player.x},${player.y},v`);
            player.y = ny;
        }
    } else {
        if (isPack(nx, py)) {
            console.log(`is pack ${nx} e ${py}`);
            movePack(nx, py, dx);
        }

        if (!isSolid(nx, py) && !isPack(nx, py)) {
            player.x = nx;
            trail.add(`${px},${player.y},h`);

            // Aplicar gravidade no jogador
            while (!hasFloorBelow(player.x, player.y)) {
                trail.add(`${player.x},${player.y},v`);
                player.y++;
                if (player.y >= CURR_LEVEL_ROWS) break;
            }

            playerJumpLevel = returnPlayerJumpLevel(player.x, player.y)
        }
    }

    px = player.x;
    py = player.y;

    if (isSolidOrPack(px + 1, py) && isSolidOrPack(px - 1, py) && isSolidOrPack(px, py - 1)) {
        playerJumpLevel = 3;
    }

    console.log("currentPlayerJumpLevel: " + playerJumpLevel);

    checkWin();
    return;
}

function movePack(x, y, direction) {
    nx = x + direction;

    if (!isPack(x, y) || isPack(nx, y) || isSolid(nx, y)) return;

    map[y][x] = E;
    map[y][nx] = P;

    // Aplicar gravidade na caixa movida
    while (!hasFloorBelow(nx, y)) {
        map[y][nx] = E;
        y = y + 1;
        map[y][nx] = P;
    }
}

function checkWin() {
    if (CURR_LEVEL_TARGET[0] === player.x && CURR_LEVEL_TARGET[1] === player.y) won = true;
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

function drawBlock(x, y, color, darkColor) {
    const px = x * TILE;
    const py = y * TILE;

    ctx.fillStyle = color;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = darkColor;
    ctx.fillRect(px, py + TILE - 3, TILE, 3);
    ctx.fillRect(px + TILE - 3, py, 3, TILE);
    ctx.strokeStyle = darkColor;
}

function drawTarget(x, y, size) {
    const px = x * TILE;
    const py = y * TILE;

    // Draw the apple body (red square)
    ctx.fillStyle = COLORS.apple;
    ctx.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);

    // Draw a stem (brown)
    ctx.fillStyle = COLORS.appleStem;
    ctx.fillRect(px + TILE / 2 - 1, py - 8, 2, 10);

    // Draw a leaf (green)
    ctx.fillStyle = COLORS.appleLeaf;
    ctx.fillRect(px + TILE / 2 + 3, py - 6, 14, 8);
}

function drawPlayer(px, py) {
    const x = px * TILE, y = py * TILE;
    ctx.fillStyle = COLORS.playerColors[playerJumpLevel] || COLORS.playerColors[0];
    // Fill entire tile
    ctx.fillRect(x, y, TILE, TILE);
    
    // Draw large square eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 2, y + 3, 13, 13);
    ctx.fillRect(x + 20, y + 3, 13, 13);
    
    // Draw pupils - left eye looking left, right eye looking right
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 4, y + 7, 7, 7);
    ctx.fillRect(x + 26, y + 7, 7, 7);
}

function drawPack(x, y) {
    const px = x * TILE;
    const py = y * TILE;

    ctx.fillStyle = COLORS.packColor;
    ctx.fillRect(px, py, TILE, TILE);

    ctx.fillStyle = COLORS.packDarkColor;
    ctx.fillRect(px, py + TILE - 3, TILE, 3);
    ctx.fillRect(px + TILE - 3, py, 3, TILE);

    ctx.strokeStyle = COLORS.packDarkColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            const bx = px + i * 11, by = py + j * 17;
            ctx.strokeRect(bx + 1, by + 1, 9, 15);
        }
    }
}

function drawTrail(x, y) {
    const px = x * TILE;
    const py = y * TILE;

    // Draw trail background
    ctx.fillStyle = COLORS.trail;
    ctx.fillRect(px, py, TILE, TILE);
}

function draw() {
    ctx.clearRect(0, 0, CURR_CANVAS_WIDTH, CURR_CANVAS_HEIGHT);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, CURR_CANVAS_WIDTH, CURR_CANVAS_HEIGHT);

    for (let row = 0; row < CURR_LEVEL_ROWS; row++) {
        for (let col = 0; col < CURR_LEVEL_COLS; col++) {
            const cell = map[row][col];
            const isTrail = trail.has(`${col},${row},v`) || trail.has(`${col},${row},h`);

            if (cell === B) {
                drawBlock(col, row, COLORS.wall, COLORS.wallDark);
            } else if (isTrail)
                drawTrail(col, row);
            else if (cell === P) {
                drawPack(col, row);
            }
        }
    }

    if (!isPack(CURR_LEVEL_TARGET[0], CURR_LEVEL_TARGET[1])) {
        drawTarget(CURR_LEVEL_TARGET[0], CURR_LEVEL_TARGET[1], 8);
    }

    drawPlayer(player.x, player.y);

    if (won) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CURR_CANVAS_WIDTH, CURR_CANVAS_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Target Reached!', CURR_CANVAS_WIDTH / 2, CURR_CANVAS_HEIGHT / 2 - 16);
        ctx.font = '16px monospace';
        ctx.fillText('Press X for next level', CURR_CANVAS_WIDTH / 2, CURR_CANVAS_HEIGHT / 2 + 20);
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'r', 'x'].includes(key)) {
        e.preventDefault();
    }

    if (key === 'arrowleft' || key === 'a') movePlayer(-1, 0);
    if (key === 'arrowright' || key === 'd') movePlayer(1, 0);
    if (key === 'arrowup' || key === 'w') movePlayer(0, -1);

    if (key === 'r') initLevel(currentLevelIdx);

    if (key === 'x' && won) {
        if (currentLevelIdx < LEVELS.length - 1) {
            currentLevelIdx++;
            console.log("loading map " + currentLevelIdx);
            initLevel(currentLevelIdx);
        } else {
            console.log("loading map 0");
            currentLevelIdx = 0;
            initLevel(0);
        }

        renderLevelSelector();
    }
});

const links = document.querySelectorAll('a');
const container = document.getElementById('game-level-selector');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        console.log('clicou:', link.textContent);

        const level = link.textContent.replace('level ', '');
        initLevel(parseInt(level));
    });
});

function renderLevelSelector() {
    container.innerHTML = '';

    LEVELS.forEach((_, index) => {
        const link = document.createElement('a');

        link.href = '#';
        link.textContent = `level ${index}`;

        if (index === currentLevelIdx) {
            link.classList.add('active');
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentLevelIdx = index;
            initLevel(index);
            renderLevelSelector();
        });

        container.appendChild(link);
    });
}

initLevel(0);
gameLoop();
renderLevelSelector();

function renderLevelSelector() {
    container.innerHTML = '';

    LEVELS.forEach((_, index) => {
        const link = document.createElement('a');

        link.href = '#';
        link.textContent = `level ${index}`;

        if (index === currentLevelIdx) {
            link.classList.add('active');
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentLevelIdx = index;
            initLevel(index);
            renderLevelSelector();
        });

        container.appendChild(link);
    });
}

initLevel(0);
gameLoop();
renderLevelSelector();

