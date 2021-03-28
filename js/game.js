

function onFirstClick(elCell, i, j) {
 
    if (gGame.isManual && countClicks !== gLevel.MINES) return;
    gBoard[i][j].isMine = false;
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
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


// Check large condition that checks if there are neighbors that are greater then 0 that are not mines or shown and if there is.. stop recursion  
function expandShown(pos) {
    var countMines = gBoard[pos.i][pos.j].minesAroundCount;
    if (!gBoard[pos.i][pos.j].isMine && !gBoard[pos.i][pos.j].isMarked && !gBoard[pos.i][pos.j].isShown && !countMines) {
        gBoard[pos.i][pos.j].isShown = true;
        renderCell(pos.i, pos.j, EMPTY);
        gGame.shownCount++;
        findNeighbors(pos.i, pos.j);
    } else if (countMines > 0 && !gBoard[pos.i][pos.j].isShown) {
        gBoard[pos.i][pos.j].isShown = true;
        renderCell(pos.i, pos.j, countMines);
        gGame.shownCount++;
    }
}

function findNeighbors(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ)
                continue;
            if (j < 0 || j >= gBoard[i].length)
                continue;
            if (gBoard[i][j].minesAroundCount >= 0 && !gBoard[i][j].isShown) {
                var pos = { i: i, j: j }
                expandShown(pos)
            }
        }
    }
}


function expandForHint(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
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
            var className = document.querySelector(`.cell.cell${i}-${j}`);
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                className.classList.remove('clicked')
                className.innerHTML = FLAG;
                gBoard[i][j].isMarked = true;
            }
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
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
        if (!gBoard[randI][randJ].isMine && !gBoard[randI][randJ].isShown) {
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
                gGame.shownCount++;
            }
        }
    }
}


function getMarkCount() {
    var isMarked = []
    var countMark = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                isMarked.push(gBoard[i][j]);
                countMark++;
            }
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                isMarked.push(gBoard[i][j]);
            }
        }
    }
    gGame.markedCount = countMark;
    return isMarked;
}





