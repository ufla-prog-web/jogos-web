# 💣 Campo Minado Web

Um clássico jogo de Campo Minado (Minesweeper) desenvolvido para rodar diretamente no navegador. O objetivo é revelar todas as células que não contêm minas, utilizando pistas numéricas para evitar as explosões.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as tecnologias fundamentais da web (Vanilla Stack):

* **HTML5:** Estruturação semântica do tabuleiro e controles.
* **CSS3:** Estilização moderna com foco em Dark Mode e interface responsiva.
* **JavaScript (ES6+):** Lógica central do jogo, manipulação do DOM e algoritmos de busca.

## 🧠 Desafios Técnicos Implementados

Para o desenvolvimento deste projeto, apliquei conceitos importantes de engenharia de software:

1.  **Matrizes Bidimensionais:** O tabuleiro é gerado dinamicamente como uma matriz de objetos, permitindo controlar o estado de cada célula (revelada, com bandeira ou com bomba).
2.  **Algoritmo de Expansão (Recursividade):** Implementação de uma função recursiva que abre automaticamente as células vazias adjacentes ao clicar em um espaço sem bombas por perto.
3.  **Manipulação Dinâmica de Eventos:** Tratamento de cliques esquerdos (revelar) e cliques direitos (marcar bandeira) com prevenção do menu padrão do navegador.
4.  **Lógica de Vitória/Derrota:** Verificação constante do estado do jogo para identificar quando o usuário isolou todas as bombas com sucesso.

## 🎮 Como Jogar

1.  **Clique Esquerdo:** Revela o conteúdo de uma célula.
2.  **Clique Direito:** Coloca ou remove uma bandeira em locais onde você suspeita que haja uma bomba.
3.  **Dificuldade:** Você pode alternar entre os níveis para aumentar o tamanho do campo e a quantidade de minas.

## 🛠️ Como rodar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone [https://https://github.com/JoaoVictorMatos/MINES_WEB.git]
