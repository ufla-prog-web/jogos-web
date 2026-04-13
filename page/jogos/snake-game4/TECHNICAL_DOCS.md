# 📚 Documentação Técnica do Snake Game

## 🏗️ Arquitetura do Código

### Estrutura Geral

O projeto utiliza uma arquitetura baseada em:
- **HTML**: Estrutura semântica e canvas para renderização
- **CSS**: Estilização modular e responsiva
- **JavaScript**: Lógica de jogo com padrão de game loop

### Fluxo do Jogo

```
Inicialização
    ↓
Input Handler (Teclado)
    ↓
Update Logic (Movimento, Colisão, Pontuação)
    ↓
Render (Desenhar no Canvas)
    ↓
RequestAnimationFrame (Loop)
```

## 📑 Estrutura de Dados

### Cobra (Snake)
```javascript
snake = [
    { x: 10, y: 10 },  // Cabeça
    { x: 9, y: 10 },   // Corpo
    { x: 8, y: 10 }    // Cauda
]
```

### Comida (Food)
```javascript
food = {
    x: 15,  // Coluna (0-19)
    y: 12   // Linha (0-19)
}
```

### Direção (Direction)
```javascript
snakeDirection = {
    x: 1,   // -1 (esquerda), 0 (parado), 1 (direita)
    y: 0    // -1 (cima), 0 (parado), 1 (baixo)
}
```

## 🎮 Estados do Jogo

| Estado | Descrição |
|--------|-----------|
| **Pronto** | Jogo não iniciado, aguardando clique do usuário |
| **Jogando** | Jogo em execução, atualizando a cada frame |
| **Pausado** | Jogo parado, mas pode ser retomado |
| **Game Over** | Colisão detectada, jogo finalizado |

## 🔧 Funções Principais

### `generateFood()`
Gera uma nova posição aleatória para a comida, garantindo que não apareça sobre a cobra.

**Lógica:**
1. Gera coordenadas (x, y) aleatórias
2. Verifica se cola com algum segmento da cobra
3. Se colidir, gera novas coordenadas
4. Repete até encontrar posição livre

### `updateGame()`
Atualiza a lógica do jogo em cada frame.

**Operações:**
1. Calcula nova posição da cabeça
2. Verifica colisão com paredes
3. Verifica colisão com corpo
4. Verifica colisão com comida
5. Aumenta velocidade progressivamente

### `drawGame()`
Renderiza todos os elementos visuais no canvas.

**Elementos desenhados:**
- Grade de fundo (opcional)
- Cobra (cabeça em verde claro, corpo em verde escuro)
- Olhos da cobra (indicam direção)
- Comida (quadrado vermelho)

### `gameLoop(frame)`
Loop principal que controla o frame rate do jogo.

**Implementação:**
- Usa `requestAnimationFrame` para otimização
- Controla a velocidade com `deltaTime`
- Chama `updateGame()` a cada intervalo
- Chama `drawGame()` a cada frame

## ⌨️ Mapeamento de Controles

### Setas do Teclado
- `ArrowUp`: Move cobra para cima
- `ArrowDown`: Move cobra para baixo
- `ArrowLeft`: Move cobra para esquerda
- `ArrowRight`: Move cobra para direita

### Teclas WASD
- `W`: Move cobra para cima
- `S`: Move cobra para baixo
- `A`: Move cobra para esquerda
- `D`: Move cobra para direita

### Outras Teclas
- `Space`: Pausa/Retoma o jogo

## 🐍 Algoritmo de Colisão

### Colisão com Paredes
```javascript
if (head.x < 0 || head.x >= tileCount || 
    head.y < 0 || head.y >= tileCount) {
    endGame();
}
```

### Colisão com o Corpo
```javascript
if (snake.some(segment => 
    segment.x === head.x && segment.y === head.y)) {
    endGame();
}
```

### Colisão com Comida
```javascript
if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = generateFood();
    gameSpeed += 0.1;
    // Não remove a cauda (cobra cresce)
}
```

## 💾 Persistência de Dados

O recorde é salvo no **localStorage** do navegador:

```javascript
// Salvar recorde
localStorage.setItem('snakeHighScore', highScore);

// Recuperar recorde
let highScore = localStorage.getItem('snakeHighScore') || 0;
```

**Vantagens:**
- Dados persistem entre sessões
- Funciona offline
- Sem necessidade de servidor

**Limitações:**
- Dados por domínio
- Usuários podem limpar cache
- Limite de ~5-10MB dependendo do navegador

## 🚀 Otimizações Implementadas

### 1. RequestAnimationFrame
```javascript
requestAnimationFrame(gameLoop);
```
- Sincroniza com a taxa de refresh do monitor (60 FPS)
- Mais eficiente que `setInterval`
- Pausa automaticamente em abas inativas

### 2. Delta Time
```javascript
if (deltaTime >= updateInterval) {
    updateGame(); // Atualiza apenas quando necessário
}
```
- Desacopla lógica de renderização da atualização
- Permite múltiplas velocidades de jogo
- Melhor performance em sistemas lentos

### 3. Verificação de Colisão Otimizada
```javascript
snake.some(segment => ...) // Para na primeira colisão
```
- Usa `some()` em vez de `forEach()`
- Interrompe iteração ao encontrar colisão

## 📊 Métricas de Performance

- **Velocidade Base**: 6 atualizações por segundo
- **Velocidade Máxima**: 12 atualizações por segundo
- **Incremento**: 0.1 por comida (100 comidas para max)
- **Pontuação**: 10 pontos por comida

## 🎨 Paleta de Cores

| Elemento | Cor | Código Hex |
|----------|-----|-----------|
| Fundo Principal | Roxo Gradiente | `#667eea` → `#764ba2` |
| Container | Branco | `#ffffff` |
| Cobra (Cabeça) | Verde Claro | `#00ff00` |
| Cobra (Corpo) | Verde Escuro | `#00aa00` |
| Comida | Vermelho | `#ff6b6b` |
| Fundo Canvas | Preto | `#1a1a1a` |
| Texto Principal | Cinza Escuro | `#333333` |
| Texto Secundário | Cinza Médio | `#666666` |

## 🔒 Validações e Regras

### Direção Oposta Bloqueada
```javascript
if (snakeDirection.y === 0) { // Só mudar se não está em movimento vertical
    snakeNextDirection = { x: 0, y: -1 };
}
```
Previne que o jogador mude de direção para a oposta (causando auto-colisão instantânea).

### Velocidade Progressiva
```javascript
if (gameSpeed < gameSpeedMax) {
    gameSpeed += 0.1;
}
```
A velocidade aumenta suavemente conforme joga, mas respeita um limite máximo.

## 🐛 Possíveis Melhorias Futuras

### 1. Temas Customizáveis
```javascript
theme = {
    snakeHeadColor: '#00ff00',
    snakeBodyColor: '#00aa00',
    foodColor: '#ff6b6b'
}
```

### 2. Sistema de Dificuldade
```javascript
const difficulties = {
    easy: { startSpeed: 4, maxSpeed: 8 },
    medium: { startSpeed: 6, maxSpeed: 12 },
    hard: { startSpeed: 8, maxSpeed: 16 }
}
```

### 3. Obstáculos
```javascript
obstacles = [
    { x: 10, y: 10 },
    { x: 15, y: 15 }
]
```

### 4. Power-ups
```javascript
powerups = {
    slow: 'Desacelera o jogo',
    grow: 'Cresce 3 segmentos',
    shield: 'Imunidade de 1 colisão'
}
```

### 5. Múltiplos Mundos
```javascript
maps = {
    classic: { width: 400, height: 400 },
    wide: { width: 600, height: 400 },
    tall: { width: 400, height: 600 }
}
```

### 6. Modo Multijogador Local
```javascript
players = [
    { snake: [...], controls: 'WASD' },
    { snake: [...], controls: 'Arrows' }
]
```

### 7. Sistema de Som
```javascript
sounds = {
    eat: new Audio('eat.mp3'),
    gameOver: new Audio('gameover.mp3'),
    bgm: new Audio('bgm.mp3')
}
```

### 8. Leaderboard Online
```javascript
// Salvar scores em um servidor
fetch('/api/scores', {
    method: 'POST',
    body: JSON.stringify({ name: playerName, score: score })
})
```

## 🧪 Testando o Jogo

### Testes Manuais Recomendados

1. **Teste de Movimento**: Mova em todas as direções
2. **Teste de Colisão**: Bata em cada parede
3. **Teste de Auto-Colisão**: Tente colidir consigo mesmo
4. **Teste de Comida**: Coma pelo menos 10 comidas
5. **Teste de Pausa**: Pause e retome várias vezes
6. **Teste de Reinício**: Reinicie o jogo múltiplas vezes
7. **Teste de Recorde**: Verifique se o recorde é salvo
8. **Teste de Responsividade**: Teste em diferentes tamanhos de tela

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile (iOS Safari, Chrome Mobile)

---

**Última atualização**: 03/04/2026
