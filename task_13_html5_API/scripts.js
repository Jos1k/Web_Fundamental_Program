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
    const properties = privateProperties.get(this);
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
    if (!localStorage.getItem('isCanvasMode')) {
        properties.renderer = new TextRenderMode(properties.gameTableAray);
    }
}

const isWinnerDetermined = function () {
    const properties = privateProperties.get(this);
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
        const properties = privateProperties.get(this);
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
        const properties = privateProperties.get(this);
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
        const properties = privateProperties.get(this);
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
        const properties = privateProperties.get(this);
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
        const properties = privateProperties.get(this);
        const currentElement = properties.renderer.getValue(properties.currentRow, properties.currentCell);
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
        properties.gameTable = document.getElementsByClassName('main-content_game_area')[0].rows;
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmRkOTA1Y2VmNDY4YzlhOGM3NzAiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvVGV4dFJlbmRlck1vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUNoRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMEJBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwQkFBMEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMEJBQTBCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwrQjs7Ozs7O0FDaExBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBOztBQUVBLHVCQUF1QixzQkFBc0I7QUFDN0MsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsaUNBQWlDO0FBQ3hELDJCQUEyQixpQ0FBaUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdDOzs7Ozs7QUMzQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEUiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJkZDkwNWNlZjQ2OGM5YThjNzcwIiwiY29uc3QgVGV4dFJlbmRlck1vZGUgPSByZXF1aXJlKCcuL1RleHRSZW5kZXJNb2RlJyk7XHJcbmNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcclxuXHJcbmNvbnN0IGluaXRCb2FyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICBwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPSAxO1xyXG4gICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCA9IDE7XHJcbiAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgIHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPSAwO1xyXG4gICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeCsrKSB7XHJcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3hdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgeSsrKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheVt4XVt5XSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcmVzZXRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5yZW5kZXJlci5yZXNldEJvYXJkKCk7XHJcbn1cclxuXHJcbmNvbnN0IGxvYWRHYW1lQm9hcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0Qm9hcmQuYXBwbHkodGhpcyk7XHJcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgY29uc3QgZ2FtZVN0b3JhZ2VCb2FyZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2dhbWVCb2FyZCcpKTtcclxuICAgIGNvbnN0IGxhc3RBY3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdEFjdCcpO1xyXG4gICAgaWYgKGxhc3RBY3QpIHtcclxuICAgICAgICBpZiAobGFzdEFjdCA9PSAnWCcpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZ2FtZVN0b3JhZ2VCb2FyZCkge1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSA9IGdhbWVTdG9yYWdlQm9hcmQ7XHJcbiAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCA9IDA7XHJcbiAgICAgICAgZ2FtZVN0b3JhZ2VCb2FyZC5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5mb3JFYWNoKChpbm5lckVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbm5lckVsZW0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaXNDYW52YXNNb2RlJykpIHtcclxuICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyID0gbmV3IFRleHRSZW5kZXJNb2RlKHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGlzV2lubmVyRGV0ZXJtaW5lZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICBpZiAocHJvcGVydGllcy5jdXJyZW50Um93ID09IHByb3BlcnRpZXMuY3VycmVudENlbGwpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMucmVuZGVyZXIuZ2V0VmFsdWUoaSwgaSkgIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyArIHByb3BlcnRpZXMuY3VycmVudENlbGwgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLnJlbmRlcmVyLmdldFZhbHVlKGksIChwcm9wZXJ0aWVzLmJvYXJkU2l6ZSAtIDEpIC0gaSkgIT0gcHJvcGVydGllcy5wbGF5ZXIpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmJvYXJkU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMucmVuZGVyZXIuZ2V0VmFsdWUocHJvcGVydGllcy5jdXJyZW50Um93LCBpKSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuYm9hcmRTaXplOyBpKyspIHtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5yZW5kZXJlci5nZXRWYWx1ZShpLCBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKSAhPSBwcm9wZXJ0aWVzLnBsYXllcilcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgaWYgKGkgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5jbGFzcyBUaWNUYWNUb2VHYW1lIHtcclxuICAgIGNvbnN0cnVjdG9yKGJvYXJkU2l6ZSkge1xyXG4gICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLnNldCh0aGlzLCB7fSk7XHJcbiAgICAgICAgcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpLmJvYXJkU2l6ZSA9IGJvYXJkU2l6ZTtcclxuICAgICAgICBsb2FkR2FtZUJvYXJkLmFwcGx5KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVMZWZ0KCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuY3VycmVudENlbGwgPiAwKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICAtLXByb3BlcnRpZXMuY3VycmVudENlbGxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmVSaWdodCgpIHtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsIDwgcHJvcGVydGllcy5ib2FyZFNpemUgLSAxKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICArK3Byb3BlcnRpZXMuY3VycmVudENlbGxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmVVcCgpIHtcclxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gcHJpdmF0ZVByb3BlcnRpZXMuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmN1cnJlbnRSb3cgPiAwKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMucmVuZGVyZXIubW92ZUN1cnNvcihcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsLCBcclxuICAgICAgICAgICAgICAgIC0tcHJvcGVydGllcy5jdXJyZW50Um93LCBcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuY3VycmVudENlbGxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1vdmVEb3duKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuY3VycmVudFJvdyA8IHByb3BlcnRpZXMuYm9hcmRTaXplIC0gMSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyLm1vdmVDdXJzb3IoXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5jdXJyZW50Q2VsbCwgXHJcbiAgICAgICAgICAgICAgICArK3Byb3BlcnRpZXMuY3VycmVudFJvdywgXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IHByb3BlcnRpZXMucmVuZGVyZXIuZ2V0VmFsdWUocHJvcGVydGllcy5jdXJyZW50Um93LCBwcm9wZXJ0aWVzLmN1cnJlbnRDZWxsKTtcclxuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQgIT0gJ1gnICYmIGN1cnJlbnRFbGVtZW50ICE9ICdPJykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnJlbmRlcmVyLmFjdChwcm9wZXJ0aWVzLmN1cnJlbnRSb3csIHByb3BlcnRpZXMuY3VycmVudENlbGwsIHByb3BlcnRpZXMucGxheWVyKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVBcmF5W3Byb3BlcnRpZXMuY3VycmVudFJvd11bcHJvcGVydGllcy5jdXJyZW50Q2VsbF0gPSBwcm9wZXJ0aWVzLnBsYXllcjtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2dhbWVCb2FyZCcsIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMuZ2FtZVRhYmxlQXJheSkpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdEFjdCcsIHByb3BlcnRpZXMucGxheWVyKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5hY3Rpb25Db3VudCsrO1xyXG4gICAgICAgICAgICBpZiAoaXNXaW5uZXJEZXRlcm1pbmVkLmFwcGx5KHRoaXMpKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnUGxheWVyICcgKyBwcm9wZXJ0aWVzLnBsYXllciArICcgV2lucyEnKTtcclxuICAgICAgICAgICAgICAgIHJlc2V0R2FtZUJvYXJkLmFwcGx5KHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuYWN0aW9uQ291bnQgPT0gcHJvcGVydGllcy5ib2FyZFNpemUgKiBwcm9wZXJ0aWVzLmJvYXJkU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdEcmF3IScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0R2FtZUJvYXJkLmFwcGx5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLnBsYXllciA9PT0gJ1gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5wbGF5ZXIgPSAnTyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnBsYXllciA9ICdYJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaWNUYWNUb2VHYW1lO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9UaWNUYWNUb2VHYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHByaXZhdGVQcm9wZXJ0aWVzID0gbmV3IFdlYWtNYXAoKTtcclxuXHJcbmNsYXNzIFRleHRSZW5kZXJNb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVCb2FyZCkge1xyXG4gICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLnNldCh0aGlzLCB7fSk7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21haW4tY29udGVudF9nYW1lX2FyZWEnKVswXS5yb3dzO1xyXG4gICAgICAgIHByb3BlcnRpZXMucGl2b3RFbGVtSW5kZXggPSBNYXRoLmZsb29yKGdhbWVCb2FyZC5sZW5ndGggLyAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBnYW1lQm9hcmQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBnYW1lQm9hcmQubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3hdLmNlbGxzW3ldLnRleHRDb250ZW50ID0gZ2FtZUJvYXJkW3hdW3ldID8gZ2FtZUJvYXJkW3hdW3ldIDogJy0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNlbGxzW3Byb3BlcnRpZXMucGl2b3RFbGVtSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0Qm9hcmQoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMuZ2FtZVRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcGVydGllcy5nYW1lVGFibGUubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW2ldLmNlbGxzW2pdLnRleHRDb250ZW50ID0gJy0nO1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbaV0uY2VsbHNbal0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvcGVydGllcy5nYW1lVGFibGVbcHJvcGVydGllcy5waXZvdEVsZW1JbmRleF0uY2VsbHNbcHJvcGVydGllcy5waXZvdEVsZW1JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUN1cnNvcihvbGRSb3csIG9sZENlbGwsIG5ld1JvdywgbmV3Q2VsbCkge1xyXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcyk7ICAgICAgICBcclxuICAgICAgICBwcm9wZXJ0aWVzLmdhbWVUYWJsZVtvbGRSb3ddLmNlbGxzW29sZENlbGxdLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkRWxlbWVudCcpO1xyXG4gICAgICAgIHByb3BlcnRpZXMuZ2FtZVRhYmxlW25ld1Jvd10uY2VsbHNbbmV3Q2VsbF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWRFbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KHJvdywgY2VsbCwgcGxheWVyKSB7XHJcbiAgICAgICAgIHByaXZhdGVQcm9wZXJ0aWVzLmdldCh0aGlzKS5nYW1lVGFibGVbcm93XS5jZWxsc1tjZWxsXS50ZXh0Q29udGVudCA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0VmFsdWUocm93LCBjZWxsKSB7XHJcbiAgICAgICAgcmV0dXJuICBwcml2YXRlUHJvcGVydGllcy5nZXQodGhpcykuZ2FtZVRhYmxlW3Jvd10uY2VsbHNbY2VsbF0udGV4dENvbnRlbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dFJlbmRlck1vZGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL1RleHRSZW5kZXJNb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFRpY1RhY1RvZUdhbWUgPSByZXF1aXJlKCcuL1RpY1RhY1RvZUdhbWUnKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB0aWNUYWNUb2VHYW1lID0gbmV3IFRpY1RhY1RvZUdhbWUoMyk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aW9uTW92ZSgpIHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAzMikge1xyXG4gICAgICAgICAgICB0aWNUYWNUb2VHYW1lLmFjdCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoWzM3LCAzOCwgMzksIDQwXS5pbmRleE9mKGV2ZW50LmtleUNvZGUpID49IDApIHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxyXG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZVVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgICAgIHRpY1RhY1RvZUdhbWUubW92ZURvd24oKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGljVGFjVG9lR2FtZS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgICAgICAgICB0aWNUYWNUb2VHYW1lLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gYWN0aW9uTW92ZTtcclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvc2NyaXB0LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=