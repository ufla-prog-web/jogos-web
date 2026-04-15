# Zona Z

Zona Z é um jogo web desenvolvido com HTML, CSS e JavaScript, onde o jogador controla um zumbi em um tabuleiro e precisa capturar um sobrevivente utilizando estratégia.

---

## Proposta do Jogo

O objetivo é capturar o sobrevivente no menor número possível de movimentos.

A cada movimento do zumbi:

- A posição anterior se torna **radiação**
- A radiação bloqueia o caminho do sobrevivente
- O sobrevivente se move automaticamente tentando fugir

---

## Mecânica

- Movimento por teclado (setas)
- Sistema de turnos:
  - Jogador se move
  - IA do sobrevivente responde

- Radiação cria obstáculos permanentes
- Vitória ao alcançar o sobrevivente
- Contador de movimentos

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript

---

## Estrutura do Projeto

```
zona-z/
│── index.html
│── style.css
│── script.js
│── assets/
│   ├── img_logo.png
│   ├── zombie.png
│   └── survivor.png
```

---

## 📄 Licença

Este projeto está sob a licença MIT.
