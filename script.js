let canvas = document.getElementById('game')
let draw = canvas.getContext('2d')
let xSize = 30;
let ySize = 30;
let stepNum = 0;
let stepButton = document.getElementById('step')
let clearButton = document.getElementById('clear')
let playButton = document.getElementById('play')
let running = false;
let playing = false;
let oldGameBoard;
let interval;
let underLimit = 1;
let overLimit = 4;
let birthLimit = 3;
let speed = 1000;

let gameBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

let ogGrid = JSON.parse(JSON.stringify(gameBoard))

console.log(gameBoard);

//function that draws an outline of the grid
function drawGrid() {
    draw.strokeStyle = '#000';
    for (let x = 1; x < 21; x++) {
        draw.beginPath();
        draw.moveTo(x * xSize, 0);
        draw.lineTo(x * xSize, 600);
        draw.stroke();
    }

    for (let y = 1; y < 21; y++) {
        draw.beginPath();
        draw.moveTo(0, y * ySize);
        draw.lineTo(600, y * ySize);
        draw.stroke();
    }
}


function render(){
    draw.clearRect(0, 0, 600, 600)
    drawGrid();
    draw.beginPath();
    draw.lineWidth = "1"
    draw.fillStyle = "black"
    for(row in gameBoard) {
        for(col in gameBoard[row]){
            if(gameBoard[row][col] == 1){
                draw.fillRect(col * xSize, row * ySize, xSize, ySize)
            }
        }
    }
    //update step num
    document.getElementById("stepNum").textContent = `Step ${stepNum}`;
}

function createLife(e){
    let canvasX = e.clientX - ((window.innerWidth - 600) / 2)
    let canvasY = e.clientY - 20;
    // console.log(`X: ${canvasX}, Y: ${canvasY}`);

    let gridX = Math.floor(canvasX / xSize) 
    let gridY = Math.floor(canvasY / ySize) 

    console.log(`GridX: ${gridX}, GridY: ${gridY}`);
    // console.log(gameBoard);

    gameBoard[gridY][gridX] = (gameBoard[gridY][gridX] == 1) ? 0 : 1
    render()
}

function findNeighbors(row, col){
    col = Number(col)
    row = Number(row)
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;

    if(col == 0) left = true;
    if(col == gameBoard[0].length - 1) right = true;
    if(row == 0) top = true;
    if(row == gameBoard.length - 1) bottom = true;

    let neighbors = 0;
    if (!top && !right && gameBoard[row - 1][col + 1] == 1) neighbors++
    if (!top && gameBoard[row - 1][col] == 1) neighbors++
    if (!top && gameBoard[row - 1][col - 1] == 1) neighbors++
    if (!left && gameBoard[row][col - 1] == 1) neighbors++
    if (!right && gameBoard[row][col + 1] == 1) neighbors++
    if (!bottom && !right && gameBoard[row + 1][col + 1] == 1) neighbors++
    if (!bottom && gameBoard[row + 1][col] == 1) neighbors++
    if (!bottom && !left && gameBoard[row + 1][col - 1] == 1) neighbors++
    return neighbors;
}

function step(){
    let ogBoard = JSON.parse(JSON.stringify(gameBoard))
    running = true;
    toggleRunning();
    for(row in gameBoard) {
        for(col in gameBoard[row]){
            let neighbors = findNeighbors(row, col);
            //Who dies?
                if(gameBoard[row][col] == 1){
                    console.log(neighbors);
                    if (neighbors <= underLimit || neighbors >= overLimit) ogBoard[row][col] = 0;
                }
            //Who's born?
                if(gameBoard[row][col] == 0){
                    if (neighbors == birthLimit) ogBoard[row][col] = 1;
                }
            }
        }
    gameBoard = JSON.parse(JSON.stringify(ogBoard))
    console.log(gameBoard);
    stepNum++;
    render()
}

function clearGrid(){
    for(row in gameBoard){
        for(col in gameBoard[row]){
            gameBoard[row][col] = 0;
        }
    }
    render()
}

function resetGrid() {
    stepNum = 0;
    gameBoard = JSON.parse(JSON.stringify(oldGameBoard))
    render()
    running = false;
    toggleRunning();
    stop()
}

function toggleRunning(){
    if(running && stepNum == 0){
        oldGameBoard = JSON.parse(JSON.stringify(gameBoard))
    }
    if(running){
        clearButton.removeEventListener("click", clearGrid);
        clearButton.addEventListener("click", resetGrid);
        canvas.removeEventListener("mousedown", createLife);
        clearButton.innerHTML = "Reset";
    }else{
        clearButton.removeEventListener("click", resetGrid);
        clearButton.addEventListener("click", clearGrid);
        canvas.addEventListener("mousedown", createLife);
        clearButton.innerHTML = "Clear";
    }
}

function togglePlay () {
    if(playing){
        playButton.innerHTML = "Pause";
        playButton.removeEventListener("click", play);
        playButton.addEventListener("click", stop);
    }else{
        playButton.innerHTML = "Play";
        playButton.removeEventListener("click", stop);
        playButton.addEventListener("click", play);
    }
}

function play () {
    playing = true;
    togglePlay();
    interval = setInterval(step, speed);
}


function stop() {
    playing = false;
    togglePlay();
    clearInterval(interval);
}

//function that updates the underLimit, overLimit, birthLimit, and speed to the input values
function updateSettings(){
    underLimit = Number(document.getElementById("underLimit").value);
    overLimit = Number(document.getElementById("overLimit").value);
    birthLimit = Number(document.getElementById("birthLimit").value);
}

function updateSpeed(){
    speed = Number(2000 - document.getElementById("speed").value);
    if(interval){
        clearInterval(interval);
        interval = setInterval(step, speed);
    }
}

drawGrid()
stepButton.addEventListener("click", step)
canvas.addEventListener("mousedown", createLife)
clearButton.addEventListener("click", clearGrid)
playButton.addEventListener("click", play)

//give the settings onInput events to updateSettings
document.getElementById("underLimit").addEventListener("input", updateSettings);
document.getElementById("overLimit").addEventListener("input", updateSettings);
document.getElementById("birthLimit").addEventListener("input", updateSettings);
document.getElementById("speed").addEventListener("input", updateSpeed);
