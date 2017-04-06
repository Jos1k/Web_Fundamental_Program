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
    ctx.fillStyle = 'rgb(200, 0, 0)';
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
    ctx.fillStyle = 'rgb(0, 200, 0)';
    ctx.fillRect(
        celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2,
        (celSize * row) + lineSize * row + + (celSize - selectionCellSize) / 2,
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
    var ctx = privateProperties.get(this).canvasContext;
    if (player == 'X') {
        ctx.fillStyle = 'rgb(0, 200, 100)';
    }
    else {
        ctx.fillStyle = 'rgb(100, 200, 0)';
    }
    ctx.fillRect(
        (celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2) + 20,
        ((celSize * row) + lineSize * row + + (celSize - selectionCellSize) / 2) + 20,
        selectionCellSize - 40,
        selectionCellSize - 40
    );
}

const loadBoardState = function () {
    const properties = privateProperties.get(this);
    for (var i = 0; i < properties.gameBoard.length; i++)
        for (var j = 0; j < properties.gameBoard.length; j++) {
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
    constructor(gameBoard) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        const canvas = document.getElementById('tic-tac-toe_canvas-render');
        properties.pivotElemIndex = Math.floor(gameBoard.length / 2);
        properties.lastSelection = JSON.parse(localStorage.getItem('lastSelection'));

        properties.boardSize = gameBoard.length;
        properties.gameBoard = gameBoard;
        properties.canvasContext = canvas.getContext('2d');
        moveCursorSelection.call(
            this,  
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
    constructor(gameBoard) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        properties.gameTable = document.getElementsByClassName('tic-tac-toe_text-render')[0].rows;
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
    
    getValue(row, cell) {
        return  privateProperties.get(this).gameTable[row].cells[cell].textContent;
    }
}

module.exports = TextRenderMode;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const TicTacToeGame = __webpack_require__(0);

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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmU2MDIzNDAyMWI2ZGMxOTgwZGYiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvQ2FudmFzUmVuZGVyTW9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL1RleHRSZW5kZXJNb2RlLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCw0Q0FBNEM7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwREFBMEQsNENBQTRDO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsRSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmU2MDIzNDAyMWI2ZGMxOTgwZGYiLCJjb25zdCBUZXh0UmVuZGVyTW9kZSA9IHJlcXVpcmUoJy4vVGV4dFJlbmRlck1vZGUnKTtcbmNvbnN0IENhbnZhc1JlbmRlck1vZGUgPSByZXF1aXJlKCcuL0NhbnZhc1JlbmRlck1vZGUnKTtcbmNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcblxuY29uc3QgaW5pdEJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgY29uc3QgbGFzdFNlbGVjdGlvbiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nKSk7XG4gICAgY29uc3QgcGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheS5sZW5ndGggLyAyKTtcbiAgICBpZiAoIWxhc3RTZWxlY3Rpb24pIHtcbiAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Um93ID0gcGl2b3RFbGVtSW5kZXg7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudENlbGwgPSBwaXZvdEVsZW1JbmRleDtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nLCBKU09OLnN0cmluZ2lmeSh7IHJvdzogcGl2b3RFbGVtSW5kZXgsIGNlbGw6IHBpdm90RWxlbUluZGV4IH0pKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdyA9IGxhc3RTZWxlY3Rpb24ucm93O1xuICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID0gbGFzdFNlbGVjdGlvbi5jZWxsO1xuICAgIH1cblxuICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xuICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeCsrKSB7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyB5KyspIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XVt5XSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCByZXNldEdhbWVCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwaXZvdEVsZW1JbmRleCA9IE1hdGguZmxvb3IocHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmdhbWVUYWJsZUFyYXkubGVuZ3RoIC8gMik7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nLCBKU09OLnN0cmluZ2lmeSh7IHJvdzogcGl2b3RFbGVtSW5kZXgsIGNlbGw6IHBpdm90RWxlbUluZGV4IH0pKTtcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLnJlbmRlcmVyLnJlc2V0Qm9hcmQoKTtcbn1cblxuY29uc3QgbG9hZEdhbWVCb2FyZCA9IGZ1bmN0aW9uIChpc0NhbnZhc0Zsb3cpIHtcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICBjb25zdCBnYW1lU3RvcmFnZUJvYXJkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZ2FtZUJvYXJkJykpO1xuICAgIGNvbnN0IGxhc3RBY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdEFjdCcpO1xuICAgIGlmIChsYXN0QWN0KSB7XG4gICAgICAgIGlmIChsYXN0QWN0ID09ICdYJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZ2FtZVN0b3JhZ2VCb2FyZCkge1xuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXkgPSBnYW1lU3RvcmFnZUJvYXJkO1xuICAgICAgICBwcm9wZXJ0aWVzLmFjdGlvbkNvdW50ID0gMDtcbiAgICAgICAgZ2FtZVN0b3JhZ2VCb2FyZC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuZm9yRWFjaCgoaW5uZXJFbGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyRWxlbSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzQ2FudmFzRmxvdykge1xuICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyID0gbmV3IENhbnZhc1JlbmRlck1vZGUocHJvcGVydGllcy5nYW1lVGFibGVBcmF5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIgPSBuZXcgVGV4dFJlbmRlck1vZGUocHJvcGVydGllcy5nYW1lVGFibGVBcmF5KTtcbiAgICB9XG59XG5cbmNvbnN0IGlzV2lubmVyRGV0ZXJtaW5lZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPT0gcHJvcGVydGllcy5jdXJyZW50Q2VsbCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbaV1baV0gIT0gcHJvcGVydGllcy5wbGF5ZXIpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAoaSA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ICsgcHJvcGVydGllcy5jdXJyZW50Q2VsbCA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydGllcy5nYW1lVGFibGVBcmF5W2ldWyhwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIC0gaV0gIT0gcHJvcGVydGllcy5wbGF5ZXIpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAoaSA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtwcm9wZXJ0aWVzLmN1cnJlbnRSb3ddW2ldICE9IHByb3BlcnRpZXMucGxheWVyKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtpXVtwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBpZiAoaSA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuY2xhc3MgVGljVGFjVG9lR2FtZSB7XG4gICAgY29uc3RydWN0b3IoaXNDYW52YXNGbG93LCBib2FyZFNpemUpIHtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuc2V0KHRoaXMsIHt9KTtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmJvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmdhbWVUYWJsZUFyYXkgPSBbXTtcbiAgICAgICAgbG9hZEdhbWVCb2FyZC5jYWxsKHRoaXMsIGlzQ2FudmFzRmxvdyk7XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID4gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKHByb3BlcnRpZXMuY3VycmVudFJvdywgLS1wcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Q2VsbCA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKHByb3BlcnRpZXMuY3VycmVudFJvdywgKytwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZVVwKCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID4gMCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKC0tcHJvcGVydGllcy5jdXJyZW50Um93LCBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0U2VsZWN0aW9uJywgSlNPTi5zdHJpbmdpZnkoeyByb3c6IHByb3BlcnRpZXMuY3VycmVudFJvdywgY2VsbDogcHJvcGVydGllcy5jdXJyZW50Q2VsbCB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbW92ZURvd24oKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcigrK3Byb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdFNlbGVjdGlvbicsIEpTT04uc3RyaW5naWZ5KHsgcm93OiBwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIGNlbGw6IHByb3BlcnRpZXMuY3VycmVudENlbGwgfSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFjdCgpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICAgICAgY29uc3QgY3VycmVudEVsZW1lbnQgPSBwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbcHJvcGVydGllcy5jdXJyZW50Um93XVtwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXTtcbiAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50ICE9ICdYJyAmJiBjdXJyZW50RWxlbWVudCAhPSAnTycpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIuYWN0KHByb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbCwgcHJvcGVydGllcy5wbGF5ZXIpO1xuICAgICAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3Byb3BlcnRpZXMuY3VycmVudFJvd11bcHJvcGVydGllcy5jdXJyZW50Q2VsbF0gPSBwcm9wZXJ0aWVzLnBsYXllcjtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdnYW1lQm9hcmQnLCBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXkpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0QWN0JywgcHJvcGVydGllcy5wbGF5ZXIpO1xuICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgaWYgKGlzV2lubmVyRGV0ZXJtaW5lZC5hcHBseSh0aGlzKSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGF5ZXIgJyArIHByb3BlcnRpZXMucGxheWVyICsgJyBXaW5zIScpO1xuICAgICAgICAgICAgICAgIHJlc2V0R2FtZUJvYXJkLmFwcGx5KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgKiBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnRHJhdyEnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRHYW1lQm9hcmQuYXBwbHkodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMucGxheWVyID09PSAnWCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGljVGFjVG9lR2FtZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvVGljVGFjVG9lR2FtZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBwcml2YXRlUHJvcGVydGllcyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBjZWxTaXplID0gMTcwO1xuY29uc3Qgc2VsZWN0aW9uQ2VsbFNpemUgPSAxNTA7XG5jb25zdCBsaW5lU2l6ZSA9IDIwO1xuY29uc3QgZHJhd0dhbWVCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xuICAgIGNvbnN0IGN0eCA9IHByb3BlcnRpZXMuY2FudmFzQ29udGV4dDtcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigyMDAsIDAsIDApJztcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDE7IGkrKykge1xuICAgICAgICBjdHguZmlsbFJlY3QoY2VsU2l6ZSwgMCwgbGluZVNpemUsIGNlbFNpemUgKiAzICsgbGluZVNpemUgKiAoMyAtIDEpKTtcbiAgICAgICAgY3R4LnRyYW5zbGF0ZShjZWxTaXplICsgbGluZVNpemUsIDApO1xuICAgIH1cbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMTsgaSsrKSB7XG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCBjZWxTaXplLCBjZWxTaXplICogMyArIGxpbmVTaXplICogKDMgLSAxKSwgbGluZVNpemUpO1xuICAgICAgICBjdHgudHJhbnNsYXRlKDAsIGNlbFNpemUgKyBsaW5lU2l6ZSk7XG4gICAgfVxuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnNhdmUoKTtcbn1cblxuY29uc3QgZHJhd1NlbGVjdGlvbiA9IGZ1bmN0aW9uIChyb3csIGNlbGwpIHtcbiAgICB2YXIgY3R4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmNhbnZhc0NvbnRleHQ7XG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMjAwLCAwKSc7XG4gICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICBjZWxTaXplICogY2VsbCArIGxpbmVTaXplICogY2VsbCArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMixcbiAgICAgICAgKGNlbFNpemUgKiByb3cpICsgbGluZVNpemUgKiByb3cgKyArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMixcbiAgICAgICAgc2VsZWN0aW9uQ2VsbFNpemUsXG4gICAgICAgIHNlbGVjdGlvbkNlbGxTaXplXG4gICAgKTtcblxuICAgIGN0eC5jbGVhclJlY3QoXG4gICAgICAgIChjZWxTaXplICogY2VsbCArIGxpbmVTaXplICogY2VsbCArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMikgKyAxMCxcbiAgICAgICAgKChjZWxTaXplICogcm93KSArIGxpbmVTaXplICogcm93ICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIDEwLFxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZSAtIDIwLFxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZSAtIDIwXG4gICAgKTtcbn1cblxuY29uc3QgZHJhd0FjdGlvbiA9IGZ1bmN0aW9uIChyb3csIGNlbGwsIHBsYXllcikge1xuICAgIHZhciBjdHggPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuY2FudmFzQ29udGV4dDtcbiAgICBpZiAocGxheWVyID09ICdYJykge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLCAyMDAsIDEwMCknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMTAwLCAyMDAsIDApJztcbiAgICB9XG4gICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICAoY2VsU2l6ZSAqIGNlbGwgKyBsaW5lU2l6ZSAqIGNlbGwgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIpICsgMjAsXG4gICAgICAgICgoY2VsU2l6ZSAqIHJvdykgKyBsaW5lU2l6ZSAqIHJvdyArICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIDIwLFxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZSAtIDQwLFxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZSAtIDQwXG4gICAgKTtcbn1cblxuY29uc3QgbG9hZEJvYXJkU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMuZ2FtZUJvYXJkLmxlbmd0aDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHByb3BlcnRpZXMuZ2FtZUJvYXJkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydGllcy5nYW1lQm9hcmRbaV1bal0pIHtcbiAgICAgICAgICAgICAgICBkcmF3QWN0aW9uLmNhbGwodGhpcywgaSwgaiwgcHJvcGVydGllcy5nYW1lQm9hcmRbaV1bal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59XG5cbmNvbnN0IG1vdmVDdXJzb3JTZWxlY3Rpb24gPSBmdW5jdGlvbiAobmV3Um93LCBuZXdDZWxsKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICBcbiAgICBwcm9wZXJ0aWVzLmxhc3RTZWxlY3Rpb24ucm93ID0gbmV3Um93O1xuICAgIHByb3BlcnRpZXMubGFzdFNlbGVjdGlvbi5jZWxsID0gbmV3Q2VsbDtcbiAgICBcbiAgICBwcm9wZXJ0aWVzLmNhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIDU1MCwgNTUwKTtcbiAgICBkcmF3R2FtZUJvYXJkLmNhbGwodGhpcyk7XG4gICAgZHJhd1NlbGVjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCk7XG4gICAgbG9hZEJvYXJkU3RhdGUuY2FsbCh0aGlzKTtcbn1cblxuY29uc3QgYWN0QWN0aW9uID0gZnVuY3Rpb24gKG5ld1JvdywgbmV3Q2VsbCwgcGxheWVyKSB7XG4gICAgbW92ZUN1cnNvclNlbGVjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCk7XG4gICAgZHJhd0FjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCwgcGxheWVyKTtcbn1cblxuY2xhc3MgQ2FudmFzUmVuZGVyTW9kZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZUJvYXJkKSB7XG4gICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLnNldCh0aGlzLCB7fSk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aWMtdGFjLXRvZV9jYW52YXMtcmVuZGVyJyk7XG4gICAgICAgIHByb3BlcnRpZXMucGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKGdhbWVCb2FyZC5sZW5ndGggLyAyKTtcbiAgICAgICAgcHJvcGVydGllcy5sYXN0U2VsZWN0aW9uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdFNlbGVjdGlvbicpKTtcblxuICAgICAgICBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSA9IGdhbWVCb2FyZC5sZW5ndGg7XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZUJvYXJkID0gZ2FtZUJvYXJkO1xuICAgICAgICBwcm9wZXJ0aWVzLmNhbnZhc0NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgbW92ZUN1cnNvclNlbGVjdGlvbi5jYWxsKFxuICAgICAgICAgICAgdGhpcywgIFxuICAgICAgICAgICAgcHJvcGVydGllcy5sYXN0U2VsZWN0aW9uLnJvdywgIFxuICAgICAgICAgICAgcHJvcGVydGllcy5sYXN0U2VsZWN0aW9uLmNlbGxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXNldEJvYXJkKCkge1xuICAgICAgICBjb25zdCBwaXZvdEVsZW1JbmRleCA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5waXZvdEVsZW1JbmRleDtcbiAgICAgICAgdGhpcy5tb3ZlQ3Vyc29yKHBpdm90RWxlbUluZGV4LCBwaXZvdEVsZW1JbmRleCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvcihuZXdSb3csIG5ld0NlbGwpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBtb3ZlQ3Vyc29yU2VsZWN0aW9uLmNhbGwodGhpcywgbmV3Um93LCBuZXdDZWxsKSk7XG4gICAgfVxuXG4gICAgYWN0KHJvdywgY2VsbCwgcGxheWVyKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gYWN0QWN0aW9uLmNhbGwodGhpcywgcm93LCBjZWxsLCBwbGF5ZXIpKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzUmVuZGVyTW9kZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvQ2FudmFzUmVuZGVyTW9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBwcml2YXRlUHJvcGVydGllcyA9IG5ldyBXZWFrTWFwKCk7XG5cbmNsYXNzIFRleHRSZW5kZXJNb2RlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lQm9hcmQpIHtcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuc2V0KHRoaXMsIHt9KTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0aWMtdGFjLXRvZV90ZXh0LXJlbmRlcicpWzBdLnJvd3M7XG4gICAgICAgIHByb3BlcnRpZXMucGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKGdhbWVCb2FyZC5sZW5ndGggLyAyKTtcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdGlvbiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3RTZWxlY3Rpb24nKSk7XG4gICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdyA9IGxhc3RTZWxlY3Rpb24ucm93O1xuICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID0gbGFzdFNlbGVjdGlvbi5jZWxsO1xuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZ2FtZUJvYXJkLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGdhbWVCb2FyZC5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3hdLmNlbGxzW3ldLnRleHRDb250ZW50ID0gZ2FtZUJvYXJkW3hdW3ldID8gZ2FtZUJvYXJkW3hdW3ldIDogJy0nO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3hdLmNlbGxzW3ldLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3Byb3BlcnRpZXMuY3VycmVudFJvd10uY2VsbHNbcHJvcGVydGllcy5jdXJyZW50Q2VsbF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgcmVzZXRCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmdhbWVUYWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wZXJ0aWVzLmdhbWVUYWJsZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW2ldLmNlbGxzW2pdLnRleHRDb250ZW50ID0gJy0nO1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW2ldLmNlbGxzW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNlbGxzW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xuICAgIH1cblxuICAgIG1vdmVDdXJzb3IobmV3Um93LCBuZXdDZWxsKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7ICAgICAgICBcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbcHJvcGVydGllcy5jdXJyZW50Um93XS5jZWxsc1twcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZEVsZW1lbnQnKTtcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbbmV3Um93XS5jZWxsc1tuZXdDZWxsXS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZEVsZW1lbnQnKTtcbiAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Um93ID0gbmV3Um93O1xuICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID0gbmV3Q2VsbDtcbiAgICB9XG5cbiAgICBhY3Qocm93LCBjZWxsLCBwbGF5ZXIpIHtcbiAgICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5nYW1lVGFibGVbcm93XS5jZWxsc1tjZWxsXS50ZXh0Q29udGVudCA9IHBsYXllcjtcbiAgICB9XG4gICAgXG4gICAgZ2V0VmFsdWUocm93LCBjZWxsKSB7XG4gICAgICAgIHJldHVybiAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmdhbWVUYWJsZVtyb3ddLmNlbGxzW2NlbGxdLnRleHRDb250ZW50O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0UmVuZGVyTW9kZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvVGV4dFJlbmRlck1vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgVGljVGFjVG9lR2FtZSA9IHJlcXVpcmUoJy4vVGljVGFjVG9lR2FtZScpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpc0NhbnZhc01vZGUgPSAhIUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2lzQ2FudmFzTW9kZScpKTtcbiAgICBsZXQgdGljVGFjVG9lR2FtZSA9IG5ldyBUaWNUYWNUb2VHYW1lKGlzQ2FudmFzTW9kZSwgMyk7XG4gICAgbGV0IGNhbnZhc0JvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpYy10YWMtdG9lX2NhbnZhcy1yZW5kZXInKTtcbiAgICBsZXQgdGV4dEJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpYy10YWMtdG9lX3RleHQtcmVuZGVyJyk7XG5cbiAgICBmdW5jdGlvbiBzd2l0Y2hNb2RlKGlzQ2FudmFzTW9kZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaXNDYW52YXNNb2RlJywgaXNDYW52YXNNb2RlKTtcbiAgICAgICAgdGljVGFjVG9lR2FtZSA9IG5ldyBUaWNUYWNUb2VHYW1lKGlzQ2FudmFzTW9kZSwgMyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNDYW52YXNNb2RlKSB7XG4gICAgICAgICAgICBjYW52YXNCb2FyZC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XG4gICAgICAgICAgICB0ZXh0Qm9hcmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhc0JvYXJkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0ZXh0Qm9hcmQuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWN0aW9uTW92ZSgpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMzIpIHtcbiAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUuYWN0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoWzM3LCAzOCwgMzksIDQwXS5pbmRleE9mKGV2ZW50LmtleUNvZGUpID49IDApIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZVVwKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZURvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5tb3ZlTGVmdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVSaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaE1vZGUoaXNDYW52YXNNb2RlKTtcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBhY3Rpb25Nb3ZlO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpc0NhbnZhc01vZGUnKS5jaGVja2VkID0gaXNDYW52YXNNb2RlO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpc0NhbnZhc01vZGUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZWxlbWVudCkgPT4ge1xuICAgICAgICBzd2l0Y2hNb2RlKGVsZW1lbnQuY3VycmVudFRhcmdldC5jaGVja2VkKTtcbiAgICB9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL3NjcmlwdC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9