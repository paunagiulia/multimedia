const wordList = [
  "media","sound","video","light","pixel",
  "color","music","input","frame","logic"
];

let secretWord = "";
let rowIndex = 0;
let finished = false;

let games = 0;
let wins = 0;
let streak = 0;

const board = document.getElementById("board");
const input = document.getElementById("wordInput");
const info = document.getElementById("info");
const newGameBtn = document.getElementById("newGame");

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

function startGame() {
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  rowIndex = 0;
  finished = false;
  info.textContent = "";
  input.value = "";
  newGameBtn.classList.add("hidden");
  createBoard();
}

function checkWord() {
  if (finished) return;

  const guess = input.value.toLowerCase();

  if (guess.length !== 5) {
    info.textContent = "Word must have 5 letters.";
    return;
  }

  const result = Array(5).fill("wrong");
  let tempWord = secretWord.split("");

  for (let i = 0; i < 5; i++) {
    if (guess[i] === tempWord[i]) {
      result[i] = "correct";
      tempWord[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const index = tempWord.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = "present";
      tempWord[index] = null;
    }
  }

  const row = board.children[rowIndex];
  for (let i = 0; i < 5; i++) {
    row.children[i].textContent = guess[i];
    row.children[i].classList.add(result[i]);
  }

  if (guess === secretWord) {
    info.textContent = "You won!";
    finished = true;
    games++;
    wins++;
    streak++;
    newGameBtn.classList.remove("hidden");
  } else {
    rowIndex++;
    if (rowIndex === 6) {
      info.textContent = "You lost! Word was: " + secretWord.toUpperCase();
      finished = true;
      games++;
      streak = 0;
      newGameBtn.classList.remove("hidden");
    }
  }

  document.getElementById("games").textContent = games;
  document.getElementById("wins").textContent = wins;
  document.getElementById("streak").textContent = streak;

  input.value = "";
}

document.getElementById("checkBtn").addEventListener("click", checkWord);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") checkWord();
});
newGameBtn.addEventListener("click", startGame);

startGame();
