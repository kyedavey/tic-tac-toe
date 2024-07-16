const gameBoard = (function () {
  let board;
  const getSquare = (position) => board[position];
  const setSquare = (position, symbol) => (board[position] = symbol);
  const setNewBoard = () => (board = new Array(9));
  return { getSquare, setSquare, setNewBoard };
})();

const gameController = (function () {
  let playerOne;
  let playerTwo;
  let activePlayer;
  let currentRound;
  let winningCombination;

  const startNewGame = () => {
    gameBoard.setNewBoard();
    playerOne = createPlayer("Player 1", "X");
    playerTwo = createPlayer("Player 2", "O");
    activePlayer = playerOne;
    currentRound = 1;
    displayController.updateGameBoard();
    displayController.updateGameStatus(`${getActivePlayerName()}'s Turn`);
    displayController.addGameSquareEventListeners();
    if (winningCombination) {
      displayController.toggleHighlightWinningCombination(winningCombination);
    }
  };

  const playRound = (position) => {
    gameBoard.setSquare(position, activePlayer.symbol);
    currentRound++;
    winningCombination = checkWin();
    if (winningCombination) {
      displayController.updateGameStatus(`${getActivePlayerName()} Wins!`);
      displayController.removeGameSquareEventListeners();
      displayController.toggleHighlightWinningCombination(winningCombination);
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

    return winningSequences.find((sequence) => {
      return sequence.every(
        (position) => gameBoard.getSquare(position) === activePlayer.symbol
      );
    });
  };

  return {
    getActivePlayerSymbol,
    getActivePlayerName,
    startNewGame,
    playRound,
  };
})();

const displayController = (function () {
  const gameSquares = document.querySelectorAll(".game-square");
  const gameStatusDisplay = document.querySelector("h2");
  const restartButton = document.querySelector("Button");

  restartButton.addEventListener("click", gameController.startNewGame);

  const updateGameBoard = () => {
    gameSquares.forEach((square) => {
      square.textContent = gameBoard.getSquare(
        square.getAttribute("data-index")
      );
    });
  };

  const updateGameStatus = (str) => {
    gameStatusDisplay.textContent = str;
  };

  const toggleHighlightWinningCombination = (winningCombination) => {
    winningCombination.forEach((square) => {
      gameSquares[square].classList.toggle("highlight");
    });
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
    toggleHighlightWinningCombination,
    addGameSquareEventListeners,
    removeGameSquareEventListeners,
  };
})();

function createPlayer(name, symbol) {
  return { name, symbol };
}

gameController.startNewGame();
