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