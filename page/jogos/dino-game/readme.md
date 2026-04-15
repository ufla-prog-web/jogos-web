# UFLA Dino Game 🦖

![Licença](https://img.shields.io/badge/License-MIT-blue.svg)

Este projeto foi desenvolvido como requisito para a **Atividade Prática 1 – Desenvolvimento de Jogo Web** da disciplina **GAC116 - Programação Web - 2026/1**, cujo objetivo é criar um jogo digital interativo utilizando os conceitos fundamentais do desenvolvimento web front-end puro (Vanilla).

## 🚀 Tecnologias Utilizadas

O jogo foi construído inteiramente do zero, sendo desenvolvido utilizando apenas as linguagens padrão da Web:
- **HTML5:** Estruturação dos elementos da página (Canvas, menus, sistema de pontuação).
- **CSS3:** Estilização da interface com foco no padrão UI Design moderno, aplicando *Glassmorphism*, gradientes em movimento e responsividade garantindo um ambiente visual vibrante.
- **JavaScript (Vanilla):** Toda a inteligência do fluxo, animações (`requestAnimationFrame`), checagens de estado, colisões, movimentação via físicas matemáticas simples e persistência (armazenamento de dados localmente).

## 🎮 O Jogo e Regras

**Proposta:**
O Dino Game é um Endless Runner (Jogo de Corrida Infinita) de sobrevivência. Você controla um quadrado azul ágil que precisa escapar de uma chuva incessante de torres avermelhadas deslizando em sua direção.

**Regras e Objetivo:**
1. O objetivo do jogador é sobreviver o maior tempo possível.
2. A pontuação sobe automaticamente conforme o jogador se mantém vivo no tempo percorrido.
3. Se o jogador encostar o seu bloco azul nos obstáculos (quadrados vermelhos), ocorre colisão e o jogo é finalizado (*Game Over*).
4. O sistema marca e salva a maior pontuação conseguida (`High Score`) diretamente no dispositivo do usuário para ser superada nas próximas corridas.

**Controles:**
- Pressione a tecla **[Espaço]** para o quadrado iniciar o jogo.
- Durante a corrida, a qualquer momento em que o quadrado estiver no chão, pressione a tecla **[Espaço]** para pular através dos obstáculos.

## ⚙️ Principais Decisões Técnicas

*   **Renderização na Tela:** Ao invés de manipular centenas de variáveis complexas e pesadas de tags no DOM em tempo real, optou-se pela utilização da API gráfica `<canvas>`, tornando a pintura do boneco e obstáculos infinitamente mais rápida, performática e fluida.
*   **Controle de Estados (State Machine):** A organização do JavaScript foi modularizada com lógicas de Estado (`'START'`, `'PLAYING'`, `'GAME_OVER'`), onde as próprias funções determinam os cenários visíveis.
*   **Posicionamentos Dinâmicos:** A geração randômica de obstáculos usa inteligência artificial para descobrir qual a distância exata em pixel desde a última torre criada. Isso impede cenários injustos ou becos-sem-saída, calibrando o *spawn rate* (nascimento) a curtas distâncias de tempos. 

## 🌐 Como Jogar

Você não precisa instalar nada! O jogo roda diretamente do seu navegador. 
Basta visitar o link do GitHub Pages para rodar a aplicação imediatamente: https://dpontello.github.io/DinoGame/


Ou você pode rodar o arquivo index.html no seu navegador após fazer o clone do repositório:
```bash
git clone https://github.com/DPontello/DinoGame.git
```

## ⚖️ Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.