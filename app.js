let board = null;
let game = new Chess();

function init() {
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
  });
}

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  setTimeout(makeRandomMove, 300);
}

function makeRandomMove() {
  let moves = game.moves();
  if (moves.length === 0) return;

  let move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);
  board.position(game.fen());
}

window.onload = init;
