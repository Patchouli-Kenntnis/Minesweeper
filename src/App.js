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
        />
      </div>

    </div>
  );
}

function Block(props) {
  return (
    <button className="Block" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Grid(props) {

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: props.rows,
      columns: props.columns,
      grid: Array(props.rows).fill(0).map(x => Array(props.columns).fill(0))
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
                    (<td key={nanoid()}><Block value="9" /></td>)
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
}
export default App;
