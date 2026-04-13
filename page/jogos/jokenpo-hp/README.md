# Jokenpo de Hogwarts

## Visao geral
Jokenpo de Hogwarts e um jogo web tematico inspirado na mecanica classica de Pedra, Papel e Tesoura, adaptado para um duelo bruxo com visual de pergaminho, atmosfera medieval e interface elegante. O projeto foi desenvolvido como trabalho academico de Programacao Web usando apenas HTML, CSS e JavaScript puro.

O jogador enfrenta uma campanha em fases com quatro oponentes de Hogwarts, cada um com dificuldade crescente. Cada fase funciona em formato melhor de 3, com atualizacao de placar em tempo real, mensagens narrativas, historico de rodadas e reinicio direto pela interface.

## Proposta do projeto
O objetivo foi criar um jogo simples de entender, mas com acabamento visual acima do basico, transmitindo a ideia de um projeto premium e bem organizado. Para isso, o jogo combina:

- estetica inspirada em Hogwarts classica
- layout responsivo
- seções bem divididas
- feedback visual para interacao
- regras claras exibidas na tela
- codigo separado por responsabilidade

## Artefatos do duelo
As escolhas do jogo foram adaptadas para um contexto magico:

- `Pedra Filosofal`
- `Capa da Invisibilidade`
- `Varinha`

## Fases da campanha
- `1. Draco Malfoy`
- `2. Harry Potter`
- `3. Lord Voldemort`
- `4. Alvo Dumbledore`

## Regras do jogo
As regras seguem a logica tradicional do jokenpo:

- Pedra Filosofal vence Varinha
- Varinha vence Capa da Invisibilidade
- Capa da Invisibilidade vence Pedra Filosofal
- Cada fase acontece em formato melhor de 3
- Quem alcancar 2 vitorias primeiro vence a fase
- A dificuldade aumenta a cada novo oponente
- Dumbledore e o boss final da campanha

## Funcionalidades implementadas
- Tela inicial com botao `Iniciar duelo`
- Tutorial rapido antes de liberar a partida
- Modo campanha com quatro fases sequenciais
- Escolha do jogador por cartas visuais
- Jogada do oponente com dificuldade crescente
- Exibicao da escolha dos dois lados
- Resultado da rodada com mensagem tematica
- Placar atualizado em tempo real
- Avanco automatico para a proxima fase ao vencer
- Encerramento automatico ao atingir 2 vitorias em cada fase
- Botao para reiniciar a partida
- Historico curto das ultimas rodadas
- Contador de vitorias totais do jogador salvo no `localStorage`
- Botao para zerar estatisticas
- Layout responsivo para desktop e mobile

## Tecnologias usadas
- `HTML5`
- `CSS3`
- `JavaScript puro`
- `localStorage` para persistencia local das estatisticas

## Estrutura de pastas
```text
Jogo/
|-- assets/
|   |-- capa-da-invisibilidade.svg
|   |-- mapa-do-maroto.svg
|   |-- pedra-filosofal.svg
|   `-- varinha.svg
|-- index.html
|-- style.css
|-- script.js
|-- README.md
`-- roteiro-apresentacao.md
```

## O que cada arquivo faz

### `index.html`
Responsavel pela estrutura da interface.

Contem:
- cabecalho principal com titulo e subtitulo
- painel de abertura com botao de iniciar
- area de tutorial
- painel de placar
- painel de fase atual e oponente
- cartas dos artefatos jogaveis
- area central do confronto entre jogador e computador
- painel da jornada da campanha
- painel de narracao da rodada
- painel com regras
- historico dos duelos
- botao de reiniciar partida

### `style.css`
Responsavel pela identidade visual e responsividade do projeto.

Contem:
- paleta de cores tematica
- visual de pergaminho e molduras
- efeitos de brilho, sombra e hover
- layout em grade para desktop
- adaptacoes para telas menores
- destaque visual para cartas selecionadas e vencedoras
- estilo dos botoes principais, tutorial e reinicio

### `script.js`
Responsavel por toda a logica do jogo.

Contem:
- definicao das escolhas e das regras de vitoria
- definicao dos oponentes e niveis de dificuldade
- controle de estado da partida
- tutorial inicial
- logica da campanha por fases
- sorteio da jogada do oponente
- comparacao das jogadas
- atualizacao do placar
- atualizacao do historico
- encerramento da partida
- reinicio do jogo
- persistencia de estatisticas no `localStorage`

### `assets/`
Pasta com as ilustracoes locais usadas no projeto.

Contem:
- imagem da Pedra Filosofal
- imagem da Capa da Invisibilidade
- imagem da Varinha

## Explicacao da interface

### 1. Tela de abertura
Quando o jogo carrega, o usuario nao entra direto na partida. Primeiro ele ve um painel inicial com o botao `Iniciar duelo`. Essa etapa melhora a apresentacao e deixa o fluxo mais profissional.

### 2. Tutorial
Depois de clicar em iniciar, o jogador passa por um tutorial curto em etapas. Esse tutorial explica:

- quais sao os artefatos
- como funcionam as regras
- como a campanha em fases funciona

Somente depois disso as cartas do jogo sao desbloqueadas.

### 3. Area dos artefatos
A secao central mostra tres cartas visuais. Cada carta representa uma jogada possivel do usuario.

Ao clicar em uma carta:
- o oponente da fase escolhe uma jogada conforme sua dificuldade
- o sistema compara as escolhas
- o resultado e mostrado na interface

### 4. Camara do duelo
Essa area mostra:

- escolha do jogador
- escolha do oponente
- destaque visual dos lados
- selo central `VS`

Quando a rodada ainda nao comecou, aparece um `?` centralizado dentro do circulo.

### 5. Narracao da rodada
Exibe mensagens tematicas como:

- quem venceu a rodada
- se houve empate
- qual sera a proxima rodada
- se a partida foi encerrada

### 6. Placar da casa
Mostra:

- pontuacao do jogador
- pontuacao do oponente
- numero da rodada atual
- fase atual da campanha
- nome do adversario atual
- total de vitorias acumuladas do jogador

### 7. Historico dos duelos
Registra as ultimas rodadas jogadas para que o usuario acompanhe o que aconteceu recentemente.

### 8. Reiniciar partida
O botao de reiniciar volta o jogo ao estado inicial:

- zera o placar da fase atual
- esconde o resultado final
- limpa o historico
- volta para a fase 1 com a tela inicial e o tutorial

## Explicacao da logica em JavaScript

### Objeto `choices`
Define as tres escolhas disponiveis no jogo e associa:

- nome exibido na interface
- imagem correspondente

### Objeto `winningRelations`
Define quem vence quem na logica do jogo.

Exemplo:
- `pedra` vence `tesoura`
- `tesoura` vence `papel`
- `papel` vence `pedra`

Os nomes internos continuam simples no codigo para facilitar a manutencao, mesmo com os nomes tematicos aparecendo na interface.

### Objeto `state`
Guarda o estado atual da partida, como:

- pontuacao do jogador
- pontuacao do computador
- rodada atual
- se a partida terminou
- historico
- estado do tutorial

### Funcoes principais

#### `getOpponentChoice()`
Escolhe a jogada do adversario da fase com base em um nivel de dificuldade.

#### `getRoundOutcome(playerChoice, computerChoice)`
Compara a jogada do jogador com a do computador e define:

- vencedor da rodada
- titulo da mensagem
- detalhe da narracao

#### `buildVictoryMessage()`
Monta as mensagens tematicas de vitoria com base na combinacao vencedora.

#### `updateScoreboard()`
Atualiza o placar mostrado na interface.

#### `renderChoices()`
Mostra na tela qual artefato foi escolhido pelo jogador e pelo computador.

#### `highlightRound()`
Destaca visualmente a carta escolhida e o lado vencedor do confronto.

#### `updateHistory()`
Adiciona no painel lateral um resumo das ultimas rodadas.

#### `finishMatch()`
Encerra a fase quando alguem alcanca 2 pontos e mostra a mensagem final.

#### `advanceStage()`
Move a campanha para o proximo personagem depois de uma vitoria.

#### `resetGame()`
Volta o jogo para o estado inicial da partida, incluindo a tela de abertura.

#### `loadTotalWins()`, `saveTotalWins()` e `resetTotalWins()`
Controlam o armazenamento das vitorias totais usando `localStorage`.

## Fluxo completo de uso
1. O usuario abre o jogo.
2. A tela inicial apresenta o tema e o botao de iniciar.
3. O tutorial explica rapidamente como o jogo funciona.
4. As cartas sao desbloqueadas.
5. O jogador escolhe um artefato.
6. O oponente da fase faz sua jogada.
7. O resultado aparece na interface.
8. O placar e atualizado.
9. Quando o jogador vence a fase, avanca para o proximo personagem.
10. Quando alguem chega a 2 vitorias, a fase termina.
11. O usuario pode continuar a campanha, reiniciar a jornada ou zerar as estatisticas.

## Como executar localmente
1. Baixe ou clone o repositorio.
2. Abra a pasta `Jogo`.
3. Execute o arquivo `index.html` em um navegador moderno.

Se preferir, tambem e possivel usar uma extensao como Live Server no VS Code.

## Publicacao no GitHub Pages
O projeto e compativel com GitHub Pages porque utiliza apenas arquivos estaticos.

Espaco para link publicado:

`[inserir link do GitHub Pages aqui]`

## Requisitos atendidos
- jogo funcional 100% no navegador
- uso exclusivo de HTML, CSS e JavaScript puro
- jogador contra oponentes em fases
- dificuldade crescente por personagem
- exibicao das escolhas
- exibicao do resultado da rodada
- placar atualizado
- fases melhor de 3
- mensagem de vencedor final da campanha
- reinicio sem uso de `alert`
- interface responsiva
- regras claras dentro da interface
- projeto organizado para apresentacao academica

## Possiveis melhorias futuras
- adicionar sons tematicos
- incluir animacoes entre as rodadas
- mostrar estatisticas mais detalhadas
- adicionar tela final com mais efeitos visuais
- criar versoes tematicas para outras casas de Hogwarts
