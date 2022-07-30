function createBoard() {
  var board = createMat(10, 12);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = { type: FLOOR, gameElement: null };
      if (
        (i === 0) | (i === board.length - 1) ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }
      board[i][j] = cell;
    }
    // board[2][9] = GAMER
    board[gamerPose.i][gamerPose.j].gameElement = GAMER;
    board[4][7].gameElement = BALL;
    board[6][9].gameElement = BALL;
  }
  console.log(board);
  return board;
}
