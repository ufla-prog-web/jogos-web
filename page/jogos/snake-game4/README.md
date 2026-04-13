# Snake Game

Projeto de jogo da cobrinha feito com HTML, CSS e JavaScript puro.

## Sobre o projeto

Este jogo foi desenvolvido para praticar:
- estrutura de paginas com HTML
- estilizacao com CSS
- manipulacao do DOM com JavaScript
- eventos de teclado e botoes
- logica de jogo (estado, pontuacao, colisao e reinicio)

## Funcionalidades

- Controle da cobra por teclado (`setas` ou `WASD`)
- Sistema de pontuacao
- Recorde salvo no navegador (`localStorage`)
- Aumento progressivo de velocidade
- Estados de jogo: pronto, jogando, pausado e game over
- Reinicio da partida por botao

## Regras

- Cada comida vale `10 pontos`
- Se bater na parede, o jogo termina
- Se bater no proprio corpo, o jogo termina
- O objetivo e fazer a maior pontuacao possivel

## Como executar

1. Baixe ou clone o repositorio
2. Abra `index.html` no navegador
3. Clique em `Iniciar Jogo`

Opcional (servidor local):

```bash
python -m http.server 8000
```

Depois, abra `http://localhost:8000`.

## Estrutura de arquivos

- `index.html`: estrutura da pagina
- `style.css`: layout e estilo
- `script.js`: logica do jogo
- `LICENSE`: licenca MIT

## Controles

- `ArrowUp` ou `W`: sobe
- `ArrowDown` ou `S`: desce
- `ArrowLeft` ou `A`: esquerda
- `ArrowRight` ou `D`: direita
- `Espaco`: pausar/retomar

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo `LICENSE`.
