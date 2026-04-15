document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    switch (key) {
        case "ArrowLeft":
        case "a":
            e.preventDefault();
            movingPiece.moveLeft();
            break;
        case "ArrowRight":
        case "d":
            e.preventDefault();
            movingPiece.moveRight();
            break;
        case "ArrowDown":
        case "s":
            e.preventDefault();
            movingPiece.moveDown();
            break;
        case "w":
            e.preventDefault();
            movingPiece.rotateLeft();
            break;
        case "Escape":
            pauseGame();
            break;
        case "Enter":
            startGame();
            break;
        case "r":
            restartGame();
            break;
        case "m":
            showLandingPage();
            break;
    }

    drawBoard();
});