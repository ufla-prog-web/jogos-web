const square = [
  [1, 1],
  [1, 1]
];

const line = [
  [1],
  [1],
  [1],
  [1]
];

const tShape = [
  [0, 1, 0],
  [1, 1, 1]
];

const lShape = [
  [1, 0],
  [1, 0],
  [1, 1]
];

const jShape = [
  [0, 1],
  [0, 1],
  [1, 1]
];

const zShape = [
  [1, 1, 0],
  [0, 1, 1]
];

const sShape = [
  [0, 1, 1],
  [1, 1, 0]
];

const pieces = [
  { shape: square, color: "gold" },
  { shape: line, color: "aqua" },
  { shape: tShape, color: "thistle" },
  { shape: lShape, color: "coral" },
  { shape: jShape, color: "steelblue" },
  { shape: zShape, color: "crimson" },
  { shape: sShape, color: "springgreen" }
];

class Piece {
  constructor(shape, color) {
    this.shape = shape;
    this.color = color;
    this.row = 0;
    this.col = Math.floor(cols / 2) - 1;
  }

  fix() {
    this.shape.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
          const boardRow = this.row + r;
          const boardCol = this.col + c;

          if (boardRow >= 0) {
            board[boardRow][boardCol] = this.color;
          }
        }
      });
    });

    handleAfterFix();
  }

  moveDown() {
    if (paused) return;

    if (!this.colides(1, 0)) {
      this.row++;
    } else {
      this.fix();

      if (checkGameOver()) {
        endGame();
      }
    }
  }

  moveLeft() {
    if (paused) return;

    if (!this.colides(0, -1)) {
      this.col--;
    }
  }

  moveRight() {
    if (paused) return;

    if (!this.colides(0, 1)) {
      this.col++;
    }
  }

  colides(offsetRow = 0, offsetCol = 0) {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (!this.shape[r][c]) continue;

        const newRow = this.row + r + offsetRow;
        const newCol = this.col + c + offsetCol;

        if (newCol < 0 || newCol >= cols) return true;

        if (newRow >= rows) return true;

        if (newRow >= 0 && board[newRow][newCol]) return true;
      }
    }

    return false;
  }

  rotateLeft() {
    if (paused) return;

    const newShape = this.shape[0].map((_, i) =>
      this.shape.map(row => row[i]).reverse()
    );

    const originalShape = this.shape;
    this.shape = newShape;

    if (this.colides()) {
      this.shape = originalShape;
    }
  }
}

function getRandomPiece() {
  const { shape, color } = pieces[Math.floor(Math.random() * pieces.length)];
  return new Piece(shape, color);
}