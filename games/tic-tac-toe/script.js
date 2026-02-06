
const cells = document.querySelectorAll(".cell");
const turnText = document.querySelector(".turn-text");
const exitBtn = document.querySelector(".exit-btn");

let board = Array(9).fill("");
let gameActive = true;
let currentTurn = "user";

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// 🔄 Turn UI
function setTurn(turn) {
  document.body.classList.remove("user-turn", "bot-turn");
  document.body.classList.add(turn === "user" ? "user-turn" : "bot-turn");
  turnText.textContent = turn === "user" ? "Your Turn" : "Bot's Turn";
  currentTurn = turn;
}

// 🏆 Winner check
function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

function isDraw() {
  return board.every(cell => cell !== "");
}

// 👤 User move
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const i = cell.dataset.index;
    if (!gameActive || board[i] !== "" || currentTurn !== "user") return;

    board[i] = "X";
    cell.textContent = "❌";

    if (checkWinner("X")) {
      turnText.textContent = "You Win 🎉";
      gameActive = false;
      return;
    }

    if (isDraw()) {
      turnText.textContent = "Draw 🤝";
      gameActive = false;
      return;
    }

    setTurn("bot");
    setTimeout(computerMove, 400);
  });
});

// 🤖 BOT (UNBEATABLE)
function computerMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  cells[move].textContent = "⭕";

  if (checkWinner("O")) {
    turnText.textContent = "Bot Wins 🤖🔥";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    turnText.textContent = "Draw 🤝";
    gameActive = false;
    return;
  }

  setTurn("user");
}

// 🧠 Minimax
function minimax(boardState, depth, isMaximizing) {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (boardState.every(c => c !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

// 🔁 Exit / Restart
exitBtn.addEventListener("click", () => {
  board.fill("");
  cells.forEach(cell => cell.textContent = "");
  gameActive = true;
  setTurn("user");
});
