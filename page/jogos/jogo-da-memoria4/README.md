# Jogo da Memória

Jogo da memória desenvolvido com HTML, CSS e JavaScript puro, sem dependências externas.

## Como jogar

1. Escolha a dificuldade no topo da tela
2. Clique em uma carta para virá-la
3. Clique em uma segunda carta tentando encontrar o par
4. Pares corretos ficam destacados em verde — erros voltam para baixo
5. Complete o tabuleiro no menor tempo e número de tentativas possível

## Modos de dificuldade

| Modo | Tabuleiro | Pares |
|------|-----------|-------|
| Fácil | 2×2 | 2 |
| Médio | 4×4 | 8 |
| Médio+ | 4×6 | 12 |
| Difícil | 6×6 | 18 |
| Difícil+ | 6×8 | 24 |
| Extremo | 8×8 | 32 |

## Funcionalidades

- Embaralhamento com algoritmo de Fisher-Yates
- Animação de virada 3D via CSS
- Cronômetro que inicia no primeiro clique
- Sistema de combo para acertos consecutivos
- Pontuação final baseada em tentativas e tempo
- Layout responsivo para desktop e mobile

## Estrutura

/
├── index.html   # estrutura e marcação
├── styles.css   # estilos, variáveis e animações
└── script.js    # lógica do jogo e embaralhamento

## Como executar

Basta abrir o arquivo `index.html` diretamente no navegador — nenhuma instalação necessária.

## Tecnologias

- HTML5
- CSS3 (custom properties, transform 3D, keyframes)
- JavaScript ES6+