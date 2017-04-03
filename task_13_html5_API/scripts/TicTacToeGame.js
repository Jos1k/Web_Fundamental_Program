const TextRenderMode = require('./TextRenderMode');
const privateProperties = new WeakMap();

const initBoard = function () {
    let properties = privateProperties.get(this);
    properties.currentRow = 1;
    properties.currentCell = 1;
    properties.player = 'X';
    properties.actionCount = 0;
    properties.gameTableAray = [];

    for (let x = 0; x < properties.boardSize; x++) {
        properties.gameTableAray[x] = [];
        for (let y = 0; y < properties.boardSize; y++) {
            properties.gameTableAray[x][y] = '';
        }
    }
}

const resetGameBoard = function () {
    initBoard.apply(this);
    localStorage.clear();
    privateProperties.get(this).renderer.resetBoard();
}

const loadGameBoard = function () {
    initBoard.apply(this);
    let properties = privateProperties.get(this);
    let gameStorageBoard = JSON.parse(localStorage.getItem('gameBoard'));
    let lastAct = localStorage.getItem('lastAct');
    if (lastAct) {
        if (lastAct == 'X') {
            properties.player = 'O';
        }
        else {
            properties.player = 'X';
        }
    }
    if (gameStorageBoard) {
        properties.gameTableAray = gameStorageBoard;
        properties.actionCount = 0;
        gameStorageBoard.forEach((el) => {
            el.forEach((innerElem) => {
                if (innerElem !== '') {
                    properties.actionCount++;
                }
            })
        });
    }
    if (!localStorage.getItem('isCanvasMode')) {
        properties.renderer = new TextRenderMode(properties.gameTableAray);
    }
}

const isWinnerDetermined = function () {
    let properties = privateProperties.get(this);
    if (properties.currentRow == properties.currentCell) {
        for (let i = 0; i < properties.boardSize; i++) {
            if (properties.renderer.getValue(i, i) != properties.player)
                break;
            if (i == properties.boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }
    }
    if (properties.currentRow + properties.currentCell == properties.boardSize - 1) {
        for (let i = 0; i < properties.boardSize; i++) {
            if (properties.renderer.getValue(i, (properties.boardSize - 1) - i) != properties.player)
                break;
            if (i == properties.boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }
    }
    for (let i = 0; i < properties.boardSize; i++) {
        if (properties.renderer.getValue(properties.currentRow, i) != properties.player)
            break;
        if (i == properties.boardSize - 1) {
            localStorage.clear();
            return true;
        }
    }
    for (let i = 0; i < properties.boardSize; i++) {
        if (properties.renderer.getValue(i, properties.currentCell) != properties.player)
            break;
        if (i == properties.boardSize - 1) {
            localStorage.clear();
            return true;
        }
    }
    return false;
};

class TicTacToeGame {
    constructor(boardSize) {
        privateProperties.set(this, {});
        privateProperties.get(this).boardSize = boardSize;
        loadGameBoard.apply(this);
    }

    moveLeft() {
        let properties = privateProperties.get(this);
        if (properties.currentCell > 0) {
            properties.renderer.moveCursor(
                properties.currentRow, 
                properties.currentCell, 
                properties.currentRow, 
                --properties.currentCell
            )
        }
    }
    moveRight() {
        let properties = privateProperties.get(this);
        if (properties.currentCell < properties.boardSize - 1) {
            properties.renderer.moveCursor(
                properties.currentRow, 
                properties.currentCell, 
                properties.currentRow, 
                ++properties.currentCell
            )
        }
    }
    moveUp() {
        let properties = privateProperties.get(this);
        if (properties.currentRow > 0) {
            properties.renderer.moveCursor(
                properties.currentRow, 
                properties.currentCell, 
                --properties.currentRow, 
                properties.currentCell
            )
        }
    }
    moveDown() {
        let properties = privateProperties.get(this);
        if (properties.currentRow < properties.boardSize - 1) {
            properties.renderer.moveCursor(
                properties.currentRow, 
                properties.currentCell, 
                ++properties.currentRow, 
                properties.currentCell
            )
        }
    }
    act() {
        let properties = privateProperties.get(this);
        let currentElement = properties.renderer.getValue(properties.currentRow, properties.currentCell);
        if (currentElement != 'X' && currentElement != 'O') {
            properties.renderer.act(properties.currentRow, properties.currentCell, properties.player);
            properties.gameTableAray[properties.currentRow][properties.currentCell] = properties.player;
            localStorage.setItem('gameBoard', JSON.stringify(properties.gameTableAray));
            localStorage.setItem('lastAct', properties.player);
            properties.actionCount++;
            if (isWinnerDetermined.apply(this)) {
                alert('Player ' + properties.player + ' Wins!');
                resetGameBoard.apply(this);
            }
            else {
                if (properties.actionCount == properties.boardSize * properties.boardSize) {
                    alert('Draw!');
                    resetGameBoard.apply(this);
                    return;
                }
                if (properties.player === 'X') {
                    properties.player = 'O';
                }
                else {
                    properties.player = 'X';
                }
            }
        }
    }
}

module.exports = TicTacToeGame;