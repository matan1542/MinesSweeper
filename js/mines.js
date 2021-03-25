'use strict'
var gBoard;
var MINE = '<i class="fas fa-bomb"></i>';
var LIVES = '<i class="fas fa-heart"></i>';
var HINTS = '<i class="far fa-lightbulb"></i>';
var FLAG = '<i class="far fa-flag"></i>';
var livesAmount = 1;
var hintsAmount = 1;
var smile = '&#128515';
var sadFace = '&#128530';
var glassFace = '&#128526 ';
var intenseFace = '&#128556 ';
var countClicks = 0;
var countRightClick = 0;
var bombsCount = 0;
var countInterval;
var victory;
var elBtn = document.querySelector('.current-mood');
var levelsContainer = document.querySelector('.levels');
var elHintBtn = document.querySelector('.hint');


var countMisplaceFlags = 0;//In case the flag wasn't set in the exact location of the mine
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    isHint: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


function initGame() {
    createLives(livesAmount);
    createHints(hintsAmount);
    gBoard = buildBoard(gLevel.SIZE);
    placeMines(gBoard, gLevel.MINES);
    checkMines();
    renderBoard(gBoard, '.board-container');
}

function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell();
        }
    }
    return board;
}

function cellClicked(elCell, i, j) {
    if (gGame.isHint) return;
    if (livesAmount === 0) {
        gameOver(sadFace)
        return
    }
    if (!gGame.isOn && countClicks > 0 || gBoard[i][j].isMarked) {
        return;
    }
    elCell.classList.add('clicked');
    countClicks++;
    if (countClicks === 1) {
        startTimer();
    }
    if (!gGame.isOn && gBoard[i][j].isMine) {
        onFirstClick(elCell, i, j);
    } else {
        gGame.isOn = true;
    }
    if (gBoard[i][j].isMine && gGame.isOn && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        livesAmount--;
        if (livesAmount === 0) {
            stopTimer();
            printAllMines();
            elBtn.innerHTML = sadFace;
        }
        gBoard[i][j].isShown = true;
        elCell.innerHTML = MINE;
        createLives(livesAmount);
        // elBtn.innerHTML = intenseFace;
    }
    if (gGame.isOn) {
        var pos = { i: i, j: j }
        checkMines();
        if (gBoard[i][j].minesAroundCount > 0 && !gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
            var countMines = gBoard[i][j].minesAroundCount;
            renderCell(i, j, countMines);
        } else {
            expandShown(pos);
        }

    }
}

function rightMouseClick(elCell, i, j) {
    if (gGame.isHint) return;
    if (livesAmount === 0 || victory) return;
    var strHtml = '';
    if (elCell.innerHTML === FLAG) {
        gBoard[i][j].isMarked = false;
        strHtml = '';
        countMisplaceFlags--;
        elCell.innerHTML = strHtml;
    } else {
        countMisplaceFlags++;
        gBoard[i][j].isMarked = true;
        strHtml = FLAG;
        elCell.innerHTML = strHtml;
    }
    victory = checkVictory();
}

//in Case Game Over


function checkVictory() {
    var markAmount = getMarkCount();
    if (markAmount.length === gLevel.MINES && countMisplaceFlags === markAmount.length) {
        countMisplaceFlags = 0;
        gameOver(glassFace);
        return true;
    }
    return false;

}
function hint() {
    if (hintsAmount === 0 || !livesAmount) {

        return
    }
    gGame.isHint = true;
}


function hintClicked(elBtn, i, j) {
    if (hintsAmount === 0) return
    if (!gGame.isHint) return
    var pos = { i: i, j: j };
    hintsAmount--;
    createHints(hintsAmount);
    expandForHint(pos);

    setTimeout(function () {
        gGame.isHint = false;
        unRevealForHint(pos)

    }, 2000)
    if (!gGame.isHint) return;
}

function restartGame() {
    setLevel(gLevel.SIZE);
    //For continuation of this project and gLevel set
}



function setLevel(SIZE) {
    var time = document.querySelector('.time');
    gLevel.SIZE = SIZE;
    gLevel.MINES = (SIZE === 4) ? 2 : (SIZE === 8) ? 12 : 30;
    livesAmount = (SIZE === 4) ? 1 : 3;
    hintsAmount = (SIZE === 4) ? 1 : 3;
    elHintBtn.hidden = false;
    countClicks = 0;
    time.innerText = '0:00'
    countMisplaceFlags = 0;
    victory = false;
    gGame.isOn = false;
    elBtn.innerHTML = smile;
    initGame();
}


window.document.oncontextmenu = function () {
    return false;
}


