window.onload = function () {
    var currentRow, currentCell, player, actionCount;
    var gameTable = document.getElementsByClassName('main-content_game_area')[0].rows;
    var textBlock = document.getElementsByClassName('main-content_text-block')[0];

    function resetGameBoard () {
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
    };

    function isWinnerDetermined () {
        var matrixSize = gameTable.length;
        if (currentRow == currentCell) {
            for (let i = 0; i < matrixSize; i++) {
                if (gameTable[i].cells[i].textContent != player)
                    break;
                if (i == matrixSize - 1) {
                    return true;
                }
            }
        }
        if (currentRow + currentCell == matrixSize - 1) {
            for (let i = 0; i < matrixSize; i++) {
                if (gameTable[i].cells[(matrixSize - 1) - i].textContent != player)
                    break;
                if (i == matrixSize - 1) {
                    return true;
                }
            }
        }
        for (let i = 0; i < matrixSize; i++) {
            if (gameTable[currentRow].cells[i].textContent != player)
                break;
            if (i == matrixSize - 1) {
                return true;
            }
        }

        for (let i = 0; i < matrixSize; i++) {
            if (gameTable[i].cells[currentCell].textContent != player)
                break;
            if (i == matrixSize - 1) {
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
                actionCount++;
                if (isWinnerDetermined()) {
                    alert('Player ' + player + ' Wins!');
                    resetGameBoard();
                }
                else {
                    if(actionCount == gameTable.length*gameTable.length){
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
    document.onkeydown = actionMove;
};