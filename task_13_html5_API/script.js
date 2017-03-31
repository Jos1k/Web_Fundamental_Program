window.onload = function () {
    var currentRow, currentCell, player, actionCount;
    var gameTable = document.getElementsByClassName('main-content_game_area')[0].rows;
    var textBlock = document.getElementsByClassName('main-content_text-block')[0];
    var gameTableAray = [];

    function initGameTable() {
        var storageBoardItem = localStorage.getItem('gameBoard');
        if (storageBoardItem) {
            gameTableAray = JSON.parse(storageBoardItem);
            for (let x = 0; x < gameTable.length; x++) {
                for (let y = 0; y < gameTable.length; y++) {
                    gameTable[x].cells[y].textContent = gameTableAray[x][y];
                }
            }
            return;
        }
        else {
            for (let x = 0; x < gameTable.length; x++) {
                gameTableAray[x] = [];
                for (let y = 0; y < gameTable.length; y++) {
                    gameTableAray[x][y] = gameTable[x].cells[y].textContent;
                }
            }
        }
    }

    function resetGameBoard() {
        currentRow = 1;
        currentCell = 1;
        player = 'X';
        actionCount = 0;
        for (let i = 0; i < gameTable.length; i++) {
            for (let j = 0; j < gameTable[i].cells.length; j++) {
                gameTable[i].cells[j].textContent = '-';
                gameTable[i].cells[j].classList.remove('selectedElement');
            }
        }
        gameTable[currentRow].cells[currentCell].classList.add('selectedElement');
    }

    function isWinnerDetermined() {
        var matrixSize = gameTable.length;
        if (currentRow == currentCell) {
            for (let i = 0; i < matrixSize; i++) {
                if (gameTable[i].cells[i].textContent != player)
                    break;
                if (i == matrixSize - 1) {
                    localStorage.clear();
                    return true;
                }
            }
        }
        if (currentRow + currentCell == matrixSize - 1) {
            for (let i = 0; i < matrixSize; i++) {
                if (gameTable[i].cells[(matrixSize - 1) - i].textContent != player)
                    break;
                if (i == matrixSize - 1) {
                    localStorage.clear();
                    return true;
                }
            }
        }
        for (let i = 0; i < matrixSize; i++) {
            if (gameTable[currentRow].cells[i].textContent != player)
                break;
            if (i == matrixSize - 1) {
                localStorage.clear();
                return true;
            }
        }

        for (let i = 0; i < matrixSize; i++) {
            if (gameTable[i].cells[currentCell].textContent != player)
                break;
            if (i == matrixSize - 1) {
                localStorage.clear();
                return true;
            }
        }
        return false;
    };

    function actionMove() {
        if (event.keyCode == 32) {
            let currentElement = gameTable[currentRow].cells[currentCell];
            if (currentElement.textContent != 'X' && currentElement.textContent != 'O') {
                currentElement.textContent = player;
                gameTableAray[currentRow][currentCell] = currentElement.textContent;
                localStorage.setItem('gameBoard', JSON.stringify(gameTableAray));
                actionCount++;
                if (isWinnerDetermined()) {
                    alert('Player ' + player + ' Wins!');
                    resetGameBoard();
                }
                else {
                    if (actionCount == gameTable.length * gameTable.length) {
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
            gameTable[currentRow].cells[currentCell].classList.remove('selectedElement');
            switch (event.keyCode) {
                case 38:
                    if (currentRow > 0) {
                        currentRow--;
                    }
                    break;
                case 40:
                    if (currentRow < gameTable.length - 1) {
                        currentRow++;
                    }
                    break;
                case 37:
                    if (currentCell > 0) {
                        currentCell--;
                    }
                    break;
                case 39:
                    if (currentCell < gameTable.length - 1) {
                        currentCell++;
                    }
                    break;
            }
            gameTable[currentRow].cells[currentCell].classList.add('selectedElement');
        }
    }

    resetGameBoard();
    initGameTable();    
    
    document.onkeydown = actionMove;
};