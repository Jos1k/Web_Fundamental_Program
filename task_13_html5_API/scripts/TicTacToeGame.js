const TextRenderMode = require('./TextRenderMode');
const CanvasRenderMode = require('./CanvasRenderMode');
const privateProperties = new WeakMap();

const initBoard = function () {
    const properties = privateProperties.get(this);
    const lastSelection = JSON.parse(localStorage.getItem('lastSelection'));
    const pivotElemIndex = Math.floor(properties.gameTableAray.length / 2);
    if (!lastSelection) {
        properties.currentRow = pivotElemIndex;
        properties.currentCell = pivotElemIndex;
        localStorage.setItem('lastSelection', JSON.stringify({ row: pivotElemIndex, cell: pivotElemIndex }));
    }
    else {
        properties.currentRow = lastSelection.row;
        properties.currentCell = lastSelection.cell;
    }

    properties.player = 'X';
    properties.actionCount = 0;

    for (let x = 0; x < properties.boardSize; x++) {
        properties.gameTableAray[x] = [];
        for (let y = 0; y < properties.boardSize; y++) {
            properties.gameTableAray[x][y] = '';
        }
    }
}

const resetGameBoard = function () {
    const pivotElemIndex = Math.floor(privateProperties.get(this).gameTableAray.length / 2);
    localStorage.setItem('lastSelection', JSON.stringify({ row: pivotElemIndex, cell: pivotElemIndex }));
    initBoard.apply(this);
    localStorage.clear();
    privateProperties.get(this).renderer.resetBoard();
}

const loadGameBoard = function (isCanvasFlow) {
    initBoard.apply(this);
    const properties = privateProperties.get(this);
    const gameStorageBoard = JSON.parse(localStorage.getItem('gameBoard'));
    const lastAct = localStorage.getItem('lastAct');
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
            });
        });
    }
    if (isCanvasFlow) {
        properties.renderer = new CanvasRenderMode(properties.gameTableAray);
    }
    else {
        properties.renderer = new TextRenderMode(properties.gameTableAray);
    }
}

const isWinnerDetermined = function () {
    const properties = privateProperties.get(this);
    if (properties.currentRow == properties.currentCell) {
        for (let i = 0; i < properties.boardSize; i++) {
            if (properties.gameTableAray[i][i] != properties.player)
                break;
            if (i == properties.boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }
    }
    if (properties.currentRow + properties.currentCell == properties.boardSize - 1) {
        for (let i = 0; i < properties.boardSize; i++) {
            if (properties.gameTableAray[i][(properties.boardSize - 1) - i] != properties.player)
                break;
            if (i == properties.boardSize - 1) {
                localStorage.clear();
                return true;
            }
        }
    }
    for (let i = 0; i < properties.boardSize; i++) {
        if (properties.gameTableAray[properties.currentRow][i] != properties.player)
            break;
        if (i == properties.boardSize - 1) {
            localStorage.clear();
            return true;
        }
    }
    for (let i = 0; i < properties.boardSize; i++) {
        if (properties.gameTableAray[i][properties.currentCell] != properties.player)
            break;
        if (i == properties.boardSize - 1) {
            localStorage.clear();
            return true;
        }
    }
    return false;
};

class TicTacToeGame {
    constructor(isCanvasFlow, boardSize) {
        privateProperties.set(this, {});
        privateProperties.get(this).boardSize = boardSize;
        privateProperties.get(this).gameTableAray = [];
        loadGameBoard.call(this, isCanvasFlow);
    }

    moveLeft() {
        const properties = privateProperties.get(this);
        if (properties.currentCell > 0) {
            properties.renderer.moveCursor(properties.currentRow, --properties.currentCell);
            localStorage.setItem('lastSelection', JSON.stringify({ row: properties.currentRow, cell: properties.currentCell }));
        }
    }
    moveRight() {
        const properties = privateProperties.get(this);
        if (properties.currentCell < properties.boardSize - 1) {
            properties.renderer.moveCursor(properties.currentRow, ++properties.currentCell);
            localStorage.setItem('lastSelection', JSON.stringify({ row: properties.currentRow, cell: properties.currentCell }));
        }
    }
    moveUp() {
        const properties = privateProperties.get(this);
        if (properties.currentRow > 0) {
            properties.renderer.moveCursor(--properties.currentRow, properties.currentCell);
            localStorage.setItem('lastSelection', JSON.stringify({ row: properties.currentRow, cell: properties.currentCell }));
        }
    }
    moveDown() {
        const properties = privateProperties.get(this);
        if (properties.currentRow < properties.boardSize - 1) {
            properties.renderer.moveCursor(++properties.currentRow, properties.currentCell);
            localStorage.setItem('lastSelection', JSON.stringify({ row: properties.currentRow, cell: properties.currentCell }));
        }
    }
    act() {
        const properties = privateProperties.get(this);
        const currentElement = properties.gameTableAray[properties.currentRow][properties.currentCell];
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