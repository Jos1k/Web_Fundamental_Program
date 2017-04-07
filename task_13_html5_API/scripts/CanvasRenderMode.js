const privateProperties = new WeakMap();
const celSize = 170;
const selectionCellSize = 150;
const lineSize = 20;
const drawGameBoard = function () {
    const properties = privateProperties.get(this);
    const ctx = properties.canvasContext;
    ctx.fillStyle = 'rgb(224, 201, 71)';
    ctx.save();

    for (var i = 0; i < properties.boardSize - 1; i++) {
        ctx.fillRect(celSize, 0, lineSize, celSize * 3 + lineSize * (3 - 1));
        ctx.translate(celSize + lineSize, 0);
    }
    ctx.restore();
    ctx.save();

    for (var i = 0; i < properties.boardSize - 1; i++) {
        ctx.fillRect(0, celSize, celSize * 3 + lineSize * (3 - 1), lineSize);
        ctx.translate(0, celSize + lineSize);
    }
    ctx.restore();
    ctx.save();
}

const drawSelection = function (row, cell) {
    var ctx = privateProperties.get(this).canvasContext;
    ctx.fillStyle = 'rgb(255, 100, 255)';
    ctx.fillRect(
        celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2,
        (celSize * row) + lineSize * row + (celSize - selectionCellSize) / 2,
        selectionCellSize,
        selectionCellSize
    );

    ctx.clearRect(
        (celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2) + 10,
        ((celSize * row) + lineSize * row + (celSize - selectionCellSize) / 2) + 10,
        selectionCellSize - 20,
        selectionCellSize - 20
    );
}

const drawAction = function (row, cell, player) {
    let ctx = privateProperties.get(this).canvasContext;
    ctx.font = selectionCellSize + 'px Sans-serif';
    if (player == 'X') {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText('X',
            (celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2) + 25,
            (celSize * row + lineSize * row + (celSize - selectionCellSize) / 2) + selectionCellSize - 20
        );
    }
    else {
        ctx.fillStyle = 'rgb(147, 224, 71)';
        ctx.fillText('O',
            (celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2) + 15,
            (celSize * row + lineSize * row + (celSize - selectionCellSize) / 2) + selectionCellSize - 20
        );
    }

}

const loadBoardState = function () {
    const properties = privateProperties.get(this);
    for (let i = 0; i < properties.gameBoard.length; i++)
        for (let j = 0; j < properties.gameBoard.length; j++) {
            if (properties.gameBoard[i][j]) {
                drawAction.call(this, i, j, properties.gameBoard[i][j]);
            }
        }
}

const moveCursorSelection = function (newRow, newCell) {
    const properties = privateProperties.get(this);
    properties.lastSelection.row = newRow;
    properties.lastSelection.cell = newCell;
    properties.canvasContext.clearRect(0, 0, 550, 550);
    drawGameBoard.call(this);
    drawSelection.call(this, newRow, newCell);
    loadBoardState.call(this);
}

const actAction = function (newRow, newCell, player) {
    moveCursorSelection.call(this, newRow, newCell);
    drawAction.call(this, newRow, newCell, player);
}

class CanvasRenderMode {
    constructor(gameBoard, uiObject) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        properties.pivotElemIndex = Math.floor(gameBoard.length / 2);
        properties.lastSelection = JSON.parse(localStorage.getItem('lastSelection'));
        properties.boardSize = gameBoard.length;
        properties.gameBoard = gameBoard;
        properties.canvasContext = uiObject.getContext('2d');
        moveCursorSelection.call(this,
            properties.lastSelection.row,
            properties.lastSelection.cell
        );
    }

    resetBoard() {
        const pivotElemIndex = privateProperties.get(this).pivotElemIndex;
        this.moveCursor(pivotElemIndex, pivotElemIndex);
    }

    moveCursor(newRow, newCell) {
        window.requestAnimationFrame(() => moveCursorSelection.call(this, newRow, newCell));
    }

    act(row, cell, player) {
        window.requestAnimationFrame(() => actAction.call(this, row, cell, player));
    }
}

module.exports = CanvasRenderMode;