# 🎮 Bounce Survival

Um jogo de sobrevivência desenvolvido com HTML, CSS e JavaScript puro, onde você deve rebater a bola o máximo de tempo possível.

## 🎯 Como Jogar

- Use as **setas esquerda e direita** do teclado para mover a raquete.
- Clique em **"Iniciar Jogo"** para começar a partida.
- Rebata a bola para manter o jogo em andamento.
- Evite deixar a bola cair pela parte inferior.
- A pontuação aumenta a cada rebatida com sucesso.
- Clique em **"Reiniciar"** para começar uma nova partida com a bola em posição aleatória.

## 📋 Regras

- A bola quica nas paredes laterais e no teto automaticamente.
- Rebata a bola com a raquete na parte inferior da tela.
- **Física realista**: O ângulo de rebate muda conforme o ponto de impacto na raquete.
  - Centro da raquete: Bola vai reta para cima
  - Extremos da raquete: Bola rebate em ângulo
- A velocidade aumenta ligeiramente a cada rebatida, aumentando a dificuldade.
- O jogo termina quando a bola cai pela parte inferior.
- **Objetivo**: Alcançar a maior pontuação possível antes que a bola escapa.

## 🛠 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e canvas para gráficos 2D
- **CSS3**: Design moderno com gradientes, animações e sombras
- **JavaScript (ES6+)**: Lógica de jogo, física e interações

## 📁 Estrutura do Projeto

```
projeto-progweb/
├── index.html          # Página principal (1000x600 canvas)
├── css/
│   └── style.css       # Estilos visuais modernos
├── js/
│   └── script.js       # Lógica do jogo com física
├── README.md           # Este arquivo
└── LICENSE             # Licença MIT
```

## ✨ Funcionalidades

✅ Canvas grande e responsivo (1000x600)  
✅ Bola com posição inicial aleatória  
✅ Controle de raquete com setas do teclado  
✅ Botão para iniciar/pausar o jogo  
✅ Botão para reiniciar com nova partida  
✅ Física realista com ângulos de rebate  
✅ Aceleração progressiva  
✅ Interface moderna e intuitiva  
✅ Pontuação em tempo real  

## 🚀 Como Executar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Clique no botão **"Iniciar Jogo"** para começar
3. Use as setas para jogar!

## 📦 Publicação

Este projeto está publicado no GitHub Pages e pode ser jogado online através do link do repositório:
https://vitingrm.github.io/bounce-survival-web/

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
