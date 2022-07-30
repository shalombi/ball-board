const GAMER = "GAMER";
const BALL = "BALL";
const WALL = "WALL";
const FLOOR = "FLOOR";
const GAMER_IMG = `<img src="img/gamer.png"/>`;
const BALL_IMG = `<img src="img/ball.png"/>`;
const GLUE = "GLUE";
const GLUE_IMG = `<img src="img/glue_.png"/>`;
//GLOBAL VARIABLES
var gBoard;
var gGamerPose;
//control balls - collected balls and count how many balls
var gCounterCollectBalls = 0;
var gCounterNumOfBalls = 0;
var gIsGameOver = false;
//interval for balls and glue
var gBallInterval;
var gGlueInterval;
// control on glue
var gIsGlue; //EXAMPLE

function initGame() {
  gIsGameOver = false;
  gGamerPose = { i: 2, j: 9 };
  gBoard = createBoard();
  renderBoard(gBoard);
  addBallsAndGlue();
}

function addBallsAndGlue() {
  gBallInterval = setInterval(function () {
    addBall(gBoard);
  }, 1700);

  gGlueInterval = setInterval(function () {
    addGlue(gBoard);
  }, 5000);
}

// createBoard();
function createBoard() {
  var board = createMat(10, 12);
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 12; j++) {
      var cell = { type: FLOOR, gameElement: null };
      if (
        (i === 0) |
        (i === board.length - 1) |
        (j === 0) |
        (j === board[0].length - 1)
      ) {
        cell.type = WALL;
      }
      board[i][j] = cell;
    }
  }
  board[2][9].gameElement = GAMER;
  //generate 2 balls and count theme
  board[3][9].gameElement = BALL;
  board[6][6].gameElement = BALL;
  gCounterNumOfBalls += 2;
  //make FLOOR in specific location

  board[0][5].type = FLOOR;
  board[5][0].type = FLOOR;
  board[5][11].type = FLOOR;
  board[9][5].type = FLOOR;
  //print board
  console.log(board);
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[0].length; j++) {
      var location = { i: i, j: j };
      var currCell = board[i][j];
      var currClass = getClassName(location);
      if (currCell.type === FLOOR) currClass += " floor";
      if (currCell.type === WALL) currClass += " wall";
      strHTML += `<td class="cell ${currClass}" onclick="moveTo(${i}, ${j})">`;
      if (currCell.gameElement === BALL) strHTML += BALL_IMG;
      if (currCell.gameElement === GAMER) strHTML += GAMER_IMG;

      strHTML += `</td>`;
    }
    strHTML += `</tr>`;
  }
  var elBoard = document.querySelector("tbody.board");
  elBoard.innerHTML = strHTML;
}

function createMat(ROWS, COLS) {
  var mat = [];
  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push("");
    }
    mat.push(row);
  }
  return mat;
}

function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`;
  return cellClass;
}

//Every few seconds a new ball is added in a random empty cell
function addBall(board) {
  if (gIsGameOver) return;
  //   board[3][3].gameElement = BALL;
  //   renderCell({ i: 3, j: 3 }, BALL_IMG);
  var i = getRandomInt(1, 9);
  var j = getRandomInt(1, 11);
  if (board[i][j].gameElement === GAMER) return;
  //Model
  board[i][j].gameElement = BALL;
  //DOM
  renderCell({ i: i, j: j }, BALL_IMG);
  //count how many balls
  gCounterNumOfBalls++;
}

//GLUE is added to board every 5 seconds and gone after 3 seconds
function addGlue(board) {
  if (gIsGameOver) return;
  //   board[3][3].gameElement = BALL;
  //   renderCell({ i: 3, j: 3 }, BALL_IMG);
  var i = getRandomInt(1, 9);
  var j = getRandomInt(1, 11);
  if (board[i][j].gameElement === GAMER) return;
  if (board[i][j].gameElement === BALL) return;
  //Model
  board[i][j].gameElement = GLUE;
  //DOM
  renderCell({ i: i, j: j }, GLUE_IMG);
  //TODO :REMOVE GLUE AFTER 3 SEC
  var gGlueInterval = setInterval(function () {
    removeGlue(i, j, board);
  }, 3000);
}
// gGlueInterval = setInterval(function () {
//     addGlue(gBoard);
//   }, 5000);

function removeGlue(i, j, board) {
  //Model
  board[i][j].gameElement = null;
  //DOM
  renderCell({ i: i, j: j }, "");
  //
  if (gGamerPose.i === i && gGamerPose.j === j) {
    renderCell({ i: i, j: j }, GAMER_IMG);
  }
  // prevent bugs
  gGlueInterval = "";
}

// balls-collected
// Move the player to a specific location
function moveTo(i, j) {
  if (gIsGameOver) return;
  if (gIsGlue) return;
  //TODO :take the gamer from left/right or top/bottom:
  if (i === -1) i = 9; // if (i === -1) i = gBoard.length - 1;
  else if (i === 10) i = 0; // if if (i === gBoard.length) i = 0
  else if (j === -1) j = 11; // if (j === -1) j = gBoard[0].length - 1
  else if (j === 12) j = 0; //if (j === gBoard[0].length) j = 0

  console.log("i", i);
  var targetCell = gBoard[i][j];
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPose.i);
  var jAbsDiff = Math.abs(j - gGamerPose.j);

  // If the clicked Cell is one of the four allowed
  var consditionForMovementA = iAbsDiff === gBoard.length - 1; //(iAbsDiff === 9)
  var consditionForMovementB = jAbsDiff === gBoard[0].length - 1; // (jAbsDiff === 11)

  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0) ||
    //The passages
    consditionForMovementA ||
    consditionForMovementB
  ) {
    i === 0 || i === -1;
    if (i === -1) i = 9;

    if (targetCell.gameElement === BALL) {
      gCounterCollectBalls++;
      //Play sound when collecting a ball
      var audio = new Audio("audio/Fruit.mp3");
      audio.play();
      //check game over
      showHowManyCollect();
      if (gCounterCollectBalls === gCounterNumOfBalls) gameOver();
    }
    if (targetCell.gameElement === GLUE) delayInGlue();

    // MOVING from current position
    // Model:
    gBoard[gGamerPose.i][gGamerPose.j].gameElement = null;
    // Dom:
    renderCell(gGamerPose, "");

    // MOVING to selected position
    // Model:
    gGamerPose.i = i;
    gGamerPose.j = j;
    gBoard[gGamerPose.i][gGamerPose.j].gameElement = GAMER;
    // DOM:
    renderCell(gGamerPose, GAMER_IMG);
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
  console.log("gCounterCollectBalls", gCounterCollectBalls);
  console.log("gCounterNumOfBalls", gCounterNumOfBalls);
}

function renderCell(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function gameOver() {
  console.log("gameOver");
  // gBallInterval = "";
  //   makeAmsg();
  gIsGameOver = true;
}

function newGame() {
  //INTERVAL
  clearInterval(gBallInterval);
  gBallInterval = "";
  //RESTART COUNTER OF BALLS
  gCounterCollectBalls = 0;
  gCounterNumOfBalls = 0;
  //   makeAmsg();
  initGame();
}

// removeGlue();
// function removeGlue() {
//   clearInterval(gGlueInterval, 3000);
//   gGlueInterval = "";
// }

function delayInGlue() {
  gIsGlue = true;
  setTimeout(() => (gIsGlue = false), 3000);
}

//UTIL
function handleKey(event) {
  var i = gGamerPose.i;
  var j = gGamerPose.j;

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
      moveTo(i + 1, j);
      break;
  }
}

function makeAmsg() {
  var modalGameOver = document.querySelector(".msg");
  if (gIsGameOver) modalGameOver.innerHTML = "😎";
  if (!gIsGameOver) modalGameOver.innerHTML = "😊";
}

//UTIL
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// i=0,j=5
// i=5,j=0
// i=5,j=11
// i=9,j=5
// gCounterCollectBalls
function showHowManyCollect() {
  var msgCollect = document.querySelector(".balls-collected");

  msgCollect.innerHTML = `collected:${gCounterCollectBalls}`;
}
