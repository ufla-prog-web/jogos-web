# 🍔 Retro Diner Rush

**Disciplina:** GAC116 - Programação Web (2026/1) | Universidade Federal de Lavras (UFLA)

**Desenvolvedor:** Raul Soares de Carvalho

---

## 📖 Sobre o Projeto
**Retro Diner Rush** é um jogo web de gerenciamento de tempo e reflexos rápidos focado no atendimento de uma lanchonete movimentada. O jogador deve atender aos pedidos exatos que aparecem na fila superior, clicando nos itens correspondentes que surgem aleatoriamente na tela antes que o tempo de expediente (45 segundos) acabe.

O projeto foi desenvolvido inteiramente com **HTML5, CSS3 e JavaScript (Vanilla)**, respeitando a arquitetura de três camadas de apresentação (Estrutura, Estilo e Comportamento) sem a utilização de frameworks, *engines* de jogos ou bibliotecas externas como jQuery.

---

## 🛠️ Decisões Técnicas

Para garantir um código limpo, performático e aderente às boas práticas da web, as seguintes decisões foram tomadas:

* **Arquitetura de Três Camadas:** Separação estrita. O `index.html` contém apenas HTML Semântico (`<header>`, `<main>`, `<footer>`), o `styles.css` lida exclusivamente com a apresentação e responsividade básica, e o `script.js` concentra toda a regra de negócios e manipulação do DOM.
* **Manipulação Dinâmica do DOM:** Em vez de manter elementos ocultos no HTML, os itens do jogo são criados e destruídos em tempo de execução utilizando `document.createElement()`, `appendChild()` e `removeChild()`. Isso simula o comportamento de *instantiation* comum em desenvolvimento de jogos e mantém a árvore do DOM enxuta.
* **Otimização de Interação (`mousedown` vs `click`):** Para jogos de ritmo acelerado, o evento padrão de `click` pode falhar se o usuário mover o mouse entre o pressionar e o soltar do botão. Optou-se pelo uso do ouvinte de evento `mousedown` para garantir responsividade imediata.
* **Posicionamento Absoluto em Contêiner Relativo:** O tabuleiro do jogo foi configurado com `position: relative` e `overflow: hidden`, permitindo que os itens gerados pelo JS recebam coordenadas absolutas (`top` e `left`) de forma aleatória, sem quebrar o fluxo da página ou gerar barras de rolagem.

---

## 🧠 Lógica de Desenvolvimento e Regras de Negócio

A lógica central do jogo baseia-se em controle de estado e *Game Loops* assíncronos gerados através de temporizadores.

1.  **Gerenciamento de Estado:**
    Variáveis globais (`pontuacao`, `tempoRestante`, `jogoAtivo`) garantem que os eventos de pontuação só sejam validados enquanto o turno estiver em andamento.
2.  **Sistema de Fila (Queue):**
    Os pedidos são gerenciados em um *Array* (`filaPedidos`) que atua como uma fila lógica. O jogador sempre deve buscar na tela o item que corresponde ao índice `[0]` dessa fila. Ao acertar, aplica-se um `shift()` para remover o item atendido e injeta-se um novo no final com o método `push()`.
3.  **Spawning de Lotes:**
    A função `gerarLotePedidos()` utiliza o `setInterval()` para invocar entre 3 a 6 itens a cada 1.5 segundos. A lógica garante matematicamente que o item alvo (necessário para pontuar) **sempre** seja instanciado junto com os itens distratores, evitando *softlocks* (situações onde o jogador não tem como pontuar).
4.  **Sistema de Pontuação e Punição:**
    Acertos concedem +15 pontos e renovam a fila. Erros (clicar no item errado) aplicam uma penalidade de -5 pontos e disparam um *feedback* visual de erro via CSS (*keyframes* de tremor e alteração de cor), exigindo atenção do jogador.
5.  **Limpeza de Memória (Garbage Collection):**
    Para evitar vazamento de memória e superlotação da tela, cada item gerado possui um `setTimeout` interno que o autodestrói (remove do DOM) após 3.5 segundos, caso não seja clicado.

---

## 🚀 Como Testar o Jogo

Como o projeto não utiliza dependências de backend, executá-lo é extremamente simples.

### Opção 1: Via IDE (Recomendado - WebStorm / VS Code)
1. Clone o repositório em sua máquina.
2. Abra a pasta do projeto no **WebStorm**.
3. Abra o arquivo `index.html`.
4. No canto superior direito do editor, clique no ícone do navegador de sua preferência (ex: Chrome) para iniciar o servidor local embutido da IDE.

*(Alternativa para VS Code: Utilize a extensão **Live Server** clicando com o botão direito no `index.html` e selecionando "Open with Live Server").*

### Opção 2: Execução Direta
1. Baixe o repositório no formato `.zip` e extraia.
2. Navegue até a pasta do projeto utilizando seu gerenciador de arquivos.
3. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente no seu navegador padrão.

### Opção 3: Python HTTP Server (Conforme material de aula)
1. Abra o terminal na pasta raiz do projeto.
2. Execute o comando: `python3 -m http.server`
3. Acesse `http://localhost:8000` em seu navegador.

---
*Projeto acadêmico com licença MIT.*