# 🚀 Star Defender — Jogo Web

**Star Defender** é um jogo de nave espacial (space shooter) desenvolvido com HTML, CSS e JavaScript puro, jogável diretamente no navegador.

## 🎮 Como Jogar

- **Mover a nave:** Use as setas `←` `→` ou as teclas `A` / `D`
- **Atirar:** Barra de espaço (`Space`)
- **Objetivo:** Destrua os asteroides e naves inimigas para acumular pontos
- **Vidas:** Você começa com 3 vidas. Colisões com inimigos reduzem suas vidas
- **Game Over:** O jogo termina quando todas as vidas acabam
- **Reiniciar:** Pressione `Enter` na tela de Game Over para jogar novamente

## ⭐ Funcionalidades

- Nave controlada pelo jogador com movimentação suave
- Tiros com cooldown
- Asteroides e naves inimigas com spawn aleatório
- Sistema de pontuação com recorde (High Score) salvo no `localStorage`
- Níveis de dificuldade progressiva (velocidade aumenta com o tempo)
- Efeitos visuais de explosão (partículas)
- Estrelas animadas no fundo (parallax)
- Interface responsiva com tela de início, HUD e tela de Game Over
- Totalmente funcional no navegador, sem dependências externas

## 🛠️ Tecnologias

- **HTML5** — Estrutura e Canvas
- **CSS3** — Estilização e layout
- **JavaScript (ES6)** — Lógica do jogo, manipulação do DOM, Canvas API

## 📁 Estrutura do Projeto

```
├── index.html        # Página principal
├── css/
│   └── style.css     # Estilos do jogo
├── js/
│   └── game.js       # Lógica do jogo
├── LICENSE           # Licença MIT
└── README.md         # Documentação
```

## 🚀 Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/star-defender.git
   ```
2. Abra o arquivo `index.html` no navegador.

Ou acesse diretamente pelo **GitHub Pages**.

## 📜 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
