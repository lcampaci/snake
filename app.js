const game = new Chess();

let selected = null;
let difficulty = 1;
let timer = 0;
let interval;

const boardEl = document.getElementById("board");

// ♟ peças unicode
const pieces = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

// 🔁 iniciar
function newGame() {
  game.reset();
  timer = 0;
  renderBoard();
  startTimer();
}

// ⏱ timer
function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText =
      new Date(timer * 1000).toISOString().substr(14, 5);
  }, 1000);
}

// 🎯 render
function renderBoard() {
  boardEl.innerHTML = "";
  const board = game.board();

  board.forEach((row, i) => {
    row.forEach((square, j) => {
      const div = document.createElement("div");
      div.className = "square " + ((i + j) % 2 ? "dark" : "light");

      if (square) {
        div.innerText = pieces[square.color === 'w'
          ? square.type.toUpperCase()
          : square.type];
      }

      div.onclick = () => onClick(i, j);
      boardEl.appendChild(div);
    });
  });
}

// 👆 clique
function onClick(i, j) {
  if (navigator.vibrate) navigator.vibrate(50);

  const square = "abcdefgh"[j] + (8 - i);

  if (!selected) {
    selected = square;
  } else {
    game.move({ from: selected, to: square });
    selected = null;
    renderBoard();
    setTimeout(aiMove, 300);
  }
}

// 🤖 IA simples
function aiMove() {
  const moves = game.moves();
  if (moves.length === 0) return endGame();

  let move;

  if (difficulty === 1) {
    move = moves[Math.floor(Math.random() * moves.length)];
  } else if (difficulty === 2) {
    move = moves[0];
  } else {
    move = moves[moves.length - 1];
  }

  game.move(move);
  renderBoard();

  if (game.game_over()) endGame();
}

// 🏁 fim
function endGame() {
  alert("Fim de jogo!");
  document.getElementById("rankingModal").classList.remove("hidden");
}

// 💾 salvar partida
function saveGame() {
  localStorage.setItem("chess-save", game.fen());
  alert("Salvo!");
}

// 🏆 ranking
function saveScore() {
  const name = document.getElementById("playerName").value;
  const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");

  ranking.push({ name, time: timer });
  ranking.sort((a, b) => a.time - b.time);

  localStorage.setItem("ranking", JSON.stringify(ranking));
  loadRanking();
}

function loadRanking() {
  const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  ranking.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.name} - ${r.time}s`;
    list.appendChild(li);
  });
}

// 🌗 tema
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// 🎚 dificuldade
function changeDifficulty() {
  difficulty = (difficulty % 3) + 1;
  alert("Dificuldade: " + ["Fácil", "Médio", "Difícil"][difficulty - 1]);
}

// 🔄 carregar
window.onload = () => {
  renderBoard();
  loadRanking();
};
