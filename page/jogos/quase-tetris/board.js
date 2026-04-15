function createBoard() {
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      game.appendChild(cell);
      board[r][c] = 0;
    }
  }
}

function createNextBoard() {
  const next = document.getElementById("next");
  next.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("next-cell");
    next.appendChild(cell);
  }
}

function drawNextPiece() {
  const cells = document.querySelectorAll(".next-cell");

  cells.forEach(cell => {
    cell.style.backgroundColor = "#111";
  });

  if (!nextPiece) return;

  nextPiece.shape.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value) {
        const index = r * 4 + c;
        cells[index].style.backgroundColor = nextPiece.color;
      }
    });
  });
}

function drawBoard() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    const r = Math.floor(index / cols);
    const c = index % cols;

    cell.classList.remove("filled");

    if (board[r][c]) {
      cell.classList.add("filled");
      cell.style.backgroundColor = "gray";
    } else {
      cell.style.backgroundColor = "";
    }
  });

  if (!movingPiece) return;

  movingPiece.shape.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value) {
        const drawRow = movingPiece.row + r;
        const drawCol = movingPiece.col + c;

        if (drawRow >= 0 && drawRow < rows && drawCol >= 0 && drawCol < cols) {
          const index = drawRow * cols + drawCol;
          cells[index].classList.add("filled");
          cells[index].style.backgroundColor = movingPiece.color;
        }
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;

  for (let r = rows - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1);
      board.unshift(new Array(cols).fill(0));
      r++;

      linesCleared++;
    }
  }

  return linesCleared;
}