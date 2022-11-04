let gameCanvas;
let boardCtx;
let piecesCanvas;
let selectCtx;
let result;
let selected;
let playing = false;

let boardLayout = [64];
let userLayout = [64];
let piecesImg = new Image();
let chessBoardImg = new Image();
let cooldown = false;

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
    boardCtx.drawImage(chessBoardImg, 0, 0, gameCanvas.width, gameCanvas.height);
}

function fillPieces(difficulty) {
    if(difficulty === 0) {
        max_pieces = 2;
    }
    else if(difficulty === 1) {
        max_pieces = 4;
    }
    else if(difficulty === 2) {
        max_pieces = 6;
    }
    else {
        max_pieces = 9;
    }
    for(let i = 0; i < max_pieces; i++) {
        boardLayout[Math.floor(Math.random() * 64)] = Math.floor(Math.random() * 12);
    }
}

function drawPieces(layout) {
    drawBoard();
    for(let i = 0; i < 64; i++) {
        if(layout[i] != -1) {
            if(layout[i] < 6) {
                boardCtx.drawImage(piecesImg, 320 * layout[i], 0, 320, 320, ((i % 8) * (gameCanvas.height / 8)) , Math.floor(i / 8) * (gameCanvas.height / 8), gameCanvas.width / 8, gameCanvas.height / 8);
            }
            else {
                boardCtx.drawImage(piecesImg, (320 * (layout[i] - 6)), 320, 320, 320, ((i % 8) * (gameCanvas.height / 8)) , Math.floor(i / 8) * (gameCanvas.height / 8), gameCanvas.width / 8, gameCanvas.height / 8);
            }
        }
    } 
}

function drawSelections () {
    selectCtx.clearRect(0, 0, piecesCanvas.width, piecesCanvas.height);
    selectCtx.drawImage(piecesImg, 0, 0, piecesCanvas.width, piecesCanvas.height);
}

function drawSelectedBorder(x, y) {
    console.log(x,y);
    drawSelections();
    document.getElementById('deletePiece').style.border = "1px solid #808080";
    selectCtx.strokeStyle='#00000';
    selectCtx.strokeRect(x, y, piecesCanvas.width / 6, piecesCanvas.height / 2);
}

function updateSelect() {
    if(!cooldown && playing) {
        const rect = gameCanvas.getBoundingClientRect();
        const pos = parseInt((event.clientX - rect.left) / (gameCanvas.width / 8)) + (parseInt((event.clientY - rect.top) / (gameCanvas.height / 8))) * 8;
        userLayout[pos] = selected;
        drawPieces(userLayout);
    }
}

function select(canvas) {
    if(!cooldown && playing) {
        const rect = canvas.getBoundingClientRect();
        const coords = [event.clientX - rect.left, event.clientY - rect.top];
        console.log(coords);
        selected = parseInt(coords[0] / (canvas.width / 6));
        if(coords[1] > 80) {
            selected += 6;
            drawSelectedBorder((parseInt(coords[0] / (canvas.width / 6))) * canvas.width / 6, canvas.height/2); 
        }  
        else {
            drawSelectedBorder((parseInt(coords[0] / (canvas.width / 6))) * canvas.width / 6, 0); 
        }
    }
}

function reSize() {
    setSize();
    drawPieces(userLayout);
    drawSelections();
}

function setSize() {
    if(document.documentElement.clientWidth > 1900) {
        piecesCanvas.width = 0.25 * document.documentElement.clientWidth;
        piecesCanvas.height = piecesCanvas.width/3;
        gameCanvas.width = 0.3 * document.documentElement.clientWidth;
        gameCanvas.height = gameCanvas.width;
    }
    else if(document.documentElement.clientWidth > 1000 && document.documentElement.clientWidth < 1900) {
        piecesCanvas.width = (0.15 + ((1900 - document.documentElement.clientWidth) * 0.00025)) * document.documentElement.clientWidth;
        piecesCanvas.height = piecesCanvas.width/3;
        gameCanvas.width = (0.25 + ((1900 - document.documentElement.clientWidth) * 0.00025)) * document.documentElement.clientWidth;
        gameCanvas.height = gameCanvas.width;
    }
    else {
        piecesCanvas.width = 0.80 * document.documentElement.clientWidth;
        piecesCanvas.height = piecesCanvas.width/3;
        gameCanvas.width = 0.90 * document.documentElement.clientWidth;
        gameCanvas.height = gameCanvas.width;
    }
}

function play() {
    if(!cooldown) {
        let timeout;
        let e = document.getElementById('diff');
        let difficulty = parseInt(e.value);
        result.innerHTML = '';
        for(let i = 0; i < 64; i++) {
            boardLayout[i] = -1;
            userLayout[i] = -1;
        }
        fillPieces(difficulty);
        drawPieces(boardLayout);
        drawSelections();
        cooldown = true;
        if(difficulty === 0 || difficulty === 1) {
            timeout = 5000;
        }
        if(difficulty === 2) {
            timeout = 7000;
        }
        if(difficulty === 3) {
            timeout = 10000;
        }
        setTimeout(() => {
            playing = true;
            boardCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawBoard();
            cooldown = false;
        }, 6000)
    }
}

function check() {
    if(!cooldown && playing) {
        for(let i = 0; i < 64; i++) {
            if(boardLayout[i] != userLayout[i]) {
                result.innerHTML = "<span style='color: red'>Not quite right!</span><span> Try again.</p>";
                return;
            }
        }
        playing = false;
        result.innerHTML = "<span style='color: green'>That's Correct!</span><span> Well done.</>";
    }
}

function del(mode) {
    if(!cooldown && playing) {
        drawSelections();
        if(mode === 0) {
            document.getElementById('deletePiece').style.border = "2px solid #000000";
            selected = -1;
        }
        else {
            document.getElementById('deletePiece').style.border = "1px solid #808080";
            for(let i = 0; i < 64; i++) {
                userLayout[i] = -1;
            }
            drawBoard();
        }
    }
}

function setup() {
    Promise.all([loadChessImage(), loadPiecesImage()])
    .then(() => {
        for(let i = 0; i < 64; i++) {
            boardLayout[i] = -1;
            userLayout[i] = -1;
        }
        gameCanvas = document.getElementById('game');
        boardCtx = gameCanvas.getContext('2d');
        boardCtx.mozImageSmoothingEnabled = false;
        boardCtx.webkitImageSmoothingEnabled = false;
        boardCtx.msImageSmoothingEnabled = false;
        boardCtx.imageSmoothingEnabled = false;
        piecesCanvas = document.getElementById('pieces');
        selectCtx = piecesCanvas.getContext('2d');
        result = document.getElementById('result');
        setSize();
        drawBoard();
        drawSelections();
        window.addEventListener('resize', reSize);
        gameCanvas.addEventListener('click', updateSelect);
        piecesCanvas.addEventListener('click', select.bind(null, piecesCanvas));
        document.getElementById('play').addEventListener('click', play);
        document.getElementById('check').addEventListener('click', check);
        document.getElementById('deletePiece').addEventListener('click', del.bind(null, 0));
        document.getElementById('deleteBoard').addEventListener('click', del.bind(null, 1));
    })
}

document.addEventListener('DOMContentLoaded', setup, false);


