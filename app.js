let board;
let game = new Chess();
let stockfish = new Worker("stockfish.js");

let level = 10;

// 🎯 iniciar tabuleiro
function init() {
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    onSnapEnd: () => board.position(game.fen())
  });
}

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  updateStatus();
  setTimeout(makeAI, 300);
}

// 🤖 IA com Stockfish
function makeAI() {
  stockfish.postMessage("position fen " + game.fen());
  stockfish.postMessage("go depth " + level);
}

stockfish.onmessage = function (event) {
  if (event.data.startsWith("bestmove")) {
    let move = event.data.split(" ")[1];

    game.move({
      from: move.substring(0, 2),
      to: move.substring(2, 4),
      promotion: 'q'
    });

    board.position(game.fen());
    updateStatus();
  }
};

// 📊 status
function updateStatus() {
  let status = "";

  if (game.in_checkmate()) {
    status = "Xeque-mate!";
    animateEnd();
  } else if (game.in_check()) {
    status = "Xeque!";
  } else {
    status = "Jogando...";
  }

  document.getElementById("status").innerText = status;
}

// ✨ animação final
function animateEnd() {
  document.body.style.background = "red";
  setTimeout(() => {
    document.body.style.background = "#111";
  }, 500);
}

// 🎮 novo jogo
function newGame() {
  game.reset();
  board.start();
}

// 🎚 nível
function setLevel(l) {
  level = l;
  alert("Nível: " + l);
}

// 🌗 tema
function toggleTheme() {
  document.body.classList.toggle("light");
}

window.onload = init;
