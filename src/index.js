// import _ from 'lodash';
import './style.css';

const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api';
let gameId;

const scoreContainer = document.getElementById('score-container');

const showMessage = (message) => {
  const messageContainer = document.getElementById('score-container');
  const tittle = document.createElement('h5');
  tittle.textContent = message;
  messageContainer.appendChild(tittle);
  setTimeout(() => {
    messageContainer.removeChild(tittle);
  }, 2000);
};

const createGame = async () => {
  try {
    const response = await fetch(`${baseURL}/games/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'My cool new game' }),
    });
    const game = await response.json();
    // eslint-disable-next-line prefer-destructuring
    gameId = game.result.split(' ')[3];
    showMessage(`Game ID: ${gameId}`);
  } catch (error) {
    showMessage(`Error fetching gameID: ${error}`);
  }
};

createGame();

const refreshScores = async () => {
  try {
    const response = await fetch(`${baseURL}/games/${gameId}/scores`);
    const scores = await response.json();
    scores.result.forEach((score) => {
      const { user, score: scoreValue } = score;
      displayScore(user, scoreValue);
    });
  } catch (error) {
    showMessage(`Error fetching scores: ${error}`);
  }
};

const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', () => {
  scoreContainer.innerHTML = '';
  refreshScores();
});

const submitScore = async (event) => {
  event.preventDefault();

  const playerNameInput = document.getElementById('playerName');
  const scoreInput = document.getElementById('score');

  const playerName = playerNameInput.value;
  const score = Number(scoreInput.value);

  try {
    if (!gameId) {
      showMessage('Game ID not available. Please create a game .');
      return;
    }

    const response = await fetch(`${baseURL}/games/${gameId}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: playerName, score }),
    });
    if (response.ok) {
      playerNameInput.value = '';
      scoreInput.value = '';

      showMessage('Leaderboard score submitted successfully!');
    }
  } catch (error) {
    showMessage(`Error submitting score: ${error}`);
  }
};

// Display a single score dynamically
const displayScore = (user, score) => {
  const listItem = document.createElement('li');
  const playerName = document.createElement('span');
  playerName.textContent = ` ${user} `;
  playerName.classList.add('player-name');
  const playerScore = document.createElement('span');
  playerScore.classList.add('player-score');
  playerScore.textContent = `${score}`;
  const seperator = document.createElement('span');
  seperator.classList.add('separator');
  scoreContainer.appendChild(listItem);
  seperator.textContent = ': ';
  listItem.appendChild(playerName);
  listItem.appendChild(seperator);
  listItem.appendChild(playerScore);
};

const scoreForm = document.getElementById('scoreForm');
scoreForm.addEventListener('submit', submitScore);
