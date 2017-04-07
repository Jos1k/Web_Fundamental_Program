/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const TextRenderMode = __webpack_require__(2);
const CanvasRenderMode = __webpack_require__(1);
const privateProperties = new WeakMap();

const initBoard = function () {
    const properties = privateProperties.get(this);
    const lastSelection = JSON.parse(localStorage.getItem('lastSelection'));
    const pivotElemIndex = Math.floor(properties.boardSize / 2);
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

const loadGameBoard = function (isCanvasFlow, uiObject) {
    initBoard.call(this);
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
        properties.renderer = new CanvasRenderMode(properties.gameTableAray, uiObject);
    }
    else {
        properties.renderer = new TextRenderMode(properties.gameTableAray, uiObject);
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
    constructor(isCanvasFlow, boardSize, uiObject) {
        privateProperties.set(this, {});
        privateProperties.get(this).boardSize = boardSize;
        privateProperties.get(this).gameTableAray = [];
        loadGameBoard.call(this, isCanvasFlow, uiObject);
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
    resetGameBoard () {
        const pivotElemIndex = Math.floor(privateProperties.get(this).boardSize / 2);
        localStorage.setItem('lastSelection', JSON.stringify({ row: pivotElemIndex, cell: pivotElemIndex }));
        initBoard.call(this);
        localStorage.clear();
        privateProperties.get(this).renderer.resetBoard();
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
            if (isWinnerDetermined.call(this)) {
                alert('Player ' + properties.player + ' Wins!');
                this.resetGameBoard();
            }
            else {
                if (properties.actionCount == properties.boardSize * properties.boardSize) {
                    alert('Draw!');
                    this.resetGameBoard();
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

const privateProperties = new WeakMap();

class TextRenderMode {
    constructor(gameBoard, uiObject) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        properties.gameTable = uiObject.rows;
        properties.pivotElemIndex = Math.floor(gameBoard.length / 2);
        const lastSelection = JSON.parse(localStorage.getItem('lastSelection'));
        properties.currentRow = lastSelection.row;
        properties.currentCell = lastSelection.cell;

        for (let x = 0; x < gameBoard.length; x++) {
            for (let y = 0; y < gameBoard.length; y++) {
                properties.gameTable[x].cells[y].textContent = gameBoard[x][y] ? gameBoard[x][y] : '-';
                properties.gameTable[x].cells[y].classList.remove('selectedElement');
            }
        }
        properties.gameTable[properties.currentRow].cells[properties.currentCell].classList.add('selectedElement');
    }

    resetBoard() {
        const properties = privateProperties.get(this);
        for (let i = 0; i < properties.gameTable.length; i++) {
            for (let j = 0; j < properties.gameTable.length; j++) {
                properties.gameTable[i].cells[j].textContent = '-';
                properties.gameTable[i].cells[j].classList.remove('selectedElement');
            }
        }
        properties.gameTable[properties.pivotElemIndex].cells[properties.pivotElemIndex].classList.add('selectedElement');
    }

    moveCursor(newRow, newCell) {
        const properties = privateProperties.get(this);        
        properties.gameTable[properties.currentRow].cells[properties.currentCell].classList.remove('selectedElement');
        properties.gameTable[newRow].cells[newCell].classList.add('selectedElement');
        properties.currentRow = newRow;
        properties.currentCell = newCell;
    }

    act(row, cell, player) {
         privateProperties.get(this).gameTable[row].cells[cell].textContent = player;
    }
}

module.exports = TextRenderMode;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const TicTacToeGame = __webpack_require__(0);

window.onload = function () {
    let ticTacToeGame = {};
    let boardSize = 3;
    let isCanvasMode = !!JSON.parse(localStorage.getItem('isCanvasMode'));
    let canvasBoard = document.getElementById('tic-tac-toe_canvas-render');
    let textBoard = document.getElementById('tic-tac-toe_text-render');

    function switchMode(isCanvasMode) {
        localStorage.setItem('isCanvasMode', isCanvasMode);
        
        if (isCanvasMode) {
            canvasBoard.style.display = 'inline';
            textBoard.style.display = 'none';
            ticTacToeGame = new TicTacToeGame(isCanvasMode, boardSize, canvasBoard);
        }
        else {
            canvasBoard.style.display = 'none';
            textBoard.style.display = 'inline';
            ticTacToeGame = new TicTacToeGame(isCanvasMode, boardSize, textBoard);
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
    document.getElementById('reset-button').addEventListener('click', (element) => {
        ticTacToeGame.resetGameBoard();
        document.activeElement.blur();
    });
    document.getElementById('isCanvasMode').checked = isCanvasMode;
    document.getElementById('isCanvasMode').addEventListener('change', (element) => {
        switchMode(element.currentTarget.checked);
        document.activeElement.blur();
    });
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2MxYzdhMmM4ZDE4OTdkY2EzYWEiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvQ2FudmFzUmVuZGVyTW9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL1RleHRSZW5kZXJNb2RlLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCw0Q0FBNEM7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwQkFBMEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLDJEQUEyRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsMkRBQTJEO0FBQzdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSwyREFBMkQ7QUFDN0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLDJEQUEyRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCw0Q0FBNEM7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCOzs7Ozs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsOEJBQThCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlDQUFpQztBQUNwRCx1QkFBdUIsaUNBQWlDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0M7Ozs7OztBQ3JIQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsc0JBQXNCO0FBQzdDLDJCQUEyQixzQkFBc0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsaUNBQWlDO0FBQ3hELDJCQUEyQixpQ0FBaUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDOzs7Ozs7QUM3Q0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxFIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzYzFjN2EyYzhkMTg5N2RjYTNhYSIsImNvbnN0IFRleHRSZW5kZXJNb2RlID0gcmVxdWlyZSgnLi9UZXh0UmVuZGVyTW9kZScpO1xuY29uc3QgQ2FudmFzUmVuZGVyTW9kZSA9IHJlcXVpcmUoJy4vQ2FudmFzUmVuZGVyTW9kZScpO1xuY29uc3QgcHJpdmF0ZVByb3BlcnRpZXMgPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCBpbml0Qm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICBjb25zdCBsYXN0U2VsZWN0aW9uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdFNlbGVjdGlvbicpKTtcbiAgICBjb25zdCBwaXZvdEVsZW1JbmRleCA9IE1hdGguZmxvb3IocHJvcGVydGllcy5ib2FyZFNpemUgLyAyKTtcbiAgICBpZiAoIWxhc3RTZWxlY3Rpb24pIHtcbiAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Um93ID0gcGl2b3RFbGVtSW5kZXg7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudENlbGwgPSBwaXZvdEVsZW1JbmRleDtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nLCBKU09OLnN0cmluZ2lmeSh7IHJvdzogcGl2b3RFbGVtSW5kZXgsIGNlbGw6IHBpdm90RWxlbUluZGV4IH0pKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdyA9IGxhc3RTZWxlY3Rpb24ucm93O1xuICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID0gbGFzdFNlbGVjdGlvbi5jZWxsO1xuICAgIH1cblxuICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xuICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeCsrKSB7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyB5KyspIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XVt5XSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBsb2FkR2FtZUJvYXJkID0gZnVuY3Rpb24gKGlzQ2FudmFzRmxvdywgdWlPYmplY3QpIHtcbiAgICBpbml0Qm9hcmQuY2FsbCh0aGlzKTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGdhbWVTdG9yYWdlQm9hcmQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdnYW1lQm9hcmQnKSk7XG4gICAgY29uc3QgbGFzdEFjdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0QWN0Jyk7XG4gICAgaWYgKGxhc3RBY3QpIHtcbiAgICAgICAgaWYgKGxhc3RBY3QgPT0gJ1gnKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdPJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChnYW1lU3RvcmFnZUJvYXJkKSB7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSA9IGdhbWVTdG9yYWdlQm9hcmQ7XG4gICAgICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPSAwO1xuICAgICAgICBnYW1lU3RvcmFnZUJvYXJkLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5mb3JFYWNoKChpbm5lckVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5uZXJFbGVtICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmFjdGlvbkNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoaXNDYW52YXNGbG93KSB7XG4gICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIgPSBuZXcgQ2FudmFzUmVuZGVyTW9kZShwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXksIHVpT2JqZWN0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIgPSBuZXcgVGV4dFJlbmRlck1vZGUocHJvcGVydGllcy5nYW1lVGFibGVBcmF5LCB1aU9iamVjdCk7XG4gICAgfVxufVxuXG5jb25zdCBpc1dpbm5lckRldGVybWluZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID09IHByb3BlcnRpZXMuY3VycmVudENlbGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydGllcy5nYW1lVGFibGVBcmF5W2ldW2ldICE9IHByb3BlcnRpZXMucGxheWVyKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyArIHByb3BlcnRpZXMuY3VycmVudENlbGwgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5ib2FyZFNpemU7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtpXVsocHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSAtIGldICE9IHByb3BlcnRpZXMucGxheWVyKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbcHJvcGVydGllcy5jdXJyZW50Um93XVtpXSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBpZiAoaSA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbaV1bcHJvcGVydGllcy5jdXJyZW50Q2VsbF0gIT0gcHJvcGVydGllcy5wbGF5ZXIpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmNsYXNzIFRpY1RhY1RvZUdhbWUge1xuICAgIGNvbnN0cnVjdG9yKGlzQ2FudmFzRmxvdywgYm9hcmRTaXplLCB1aU9iamVjdCkge1xuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5zZXQodGhpcywge30pO1xuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuYm9hcmRTaXplID0gYm9hcmRTaXplO1xuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuZ2FtZVRhYmxlQXJheSA9IFtdO1xuICAgICAgICBsb2FkR2FtZUJvYXJkLmNhbGwodGhpcywgaXNDYW52YXNGbG93LCB1aU9iamVjdCk7XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID4gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKHByb3BlcnRpZXMuY3VycmVudFJvdywgLS1wcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Q2VsbCA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKHByb3BlcnRpZXMuY3VycmVudFJvdywgKytwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZVVwKCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID4gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKC0tcHJvcGVydGllcy5jdXJyZW50Um93LCBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZURvd24oKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcigrK3Byb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdFNlbGVjdGlvbicsIEpTT04uc3RyaW5naWZ5KHsgcm93OiBwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIGNlbGw6IHByb3BlcnRpZXMuY3VycmVudENlbGwgfSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc2V0R2FtZUJvYXJkICgpIHtcbiAgICAgICAgY29uc3QgcGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5ib2FyZFNpemUgLyAyKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nLCBKU09OLnN0cmluZ2lmeSh7IHJvdzogcGl2b3RFbGVtSW5kZXgsIGNlbGw6IHBpdm90RWxlbUluZGV4IH0pKTtcbiAgICAgICAgaW5pdEJvYXJkLmNhbGwodGhpcyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykucmVuZGVyZXIucmVzZXRCb2FyZCgpO1xuICAgIH1cbiAgICBhY3QoKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRFbGVtZW50ID0gcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3Byb3BlcnRpZXMuY3VycmVudFJvd11bcHJvcGVydGllcy5jdXJyZW50Q2VsbF07XG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCAhPSAnWCcgJiYgY3VycmVudEVsZW1lbnQgIT0gJ08nKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyLmFjdChwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIHByb3BlcnRpZXMuY3VycmVudENlbGwsIHByb3BlcnRpZXMucGxheWVyKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtwcm9wZXJ0aWVzLmN1cnJlbnRSb3ddW3Byb3BlcnRpZXMuY3VycmVudENlbGxdID0gcHJvcGVydGllcy5wbGF5ZXI7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZ2FtZUJvYXJkJywgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcy5nYW1lVGFibGVBcmF5KSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdEFjdCcsIHByb3BlcnRpZXMucGxheWVyKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQrKztcbiAgICAgICAgICAgIGlmIChpc1dpbm5lckRldGVybWluZWQuY2FsbCh0aGlzKSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGF5ZXIgJyArIHByb3BlcnRpZXMucGxheWVyICsgJyBXaW5zIScpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRHYW1lQm9hcmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmFjdGlvbkNvdW50ID09IHByb3BlcnRpZXMuYm9hcmRTaXplICogcHJvcGVydGllcy5ib2FyZFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0RyYXchJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRHYW1lQm9hcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5wbGF5ZXIgPT09ICdYJykge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdPJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaWNUYWNUb2VHYW1lO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGNlbFNpemUgPSAxNzA7XG5jb25zdCBzZWxlY3Rpb25DZWxsU2l6ZSA9IDE1MDtcbmNvbnN0IGxpbmVTaXplID0gMjA7XG5jb25zdCBkcmF3R2FtZUJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgY29uc3QgY3R4ID0gcHJvcGVydGllcy5jYW52YXNDb250ZXh0O1xuICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDIyNCwgMjAxLCA3MSknO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMTsgaSsrKSB7XG4gICAgICAgIGN0eC5maWxsUmVjdChjZWxTaXplLCAwLCBsaW5lU2l6ZSwgY2VsU2l6ZSAqIDMgKyBsaW5lU2l6ZSAqICgzIC0gMSkpO1xuICAgICAgICBjdHgudHJhbnNsYXRlKGNlbFNpemUgKyBsaW5lU2l6ZSwgMCk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxOyBpKyspIHtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIGNlbFNpemUsIGNlbFNpemUgKiAzICsgbGluZVNpemUgKiAoMyAtIDEpLCBsaW5lU2l6ZSk7XG4gICAgICAgIGN0eC50cmFuc2xhdGUoMCwgY2VsU2l6ZSArIGxpbmVTaXplKTtcbiAgICB9XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICBjdHguc2F2ZSgpO1xufVxuXG5jb25zdCBkcmF3U2VsZWN0aW9uID0gZnVuY3Rpb24gKHJvdywgY2VsbCkge1xuICAgIHZhciBjdHggPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuY2FudmFzQ29udGV4dDtcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigyNTUsIDEwMCwgMjU1KSc7XG4gICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICBjZWxTaXplICogY2VsbCArIGxpbmVTaXplICogY2VsbCArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMixcbiAgICAgICAgKGNlbFNpemUgKiByb3cpICsgbGluZVNpemUgKiByb3cgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIsXG4gICAgICAgIHNlbGVjdGlvbkNlbGxTaXplLFxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZVxuICAgICk7XG5cbiAgICBjdHguY2xlYXJSZWN0KFxuICAgICAgICAoY2VsU2l6ZSAqIGNlbGwgKyBsaW5lU2l6ZSAqIGNlbGwgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIpICsgMTAsXG4gICAgICAgICgoY2VsU2l6ZSAqIHJvdykgKyBsaW5lU2l6ZSAqIHJvdyArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMikgKyAxMCxcbiAgICAgICAgc2VsZWN0aW9uQ2VsbFNpemUgLSAyMCxcbiAgICAgICAgc2VsZWN0aW9uQ2VsbFNpemUgLSAyMFxuICAgICk7XG59XG5cbmNvbnN0IGRyYXdBY3Rpb24gPSBmdW5jdGlvbiAocm93LCBjZWxsLCBwbGF5ZXIpIHtcbiAgICBsZXQgY3R4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmNhbnZhc0NvbnRleHQ7XG4gICAgY3R4LmZvbnQgPSBzZWxlY3Rpb25DZWxsU2l6ZSArICdweCBTYW5zLXNlcmlmJztcbiAgICBpZiAocGxheWVyID09ICdYJykge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigyNTUsIDI1NSwgMjU1KSc7XG4gICAgICAgIGN0eC5maWxsVGV4dCgnWCcsXG4gICAgICAgICAgICAoY2VsU2l6ZSAqIGNlbGwgKyBsaW5lU2l6ZSAqIGNlbGwgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIpICsgMjUsXG4gICAgICAgICAgICAoY2VsU2l6ZSAqIHJvdyArIGxpbmVTaXplICogcm93ICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIHNlbGVjdGlvbkNlbGxTaXplIC0gMjBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDE0NywgMjI0LCA3MSknO1xuICAgICAgICBjdHguZmlsbFRleHQoJ08nLFxuICAgICAgICAgICAgKGNlbFNpemUgKiBjZWxsICsgbGluZVNpemUgKiBjZWxsICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIDE1LFxuICAgICAgICAgICAgKGNlbFNpemUgKiByb3cgKyBsaW5lU2l6ZSAqIHJvdyArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMikgKyBzZWxlY3Rpb25DZWxsU2l6ZSAtIDIwXG4gICAgICAgICk7XG4gICAgfVxuXG59XG5cbmNvbnN0IGxvYWRCb2FyZFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmdhbWVCb2FyZC5sZW5ndGg7IGkrKylcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wZXJ0aWVzLmdhbWVCb2FyZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuZ2FtZUJvYXJkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgZHJhd0FjdGlvbi5jYWxsKHRoaXMsIGksIGosIHByb3BlcnRpZXMuZ2FtZUJvYXJkW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxufVxuXG5jb25zdCBtb3ZlQ3Vyc29yU2VsZWN0aW9uID0gZnVuY3Rpb24gKG5ld1JvdywgbmV3Q2VsbCkge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgcHJvcGVydGllcy5sYXN0U2VsZWN0aW9uLnJvdyA9IG5ld1JvdztcbiAgICBwcm9wZXJ0aWVzLmxhc3RTZWxlY3Rpb24uY2VsbCA9IG5ld0NlbGw7XG4gICAgcHJvcGVydGllcy5jYW52YXNDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCA1NTAsIDU1MCk7XG4gICAgZHJhd0dhbWVCb2FyZC5jYWxsKHRoaXMpO1xuICAgIGRyYXdTZWxlY3Rpb24uY2FsbCh0aGlzLCBuZXdSb3csIG5ld0NlbGwpO1xuICAgIGxvYWRCb2FyZFN0YXRlLmNhbGwodGhpcyk7XG59XG5cbmNvbnN0IGFjdEFjdGlvbiA9IGZ1bmN0aW9uIChuZXdSb3csIG5ld0NlbGwsIHBsYXllcikge1xuICAgIG1vdmVDdXJzb3JTZWxlY3Rpb24uY2FsbCh0aGlzLCBuZXdSb3csIG5ld0NlbGwpO1xuICAgIGRyYXdBY3Rpb24uY2FsbCh0aGlzLCBuZXdSb3csIG5ld0NlbGwsIHBsYXllcik7XG59XG5cbmNsYXNzIENhbnZhc1JlbmRlck1vZGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWVCb2FyZCwgdWlPYmplY3QpIHtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuc2V0KHRoaXMsIHt9KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICAgICAgcHJvcGVydGllcy5waXZvdEVsZW1JbmRleCA9IE1hdGguZmxvb3IoZ2FtZUJvYXJkLmxlbmd0aCAvIDIpO1xuICAgICAgICBwcm9wZXJ0aWVzLmxhc3RTZWxlY3Rpb24gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0U2VsZWN0aW9uJykpO1xuICAgICAgICBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSA9IGdhbWVCb2FyZC5sZW5ndGg7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZUJvYXJkID0gZ2FtZUJvYXJkO1xuICAgICAgICBwcm9wZXJ0aWVzLmNhbnZhc0NvbnRleHQgPSB1aU9iamVjdC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBtb3ZlQ3Vyc29yU2VsZWN0aW9uLmNhbGwodGhpcyxcbiAgICAgICAgICAgIHByb3BlcnRpZXMubGFzdFNlbGVjdGlvbi5yb3csXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmxhc3RTZWxlY3Rpb24uY2VsbFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlc2V0Qm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IHBpdm90RWxlbUluZGV4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLnBpdm90RWxlbUluZGV4O1xuICAgICAgICB0aGlzLm1vdmVDdXJzb3IocGl2b3RFbGVtSW5kZXgsIHBpdm90RWxlbUluZGV4KTtcbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yKG5ld1JvdywgbmV3Q2VsbCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IG1vdmVDdXJzb3JTZWxlY3Rpb24uY2FsbCh0aGlzLCBuZXdSb3csIG5ld0NlbGwpKTtcbiAgICB9XG5cbiAgICBhY3Qocm93LCBjZWxsLCBwbGF5ZXIpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBhY3RBY3Rpb24uY2FsbCh0aGlzLCByb3csIGNlbGwsIHBsYXllcikpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXNSZW5kZXJNb2RlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9DYW52YXNSZW5kZXJNb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcblxuY2xhc3MgVGV4dFJlbmRlck1vZGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWVCb2FyZCwgdWlPYmplY3QpIHtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuc2V0KHRoaXMsIHt9KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGUgPSB1aU9iamVjdC5yb3dzO1xuICAgICAgICBwcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4ID0gTWF0aC5mbG9vcihnYW1lQm9hcmQubGVuZ3RoIC8gMik7XG4gICAgICAgIGNvbnN0IGxhc3RTZWxlY3Rpb24gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0U2VsZWN0aW9uJykpO1xuICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPSBsYXN0U2VsZWN0aW9uLnJvdztcbiAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCA9IGxhc3RTZWxlY3Rpb24uY2VsbDtcblxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGdhbWVCb2FyZC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBnYW1lQm9hcmQubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVt4XS5jZWxsc1t5XS50ZXh0Q29udGVudCA9IGdhbWVCb2FyZFt4XVt5XSA/IGdhbWVCb2FyZFt4XVt5XSA6ICctJztcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVt4XS5jZWxsc1t5XS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZEVsZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtwcm9wZXJ0aWVzLmN1cnJlbnRSb3ddLmNlbGxzW3Byb3BlcnRpZXMuY3VycmVudENlbGxdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xuICAgIH1cblxuICAgIHJlc2V0Qm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5nYW1lVGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcGVydGllcy5nYW1lVGFibGUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtpXS5jZWxsc1tqXS50ZXh0Q29udGVudCA9ICctJztcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtpXS5jZWxsc1tqXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZEVsZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtwcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4XS5jZWxsc1twcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZEVsZW1lbnQnKTtcbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yKG5ld1JvdywgbmV3Q2VsbCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpOyAgICAgICAgXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3Byb3BlcnRpZXMuY3VycmVudFJvd10uY2VsbHNbcHJvcGVydGllcy5jdXJyZW50Q2VsbF0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWRFbGVtZW50Jyk7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW25ld1Jvd10uY2VsbHNbbmV3Q2VsbF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdyA9IG5ld1JvdztcbiAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCA9IG5ld0NlbGw7XG4gICAgfVxuXG4gICAgYWN0KHJvdywgY2VsbCwgcGxheWVyKSB7XG4gICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuZ2FtZVRhYmxlW3Jvd10uY2VsbHNbY2VsbF0udGV4dENvbnRlbnQgPSBwbGF5ZXI7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRSZW5kZXJNb2RlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9UZXh0UmVuZGVyTW9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBUaWNUYWNUb2VHYW1lID0gcmVxdWlyZSgnLi9UaWNUYWNUb2VHYW1lJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRpY1RhY1RvZUdhbWUgPSB7fTtcbiAgICBsZXQgYm9hcmRTaXplID0gMztcbiAgICBsZXQgaXNDYW52YXNNb2RlID0gISFKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpc0NhbnZhc01vZGUnKSk7XG4gICAgbGV0IGNhbnZhc0JvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpYy10YWMtdG9lX2NhbnZhcy1yZW5kZXInKTtcbiAgICBsZXQgdGV4dEJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpYy10YWMtdG9lX3RleHQtcmVuZGVyJyk7XG5cbiAgICBmdW5jdGlvbiBzd2l0Y2hNb2RlKGlzQ2FudmFzTW9kZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaXNDYW52YXNNb2RlJywgaXNDYW52YXNNb2RlKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChpc0NhbnZhc01vZGUpIHtcbiAgICAgICAgICAgIGNhbnZhc0JvYXJkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcbiAgICAgICAgICAgIHRleHRCb2FyZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGljVGFjVG9lR2FtZSA9IG5ldyBUaWNUYWNUb2VHYW1lKGlzQ2FudmFzTW9kZSwgYm9hcmRTaXplLCBjYW52YXNCb2FyZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYW52YXNCb2FyZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGV4dEJvYXJkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcbiAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUgPSBuZXcgVGljVGFjVG9lR2FtZShpc0NhbnZhc01vZGUsIGJvYXJkU2l6ZSwgdGV4dEJvYXJkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFjdGlvbk1vdmUoKSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDMyKSB7XG4gICAgICAgICAgICB0aWNUYWNUb2VHYW1lLmFjdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKFszNywgMzgsIDM5LCA0MF0uaW5kZXhPZihldmVudC5rZXlDb2RlKSA+PSAwKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVVcCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVEb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZUxlZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5tb3ZlUmlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2hNb2RlKGlzQ2FudmFzTW9kZSk7XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gYWN0aW9uTW92ZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZWxlbWVudCkgPT4ge1xuICAgICAgICB0aWNUYWNUb2VHYW1lLnJlc2V0R2FtZUJvYXJkKCk7XG4gICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpc0NhbnZhc01vZGUnKS5jaGVja2VkID0gaXNDYW52YXNNb2RlO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpc0NhbnZhc01vZGUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZWxlbWVudCkgPT4ge1xuICAgICAgICBzd2l0Y2hNb2RlKGVsZW1lbnQuY3VycmVudFRhcmdldC5jaGVja2VkKTtcbiAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9zY3JpcHQuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==