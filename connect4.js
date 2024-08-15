/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game{
  // Add the 2 player objects with their colors
  constructor(player1, player2, HEIGHT = 6, WIDTH = 7){
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.currPlayer = player1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    // Will track if the game is currently on
    this.gameOn = true; 
    this.players = [player1, player2];
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // Since the handclick is being used in the event handler, the 'this'
    // isnt the Game object anymore, so binding it allows it to know what the object is now
    this.handleClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // Use the class color
    piece.style.backgroundColor = this.currPlayer.color; 
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    // Game isn't currently on now
    this.gameOn = false;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // Shouldnt allow anymore clicking after the game is over
    if(!this.gameOn){
      return;
    } 
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players depending on who the current player is
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // The 'This' inside the _win function isn't for the Game object, since it's inside another function
    // Since an arrow function gets the 'This' from the code around them, if we use it for the _win function,
    // it should now be for the Game object
    const  _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  // Clear board when user restarts
  clearBoard() {
    const board = document.querySelector('#board');
    board.innerHTML = '';
  }
}

// Allow the players to choose their colors
class Player{
  constructor(color){
    this.color = color;
  }
}

// Create a start button
const gameButton = document.querySelector("#start-button");
// This will keep track of when the game is created
let game = null;
// Listen for the user click to either start, or restart game
gameButton.addEventListener("click", () => {
  // If the game exist, then clear the board, and restart
  if(game){
    game.clearBoard();
  }
  // Get the colors the players chose
  let color1 = document.querySelector("#player1-color").value;
  let color2 = document.querySelector("#player2-color").value;
  let player1 = new Player(color1);
  let player2 = new Player(color2);
  // Create the game
  game = new Game(player1, player2);
});



