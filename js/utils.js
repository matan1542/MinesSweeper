function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            if (!cell.isShown) {
                strHTML += `<td oncontextmenu="rightMouseClick(this,${i},${j})" onClick="cellClicked(this,${i},${j}),hintClicked(${i},${j}),safeClick(this,${i},${j})"  class="  ${className}"></td>`
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}
function copyMat(mat) {
    var board = [];
    for(var i = 0; i < mat.length; i++) {
      board[i] = [];
      for(var j = 0; j < mat[i].length; j++) {
        board[i][j] = {
          minesAroundCount: mat[i][j].minesAroundCount,
          isShown: mat[i][j].isShown,
          isMine: mat[i][j].isMine,
          isMarked: mat[i][j].isMarked
        }
      }
    }
    return board;
  }
// location such as: {i: 2, j: 7}
function renderCell(i, j, value) {
    // Select the elCell and set the value
    var className = document.querySelector(`.cell.cell${i}-${j}`);
    // gBoard[i][j].isShown = true;
    className.classList.add('clicked');
    className.innerText = value;
}

function renderCellHtml(i, j, value) {
    // Select the elCell and set the value
    var className = document.querySelector(`.cell.cell${i}-${j}`);
    // gBoard[i][j].isShown = true;
    className.classList.add('clicked');
    className.innerHTML = value;

}



function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startTimer() {
    var timer = document.querySelector('.time');
    gGame.secsPassed = 0;

    countInterval = setInterval(() => {
        timer.innerText = `${gGame.secsPassed} Sec`
        gGame.secsPassed++;
    }, 1000)
    
}


// function addGameStep() {
//     var board = copyMat(gBoard);
//     var step = {
//       board,
//       shownCount: gGame.shownCount,
//       markedCount: gGame.markedCount,
//       lives: gGame.lives,
//       hints: gGame.hints,
//       safes: gGame.safes
//     }
//     return step;
//   }

function stopTimer() {
    clearInterval(countInterval);
}