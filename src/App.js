import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { nanoid } from 'nanoid';

function App() {
  return (
    <div className="App">
      <h1>War, War never changes.</h1>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Game
          rows={15}
          columns={20}
          mines={50}
        />
      </div>

    </div>
  );
}

function Block(props) {
  return (
    <button className={ props.isExploded ? "ExplodedBlock" : (props.isOpened ? "Block" : "UnopenedBlock") } onClick={props.onClick}>
      {props.isOpened? props.value : ' '}
    </button>
  );
}

function Grid(props) {

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let minedPositions = Array(props.rows * props.columns).fill(0);
    for (let i = 0; i != props.mines && i != minedPositions.length; ++i) {
      minedPositions[i] = 1; // lay mines
    }
    reShuffle(minedPositions);
    var minedGrid = Array(props.rows).fill(0).map(x => Array(props.columns).fill(0)); // 2d grid of integers, 1 = mined, 0 = not mined

    // convert 1d array(minedPositions) to 2d grid (minedGrid)
    let counter = 0;
    for (let i = 0; i != minedGrid.length; ++i) {
      for (let j = 0; j != minedGrid[i].length; ++j) {
        minedGrid[i][j] = minedPositions[counter];
        ++counter;
      }
    }

    // build grid of tiles from minedGrid
    var tilesGrid = Array(props.rows).fill(0).map(x => Array(props.columns).fill(null));
    for (let i = 0; i != minedGrid.length; ++i) {
      for (let j = 0; j != minedGrid[i].length; ++j) {
        tilesGrid[i][j] = new Tile(
          getAdjMines(minedGrid, i, j),
          minedGrid[i][j],
          false,
          i,
          j,
          false
        )
      }
    }

    this.state = {
      rows: props.rows,
      columns: props.columns,
      grid: tilesGrid
    };


  }
  render() {
    let rows = //(<tr><td>{this.state.rows}</td></tr>)  ;
      this.state.grid.map(
        (row) => {
          let key = 0;
          return (
            <tr key={nanoid()}>
              {
                row.map(
                  (elem) =>
                  (<td key={nanoid()}>
                    <Block isOpened={elem.isOpened} value={elem.getTileText()} isExploded={elem.isExploded}
                    onClick=
                    {
                      () => {
                        if (!elem.isOpened) {
                          if (elem.isMined) {
                            this.die(elem.ln, elem.col);
                            return;
                          }
                          let newGrid = deepCopyGrid(this.state.grid);
                          discover(newGrid, elem.ln, elem.col);
                          this.setState({grid: newGrid});
                        }
                      }
                    } />
                  </td >)
                )
              }
            </tr>
          )
        }

      )
    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
  die(ln, col) {
    let newGrid = deepCopyGrid(this.state.grid);
    newGrid[ln][col].isExploded = true;
    for (let i = 0; i != this.state.rows; ++i)
      for (let j = 0; j != this.state.columns; ++j) {
        newGrid[i][j].isOpened = true;
      }
    this.setState({ grid: newGrid });
    this.render();
    alert("YOU DIE DIE!!!! Press F5 to restart the game. Press OK to see the board.");

    
  }
}

class Tile {
  number;
  isMined;
  isOpened;
  ln;
  col;
  isExploded;
  constructor(number, isMined, isOpened, ln, col, isExploded) {
    this.number = number;
    this.isMined = isMined;
    this.isOpened = isOpened;
    this.ln = ln;
    this.col = col;
    this.isExploded = isExploded;
  }
  getTileDebugTest() {
    return this.number + (this.isMined ? '*' : '');
  }
  getTileText() {
    //if (!this.isOpened) return ' ';  else 
    if (this.isExploded) return '💥';
    else if (this.isMined) return '💣';
    else if (this.number == 0) return ' ';
    else return this.number;
  }
  explode() {
    this.isExploded = true;
  }
}

function deepCopyGrid(grid) {
  var clone = Array(grid.length).fill(0).map(x => Array(x.length).fill(null));
  for (let i = 0; i != grid.length; ++i) {
    for (let j = 0; j != grid[i].length; ++j) {
      clone[i][j] = new Tile(
        grid[i][j].number,
        grid[i][j].isMined,
        grid[i][j].isOpened,
        grid[i][j].ln,
        grid[i][j].col,
        grid[i][j].isExploded
      )
    }
  }
  return clone;
}


/**
 * Fisher–Yates shuffle the array
 * @param {the array} array 
 */
function reShuffle(array) {
  for (let i = array.length - 1; i != -1; --i) {
    let j = getRndInteger(0, i + 1);// j ← random integer such that 0 ≤ j ≤ i
    // exchange a[j] and a[i]
    let p = array[j];
    array[j] = array[i];
    array[i] = p;
  }
}
/**
 * Return a random integer
 * @param {min inclusive} min 
 * @param {max exclusive} max 
 * @returns an integer in [min, max)
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Calculate how many mines are adjacent to array[ln][col].
 * @param {the array} array 
 * @param {the line} ln 
 * @param {the column} col 
 * @returns the number of mines adjacent (8 positions) to array[ln][col]
 */
function getAdjMines(array, ln, col) {
  if (ln < 0 || ln >= array.length || col < 0 || col >= array[ln].length) {
    throw new Error("Illegal arguments: ln " + ln + ", col" + col);
  }
  let counter = 0;
  for (let i = ln - 1; i <= ln + 1; ++i)
    for (let j = col - 1; j <= col + 1; ++j) {
      if (i < 0 || i >= array.length || j < 0 || j >= array[i].length || (i == ln && j == col) || !array[i][j])
        continue; // if the position is out of the grid, or if the position is the current tile
      // or if there is no mine: do not increase the counter
      else ++counter;
    }
  return counter;
}

function discover(array, ln, col) {
  if (ln < 0 || ln >= array.length || col < 0 || col >= array[ln].length || array[ln][col].isOpened) return; // out of bound or already opened
  array[ln][col].isOpened = true;
  if (array[ln][col].number == 0) { // if the tile is not adjacent to mines, discover the adjacent 8 tiles
    for (let i = ln - 1; i <= ln + 1; ++i)
      for (let j = col - 1; j <= col + 1; ++j)
        if (i != ln || j != col)
          discover(array, i, j);
  }
}
export default App;