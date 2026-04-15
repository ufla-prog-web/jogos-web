# Quase Tetris

Projeto simples de Tetris em JavaScript puro, com interface em HTML e CSS.

## O que tem no projeto

- Tabuleiro 10x20
- Queda, movimentação e rotação de peças
- Pontuação
- Pré-visualização da próxima peça
- Pausa e reinício
- Ranking de melhores pontuações

## Como executar

1. Abra a pasta do projeto.
2. Abra o arquivo `index.html` no navegador.

## Controles

- A: mover para a esquerda
- D: mover para a direita
- S: acelerar queda
- W: girar peça
- ESC: pausar/continuar
- Enter: iniciar
- R: reiniciar
- M: voltar para a tela inicial

## Estrutura básica

- `index.html`: estrutura da interface
- `styles.css`: estilos visuais
- `state.js`: estado global do jogo
- `pieces.js`: definição das peças
- `board.js`: regras do tabuleiro
- `game.js`: lógica principal
- `controls.js`: entrada de teclado
