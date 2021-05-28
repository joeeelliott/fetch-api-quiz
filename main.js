const answerBtns = Array.from(document.querySelector('.answers-container').children);
const answerBtn1 = document.querySelector('.answerOne');
const answerBtn2 = document.querySelector('.answerTwo');
const answerBtn3 = document.querySelector('.answerThree');
const answerBtn4 = document.querySelector('.answerFour');
const startBtn = document.querySelector('.startBtn'); 
const playAgainBtn = document.querySelector('.play-again');
const okayBtn = document.querySelector('.okay-btn');

const questionContainer = document.querySelector('.question-container');
const modal = document.querySelector('.modal-container'); 
const lives = document.querySelector('.lives'); 

const difficulty = document.querySelector('#difficulty');
const numberOfQuestions = document.querySelector('#numOfQuestions');


// these arrays will represent the indexes of the questions we fetch(). the shuffle function shuffles these into a random order so that when we are printing a question and answer to the browser, what we are doing is iterating through those API object results in a randomized order via this randomized array. console.log to make sense 

const randomNumber10 = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const randomNumber20 = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
const randomNumber30 = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
const randomNumber40 = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
const randomNumber50 = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);

let randomNumber;    // is defined to an above array depending on number of questions selected 
let questionsIndex;
let answers;
let correctAnswer; 
let dataResults;
let questionCount;
let correctAnswerCount; 
let API;     // defined as the API equal touser settings

const maxNumQuestionsTxt = document.querySelector('.max-num-questions'); 

// highlights the maximum number of questions that can be chosen for each difficulty 
difficulty.addEventListener('click', () => {
  if(difficulty.value === 'easy'){
    maxNumQuestionsTxt.innerHTML = '(Maximum number of questions is 40 on this difficulty)';
    numberOfQuestions.setAttribute('max', '40');
    numberOfQuestions.value = '20'; 
    maxNumQuestionsTxt.classList.add('on-difficulty-click');
    maxNumQuestionsTxt.style.opacity = "0.8";
  } else if(difficulty.value === 'medium'){
    maxNumQuestionsTxt.innerHTML = '(Maximum number of questions is 50 on this difficulty)';
    numberOfQuestions.setAttribute('max', '50');
    numberOfQuestions.value = '20'; 
  } else if(difficulty.value === 'hard'){
    maxNumQuestionsTxt.innerHTML = '(Maximum number of questions is 20 on this difficulty)';
    numberOfQuestions.setAttribute('max', '20');
    numberOfQuestions.value = '20'; 
  } else {
    maxNumQuestionsTxt.innerHTML = '(Maximum number of questions is 50 on this difficulty)';
    numberOfQuestions.setAttribute('max', '50');
    numberOfQuestions.value = '20'; 
  }
});

// iterate through this to validate user settings
const settings = [
  {
    difficulty: 'easy',
    maxNum: 40
  },
  {
    difficulty: 'medium',
    maxNum: 50
  },
  {
    difficulty: 'hard',
    maxNum: 20
  },
  {
    difficulty: 'any',
    maxNum: 50
  }
];

// begin quiz
startBtn.addEventListener('click', () => {
  let correctSettings = []; 

  for(let i = 0; i < settings.length; i++){
    if(difficulty.value === settings[i].difficulty && numberOfQuestions.value <= settings[i].maxNum){
      correctSettings.push(true);   
      // this array will either have one value 'true' which means the settings chosen is equivalent to the key:value pairs in the settings array, OR it will have no values as the user settings didn't equal any of the settings. 
    }
  }  
  
  if(correctSettings[0]){ //...so if that only item is true..

    // ...we define randomNumber to the randomNumber array which has the same amount of values as the number of questions chosen
    if(Number(numberOfQuestions.value) === 10){
      randomNumber = randomNumber10;
    } else if(Number(numberOfQuestions.value) === 20){
      randomNumber = randomNumber20; 
    } else if(Number(numberOfQuestions.value) === 30){
      randomNumber = randomNumber30; 
    } else if(Number(numberOfQuestions.value) === 40){
      randomNumber = randomNumber40; 
    } else if(Number(numberOfQuestions.value) === 50){
      randomNumber = randomNumber50; 
    }

    runQuestion();    // we run the first question
    calculateLives(difficulty.value, Number(numberOfQuestions.value));
    document.querySelector('.startBtn').classList.add('hide');
    document.querySelector('.settings-container').classList.add('hide');

  } else {
    document.querySelector('.settings-modal').classList.remove('hide');
  }  
});

okayBtn.addEventListener('click', settingsOkay);
playAgainBtn.addEventListener('click', playAgain);

// calculate no. of lives based on user input settings
function calculateLives(difficulty, questions){
  if(difficulty === 'easy' && questions === 10){
    lives.innerHTML = 3;
  } else if(difficulty === 'easy' && questions === 20){
    lives.innerHTML = 6;
  } else if(difficulty === 'easy' && questions === 30){
    lives.innerHTML = 9;
  } else if(difficulty === 'easy' && questions === 40){
    lives.innerHTML = 12;
  } else if(difficulty === 'medium' && questions === 10){
    lives.innerHTML = 3;
  } else if(difficulty === 'medium' && questions === 20){
    lives.innerHTML = 6;
  } else if(difficulty === 'medium' && questions === 30){
    lives.innerHTML = 9;
  } else if(difficulty === 'medium' && questions === 40){
    lives.innerHTML = 12;
  } else if(difficulty === 'medium' && questions === 50){
    lives.innerHTML = 15;
  } else if(difficulty === 'hard' && questions === 10){
    lives.innerHTML = 3;
  } else if(difficulty === 'hard' && questions === 20){
    lives.innerHTML = 6;
  }
}
 
function runQuestion(){
  questionCount = 1;    // begins question count
  document.querySelector('.question-count').innerHTML = questionCount;

  // DIFFICULTY: EASY API's
  if(difficulty.value === 'easy' && numberOfQuestions.value <= 10){
    API = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';
  } else if(difficulty.value === 'easy' && numberOfQuestions.value > 10 && numberOfQuestions.value <= 20){
    API = 'https://opentdb.com/api.php?amount=20&category=21&difficulty=easy&type=multiple';
  } else if(difficulty.value === 'easy' && numberOfQuestions.value > 20 && numberOfQuestions.value <= 30){
    API = 'https://opentdb.com/api.php?amount=30&category=21&difficulty=easy&type=multiple';
  } else if(difficulty.value === 'easy' && numberOfQuestions.value > 30 && numberOfQuestions.value <= 40){
    API = 'https://opentdb.com/api.php?amount=40&category=21&difficulty=easy&type=multiple';
  } 
  // DIFFICULTY: MEDIUM API's
  else if(difficulty.value === 'medium' && numberOfQuestions.value <= 10){
    API = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple'; 
  } else if(difficulty.value === 'medium' && numberOfQuestions.value > 10 && numberOfQuestions.value <= 20){
    API = 'https://opentdb.com/api.php?amount=20&category=21&difficulty=medium&type=multiple'; 
  } else if(difficulty.value === 'medium' && numberOfQuestions.value > 20 && numberOfQuestions.value <= 30){
    API = 'https://opentdb.com/api.php?amount=30&category=21&difficulty=medium&type=multiple';
  } else if(difficulty.value === 'medium' && numberOfQuestions.value > 30 && numberOfQuestions.value <= 40){
    API = 'https://opentdb.com/api.php?amount=40&category=21&difficulty=medium&type=multiple';
  } else if(difficulty.value === 'medium' && numberOfQuestions.value > 40 && numberOfQuestions.value <= 50){
    API = 'https://opentdb.com/api.php?amount=50&category=21&difficulty=medium&type=multiple';
  } 
  // DIFFICULTY: HARD API's
  else if(difficulty.value === 'hard' && numberOfQuestions.value <= 10){
    API = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=hard&type=multiple';
  }   else if(difficulty.value === 'hard' && numberOfQuestions.value > 10 && numberOfQuestions.value <= 20){
    API = 'https://opentdb.com/api.php?amount=20&category=21&difficulty=hard&type=multiple';
  }

  fetch(API)
  .then(response => response.json())
  .then(data => { 
    // these are inside the promise so they display on screen only when the data is ready and not a split second before
    document.querySelector('.question-container').classList.remove('hide');
    document.querySelector('.answers-container').classList.remove('hide');
    document.querySelector('.lives-container').classList.remove('hide');
    document.querySelector('.question-count-container').classList.remove('hide');
    
    dataResults = data.results; // global scope to use in other functions

    questionsIndex = 0; 
    correctAnswerCount = 0;

    getQuestion();

    answerBtn1.addEventListener('click', checkAnswer)
    answerBtn2.addEventListener('click', checkAnswer)
    answerBtn3.addEventListener('click', checkAnswer)
    answerBtn4.addEventListener('click', checkAnswer)
  })
  .catch(err => {
    console.log('Error');
    console.log(err);
  });
}

function checkAnswer(e){
  // if user gets the right answer
  if(e.currentTarget.innerHTML === correctAnswer){

    questionCount++;   
    questionsIndex++;
    correctAnswerCount++; 

    // prevents question count going up one extra on screen than the number of questions user selected
    if(questionCount <= Number(numberOfQuestions.value)){
      document.querySelector('.question-count').innerHTML = questionCount;
    }

    // if all questions are completed before lives run out
    if(questionCount - 1 === Number(numberOfQuestions.value)){
      quizOver('Congratulations!');
    }

    getQuestion();

  } else {   // if they get the wrong answer
    lives.innerHTML -= 1; 
  }

  // if user runs out of lives 
  if(lives.innerHTML === '0'){
    quizOver('You Lose!');
  }
}

// reset game
function playAgain(){
  modal.classList.add('hide');
  
  startBtn.classList.remove('hide'); 
  document.querySelector('.lives-container').classList.add('hide');
  document.querySelector('.question-count-container').classList.add('hide');

  document.querySelector('.settings-container').classList.remove('hide'); 
  document.querySelector('.question-container').classList.add('hide'); 
  document.querySelector('.answers-container').classList.add('hide'); 

  lives.innerHTML = '';
}

function settingsOkay(){
  document.querySelector('.settings-modal').classList.add('hide'); 
}

// return an array of numbers (passed in as a parameter) shuffled into a random order 
function shuffle(array) {
  var i = array.length,
      j = 0,
      temp;

  while (i--) {
      j = Math.floor(Math.random() * (i+1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}
// get question 
function getQuestion(){
  questionContainer.innerHTML = `<h2 class="question">${dataResults[randomNumber[questionsIndex]].question}</h2>`;

    correctAnswer = dataResults[randomNumber[questionsIndex]].correct_answer;
    answers = dataResults[randomNumber[questionsIndex]].incorrect_answers;

    answers.push(correctAnswer);

    let ranAnswerNums = shuffle([0,1,2,3]); 
    let answersIndex = -1; 
    answerBtns.forEach(item => {
      answersIndex++;
      item.innerHTML = answers[ranAnswerNums[answersIndex]];
    });
}
// quiz over
function quizOver(text){
  modal.classList.remove('hide'); 
  modal.children[0].children[0].innerHTML = text;
  modal.children[0].children[1].innerHTML = `You scored ${correctAnswerCount} out of ${numberOfQuestions.value}.`;
  questionContainer.innerHTML = '';

  answerBtns.forEach(item => {
    item.innerHTML = ''; 
  });
}