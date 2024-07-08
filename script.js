const gameBoard = (function () {
  let board = new Array(9);
  const getSquare = (position) => board[position];
  const setSquare = (position, symbol) => (board[position] = symbol);
  const reset = () => (board = new Array(9));
  const printToConsole = () => {
    console.log(
      `gameBoard:\n0:${getSquare(0)} 1:${getSquare(1)} 2:${getSquare(
        2
      )}\n3:${getSquare(3)} 4:${getSquare(4)} 5:${getSquare(5)}\n6:${getSquare(
        6
      )} 7:${getSquare(7)} 8:${getSquare(8)}`
    );
  };
  return { getSquare, setSquare, reset, printToConsole };
})();

const gameController = (function () {
  let playerOne;
  let playerTwo;
  let activePlayer;
  let currentRound;
  let gameActive = false;
  let boardUsed = false;

  const startGame = () => {
    console.log("Starting New Game");
    if (boardUsed) gameBoard.reset();
    playerOne = createPlayer("Player 1", "X");
    playerTwo = createPlayer("Player 2", "O");
    activePlayer = playerOne;
    currentRound = 1;
    gameActive = true;
    boardUsed = true;
    gameBoard.printToConsole();
    console.log(`${getActivePlayerName()}'s turn`);
    displayController.renderGameBoard();
  };

  const playRound = (position) => {
    if (!gameActive) {
      console.log("Game has not started");
      return;
    }
    if (gameBoard.getSquare(position)) {
      console.log("Square Taken, Replay Round");
      return;
    }
    gameBoard.setSquare(position, activePlayer.symbol);
    currentRound++;
    gameBoard.printToConsole();
    if (checkWin()) {
      console.log(`${getActivePlayerName()} wins`);
      gameActive = false;
      return;
    }
    if (currentRound > 9) {
      console.log(`Tie`);
      gameActive = false;
      return;
    }
    switchPlayer();
    displayController.renderGameBoard();
    console.log(`${getActivePlayerName()}'s turn`);
  };

  const switchPlayer = () =>
    activePlayer == playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  const getActivePlayerName = () => activePlayer.name;
  const getActivePlayerSymbol = () => activePlayer.symbol;
  const getGameStatus = () => gameActive;

  const checkWin = () => {
    const winningSequences = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningSequences.some((sequence) => {
      return sequence.every(
        (position) => gameBoard.getSquare(position) === activePlayer.symbol
      );
    });
  };

  return {
    getActivePlayerSymbol,
    getActivePlayerName,
    startGame,
    playRound,
    getGameStatus,
  };
})();

const displayController = (function () {
  const gameSquares = document.querySelectorAll(".game-square");

  const renderGameBoard = () => {
    gameSquares.forEach((square) => {
      console.log(square.getAttribute("data-index"));
      square.textContent = gameBoard.getSquare(
        square.getAttribute("data-index")
      );
    });
  };

  return { renderGameBoard };
})();

function createPlayer(name, symbol) {
  return { name, symbol };
}

gameController.startGame();
