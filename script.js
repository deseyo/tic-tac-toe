const Gameboard = (function() {
  let gameboard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  const displayGameboard = () => {
    gameboard.forEach(row => {
      if (gameboard.indexOf(row) === gameboard.length - 1) console.log(row, "\n")
      else console.log(row);
    });
  }

  const markField = (row, field) => {
    if (gameboard[row][field] !== 1) {
      gameboard[row][field] = 1;
      checkForWin.row();
      checkForWin.column();
      checkForWin.cornerLeftToRight();
      checkForWin.cornerRightToLeft();
    } else console.log("This field is already taken!")
  } 

  const checkForWin = (function() {
    const row = () => {
      for (let i = 0; i < 3; i++) {
        if (gameboard[i][0] === 1 && gameboard[i][1] === 1 && gameboard[i][2] === 1) console.log('row win'), resetGameboard();
      }
    };
    const column = () => {
      for (let i = 0; i < 3; i++) {
        if (gameboard[0][i] === 1 && gameboard[1][i] === 1 && gameboard[2][i] === 1) console.log('column win'), resetGameboard();
      }
    }
    const cornerLeftToRight = () => {
      if (gameboard[0][0] === 1 && gameboard[1][1] === 1 && gameboard[2][2] === 1) console.log('corner left to right win'), resetGameboard();
    }
    const cornerRightToLeft = () => {
      if (gameboard[0][2] === 1 && gameboard[1][1] === 1 && gameboard[2][0] === 1) console.log('corner right to left win'), resetGameboard();
    }

    return {row, column, cornerLeftToRight, cornerRightToLeft};
  })()
  
  const resetGameboard = () => {
    displayGameboard();
    gameboard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }

  return {displayGameboard, markField, checkForWin}
})();