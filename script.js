const gameBoard = (function () {
  let board = new Array(9);
  const getSquare = (position) => board[position];
  const setSquare = (position, symbol) => (board[position] = symbol);
  const reset = () => (board = new Array(9));
  return { getSquare, setSquare, reset };
})();

const gameController = (function () {
  let playerOne;
  let playerTwo;
  let activePlayer;
  let currentRound;

  const startGame = () => {
    playerOne = createPlayer("Player 1", "X");
    playerTwo = createPlayer("Player 2", "O");
    activePlayer = playerOne;
    currentRound = 1;
    displayController.updateGameBoard();
    displayController.updateGameStatus(`${getActivePlayerName()}'s Turn`);
    displayController.addGameSquareEventListeners();
  };

  const playRound = (position) => {
    gameBoard.setSquare(position, activePlayer.symbol);
    currentRound++;
    if (checkWin()) {
      displayController.updateGameStatus(`${getActivePlayerName()} Wins!`);
      displayController.removeGameSquareEventListeners();
      return;
    }
    if (currentRound > 9) {
      displayController.updateGameStatus(`Tie!`);
      displayController.removeGameSquareEventListeners();
      return;
    }
    switchPlayer();
    displayController.updateGameStatus(`${getActivePlayerName()}'s turn`);
  };

  const switchPlayer = () =>
    activePlayer == playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  const getActivePlayerName = () => activePlayer.name;
  const getActivePlayerSymbol = () => activePlayer.symbol;

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
  };
})();

const displayController = (function () {
  const gameSquares = document.querySelectorAll(".game-square");

  const updateGameBoard = () => {
    gameSquares.forEach((square) => {
      square.textContent = gameBoard.getSquare(
        square.getAttribute("data-index")
      );
    });
  };

  const updateGameStatus = (str) => {
    const h2 = document.querySelector("h2");
    h2.textContent = str;
  };

  const gameSquareClicked = (e) => {
    const position = e.target.getAttribute("data-index");
    gameController.playRound(position);
    updateGameBoard();
    e.target.removeEventListener("click", gameSquareClicked);
  };

  const addGameSquareEventListeners = () => {
    gameSquares.forEach((square) =>
      square.addEventListener("click", gameSquareClicked)
    );
  };

  const removeGameSquareEventListeners = () => {
    gameSquares.forEach((square) =>
      square.removeEventListener("click", gameSquareClicked)
    );
  };

  return {
    updateGameBoard,
    updateGameStatus,
    addGameSquareEventListeners,
    removeGameSquareEventListeners,
  };
})();

function createPlayer(name, symbol) {
  return { name, symbol };
}

gameController.startGame();
