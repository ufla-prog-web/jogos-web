// ============================================================
// STAR DEFENDER — Jogo Web (HTML + CSS + JavaScript Puro)
// ============================================================

// ===== REFERÊNCIAS DOM =====
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const btnMenu = document.getElementById('btn-menu');

const hudScore = document.getElementById('hud-score');
const hudLevel = document.getElementById('hud-level');
const hudLives = document.getElementById('hud-lives');
const hudHighscore = document.getElementById('hud-highscore');

const finalScore = document.getElementById('final-score');
const finalLevel = document.getElementById('final-level');
const finalHighscore = document.getElementById('final-highscore');

// ===== CONFIGURAÇÕES DO JOGO =====
const CONFIG = {
    PLAYER_SPEED: 6,
    PLAYER_WIDTH: 40,
    PLAYER_HEIGHT: 40,
    BULLET_SPEED: 8,
    BULLET_WIDTH: 4,
    BULLET_HEIGHT: 14,
    SHOOT_COOLDOWN: 200,       // ms entre tiros
    ENEMY_BASE_SPEED: 2,
    ENEMY_SPAWN_INTERVAL: 1200, // ms
    ASTEROID_BASE_SPEED: 1.5,
    ASTEROID_SPAWN_INTERVAL: 2000,
    LEVEL_UP_SCORE: 500,       // pontos para subir de nível
    MAX_LIVES: 3,
    STAR_COUNT: 120,
    PARTICLE_COUNT: 12,
};

// ===== ESTADO DO JOGO =====
let game = {};
let keys = {};
let animationId = null;
let lastTime = 0;
let enemyTimer = 0;
let asteroidTimer = 0;

// ===== INICIALIZAÇÃO =====
function initGame() {
    resizeCanvas();

    game = {
        running: false,
        score: 0,
        level: 1,
        lives: CONFIG.MAX_LIVES,
        highscore: getHighscore(),
        player: {
            x: canvas.width / 2 - CONFIG.PLAYER_WIDTH / 2,
            y: canvas.height - 70,
            width: CONFIG.PLAYER_WIDTH,
            height: CONFIG.PLAYER_HEIGHT,
            lastShot: 0,
            invincible: false,
            invincibleTimer: 0,
        },
        bullets: [],
        enemies: [],
        asteroids: [],
        particles: [],
        stars: [],
    };

    // Gerar estrelas de fundo
    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
        game.stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 1.5 + 0.3,
            brightness: Math.random() * 0.5 + 0.5,
        });
    }

    enemyTimer = 0;
    asteroidTimer = 0;

    updateHUD();
}

// ===== CANVAS RESPONSIVO =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    if (game.player) {
        game.player.y = canvas.height - 70;
        if (game.player.x > canvas.width - game.player.width) {
            game.player.x = canvas.width - game.player.width;
        }
    }
});

// ===== CONTROLES =====
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    // Atalho: Enter para reiniciar no game over
    if (e.code === 'Enter' && !gameoverScreen.classList.contains('hidden')) {
        startGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Botões
btnStart.addEventListener('click', startGame);
btnRestart.addEventListener('click', startGame);
btnMenu.addEventListener('click', showMenu);

// ===== NAVEGAÇÃO DE TELAS =====
function showScreen(screen) {
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function showMenu() {
    if (animationId) cancelAnimationFrame(animationId);
    game.running = false;
    showScreen(startScreen);
}

function startGame() {
    initGame();
    game.running = true;
    showScreen(gameScreen);
    lastTime = performance.now();
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    game.running = false;
    if (animationId) cancelAnimationFrame(animationId);

    // Salvar recorde
    if (game.score > game.highscore) {
        game.highscore = game.score;
        saveHighscore(game.score);
    }

    // Atualizar tela de game over
    finalScore.textContent = game.score;
    finalLevel.textContent = game.level;
    finalHighscore.textContent = game.highscore;

    showScreen(gameoverScreen);
}

// ===== GAME LOOP =====
function gameLoop(timestamp) {
    if (!game.running) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    animationId = requestAnimationFrame(gameLoop);
}

// ===== ATUALIZAÇÃO =====
function update(dt) {
    updatePlayer(dt);
    updateBullets();
    updateEnemies(dt);
    updateAsteroids(dt);
    updateParticles();
    updateStars();
    spawnEnemies(dt);
    spawnAsteroids(dt);
    checkCollisions();
    checkLevelUp();
    updateHUD();
}

function updatePlayer(dt) {
    const p = game.player;

    // Movimentação
    if (keys['ArrowLeft'] || keys['KeyA']) {
        p.x -= CONFIG.PLAYER_SPEED;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        p.x += CONFIG.PLAYER_SPEED;
    }

    // Limites da tela
    if (p.x < 0) p.x = 0;
    if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;

    // Tiro
    if (keys['Space']) {
        const now = performance.now();
        if (now - p.lastShot >= CONFIG.SHOOT_COOLDOWN) {
            p.lastShot = now;
            game.bullets.push({
                x: p.x + p.width / 2 - CONFIG.BULLET_WIDTH / 2,
                y: p.y - CONFIG.BULLET_HEIGHT,
                width: CONFIG.BULLET_WIDTH,
                height: CONFIG.BULLET_HEIGHT,
            });
        }
    }

    // Invencibilidade temporária
    if (p.invincible) {
        p.invincibleTimer -= dt;
        if (p.invincibleTimer <= 0) {
            p.invincible = false;
        }
    }
}

function updateBullets() {
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        game.bullets[i].y -= CONFIG.BULLET_SPEED;
        if (game.bullets[i].y + game.bullets[i].height < 0) {
            game.bullets.splice(i, 1);
        }
    }
}

function updateEnemies(dt) {
    const speed = CONFIG.ENEMY_BASE_SPEED + (game.level - 1) * 0.4;
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const e = game.enemies[i];
        e.y += speed;
        // Movimento lateral senoidal
        e.x += Math.sin(e.y * 0.02 + e.phase) * 1.2;

        if (e.y > canvas.height + 50) {
            game.enemies.splice(i, 1);
        }
    }
}

function updateAsteroids(dt) {
    const speed = CONFIG.ASTEROID_BASE_SPEED + (game.level - 1) * 0.3;
    for (let i = game.asteroids.length - 1; i >= 0; i--) {
        const a = game.asteroids[i];
        a.y += speed;
        a.rotation += a.rotSpeed;

        if (a.y > canvas.height + 60) {
            game.asteroids.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.97;

        if (p.life <= 0 || p.size < 0.3) {
            game.particles.splice(i, 1);
        }
    }
}

function updateStars() {
    for (const star of game.stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

// ===== SPAWNS =====
function spawnEnemies(dt) {
    enemyTimer += dt;
    const interval = Math.max(400, CONFIG.ENEMY_SPAWN_INTERVAL - (game.level - 1) * 80);
    if (enemyTimer >= interval) {
        enemyTimer = 0;
        const size = 30 + Math.random() * 15;
        game.enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            phase: Math.random() * Math.PI * 2,
            hp: 1,
        });
    }
}

function spawnAsteroids(dt) {
    asteroidTimer += dt;
    const interval = Math.max(600, CONFIG.ASTEROID_SPAWN_INTERVAL - (game.level - 1) * 100);
    if (asteroidTimer >= interval) {
        asteroidTimer = 0;
        const size = 20 + Math.random() * 30;
        game.asteroids.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            radius: size / 2,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            hp: 2,
        });
    }
}

// ===== COLISÕES =====
function checkCollisions() {
    const p = game.player;

    // Tiros vs Inimigos
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const b = game.bullets[i];

        // Tiro vs Inimigo
        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const e = game.enemies[j];
            if (rectCollision(b, e)) {
                game.bullets.splice(i, 1);
                e.hp--;
                if (e.hp <= 0) {
                    spawnExplosion(e.x + e.width / 2, e.y + e.height / 2, '#ff6b6b');
                    game.enemies.splice(j, 1);
                    game.score += 100;
                }
                break;
            }
        }

        // Tiro vs Asteroide
        if (i < game.bullets.length) {
            const b2 = game.bullets[i];
            for (let j = game.asteroids.length - 1; j >= 0; j--) {
                const a = game.asteroids[j];
                if (rectCircleCollision(b2, a)) {
                    game.bullets.splice(i, 1);
                    a.hp--;
                    if (a.hp <= 0) {
                        spawnExplosion(a.x, a.y, '#a0a0a0');
                        game.asteroids.splice(j, 1);
                        game.score += 50;
                    }
                    break;
                }
            }
        }
    }

    // Jogador vs Inimigos
    if (!p.invincible) {
        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const e = game.enemies[j];
            if (rectCollision(p, e)) {
                spawnExplosion(e.x + e.width / 2, e.y + e.height / 2, '#ff6b6b');
                game.enemies.splice(j, 1);
                playerHit();
                break;
            }
        }

        // Jogador vs Asteroides
        for (let j = game.asteroids.length - 1; j >= 0; j--) {
            const a = game.asteroids[j];
            const playerRect = { x: p.x, y: p.y, width: p.width, height: p.height };
            if (rectCircleCollision(playerRect, a)) {
                spawnExplosion(a.x, a.y, '#a0a0a0');
                game.asteroids.splice(j, 1);
                playerHit();
                break;
            }
        }
    }
}

function playerHit() {
    game.lives--;
    if (game.lives <= 0) {
        spawnExplosion(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2, '#f7d94e');
        gameOver();
    } else {
        game.player.invincible = true;
        game.player.invincibleTimer = 2000; // 2 segundos de invencibilidade
    }
}

function rectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function rectCircleCollision(rect, circle) {
    const cx = circle.x;
    const cy = circle.y;
    const r = circle.radius;

    const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    const dx = cx - nearestX;
    const dy = cy - nearestY;

    return (dx * dx + dy * dy) < (r * r);
}

// ===== PARTÍCULAS / EXPLOSÃO =====
function spawnExplosion(x, y, color) {
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        game.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: color,
            life: 1.0,
        });
    }
}

// ===== NÍVEL =====
function checkLevelUp() {
    const newLevel = Math.floor(game.score / CONFIG.LEVEL_UP_SCORE) + 1;
    if (newLevel > game.level) {
        game.level = newLevel;
        // Flash visual (partículas douradas)
        for (let i = 0; i < 20; i++) {
            spawnExplosion(
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.3,
                '#f7d94e'
            );
        }
    }
}

// ===== DESENHO =====
function draw() {
    // Limpar canvas
    ctx.fillStyle = '#0a0a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    drawBullets();
    drawEnemies();
    drawAsteroids();
    drawParticles();
    drawPlayer();
}

function drawStars() {
    for (const star of game.stars) {
        ctx.globalAlpha = star.brightness;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawPlayer() {
    const p = game.player;

    // Piscar quando invencível
    if (p.invincible && Math.floor(performance.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.3;
    }

    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    // Corpo da nave (triângulo principal)
    ctx.fillStyle = '#4a90d9';
    ctx.beginPath();
    ctx.moveTo(0, -p.height / 2);           // Ponta superior
    ctx.lineTo(-p.width / 2, p.height / 2); // Base esquerda
    ctx.lineTo(p.width / 2, p.height / 2);  // Base direita
    ctx.closePath();
    ctx.fill();

    // Detalhe central
    ctx.fillStyle = '#8ab4f8';
    ctx.beginPath();
    ctx.moveTo(0, -p.height / 2 + 6);
    ctx.lineTo(-p.width / 4, p.height / 2 - 4);
    ctx.lineTo(p.width / 4, p.height / 2 - 4);
    ctx.closePath();
    ctx.fill();

    // Cockpit (janela)
    ctx.fillStyle = '#f7d94e';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Chama do propulsor
    const flameSize = 5 + Math.random() * 8;
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(-6, p.height / 2);
    ctx.lineTo(0, p.height / 2 + flameSize);
    ctx.lineTo(6, p.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f7d94e';
    ctx.beginPath();
    ctx.moveTo(-3, p.height / 2);
    ctx.lineTo(0, p.height / 2 + flameSize * 0.6);
    ctx.lineTo(3, p.height / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
}

function drawBullets() {
    for (const b of game.bullets) {
        // Brilho do tiro
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#4af7d9';

        ctx.fillStyle = '#4af7d9';
        ctx.fillRect(b.x, b.y, b.width, b.height);

        // Glow adicional
        ctx.fillStyle = 'rgba(74, 247, 217, 0.3)';
        ctx.fillRect(b.x - 2, b.y, b.width + 4, b.height);

        ctx.shadowBlur = 0;
    }
}

function drawEnemies() {
    for (const e of game.enemies) {
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

        // Corpo do inimigo (diamante/losango)
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(0, -e.height / 2);
        ctx.lineTo(e.width / 2, 0);
        ctx.lineTo(0, e.height / 2);
        ctx.lineTo(-e.width / 2, 0);
        ctx.closePath();
        ctx.fill();

        // Detalhe interno
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.moveTo(0, -e.height / 4);
        ctx.lineTo(e.width / 4, 0);
        ctx.lineTo(0, e.height / 4);
        ctx.lineTo(-e.width / 4, 0);
        ctx.closePath();
        ctx.fill();

        // Olho/núcleo
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function drawAsteroids() {
    for (const a of game.asteroids) {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);

        // Asteroide (polígono irregular)
        ctx.fillStyle = '#6b6b6b';
        ctx.beginPath();
        const sides = 7;
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const variation = 0.7 + Math.sin(i * 2.5) * 0.3;
            const r = a.radius * variation;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Borda
        ctx.strokeStyle = '#8a8a8a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crateras
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.arc(a.radius * 0.2, -a.radius * 0.2, a.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-a.radius * 0.3, a.radius * 0.15, a.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function drawParticles() {
    for (const p of game.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// ===== HUD =====
function updateHUD() {
    hudScore.textContent = game.score;
    hudLevel.textContent = game.level;
    hudHighscore.textContent = game.highscore;

    let hearts = '';
    for (let i = 0; i < game.lives; i++) hearts += '❤️';
    for (let i = game.lives; i < CONFIG.MAX_LIVES; i++) hearts += '🖤';
    hudLives.textContent = hearts;
}

// ===== LOCAL STORAGE (RECORDE) =====
function getHighscore() {
    return parseInt(localStorage.getItem('stardefender_highscore')) || 0;
}

function saveHighscore(score) {
    localStorage.setItem('stardefender_highscore', score.toString());
}

// ===== CARREGAR RECORDE INICIAL =====
hudHighscore.textContent = getHighscore();
