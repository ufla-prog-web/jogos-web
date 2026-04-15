# Corda Certa

Jogo web de memória inspirado no Genius, com identidade visual e sonora baseada em violão acústico. O projeto foi desenvolvido com HTML, CSS e JavaScript puro, sem dependências externas.

## Demo

https://joaogsribeiro.github.io/corda_certa/

## Visão geral

No Corda Certa, o jogador deve reproduzir corretamente a sequência de notas exibida em cada rodada. A dificuldade aumenta progressivamente com a adição de uma nova nota por nível.

## Funcionalidades

- Progressão por níveis com aumento gradual de dificuldade.
- Sistema de pontuação por nível concluído.
- Registro de melhor pontuação no navegador via `localStorage`.
- Feedback sonoro por nota utilizando arquivos em `assets/sounds`.
- Interface responsiva para desktop e dispositivos móveis.
- Reinício rápido para novas tentativas.

## Regras do jogo

1. Inicie a partida.
2. Observe a sequência de notas apresentada.
3. Repita a sequência na ordem correta.
4. Em caso de erro, a partida é encerrada.
5. O objetivo é alcançar o nível 10.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)

## Estrutura do projeto

```text
corda_certa/
├── assets
│   └── sounds
│       ├── do.mp3
│       ├── fa.mp3
│       ├── mi.mp3
│       └── re.mp3
├── index.html
├── LICENSE
├── README.md
├── script.js
└── style.css
```

## Execução local

Abra `index.html` em qualquer navegador moderno.

## Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
