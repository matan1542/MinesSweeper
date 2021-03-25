

function onFirstClick(elCell, i, j) {
    gBoard[i][j].isMine = false;
    gBoard[i][j].isShown = true;
    elCell.innerText = '';
    gGame.isOn = true;
    placeMines(gBoard, 1);
    checkMines()
    var pos = { i: i, j: j }
    expandShown(pos);
}

function gameOver(value) {
    gGame.isOn = false;
    elBtn.innerHTML = value;
}

function createLives(amount) {
    var strHtml = '';
    for (var i = 0; i < amount; i++) {
        strHtml += LIVES;
    }
    var lives = document.querySelector('.icons');
    lives.innerHTML = strHtml;
}

function createHints(amount) {
    var strHtml = '';
    for (var i = 0; i < amount; i++) {
        strHtml += HINTS;
    }
    var hints = document.querySelector('.hint-icons');
    hints.innerHTML = strHtml;

}



function createCell() {
    var cell = {
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell
}



function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                var countMines = gBoard[i][j].minesAroundCount;
                renderCell(i, j, countMines);
            }
        }
    }
}


function expandForHint(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (!gBoard[i][j].isMarked) {
                var countMines = gBoard[i][j].minesAroundCount;
                renderCell(i, j, countMines);
            }
            if (gBoard[i][j].isMine) {
                renderCellHtml(i, j, MINE);
            }
        }
    }
}


function unRevealForHint(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (!gBoard[i][j].isMarked) {
                var className = document.querySelector(`.cell.cell${i}-${j}`);
                className.classList.remove('clicked')
                var countMines = ' ';
                className.innerText = countMines;
            }

        }
    }
}



function checkMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var location = {
                i: i,
                j: j
            }
            var countBomb = setMinesNegsCount(location);
            if (countBomb !== 0) {
                gBoard[i][j].minesAroundCount = countBomb;
            } else {
                gBoard[i][j].minesAroundCount = '';

            }
        }
    }
}



//function that opens the 8 locaiton near her that's empty


function setMinesNegsCount(pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === pos.i && j === pos.j) continue;

            if (gBoard[i][j].isMine) {
                count++;
            }
        }
    }
    return count;
}


function placeMines(board, amount) {
    for (var i = 0; i < amount; i++) {
        var randI = getRandomIntInclusive(0, board.length - 1)
        var randJ = getRandomIntInclusive(0, board.length - 1)
        if (!gBoard[randI][randJ].isMine) {
            board[randI][randJ].isMine = true;
        } else {
            i--;
        }
    }
}

function printAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var className = document.querySelector(`.cell.cell${i}-${j}`);
                className.classList.add('clicked');
                className.innerHTML = MINE;
                gBoard[i][j].isShown = true;
            }
        }
    }
}


function getMarkCount() {
    var isMarked = []
    var countMark = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                isMarked.push(gBoard[i][j]);
                countMark++;
            }
        }
    }
    gGame.markedCount = countMark;
    return isMarked;
}

