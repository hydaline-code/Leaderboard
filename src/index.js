// import _ from 'lodash';
import './style.css';

const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api';
let gameId;

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
    gameId = game.result.split(' ')[3];
    console.log('Game ID:', gameId);
  } catch (error) {
    console.error('Error creating game:', error);
  }
};

createGame();

const refreshScores = async () => {
  try {
    const response = await fetch(`${baseURL}/games/${gameId}/scores`);
    const scores = await response.json();
    console.log('Scores:', scores);
   
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
};

const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', refreshScores);

const submitScore = async (event) => {
  event.preventDefault();

  const playerNameInput = document.getElementById('playerName');
  const scoreInput = document.getElementById('score');

  const playerName = playerNameInput.value;
  const score = Number(scoreInput.value);

  try {
    if (!gameId) {
      console.log('Game ID not available. Please create a game .');
      return;
    }

    const response = await fetch(`${baseURL}/games/${gameId}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: playerName, score: score }),
    });

    playerNameInput.value = '';
    scoreInput.value = '';

    console.log('Leaderboard score submitted successfully!');
    
    refreshScores(); 
    displayScore(playerName, score); 

  } catch (error) {
    console.error('Error submitting score:', error);
  }
};

// Display a single score dynamically 
const displayScore = (user, score) => {
  const scoreContainer = document.getElementById('score-container');

  const listItem = document.createElement('li');
  const playerName = document.createElement('span');
  playerName.textContent = ` ${user} `;
  const playerScore = document.createElement('span');
  playerScore.textContent = `${score}`;
  const seperator = document.createElement('span');
  scoreContainer.appendChild(listItem);
  seperator.textContent = ': ';
listItem.appendChild(playerName);
listItem.appendChild(seperator);
listItem.appendChild(playerScore);
};

const scoreForm = document.getElementById('scoreForm');
scoreForm.addEventListener('submit', submitScore);