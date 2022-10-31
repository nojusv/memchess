const gameCanvas = document.getElementById('game');
const boardCtx = gameCanvas.getContext('2d');
const piecesCanvas = document.getElementById('pieces');
const selectCtx = piecesCanvas.getContext('2d');

let boardLayout = [64];
let userLayout = [64];
let piecesImg = new Image();
let chessBoardImg = new Image();
let selected;
let editable = 0;

function loadChessImage() {
    return new Promise((resolve, reject) => {
        chessBoardImg.src='assets/images/chessboard.png';
        chessBoardImg.onload = function() {
            resolve();
        }
      })
}

function loadPiecesImage() {
    return new Promise((resolve, reject) => {
        piecesImg.src='assets/images/chesspieces.png';
        piecesImg.onload = function() {
            resolve();
        }
      })
}

function drawBoard () {
    boardCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    boardCtx.drawImage(chessBoardImg, 0, 0, 500, 500);
}

function fillPieces(pieces, difficulty) {
    if(difficulty === 1) {
        max_pieces = 2;
    }
    else if(difficulty === 2) {
        max_pieces = 5;
    }
    else {
        max_pieces = 9;
    }
    for(let i = 0; i < max_pieces; i++) {
        pieces[Math.floor(Math.random() * 64)] = Math.floor(Math.random() * 12);
    }
}

function drawPieces(layout) {
    drawBoard();
    for(let i = 0; i < 64; i++) {
        if(layout[i] != -1) {
            if(layout[i] < 6) {
                boardCtx.drawImage(piecesImg, 320 * layout[i], 0, 320, 320, ((i % 8) * (gameCanvas.height / 8)) , Math.floor(i / 8) * (gameCanvas.height / 8), 62.5, 62.5);
            }
            else {
                boardCtx.drawImage(piecesImg, (320 * (layout[i] - 6)), 320, 320, 320, ((i % 8) * (gameCanvas.height / 8)) , Math.floor(i / 8) * (gameCanvas.height / 8), 62.5, 62.5);
            }
        }
    } 
}

function drawSelections () {
    selectCtx.drawImage(piecesImg, 0, 0, 480, 160);
}

function drawSelectedBorder(x, y) {
    document.getElementById('delete').style.border = 'none';
    selectCtx.clearRect(0, 0, piecesCanvas.width, piecesCanvas.height);
    selectCtx.strokeStyle='#000000';
    selectCtx.strokeRect(x, y, piecesCanvas.width / 6, piecesCanvas.height / 2);
}

function updateSelect() {
    if(editable != 0) {
        const rect = gameCanvas.getBoundingClientRect();
        const pos = parseInt((event.clientX - rect.left) / (gameCanvas.width / 8)) + (parseInt((event.clientY - rect.top) / (gameCanvas.height / 8))) * 8;
        userLayout[pos] = selected;
        drawPieces(userLayout);
    }
}

function select(canvas) {
    if(editable != 0) {
        const rect = canvas.getBoundingClientRect();
        const coords = [event.clientX - rect.left, event.clientY - rect.top];
        selected = parseInt(coords[0] / (canvas.width / 6));
        if(coords[1] > 80) {
            selected += 6;
            drawSelectedBorder((parseInt(coords[0] / (canvas.width / 6))) * canvas.width / 6, 80); 
        }  
        else {
            drawSelectedBorder((parseInt(coords[0] / (canvas.width / 6))) * canvas.width / 6, 0); 
        }
        drawSelections();
    }
}

function play() {
    editable = 0;
    for(let i = 0; i < 64; i++) {
        boardLayout[i] = -1;
        userLayout[i] = -1;
    }
    fillPieces(boardLayout, 1);
    drawPieces(boardLayout);
    setTimeout(() => {
        boardCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBoard();
        editable = 1;
    }, 3000)
}

function check() {
    for(let i = 0; i < 64; i++) {
        if(boardLayout[i] != userLayout[i]) {
            document.getElementById('result').innerHTML += "<p>Not quite right! Try again.</p>";
            return;
        }
    }
    document.getElementById('result').innerHTML += "<p>That's Correct! Well done.</p>";
}

function setup() {
    Promise.all([loadChessImage(), loadPiecesImage()])
    .then(() => {
        for(let i = 0; i < 64; i++) {
            boardLayout[i] = -1;
            userLayout[i] = -1;
        }
        drawBoard();
        drawSelections();
        gameCanvas.addEventListener('click', updateSelect);
        piecesCanvas.addEventListener('click', select.bind(null, piecesCanvas));
        document.getElementById('play').addEventListener('click', play);
        document.getElementById('check').addEventListener('click', check);
        document.getElementById('delete').addEventListener('click', () => {
            selected = -1; 
            selectCtx.clearRect(0, 0, piecesCanvas.width, piecesCanvas.height);
            selectCtx.drawImage(piecesImg, 0, 0, 480, 160);
            document.getElementById('delete').style.border = '5px solid #555'});
    })
}


document.addEventListener('DOMContentLoaded', setup, false);


