# 🐾 Jogo da Capivara

Um mini-jogo web interativo no estilo arcade (estilo "Dinosaur Game"), desenvolvido inteiramente com **HTML5, CSS3 e JavaScript Vanilla**. 

Este projeto foi construído como parte da **Atividade Prática 1 da disciplina de Programação Web - 2026/1**. O objetivo do jogo é controlar uma capivara saltitante para desviar dos jacarés, acumulando a maior pontuação possível.

## 🎮 Jogue Agora

👉 **[JOGAR ONLINE (GitHub Pages) - CLIQUE AQUI](https://eijuliamorais.github.io/Web_Game/)** 

## ✨ Funcionalidades e Lógica Técnica

[cite_start]Este projeto atende a todos os requisitos técnicos propostos, com destaque para as seguintes implementações:

* **Física e Animação:** Utilização de `requestAnimationFrame` no JavaScript para criar um loop de jogo fluido e verificações de colisão de alta precisão (pixel-perfect).
* **Manipulação do DOM:** Atualização dinâmica do placar, troca de telas (Start Screen e Game Over) e congelamento de elementos na tela em tempo real manipulando estilos CSS via JS.
* **Sistema de Pontuação:** A pontuação não é baseada em tempo, mas sim em **superação de obstáculos**, exigindo lógica de validação (chaves booleanas) para contabilizar o salto perfeito de forma justa.
* **Persistência de Dados (Recorde):** Implementação da API nativa `localStorage` para salvar o "High Score" (recorde) do jogador diretamente no navegador, persistindo a informação mesmo após fechar a aba.
* **Estilo Retro:** Interface construída com CSS puro usando `text-shadow` e fontes externas (Google Fonts) para simular o visual nostálgico de jogos 8-bits.

## 🕹️ Como Jogar

1. Acesse o jogo.
2. Pressione **Qualquer Tecla** no teclado para iniciar a partida.
3. Pressione **Qualquer Tecla** novamente para fazer a capivara pular.
4. Salte por cima dos jacarés sem encostar neles. Cada salto bem-sucedido concede **20 pontos**.
5. Se bater, o jogo para. Pressione qualquer tecla para recarregar a página e tentar bater seu recorde!

