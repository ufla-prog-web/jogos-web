# Coliseu Arcano

Jogo web de sobrevivencia em arena, desenvolvido para a disciplina de Desenvolvimento Web.

## Proposta

Em Coliseu Arcano, o jogador controla um guerreiro em uma arena 2D e precisa sobreviver ao maior numero possivel de ondas de inimigos. O combate acontece em tempo real: o personagem se move com o teclado e ataca automaticamente o inimigo mais proximo.

O foco do projeto e combinar mecanicas simples (movimento, colisao, progressao por nivel e spawn de inimigos) em JavaScript puro, sem frameworks.

## Regras e funcionamento

## Controles

- W, A, S, D: movimentacao do personagem.
- Esc: pausa/despausa durante a partida.
- Menus: botoes de iniciar, continuar e reiniciar.

## Objetivo

- Sobreviver pelo maior tempo possivel.
- Eliminar inimigos para ganhar experiencia (XP).
- Evoluir o personagem para suportar inimigos cada vez mais fortes.

## Combate

- O personagem ataca automaticamente, disparando projeteis de espada no inimigo mais proximo.
- Inimigos comuns perseguem o jogador e causam dano por contato.
- Magos atacam a distancia com projeteis de fogo.
- Projetis sao desativados ao colidir com um alvo ou sair dos limites do mapa.

## Progressao

- A cada inimigo derrotado, o personagem recebe XP.
- Ao acumular XP suficiente, o personagem sobe de nivel.
- Ao subir de nivel, atributos escalam (vida, velocidade, dano e velocidade de ataque).
- A cada 5 niveis, o personagem recebe uma melhoria aleatoria:
  - +1 de armadura; ou
  - +10% de roubo de vida.
- A quantidade maxima de inimigos simultaneos aumenta com o nivel do jogador.

## Fim de jogo

- Quando a vida do personagem chega a zero, a partida termina.
- A tela de reinicio e exibida para iniciar uma nova tentativa.

## Principais decisoes tecnicas adotadas

- Estrutura orientada a objetos:
  - Entidades base (`Entity`) concentram posicao, movimento, distancia e colisao.
  - Entidades vivas (`AliveEntity`) centralizam vida, dano, nivel e cooldowns.
  - Especializacoes (`Character`, `Enemy`, `Mage`, `Projectile`) isolam comportamentos especificos.

- Separacao entre logica e renderizacao:
  - A atualizacao do estado roda em intervalo fixo de 16 ms.
  - A renderizacao usa `requestAnimationFrame` para desenho fluido no canvas.
  - Essa separacao evita acoplamento direto entre taxa de simulacao e taxa de desenho.

- Balanceamento por escalonamento progressivo:
  - Spawn de inimigos baseado no nivel do jogador.
  - Escala de atributos com crescimento percentual por nivel.
  - Variantes de inimigos com papeis distintos (melee e ranged) para aumentar variedade.

- Sistema de combate simples e previsivel:
  - Colisao axis-aligned bounding box (AABB) para baixo custo computacional.
  - Cooldowns baseados em timestamp (`Date.now()`) para ataque e dano.
  - Alvo automatico no inimigo mais proximo para reduzir complexidade.

- Interface gerada dinamicamente via DOM:
  - HUD de vida/XP e nivel atualizados em tempo real.
  - Telas de inicio, pausa e reinicio criadas por componentes de UI dedicados.
