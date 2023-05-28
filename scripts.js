const cards = document.querySelectorAll('.memory-card');


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0; 
let timer = null; 
let time = 0; 
let isGameWon = false; 
let isGameStarted = false;

function flipCard() {

  // Redă sunetul la fiecare întoarcere a unui card
  const flipSound = new Audio('sound/click.mp3');
  flipSound.play();

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  

  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  const sound = new Audio('sound/bell.mp3');
  sound.play();

  resetBoard();
  
  matchedPairs++;
  if (matchedPairs === 6) {
    clearInterval(timer);
    showMessage('Ai câștigat!');
    document.getElementById('win-time').innerHTML = document.getElementById('timer').innerHTML;
    isGameWon = true;
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    const sound = new Audio('sound/flip_sound.mp3');
    sound.play();

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
};

shuffle();


function startGame() {
  
    // Actualizează textul butonului pentru a indica că jocul este în desfășurare
    document.getElementById('start-button').innerHTML = 'Joc în curs...';
    document.getElementById('start-button').disabled = true;

    cards.forEach(card => card.addEventListener('click', flipCard))

    // Afișează timerul
    document.getElementById('timer').style.display = 'block';
  
    if (!isGameWon) {
      timer = setInterval(updateTimer, 1000);
    }

    isGameStarted = true;
}

function stopGame() {
  // Actualizează textul butonului pentru a indica că jocul este în desfășurare
  document.getElementById('start-button').innerHTML = 'Start';
  document.getElementById('start-button').disabled = false;
  cards.forEach(card => card.removeEventListener('click', flipCard))


  clearInterval(timer);
}

function updateTimer() {
  time++;
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById('timer').innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showMessage(message) {
  const messageContainer = document.getElementById('win-message');
  const messageText = document.getElementById('win-message-text');
  messageText.innerHTML = message;
  messageContainer.style.display = 'block';
}

function playBackgroundMusic() {
  console.log('test');
  const sound = new Audio('sound/fundal.mp3');
  sound.play();
}

function restartGame() {
  // Resetare variabile și starea jocului
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;
  time = 0;
  isGameWon = false;

  // Ascunde mesajul de câștig și resetați stilurile
  document.getElementById('win-message').style.display = 'none';
  document.getElementById('timer').classList.remove('win');

  // Resetați starea cardurilor și amestecați-le
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  

  // Resetare timer doar dacă jocul a început deja
  if (isGameStarted) {
    clearInterval(timer);
    time = 0;
    updateTimer();
  }

  // Porniți jocul
  //startGame();

  shuffle();

  // Resetarea timerului și afișarea valorii 00:00
  stopGame();
  document.getElementById('timer').innerHTML = '00:00';

}

function checkForWin() {
  if (matchedPairs === 6) {
    clearInterval(timer);
    document.getElementById('timer').classList.add('win');
    showMessage('Ai câștigat!');

    
  }
}

document.getElementById('start-button').addEventListener('click', startGame)
document.getElementById('reset-button').addEventListener('click', restartGame)
