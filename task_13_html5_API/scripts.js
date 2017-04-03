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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

class TextRenderMode {
    constructor(gameBoard) {
        this.gameTable = document.getElementsByClassName('main-content_game_area')[0].rows;
        this.pivotElemIndex = Math.floor(gameBoard.length / 2);

        for (let x = 0; x < gameBoard.length; x++) {
            for (let y = 0; y < gameBoard.length; y++) {
                this.gameTable[x].cells[y].textContent = gameBoard[x][y] ? gameBoard[x][y] : '-';
            }
        }
        this.gameTable[this.pivotElemIndex].cells[this.pivotElemIndex].classList.add('selectedElement');
    }

    resetBoard() {
        for (let i = 0; i < this.gameTable.length; i++) {
            for (let j = 0; j < this.gameTable.length; j++) {
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
    }
    
    getValue(row, cell) {
        return this.gameTable[row].cells[cell].textContent;
    }
}

module.exports = TextRenderMode;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const TicTacToeGame = __webpack_require__(0);

window.onload = function () {
    let ticTacToeGame = new TicTacToeGame(3);

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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjYxM2EzYmZjZjY2YjFjYzgyNTIiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvVGV4dFJlbmRlck1vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwQkFBMEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQjs7Ozs7O0FDaExBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixzQkFBc0I7QUFDN0MsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLDJCQUEyQjtBQUNsRCwyQkFBMkIsMkJBQTJCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0M7Ozs7OztBQ3JDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjYxM2EzYmZjZjY2YjFjYzgyNTIiLCJjb25zdCBUZXh0UmVuZGVyTW9kZSA9IHJlcXVpcmUoJy4vVGV4dFJlbmRlck1vZGUnKTtcclxuY29uc3QgcHJpdmF0ZVByb3BlcnRpZXMgPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuY29uc3QgaW5pdEJvYXJkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICBwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPSAxO1xyXG4gICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCA9IDE7XHJcbiAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPSAwO1xyXG4gICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeCsrKSB7XHJcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3hdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeSsrKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XVt5XSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcmVzZXRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5yZW5kZXJlci5yZXNldEJvYXJkKCk7XHJcbn1cclxuXHJcbmNvbnN0IGxvYWRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgIGxldCBnYW1lU3RvcmFnZUJvYXJkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZ2FtZUJvYXJkJykpO1xyXG4gICAgbGV0IGxhc3RBY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdEFjdCcpO1xyXG4gICAgaWYgKGxhc3RBY3QpIHtcclxuICAgICAgICBpZiAobGFzdEFjdCA9PSAnWCcpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZ2FtZVN0b3JhZ2VCb2FyZCkge1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSA9IGdhbWVTdG9yYWdlQm9hcmQ7XHJcbiAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCA9IDA7XHJcbiAgICAgICAgZ2FtZVN0b3JhZ2VCb2FyZC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5mb3JFYWNoKChpbm5lckVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbm5lckVsZW0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaXNDYW52YXNNb2RlJykpIHtcclxuICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyID0gbmV3IFRleHRSZW5kZXJNb2RlKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGlzV2lubmVyRGV0ZXJtaW5lZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyA9PSBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLnJlbmRlcmVyLmdldFZhbHVlKGksIGkpICE9IHByb3BlcnRpZXMucGxheWVyKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgKyBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5ib2FyZFNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcy5yZW5kZXJlci5nZXRWYWx1ZShpLCAocHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSAtIGkpICE9IHByb3BlcnRpZXMucGxheWVyKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllcy5ib2FyZFNpemU7IGkrKykge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLnJlbmRlcmVyLmdldFZhbHVlKHByb3BlcnRpZXMuY3VycmVudFJvdywgaSkgIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMucmVuZGVyZXIuZ2V0VmFsdWUoaSwgcHJvcGVydGllcy5jdXJyZW50Q2VsbCkgIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGlmIChpID09IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuY2xhc3MgVGljVGFjVG9lR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihib2FyZFNpemUpIHtcclxuICAgICAgICBwcml2YXRlUHJvcGVydGllcy5zZXQodGhpcywge30pO1xyXG4gICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5ib2FyZFNpemUgPSBib2FyZFNpemU7XHJcbiAgICAgICAgbG9hZEdhbWVCb2FyZC5hcHBseSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTGVmdCgpIHtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Q2VsbCA+IDApIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5tb3ZlQ3Vyc29yKFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Um93LCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudENlbGwsIFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Um93LCBcclxuICAgICAgICAgICAgICAgIC0tcHJvcGVydGllcy5jdXJyZW50Q2VsbFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbW92ZVJpZ2h0KCkge1xyXG4gICAgICAgIGxldCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsIDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICArK3Byb3BlcnRpZXMuY3VycmVudENlbGxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmVVcCgpIHtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID4gMCkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyLm1vdmVDdXJzb3IoXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCwgXHJcbiAgICAgICAgICAgICAgICAtLXByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBtb3ZlRG93bigpIHtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93IDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBcclxuICAgICAgICAgICAgICAgICsrcHJvcGVydGllcy5jdXJyZW50Um93LCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudENlbGxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBsZXQgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBwcm9wZXJ0aWVzLnJlbmRlcmVyLmdldFZhbHVlKHByb3BlcnRpZXMuY3VycmVudFJvdywgcHJvcGVydGllcy5jdXJyZW50Q2VsbCk7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50ICE9ICdYJyAmJiBjdXJyZW50RWxlbWVudCAhPSAnTycpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5yZW5kZXJlci5hY3QocHJvcGVydGllcy5jdXJyZW50Um93LCBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBwcm9wZXJ0aWVzLnBsYXllcik7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVtwcm9wZXJ0aWVzLmN1cnJlbnRSb3ddW3Byb3BlcnRpZXMuY3VycmVudENlbGxdID0gcHJvcGVydGllcy5wbGF5ZXI7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdnYW1lQm9hcmQnLCBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzLmdhbWVUYWJsZUFyYXkpKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RBY3QnLCBwcm9wZXJ0aWVzLnBsYXllcik7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQrKztcclxuICAgICAgICAgICAgaWYgKGlzV2lubmVyRGV0ZXJtaW5lZC5hcHBseSh0aGlzKSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ1BsYXllciAnICsgcHJvcGVydGllcy5wbGF5ZXIgKyAnIFdpbnMhJyk7XHJcbiAgICAgICAgICAgICAgICByZXNldEdhbWVCb2FyZC5hcHBseSh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmFjdGlvbkNvdW50ID09IHByb3BlcnRpZXMuYm9hcmRTaXplICogcHJvcGVydGllcy5ib2FyZFNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnRHJhdyEnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNldEdhbWVCb2FyZC5hcHBseSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5wbGF5ZXIgPT09ICdYJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMucGxheWVyID0gJ08nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnWCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGljVGFjVG9lR2FtZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvVGljVGFjVG9lR2FtZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBUZXh0UmVuZGVyTW9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lQm9hcmQpIHtcclxuICAgICAgICB0aGlzLmdhbWVUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21haW4tY29udGVudF9nYW1lX2FyZWEnKVswXS5yb3dzO1xyXG4gICAgICAgIHRoaXMucGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKGdhbWVCb2FyZC5sZW5ndGggLyAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBnYW1lQm9hcmQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBnYW1lQm9hcmQubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZVRhYmxlW3hdLmNlbGxzW3ldLnRleHRDb250ZW50ID0gZ2FtZUJvYXJkW3hdW3ldID8gZ2FtZUJvYXJkW3hdW3ldIDogJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2FtZVRhYmxlW3RoaXMucGl2b3RFbGVtSW5kZXhdLmNlbGxzW3RoaXMucGl2b3RFbGVtSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0Qm9hcmQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWVUYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuZ2FtZVRhYmxlLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVUYWJsZVtpXS5jZWxsc1tqXS50ZXh0Q29udGVudCA9ICctJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZVRhYmxlW2ldLmNlbGxzW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2FtZVRhYmxlW3RoaXMucGl2b3RFbGVtSW5kZXhdLmNlbGxzW3RoaXMucGl2b3RFbGVtSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVDdXJzb3Iob2xkUm93LCBvbGRDZWxsLCBuZXdSb3csIG5ld0NlbGwpIHtcclxuICAgICAgICB0aGlzLmdhbWVUYWJsZVtvbGRSb3ddLmNlbGxzW29sZENlbGxdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgICAgIHRoaXMuZ2FtZVRhYmxlW25ld1Jvd10uY2VsbHNbbmV3Q2VsbF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KHJvdywgY2VsbCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lVGFibGVbcm93XS5jZWxsc1tjZWxsXS50ZXh0Q29udGVudCA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0VmFsdWUocm93LCBjZWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZVRhYmxlW3Jvd10uY2VsbHNbY2VsbF0udGV4dENvbnRlbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dFJlbmRlck1vZGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL1RleHRSZW5kZXJNb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFRpY1RhY1RvZUdhbWUgPSByZXF1aXJlKCcuL1RpY1RhY1RvZUdhbWUnKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdGljVGFjVG9lR2FtZSA9IG5ldyBUaWNUYWNUb2VHYW1lKDMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGlvbk1vdmUoKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMzIpIHtcclxuICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5hY3QoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFszNywgMzgsIDM5LCA0MF0uaW5kZXhPZihldmVudC5rZXlDb2RlKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVVcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcclxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVEb3duKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxyXG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGFjdGlvbk1vdmU7XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL3NjcmlwdC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9