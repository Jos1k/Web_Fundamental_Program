window.onload = function () {
    let ticTacToeGame = new TicTacToeGame();

    function actionMove() {
        if (event.keyCode == 32) {
            ticTacToeGame.act();
        } else if ([37, 38, 39, 40].indexOf(event.keyCode) >= 0) {
            switch (event.keyCode) {
                case 38:
                    ticTacToeGame.moveUp();
                    break;
                case 40:
                    ticTacToeGame.moveDown();
                    break;
                case 37:
                    ticTacToeGame.moveLeft();
                    break;
                case 39:
                    ticTacToeGame.moveRight();
                    break;
            }
        }
    }
    document.onkeydown = actionMove;
};