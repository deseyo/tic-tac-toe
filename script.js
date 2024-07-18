const gameboardContainer = document.querySelector('.gameboard-container');
const btnStart = document.querySelector('.btn-start');
const btnRestart = document.querySelector('.btn-restart');
const btnNames = document.querySelector('.btn-names');
const winnerField = document.querySelector('.winner-field');
const noWinnerField = document.querySelector('.no-winner-field');
let gameCanceled;


const gameboardLogic = (function() {
  let gameboard = [];
  let gameboardRows = [[], [], []];
  let userOne;
  let userTwo;
  let userTurn = 0;
  let fieldClicked;
  let gameEnded = false
  
  const createUser = (name) => {
    return {name};
  };

  const initiateUsers = () => {
    while (true) {
      userOne = createUser(prompt('Enter user one name: '));
      if (userOne.name === null) {
        alert('Game canceled');
        gameCanceled = true;
      } else if (userOne.name.split('').filter(value => value !== ' ').length === 0) {
        alert('Enter valid name!');
        continue;
      }
      break;
    } 

    if (!gameCanceled) {
      while (true) {
        userTwo = createUser(prompt('Enter user two name: '));
        if (userTwo.name === null) {
          alert('Game canceled');
          gameCanceled = true;
        } else if (userTwo.name.split('').filter(value => value !== ' ').length === 0 || userTwo.name === userOne.name) {
          alert('Enter valid name!');
          continue;
        }
        break;
      }
    }
  };

  const createGameboard = () => {
    for (let i = 0; i < 9; i++) {
      const field = document.createElement('div');
      field.setAttribute('class', 'gameboard-field');
      field.index = i;
      field.disabled = false;
      field.textContent = '';
      field.addEventListener('click', () => {
        if (field.disabled === false) {
          fieldClicked = field.index;
          field.disabled = true;
          markField()
        }
      })
      gameboardContainer.appendChild(field)
      gameboard.push(field);
    }
    
    for (let i = 0; i < 9; i++) {
      if (i < 3) gameboardRows[0].push(gameboard[i]);
      else if (i < 6) gameboardRows[1].push(gameboard[i]);
      else gameboardRows[2].push(gameboard[i]);
    }
  };

  const markField = () => {
    let symbol;
    
    if (userTurn === 0) symbol = 'O', userTurn = 1;
    else symbol = 'X', userTurn = 0;
    
    for (field of gameboard) {
      if (field.index === fieldClicked && field.textContent === '') {
        field.textContent = symbol;
        break;
      }
    }

    checkForWin.row(symbol);
    checkForWin.column(symbol);
    checkForWin.tie(symbol);   

    if (gameEnded === false && gameboard.filter(field => field.disabled === false).length === 0) noWinnerField.textContent = 'Noone won', setTimeout(restartGame.generalGameRestart, 2000);
  };

  const checkForWin = (function() {
    const row = (symbol) => {
      for (let i = 0; i < 3; i++) {
        if (
          gameboardRows[i][0].textContent === symbol && 
          gameboardRows[i][1].textContent === symbol && 
          gameboardRows[i][2].textContent === symbol) gameEnded = true, restartGame.wonGameRestart();
      }
    };
    const column = (symbol) => {
      for (let i = 0; i < 3; i++) {
        if (
          gameboardRows[0][i].textContent === symbol &&
          gameboardRows[1][i].textContent === symbol &&
          gameboardRows[2][i].textContent === symbol) gameEnded = true, restartGame.wonGameRestart();
      }
    };
    const tie = (symbol) => {
      if (
        gameboardRows[0][0].textContent === symbol &&
        gameboardRows[1][1].textContent === symbol &&
        gameboardRows[2][2].textContent === symbol || 
        gameboardRows[0][2].textContent === symbol && 
        gameboardRows[1][1].textContent === symbol && 
        gameboardRows[2][0].textContent === symbol) gameEnded = true, restartGame.wonGameRestart();
    };

    return {row, column, tie};
  })();

  const restartGame = (function() {
    const wonGameRestart = () => {
      if (userTurn === 1) winnerField.textContent = `${userOne.name} won!`;
      else winnerField.textContent = `${userTwo.name} won!`;

      for (field of gameboard) {
        field.disabled = true;
      }

      setTimeout(generalGameRestart, 2000);
    };
    
    const generalGameRestart = () => {
      userTurn = 0;
      fieldClicked = undefined;
      gameEnded = false;
      winnerField.textContent = '';
      noWinnerField.textContent = '';

      for (field of gameboard) {
        field.disabled = false;
        field.textContent = '';
      };

      for (row of gameboardRows) {
        for (field of row) {
          field.disabled = false;
          field.textContent = '';
        }
      };
    };

    const btnRestart = () => {
      initiateUsers();
      if (gameCanceled === true) {
        gameboard = [];
        gameboardRows = [[],[],[]];
        userTurn = 0;
        fieldClicked = undefined;
        gameEnded = false;
        gameboardContainer.innerHTML = ''

        for (let i = 0; i < 9; i++) {
          const field = document.createElement('div');
          field.setAttribute('class', 'gameboard-field');
          gameboardContainer.appendChild(field);
        }
      } else generalGameRestart();
    };

    return {wonGameRestart, generalGameRestart, btnRestart};
  })();

  return {initiateUsers, createGameboard, markField, checkForWin, restartGame};
})();


function btnRestartEventListener() {
  gameboardLogic.restartGame.btnRestart();
  if (gameCanceled === true) {
    btnRestart.classList.add('btn-inactive');
    btnStart.addEventListener('click', startGame);
    btnStart.classList.remove('btn-inactive');
    btnRestart.removeEventListener('click', btnRestartEventListener);
  }  
}


function startGame() {
  gameCanceled = false;
  gameboardLogic.initiateUsers();  
  
  if (gameCanceled === false) {
    btnStart.removeEventListener('click', startGame);
    btnStart.classList.add('btn-inactive');
    btnRestart.addEventListener('click', btnRestartEventListener);
    btnRestart.classList.remove('btn-inactive');
    gameboardContainer.innerHTML = '';
    gameboardLogic.createGameboard();
  }
}

btnStart.addEventListener('click', startGame);
