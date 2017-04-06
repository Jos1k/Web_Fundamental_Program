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