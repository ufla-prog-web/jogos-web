# 🎮 Clone do LoLdle

![Demonstração do Jogo](/ReadmeAssets/game.png)

## 📖 Sobre o Projeto
Este projeto é um jogo de adivinhação baseado no popular "LoLdle", onde o jogador precisa descobrir o campeão secreto do League of Legends com base em dicas de atributos (Gênero, Recurso, Classe, etc.). 

O jogo foi desenvolvido como requisito para a **Atividade Prática 1 - Desenvolvimento de Jogo Web** da disciplina **GAC116 - Programação Web - 2026/1**. O objetivo principal é aplicar de forma prática os conceitos de estruturação, estilização e lógica de programação no navegador.

### 🎯 Regras do Jogo
1. Digite o nome de um campeão no campo de busca e clique em "Tentar".
2. O jogo comparará os atributos do seu palpite com os do campeão secreto.
3. As cores indicarão o quão perto você está:
   - **Azul/Verde (Correct):** O atributo é exatamente igual ao do campeão secreto.
   - **Vermelho (Wrong):** O atributo é diferente.
   - **Setas (Ano de Lançamento):** Uma seta para cima indica que o campeão secreto é mais novo (lançado depois), e para baixo indica que é mais antigo.
4. O jogo termina quando você adivinhar o nome correto!

## 🚀 Tecnologias Utilizadas
O projeto cumpre o requisito de ser desenvolvido utilizando apenas tecnologias web nativas:
* **HTML5:** Estruturação semântica da página.
* **CSS3:** Estilização da interface, layout em Grid e feedback visual por cores.
* **JavaScript (Vanilla):** Lógica do jogo, manipulação do DOM e consumo de dados via Fetch API.

## ⚙️ Como rodar o jogo localmente
Como o jogo consome um arquivo JSON externo de forma assíncrona (`fetch`), ele não pode ser aberto diretamente dando um clique duplo no arquivo `index.html` devido às políticas de segurança do navegador (CORS). 

Para jogá-lo na sua máquina, você precisa rodá-lo em um servidor local (`localhost`).

**Passo a passo recomendado:**
1. Faça o clone deste repositório ou baixe os arquivos.
2. Certifique-se de ter o arquivo contendo os dados dos campeões. Você pode baixá-lo aqui: [champions.json](https://github.com/ngryman/lol-champions/blob/master/champions.json) e colocá-lo na mesma pasta do projeto.
3. Abra a pasta do projeto no **VS Code**.
4. Instale a extensão **Live Server**.
5. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
6. O jogo abrirá automaticamente no seu navegador padrão.

## 🚀 Git Hub Pages
Clique aqui para acessar o jogo no [GitHub pages.](https://guiazevedo04.github.io/loldle-remake/)

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo.