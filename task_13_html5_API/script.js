window.onload = function () {
    var currentRow = 1;
    var currentCell = 1;
    var player = 'X';
    var actionCount = 0;
    var boardSize = 3;
    var currentMode = {};
    var textBlock = document.getElementsByClassName('main-content_text-block')[0];

    function loadGameBoard() {
        let gameTableAray= JSON.parse(localStorage.getItem('gameBoard'));
        let lastAct = localStorage.getItem('lastAct');
        if (lastAct){
            if (lastAct == 'X'){
                player = 'O';
            }
            else{
                player = 'X';
            }
        }
        if (!gameTableAray) {
            gameTableAray = [];
            for (let x = 0; x < boardSize; x++) {
                gameTableAray[x] = [];
                for (let y = 0; y < boardSize; y++) {
                    gameTableAray[x][y] = '';
                }
            }
        }
        else{
            actionCount = gameTableAray.filter((el)=> el !== '').length;
        }
        if (!localStorage.getItem('isCanvasMode')) {
            currentMode = new TextRenderMode(gameTableAray);
        }
    }

    function resetGameBoard() {
        currentRow = 1;
        currentCell = 1;
        player = 'X';
        actionCount = 0;
        localStorage.removeItem('gameBoard');
        currentMode.resetBoard();
    }

    function isWinnerDetermined() {
        if (currentRow == currentCell) {
            for (let i = 0; i < boardSize; i++) {
                if (currentMode.getValue(i, i) != player)
                    break;
                if (i == boardSize - 1) {
                    localStorage.clear();
                    return true;
                }
            }
        }
        if (currentRow + currentCell == boardSize - 1) {
            for (let i = 0; i < boardSize; i++) {
                if (currentMode.getValue(i, (boardSize - 1)-i) != player)
                    break;
                if (i == boardSize - 1) {
                    localStorage.clear();
                    return true;
                }
            }
        }
        for (let i = 0; i < boardSize; i++) {
            if (currentMode.getValue(currentRow,i) != player)
                break;
            if (i == boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }

        for (let i = 0; i < boardSize; i++) {
            if (currentMode.getValue(i,currentCell) != player)
                break;
            if (i == boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }
        return false;
    };

    function actionMove() {
        if (event.keyCode == 32) {
            let currentElement = currentMode.getValue(currentRow, currentCell);
            if (currentElement != 'X' && currentElement != 'O') {
                currentMode.act(currentRow, currentCell,player);
                actionCount++;
                if (isWinnerDetermined()) {
                    alert('Player ' + player + ' Wins!');
                    resetGameBoard();
                }
                else {
                    if (actionCount == boardSize * boardSize) {
                        alert('Draw!');
                        resetGameBoard();
                        return;
                    }
                    if (player === 'X') {
                        player = 'O';
                    }
                    else {
                        player = 'X';
                    }
                    textBlock.textContent = 'Player ' + player + ' Moves';
                }
            }
        } else if ([37, 38, 39, 40].indexOf(event.keyCode) >= 0) {
            let oldRow = currentRow;
            let oldCell = currentCell;
            switch (event.keyCode) {
                case 38:
                    if (currentRow > 0) {
                        currentRow--;
                    }
                    break;
                case 40:
                    if (currentRow < boardSize) {
                        currentRow++;
                    }
                    break;
                case 37:
                    if (currentCell > 0) {
                        currentCell--;
                    }
                    break;
                case 39:
                    if (currentCell < boardSize) {
                        currentCell++;
                    }
                    break;
            }
            currentMode.moveCursor(oldRow, oldCell, currentRow, currentCell);
        }
    }

    function setMode(elem) {
        localStorage.setItem("isCanvasMode", elem);
    }

    loadGameBoard();

    document.onkeydown = actionMove;
    document.getElementById('reset-button').addEventListener("click", () => {
        resetGameBoard();
    });
};

class TextRenderMode {

    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.gameTable = document.getElementsByClassName('main-content_game_area')[0].rows;
        this.pivotElemIndex = Math.floor(this.gameBoard.length / 2);

        for (let x = 0; x < this.gameBoard.length; x++) {
            for (let y = 0; y < this.gameBoard.length; y++) {
                this.gameTable[x].cells[y].textContent = gameBoard[x][y] ? gameBoard[x][y] : '-';
            }
        }
        this.gameTable[this.pivotElemIndex].cells[this.pivotElemIndex].classList.add('selectedElement');
    }

    resetBoard() {
        for (let i = 0; i < this.gameBoard.length; i++) {
            for (let j = 0; j < this.gameBoard.length; j++) {
                this.gameTable[i].cells[j].textContent = '-';
                this.gameTable[i].cells[j].classList.remove('selectedElement');
            }
        }
        this.gameTable[this.pivotElemIndex].cells[this.pivotElemIndex].classList.add('selectedElement');
    }

    moveCursor(oldRow, oldCell, newRow, newCell) {
        this.gameTable[oldRow].cells[oldCell].classList.remove('selectedElement');
        this.gameTable[newRow].cells[newCell].classList.add('selectedElement');
    }
    act(row, cell, player) {
        this.gameTable[row].cells[cell].textContent = player;
        this.gameBoard[row][cell] = player;
        localStorage.setItem('gameBoard', JSON.stringify(this.gameBoard));
        localStorage.setItem('lastAct',player);
    }
    getValue(row, cell) {
        return this.gameTable[row].cells[cell].textContent;
    }
}