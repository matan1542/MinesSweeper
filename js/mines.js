'use strict'
var gBoard;
var MINE = '<i class="fas fa-bomb"></i>';
var LIVES = '<i class="fas fa-heart"></i>';
var HINTS = '<i class="far fa-lightbulb"></i>';
var FLAG = '<i class="far fa-flag"></i>';
var EMPTY = '';
var livesAmount = 1;
var hintsAmount = 1;
var safeClicks = 1;
var smile = '&#128515';
var sadFace = '&#128530';
var glassFace = '&#128526 ';
var intenseFace = '&#128556 ';
var countClicks = 0;
var countRightClick = 0;
var bombsCount = 0;
var bombShown = 0;
var bestTimeCounter = Infinity;
var countInterval;
var victory;
var elBtn = document.querySelector('.current-mood');
var levelsContainer = document.querySelector('.levels');
var elHintBtn = document.querySelector('.hint');
var elSafeSpan = document.querySelector('.safe-clicks');
var safeContainer = document.querySelector('.safe-click-container');





var countMisplaceFlags = 0;//In case the flag wasn't set in the exact location of the mine
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    isHint: false,
    isSafe: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: Infinity
};


function initGame() {
    if (!localStorage.level4) {
        createLocalStorage()
    }
    updateScoreDom()
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
    if (gGame.isHint || victory || gGame.isSafe) return;
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
    if (gBoard[i][j].isMine && gGame.isOn && !gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        bombShown++;
        victory = checkVictory();
        livesAmount--;
        if (livesAmount === 0) {
            stopTimer();
            printAllMines();
            elBtn.innerHTML = sadFace;
        }
        if (!gBoard[i][j].isShown) {
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
        }

        elCell.innerHTML = MINE;
        createLives(livesAmount);
        // elBtn.innerHTML = intenseFace;
    }
    if (gGame.isOn) {
        var pos = { i: i, j: j }
        checkMines();
        if (gBoard[i][j].minesAroundCount > 0 && !gBoard[i][j].isMine && !gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            var countMines = gBoard[i][j].minesAroundCount;
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            renderCell(i, j, countMines);
        } else {
            expandShown(pos);
        }

    }
}

function rightMouseClick(elCell, i, j) {
    if (gGame.isHint || livesAmount === 0 || victory || gBoard[i][j].isShown) return;
    var strHtml = '';
    if (elCell.innerHTML === FLAG) {
        gBoard[i][j].isMarked = false;
        strHtml = EMPTY;
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




function checkVictory() {
    var markAmount = getMarkCount();
    if (markAmount.length === gLevel.MINES && (countMisplaceFlags + bombShown) === markAmount.length) {
        countMisplaceFlags = 0;
        gameOver(glassFace);
        stopTimer();
        checkBestTime(gLevel.SIZE, gGame.secsPassed - 1);
        updateScoreDom()
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



function hintClicked(i, j) {
    if (hintsAmount === 0 || gBoard[i][j].isShown) return
    if (!gGame.isHint) return
    var pos = { i: i, j: j };
    hintsAmount--;
    if (hintsAmount === 0) elHintBtn.hidden = true;
    createHints(hintsAmount);
    expandForHint(pos);

    setTimeout(function () {
        gGame.isHint = false;
        unRevealForHint(pos)

    }, 2000)
    if (!gGame.isHint) return;
}

function initializeSafeClick(safeBtn) {
    var emptyCells = (gLevel.SIZE ** 2) - gGame.shownCount;
    if (safeClicks === 0 || !livesAmount || emptyCells <= gLevel.MINES) {
        safeContainer.hidden = true;
        return
    }
    gGame.isSafe = true;
}

function safeClick(elCell, i, j) {
    if (!gGame.isSafe || safeClicks === 0 || !livesAmount || !gGame.isOn) return
    if (gBoard[i][j].isMine) {
        gBoard[i][j].isMine = false;
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elCell.innerText = '';
        elCell.classList.add('clicked');
        placeMines(gBoard, 1);
        checkMines();
        elSafeSpan.innerText = safeClicks;
    } else if (gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('clicked');
        elSafeSpan.innerText = safeClicks;
    } else {
        elCell.innerText = '';
        elCell.classList.add('clicked');

    }
    safeClicks--;
    if(safeClicks === 0) safeContainer.hidden = true;
    elSafeSpan.innerText = safeClicks;
    gGame.isSafe = false;
    var pos = { i: i, j: j }
    expandShown(pos);
}

function restartGame() {
    setLevel(gLevel.SIZE);
}

function updateScoreDom() {
    var level4 = document.querySelector('.level4-bestscore');
    var level8 = document.querySelector('.level8-bestscore');
    var level12 = document.querySelector('.level12-bestscore');
    var bestTimeLevel4 = localStorage.getItem('level4');
    var bestTimeLevel8 = localStorage.getItem('level8');
    var bestTimeLevel12 = localStorage.getItem('level12');
    var bestTime4 = (+bestTimeLevel4 === Infinity) ? ' ' : bestTimeLevel4;
    var bestTime8 = (+bestTimeLevel8 === Infinity) ? ' ' : bestTimeLevel8;
    var bestTime12 = (+bestTimeLevel12 === Infinity) ? '' : bestTimeLevel12;

    level4.innerText = bestTime4 + ' Sec';
    level8.innerText = bestTime8 + ' Sec';
    level12.innerText = bestTime12 + ' Sec';

}

function setLevel(SIZE) {
    var time = document.querySelector('.time');
    gLevel.SIZE = SIZE;
    gLevel.MINES = (SIZE === 4) ? 2 : (SIZE === 8) ? 12 : 30;
    livesAmount = (SIZE === 4) ? 1 : 3;
    hintsAmount = (SIZE === 4) ? 1 : 3;
    safeClicks = (SIZE === 4) ? 1 : 3;
    elHintBtn.hidden = false;
    gGame.shownCount = 0;
    safeContainer.hidden = false;
    countClicks = 0;
    bombShown = 0;

    elSafeSpan.innerText = safeClicks;
    stopTimer();
    time.innerText = '0:00'
    countMisplaceFlags = 0;
    victory = false;
    gGame.isOn = false;
    elBtn.innerHTML = smile;
    initGame();
}







function checkBestTime(size, time) {
    var bestTime = localStorage.getItem(`level${size}`);
    if (time < +bestTime) {
        updateLocalStorage(size, time);
    }
}

function updateLocalStorage(size, time) {
    localStorage.setItem(`level${size}`, time);
}


function createLocalStorage() {
    localStorage.setItem("level4", Infinity);
    localStorage.setItem("level8", Infinity);
    localStorage.setItem("level12", Infinity);
}

window.document.oncontextmenu = function () {
    return false;
}


