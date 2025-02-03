const colorBoxes = document.querySelectorAll(".color-box");
const startBtn = document.getElementById("start-btn");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("time-left");
const scoreDisplay = document.getElementById("current-score");
const gameOverModal = document.getElementById("game-over-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const finalLevel = document.getElementById("final-level");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty-select");
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");
const levelUpSound = document.getElementById("level-up-sound");

let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let timer;
let timeLeft;
const WIN_LEVEL = 10;

// Set difficulty settings
const difficultySettings = {
  easy: { baseTime: 10, timeIncrement: 1 }, // Base time increases by 1 second per level
  medium: { baseTime: 8, timeIncrement: 0.5 }, // Base time increases by 0.5 seconds per level
  hard: { baseTime: 6, timeIncrement: 0 }, // Base time remains the same
};

// Generate a random sequence of colors
function generateSequence() {
  sequence = [];
  const difficulty = difficultySelect.value;
  const sequenceLength = difficultySettings[difficulty].sequenceLength || 3; // Default sequence length
  for (let i = 0; i < sequenceLength; i++) {
    const randomColor = colorBoxes[Math.floor(Math.random() * colorBoxes.length)].getAttribute("data-color");
    sequence.push(randomColor);
  }
}

// Show the sequence to the player
function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    flashColor(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      enableClicks();
      startTimer();
    }
  }, 1000);
}

// Flash a color box
function flashColor(color) {
  const colorBox = document.querySelector(`[data-color="${color}"]`);
  colorBox.style.opacity = "0.5";
  setTimeout(() => {
    colorBox.style.opacity = "1";
  }, 500);
}

// Enable player clicks
function enableClicks() {
  colorBoxes.forEach(box => {
    box.addEventListener("click", handleClick);
  });
}

// Handle player clicks
function handleClick(e) {
  const color = e.target.getAttribute("data-color");
  playerSequence.push(color);
  flashColor(color);

  if (playerSequence.length === sequence.length) {
    checkSequence();
  }
}

// Check if the player's sequence matches the generated sequence
function checkSequence() {
  if (JSON.stringify(playerSequence) === JSON.stringify(sequence)) {
    correctSound.play();
    score += timeLeft * 10; // Award points based on time left
    scoreDisplay.textContent = score;
    if (level === WIN_LEVEL) {
      clearInterval(timer); // Clear the timer
      showModal("Congratulations! You won the game!", `You reached level ${level} with a score of ${score}.`);
    } else {
      levelUpSound.play();
      level++;
      levelDisplay.textContent = `Level: ${level}`;
      playerSequence = [];
      clearInterval(timer); // Clear the timer before starting the next level
      setTimeout(() => {
        startGame();
      }, 1000);
    }
  } else {
    clearInterval(timer); // Clear the timer
    incorrectSound.play();
    showModal("Game Over!", `You reached level ${level} with a score of ${score}.`);
  }
}

// Start the timer
function startTimer() {
  const difficulty = difficultySelect.value;
  const { baseTime, timeIncrement } = difficultySettings[difficulty];
  timeLeft = baseTime + timeIncrement * (level - 1); // Adjust time based on level
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      incorrectSound.play();
      showModal("Time's Up!", `You ran out of time at level ${level}.`);
    }
  }, 1000);
}

// Update the timer when difficulty changes
function updateTimer() {
  if (timer) {
    clearInterval(timer); // Stop the current timer
    startTimer(); // Start a new timer with updated settings
  }
}

// Show the modal with a custom title and message
function showModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  finalLevel.textContent = level;
  finalScore.textContent = score;
  gameOverModal.style.display = "flex";
  clearInterval(timer); // Ensure the timer is cleared
}

// Reset the game
function resetGame() {
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  levelDisplay.textContent = `Level: ${level}`;
  scoreDisplay.textContent = score;
  gameOverModal.style.display = "none";
  startBtn.disabled = false;
  clearInterval(timer); // Ensure the timer is cleared
}

// Start the game
function startGame() {
  startBtn.disabled = true;
  generateSequence();
  showSequence();
}

// Event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", updateTimer); // Update timer when difficulty changes