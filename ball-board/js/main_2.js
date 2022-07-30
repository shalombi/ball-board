const WALL = "WALL";
const FLOOR = "FLOOR";
const BALL = "BALL";
const GAMER = "GAMER";

const GAMER_IMG = `<img src="img/gamer.png"/>`;
const BALL_IMG = `<img src="img/ball.png"/>`;

var gBoard;
var gGamerPose;

function initGame() {
  gGamerPose = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  var board = createMat(10, 12);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = { type: FLOOR, gameElement: null };
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }
      board[i][j] = cell;
    }
  }
  board[gGamerPose.i][gGamerPose.j].gameElement = GAMER;

  board[3][8].gameElement = BALL;
  board[7][4].gameElement = BALL;

  console.log(board);
  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var cellClass = getClassName({ i: i, j: j }); //cell-1-2
      if (currCell.type === FLOOR) cellClass += " floor"; //cell-1-2 floor
      if (currCell.type === WALL) cellClass += " wall";

      strHTML += `<td class="cell ${cellClass} ">`;
      if (currCell.gameElement === GAMER) strHTML += GAMER_IMG;
      if (currCell.gameElement === BALL) strHTML += BALL_IMG;

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

//location = {i:3,j:8} => cell-3-8
function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`;
  return cellClass;
}
