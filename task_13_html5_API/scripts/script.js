const TicTacToeGame = require('./TicTacToeGame');

window.onload = function () {
    let isCanvasMode = !!JSON.parse(localStorage.getItem('isCanvasMode'));
    let ticTacToeGame = new TicTacToeGame(isCanvasMode, 3);
    let canvasBoard = document.getElementById('tic-tac-toe_canvas-render');
    let textBoard = document.getElementById('tic-tac-toe_text-render');

    function switchMode(isCanvasMode) {
        localStorage.setItem('isCanvasMode', isCanvasMode);
        ticTacToeGame = new TicTacToeGame(isCanvasMode, 3);
        
        if (isCanvasMode) {
            canvasBoard.style.display = 'inline';
            textBoard.style.display = 'none';
        }
        else {
            canvasBoard.style.display = 'none';
            textBoard.style.display = 'inline';
        }
    }

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

    switchMode(isCanvasMode);
    document.onkeydown = actionMove;
    document.getElementById('isCanvasMode').checked = isCanvasMode;
    document.getElementById('isCanvasMode').addEventListener('change', (element) => {
        switchMode(element.currentTarget.checked);
    });
};