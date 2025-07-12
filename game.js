const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-container"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [...questions];

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;
const TIME_PENALTY = 10;
let timeLeft = 60;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  startTimer();
}

function startTimer() {
  const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0 || questionCounter >= MAX_QUESTIONS) {
      clearInterval(timerInterval);
      localStorage.setItem("mostRecentScore", score);
      return window.location.assign("end.html");
    }
  }, 1000);
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html");
  }

  // Clear visual feedback
  choices.forEach(choice => {
    choice.classList.remove("correct", "incorrect");
  });

  questionCounter++;
  questionCounterText.innerText = questionCounter;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice, index) => {
    const choiceText = choice.querySelector(".choice-text");
    choiceText.innerText = currentQuestion.choices[index];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
}

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;

    const selectedAnswer = parseInt(choice.dataset["number"]);
    const classToApply =
      selectedAnswer === currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      score += SCORE_POINTS;
    } else {
      timeLeft -= TIME_PENALTY;
    }

    scoreText.innerText = score;

    choice.classList.add(classToApply);

    setTimeout(() => {
      choice.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

startGame();