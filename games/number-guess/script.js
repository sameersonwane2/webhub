const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const resultText = document.querySelector(".result-text");
const attemptsText = document.querySelector(".attempts-text");
const restartBtn = document.querySelector(".exit-btn");
const difficultySelect = document.getElementById("difficulty");
const hintText = document.querySelector(".hint");
const timerText = document.querySelector(".timer");
const scoreText = document.querySelector(".score");

let maxNumber, maxAttempts, timeLimit;
let secretNumber, attemptsLeft, timeLeft;
let gameActive = true;
let score = 0;
let timerInterval;

// 🎯 Difficulty setup
function setDifficulty() {
  const level = difficultySelect.value;

  if (level === "easy") {
    maxNumber = 50;
    maxAttempts = 10;
    timeLimit = 30;
  } else if (level === "hard") {
    maxNumber = 200;
    maxAttempts = 5;
    timeLimit = 15;
  } else {
    maxNumber = 100;
    maxAttempts = 7;
    timeLimit = 20;
  }

  resetGame();
}

// 🔄 Reset
function resetGame() {
  clearInterval(timerInterval);
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attemptsLeft = maxAttempts;
  timeLeft = timeLimit;

  hintText.textContent = `Guess between 1 and ${maxNumber}`;
  attemptsText.textContent = `Attempts left: ${attemptsLeft}`;
  timerText.textContent = `⏱ ${timeLeft}s`;
  scoreText.textContent = `⭐ Score: ${score}`;
  resultText.textContent = "";
  guessInput.value = "";
  document.body.classList.remove("bot-turn");
  gameActive = true;

  startTimer();
}

// ⏱ Timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (!gameActive) return;
    timeLeft--;
    timerText.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft === 0) {
      endGame(false, "⏰ Time’s up!");
    }
  }, 1000);
}

// 👤 Guess logic
guessBtn.addEventListener("click", () => {
  if (!gameActive) return;

  const guess = Number(guessInput.value);
  if (!guess || guess < 1 || guess > maxNumber) {
    resultText.textContent = "⚠️ Enter a valid number!";
    return;
  }

  attemptsLeft--;
  attemptsText.textContent = `Attempts left: ${attemptsLeft}`;

  if (guess === secretNumber) {
    endGame(true, "🎉 Correct! You Win!");
    return;
  }

  if (attemptsLeft === 0) {
    endGame(false, `😢 Game Over! Number was ${secretNumber}`);
    return;
  }

  resultText.textContent =
    guess < secretNumber ? "📉 Too Low!" : "📈 Too High!";
});

// 🏁 End Game
function endGame(win, message) {
  clearInterval(timerInterval);
  gameActive = false;
  resultText.textContent = message;
  document.body.classList.add("bot-turn");

  score += win ? 10 : -5;
  scoreText.textContent = `⭐ Score: ${score}`;
}

// 🔁 Controls
restartBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", setDifficulty);

// 🚀 Init
setDifficulty();
