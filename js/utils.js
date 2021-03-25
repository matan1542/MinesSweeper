function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            if (!cell.isShown) {
                strHTML += `<td oncontextmenu="rightMouseClick(this,${i},${j})" onClick="cellClicked(this,${i},${j}),hintClicked(this,${i},${j})"  class="  ${className}"></td>`
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
    var countMil = 0;
    var countSec = 1;

    countInterval = setInterval(() => {
        timer.innerText = `${countSec}.${countMil}`
        countMil++;
        if (countMil > 100) {
            countSec++;
            countMil = 0;
        }
    }, 10)
}

function stopTimer() {
    clearInterval(countInterval);
}