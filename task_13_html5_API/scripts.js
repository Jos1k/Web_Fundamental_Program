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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const TextRenderMode = __webpack_require__(1);
const CanvasRenderMode = __webpack_require__(3);
const privateProperties = new WeakMap();

const initBoard = function () {
    const properties = privateProperties.get(this);
    properties.currentRow = 1;
    properties.currentCell = 1;
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
    initBoard.apply(this);
    localStorage.clear();
    privateProperties.get(this).renderer.resetBoard();
}

const loadGameBoard = function () {
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
            })
        });
    }
    if (localStorage.getItem('isCanvasMode')) {
        properties.renderer = new TextRenderMode(properties.gameTableAray);
    }
    else {
        properties.renderer = new CanvasRenderMode(properties.gameTableAray);
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
    constructor(boardSize) {
        privateProperties.set(this, {});
        privateProperties.get(this).boardSize = boardSize;
        privateProperties.get(this).gameTableAray = [];
        loadGameBoard.apply(this);
    }

    moveLeft() {
        const properties = privateProperties.get(this);
        if (properties.currentCell > 0) {
            properties.renderer.moveCursor(properties.currentRow, --properties.currentCell)
        }
    }
    moveRight() {
        const properties = privateProperties.get(this);
        if (properties.currentCell < properties.boardSize - 1) {
            properties.renderer.moveCursor(properties.currentRow, ++properties.currentCell)
        }
    }
    moveUp() {
        const properties = privateProperties.get(this);
        if (properties.currentRow > 0) {
            properties.renderer.moveCursor(--properties.currentRow, properties.currentCell)
        }
    }
    moveDown() {
        const properties = privateProperties.get(this);
        if (properties.currentRow < properties.boardSize - 1) {
            properties.renderer.moveCursor(++properties.currentRow, properties.currentCell)
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

class TextRenderMode {
    constructor(gameBoard) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        properties.gameTable = document.getElementsByClassName('tic-tac-toe_text-render')[0].rows;
        properties.pivotElemIndex = Math.floor(gameBoard.length / 2);

        for (let x = 0; x < gameBoard.length; x++) {
            for (let y = 0; y < gameBoard.length; y++) {
                properties.gameTable[x].cells[y].textContent = gameBoard[x][y] ? gameBoard[x][y] : '-';
            }
        }
        properties.gameTable[properties.pivotElemIndex].cells[properties.pivotElemIndex].classList.add('selectedElement');
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

    moveCursor(oldRow, oldCell, newRow, newCell) {
        const properties = privateProperties.get(this);        
        properties.gameTable[oldRow].cells[oldCell].classList.remove('selectedElement');
        properties.gameTable[newRow].cells[newCell].classList.add('selectedElement');
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const TicTacToeGame = __webpack_require__(0);

window.onload = function () {
    const ticTacToeGame = new TicTacToeGame(3);

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

/***/ }),
/* 3 */
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
        ((celSize * row) + lineSize * row + + (celSize - selectionCellSize) / 2) + 10,
        selectionCellSize - 20,
        selectionCellSize - 20
    );
}
const drawAction = function(row, cell,player){
    var ctx = privateProperties.get(this).canvasContext;
    if (player == 'X'){
        ctx.fillStyle = 'rgb(0, 200, 100)';
    }
    else{
        ctx.fillStyle = 'rgb(100, 200, 0)';
    }
    ctx.fillRect(
        (celSize * cell + lineSize * cell + (celSize - selectionCellSize) / 2) + 20,
        ((celSize * row) + lineSize * row + + (celSize - selectionCellSize) / 2) + 20,
        selectionCellSize - 40,
        selectionCellSize - 40
    );
}
const loadBoardState = function(){
    const properties = privateProperties.get(this);
    for(var i=0;i<properties.gameBoard.length;i++)
        for (var j=0;j<properties.gameBoard.length;j++){
            if (properties.gameBoard[i][j]){
                drawAction.call(this,i,j,properties.gameBoard[i][j]);
            }
        }
}

const moveCursorSelection = function (newRow, newCell) {
    const properties = privateProperties.get(this);
    properties.canvasContext.clearRect(0, 0, 550, 550);
    drawGameBoard.call(this);
    drawSelection.call(this, newRow, newCell);
    loadBoardState.call(this);
}

const actAction = function(newRow, newCell,player){
    moveCursorSelection.call(this, newRow, newCell);
    drawAction.call(this, newRow, newCell, player);
}

class CanvasRenderMode {
    constructor(gameBoard) {
        privateProperties.set(this, {});
        const properties = privateProperties.get(this);
        const canvas = document.getElementById('tic-tac-toe_canvas-render');
        properties.pivotElemIndex = Math.floor(gameBoard.length / 2);
        properties.boardSize = gameBoard.length;
        properties.gameBoard = gameBoard;
        properties.canvasContext = canvas.getContext('2d');
        moveCursorSelection.call(this, properties.pivotElemIndex, properties.pivotElemIndex);
    }

    resetBoard() {
        const pivotElemIndex = privateProperties.get(this).pivotElemIndex;
        moveCursor(pivotElemIndex, pivotElemIndex);
    }

    moveCursor(newRow, newCell) {
        window.requestAnimationFrame(() => moveCursorSelection.call(this, newRow, newCell));
    }

    act(row, cell, player) {
        window.requestAnimationFrame(() => actAction.call(this, row, cell,player));
    }
}

module.exports = CanvasRenderMode;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGNhMWZhNjQxY2RjYzBhN2RlYTUiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvVGV4dFJlbmRlck1vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9DYW52YXNSZW5kZXJNb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBLHVCQUF1QiwwQkFBMEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDBCQUEwQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCOzs7Ozs7QUNoS0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLHNCQUFzQjtBQUM3QywyQkFBMkIsc0JBQXNCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixpQ0FBaUM7QUFDeEQsMkJBQTJCLGlDQUFpQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0M7Ozs7OztBQzNDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsOEJBQThCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLDhCQUE4QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw4QkFBOEI7QUFDOUMscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0MiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhjYTFmYTY0MWNkY2MwYTdkZWE1IiwiY29uc3QgVGV4dFJlbmRlck1vZGUgPSByZXF1aXJlKCcuL1RleHRSZW5kZXJNb2RlJyk7XHJcbmNvbnN0IENhbnZhc1JlbmRlck1vZGUgPSByZXF1aXJlKCcuL0NhbnZhc1JlbmRlck1vZGUnKTtcclxuY29uc3QgcHJpdmF0ZVByb3BlcnRpZXMgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY29uc3QgaW5pdEJvYXJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgIHByb3BlcnRpZXMuY3VycmVudFJvdyA9IDE7XHJcbiAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID0gMTtcclxuICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xyXG4gICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCA9IDA7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeCsrKSB7XHJcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3hdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeSsrKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XVt5XSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcmVzZXRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5yZW5kZXJlci5yZXNldEJvYXJkKCk7XHJcbn1cclxuXHJcbmNvbnN0IGxvYWRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgY29uc3QgZ2FtZVN0b3JhZ2VCb2FyZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2dhbWVCb2FyZCcpKTtcclxuICAgIGNvbnN0IGxhc3RBY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdEFjdCcpO1xyXG4gICAgaWYgKGxhc3RBY3QpIHtcclxuICAgICAgICBpZiAobGFzdEFjdCA9PSAnWCcpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZ2FtZVN0b3JhZ2VCb2FyZCkge1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSA9IGdhbWVTdG9yYWdlQm9hcmQ7XHJcbiAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCA9IDA7XHJcbiAgICAgICAgZ2FtZVN0b3JhZ2VCb2FyZC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5mb3JFYWNoKChpbm5lckVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbm5lckVsZW0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpc0NhbnZhc01vZGUnKSkge1xyXG4gICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIgPSBuZXcgVGV4dFJlbmRlck1vZGUocHJvcGVydGllcy5nYW1lVGFibGVBcmF5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIgPSBuZXcgQ2FudmFzUmVuZGVyTW9kZShwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpc1dpbm5lckRldGVybWluZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyA9PSBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbaV1baV0gIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyArIHByb3BlcnRpZXMuY3VycmVudENlbGwgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbaV1bKHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkgLSBpXSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBpZiAoaSA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3Byb3BlcnRpZXMuY3VycmVudFJvd11baV0gIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtpXVtwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5jbGFzcyBUaWNUYWNUb2VHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGJvYXJkU2l6ZSkge1xyXG4gICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLnNldCh0aGlzLCB7fSk7XHJcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmJvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuZ2FtZVRhYmxlQXJheSA9IFtdO1xyXG4gICAgICAgIGxvYWRHYW1lQm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUxlZnQoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Q2VsbCA+IDApIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKHByb3BlcnRpZXMuY3VycmVudFJvdywgLS1wcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmVSaWdodCgpIHtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsIDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihwcm9wZXJ0aWVzLmN1cnJlbnRSb3csICsrcHJvcGVydGllcy5jdXJyZW50Q2VsbClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtb3ZlVXAoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID4gMCkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyLm1vdmVDdXJzb3IoLS1wcm9wZXJ0aWVzLmN1cnJlbnRSb3csIHByb3BlcnRpZXMuY3VycmVudENlbGwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbW92ZURvd24oKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93IDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcigrK3Byb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtwcm9wZXJ0aWVzLmN1cnJlbnRSb3ddW3Byb3BlcnRpZXMuY3VycmVudENlbGxdO1xyXG4gICAgICAgIGlmIChjdXJyZW50RWxlbWVudCAhPSAnWCcgJiYgY3VycmVudEVsZW1lbnQgIT0gJ08nKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIuYWN0KHByb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbCwgcHJvcGVydGllcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXlbcHJvcGVydGllcy5jdXJyZW50Um93XVtwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXSA9IHByb3BlcnRpZXMucGxheWVyO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZ2FtZUJvYXJkJywgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcy5nYW1lVGFibGVBcmF5KSk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0QWN0JywgcHJvcGVydGllcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmFjdGlvbkNvdW50Kys7XHJcbiAgICAgICAgICAgIGlmIChpc1dpbm5lckRldGVybWluZWQuYXBwbHkodGhpcykpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGF5ZXIgJyArIHByb3BlcnRpZXMucGxheWVyICsgJyBXaW5zIScpO1xyXG4gICAgICAgICAgICAgICAgcmVzZXRHYW1lQm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5hY3Rpb25Db3VudCA9PSBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAqIHByb3BlcnRpZXMuYm9hcmRTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0RyYXchJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRHYW1lQm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMucGxheWVyID09PSAnWCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdPJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucGxheWVyID0gJ1gnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpY1RhY1RvZUdhbWU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL1RpY1RhY1RvZUdhbWUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgcHJpdmF0ZVByb3BlcnRpZXMgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY2xhc3MgVGV4dFJlbmRlck1vZGUge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZUJvYXJkKSB7XHJcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuc2V0KHRoaXMsIHt9KTtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGljLXRhYy10b2VfdGV4dC1yZW5kZXInKVswXS5yb3dzO1xyXG4gICAgICAgIHByb3BlcnRpZXMucGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKGdhbWVCb2FyZC5sZW5ndGggLyAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBnYW1lQm9hcmQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBnYW1lQm9hcmQubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3hdLmNlbGxzW3ldLnRleHRDb250ZW50ID0gZ2FtZUJvYXJkW3hdW3ldID8gZ2FtZUJvYXJkW3hdW3ldIDogJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNlbGxzW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0Qm9hcmQoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuZ2FtZVRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcGVydGllcy5nYW1lVGFibGUubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW2ldLmNlbGxzW2pdLnRleHRDb250ZW50ID0gJy0nO1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbaV0uY2VsbHNbal0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbcHJvcGVydGllcy5waXZvdEVsZW1JbmRleF0uY2VsbHNbcHJvcGVydGllcy5waXZvdEVsZW1JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUN1cnNvcihvbGRSb3csIG9sZENlbGwsIG5ld1JvdywgbmV3Q2VsbCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7ICAgICAgICBcclxuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtvbGRSb3ddLmNlbGxzW29sZENlbGxdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW25ld1Jvd10uY2VsbHNbbmV3Q2VsbF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KHJvdywgY2VsbCwgcGxheWVyKSB7XHJcbiAgICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5nYW1lVGFibGVbcm93XS5jZWxsc1tjZWxsXS50ZXh0Q29udGVudCA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0VmFsdWUocm93LCBjZWxsKSB7XHJcbiAgICAgICAgcmV0dXJuICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuZ2FtZVRhYmxlW3Jvd10uY2VsbHNbY2VsbF0udGV4dENvbnRlbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dFJlbmRlck1vZGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL1RleHRSZW5kZXJNb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFRpY1RhY1RvZUdhbWUgPSByZXF1aXJlKCcuL1RpY1RhY1RvZUdhbWUnKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB0aWNUYWNUb2VHYW1lID0gbmV3IFRpY1RhY1RvZUdhbWUoMyk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aW9uTW92ZSgpIHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAzMikge1xyXG4gICAgICAgICAgICB0aWNUYWNUb2VHYW1lLmFjdCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoWzM3LCAzOCwgMzksIDQwXS5pbmRleE9mKGV2ZW50LmtleUNvZGUpID49IDApIHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZVVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZURvd24oKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gYWN0aW9uTW92ZTtcclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvc2NyaXB0LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcclxuY29uc3QgY2VsU2l6ZSA9IDE3MDtcclxuY29uc3Qgc2VsZWN0aW9uQ2VsbFNpemUgPSAxNTA7XHJcbmNvbnN0IGxpbmVTaXplID0gMjA7XHJcbmNvbnN0IGRyYXdHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgY29uc3QgY3R4ID0gcHJvcGVydGllcy5jYW52YXNDb250ZXh0O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjAwLCAwLCAwKSc7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxOyBpKyspIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoY2VsU2l6ZSwgMCwgbGluZVNpemUsIGNlbFNpemUgKiAzICsgbGluZVNpemUgKiAoMyAtIDEpKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKGNlbFNpemUgKyBsaW5lU2l6ZSwgMCk7XHJcbiAgICB9XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgY3R4LnNhdmUoKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIGNlbFNpemUsIGNlbFNpemUgKiAzICsgbGluZVNpemUgKiAoMyAtIDEpLCBsaW5lU2l6ZSk7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCBjZWxTaXplICsgbGluZVNpemUpO1xyXG4gICAgfVxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIGN0eC5zYXZlKCk7XHJcbn1cclxuXHJcbmNvbnN0IGRyYXdTZWxlY3Rpb24gPSBmdW5jdGlvbiAocm93LCBjZWxsKSB7XHJcbiAgICB2YXIgY3R4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmNhbnZhc0NvbnRleHQ7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLCAyMDAsIDApJztcclxuICAgIGN0eC5maWxsUmVjdChcclxuICAgICAgICBjZWxTaXplICogY2VsbCArIGxpbmVTaXplICogY2VsbCArIChjZWxTaXplIC0gc2VsZWN0aW9uQ2VsbFNpemUpIC8gMixcclxuICAgICAgICAoY2VsU2l6ZSAqIHJvdykgKyBsaW5lU2l6ZSAqIHJvdyArICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyLFxyXG4gICAgICAgIHNlbGVjdGlvbkNlbGxTaXplLFxyXG4gICAgICAgIHNlbGVjdGlvbkNlbGxTaXplXHJcbiAgICApO1xyXG5cclxuICAgIGN0eC5jbGVhclJlY3QoXHJcbiAgICAgICAgKGNlbFNpemUgKiBjZWxsICsgbGluZVNpemUgKiBjZWxsICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIDEwLFxyXG4gICAgICAgICgoY2VsU2l6ZSAqIHJvdykgKyBsaW5lU2l6ZSAqIHJvdyArICsgKGNlbFNpemUgLSBzZWxlY3Rpb25DZWxsU2l6ZSkgLyAyKSArIDEwLFxyXG4gICAgICAgIHNlbGVjdGlvbkNlbGxTaXplIC0gMjAsXHJcbiAgICAgICAgc2VsZWN0aW9uQ2VsbFNpemUgLSAyMFxyXG4gICAgKTtcclxufVxyXG5jb25zdCBkcmF3QWN0aW9uID0gZnVuY3Rpb24ocm93LCBjZWxsLHBsYXllcil7XHJcbiAgICB2YXIgY3R4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmNhbnZhc0NvbnRleHQ7XHJcbiAgICBpZiAocGxheWVyID09ICdYJyl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwgMjAwLCAxMDApJztcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMTAwLCAyMDAsIDApJztcclxuICAgIH1cclxuICAgIGN0eC5maWxsUmVjdChcclxuICAgICAgICAoY2VsU2l6ZSAqIGNlbGwgKyBsaW5lU2l6ZSAqIGNlbGwgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIpICsgMjAsXHJcbiAgICAgICAgKChjZWxTaXplICogcm93KSArIGxpbmVTaXplICogcm93ICsgKyAoY2VsU2l6ZSAtIHNlbGVjdGlvbkNlbGxTaXplKSAvIDIpICsgMjAsXHJcbiAgICAgICAgc2VsZWN0aW9uQ2VsbFNpemUgLSA0MCxcclxuICAgICAgICBzZWxlY3Rpb25DZWxsU2l6ZSAtIDQwXHJcbiAgICApO1xyXG59XHJcbmNvbnN0IGxvYWRCb2FyZFN0YXRlID0gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICBmb3IodmFyIGk9MDtpPHByb3BlcnRpZXMuZ2FtZUJvYXJkLmxlbmd0aDtpKyspXHJcbiAgICAgICAgZm9yICh2YXIgaj0wO2o8cHJvcGVydGllcy5nYW1lQm9hcmQubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmdhbWVCb2FyZFtpXVtqXSl7XHJcbiAgICAgICAgICAgICAgICBkcmF3QWN0aW9uLmNhbGwodGhpcyxpLGoscHJvcGVydGllcy5nYW1lQm9hcmRbaV1bal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG5jb25zdCBtb3ZlQ3Vyc29yU2VsZWN0aW9uID0gZnVuY3Rpb24gKG5ld1JvdywgbmV3Q2VsbCkge1xyXG4gICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgIHByb3BlcnRpZXMuY2FudmFzQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgNTUwLCA1NTApO1xyXG4gICAgZHJhd0dhbWVCb2FyZC5jYWxsKHRoaXMpO1xyXG4gICAgZHJhd1NlbGVjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCk7XHJcbiAgICBsb2FkQm9hcmRTdGF0ZS5jYWxsKHRoaXMpO1xyXG59XHJcblxyXG5jb25zdCBhY3RBY3Rpb24gPSBmdW5jdGlvbihuZXdSb3csIG5ld0NlbGwscGxheWVyKXtcclxuICAgIG1vdmVDdXJzb3JTZWxlY3Rpb24uY2FsbCh0aGlzLCBuZXdSb3csIG5ld0NlbGwpO1xyXG4gICAgZHJhd0FjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCwgcGxheWVyKTtcclxufVxyXG5cclxuY2xhc3MgQ2FudmFzUmVuZGVyTW9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lQm9hcmQpIHtcclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5zZXQodGhpcywge30pO1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpYy10YWMtdG9lX2NhbnZhcy1yZW5kZXInKTtcclxuICAgICAgICBwcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4ID0gTWF0aC5mbG9vcihnYW1lQm9hcmQubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgcHJvcGVydGllcy5ib2FyZFNpemUgPSBnYW1lQm9hcmQubGVuZ3RoO1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZUJvYXJkID0gZ2FtZUJvYXJkO1xyXG4gICAgICAgIHByb3BlcnRpZXMuY2FudmFzQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIG1vdmVDdXJzb3JTZWxlY3Rpb24uY2FsbCh0aGlzLCBwcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4LCBwcm9wZXJ0aWVzLnBpdm90RWxlbUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldEJvYXJkKCkge1xyXG4gICAgICAgIGNvbnN0IHBpdm90RWxlbUluZGV4ID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLnBpdm90RWxlbUluZGV4O1xyXG4gICAgICAgIG1vdmVDdXJzb3IocGl2b3RFbGVtSW5kZXgsIHBpdm90RWxlbUluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQ3Vyc29yKG5ld1JvdywgbmV3Q2VsbCkge1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gbW92ZUN1cnNvclNlbGVjdGlvbi5jYWxsKHRoaXMsIG5ld1JvdywgbmV3Q2VsbCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChyb3csIGNlbGwsIHBsYXllcikge1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gYWN0QWN0aW9uLmNhbGwodGhpcywgcm93LCBjZWxsLHBsYXllcikpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhc1JlbmRlck1vZGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL0NhbnZhc1JlbmRlck1vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==