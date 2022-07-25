import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { nanoid } from "nanoid";

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button
      key={props.value}
      className={`square ${props.changeColor ? "red" : ""}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={nanoid()}
        changeColor={this.props.victoryLine?.includes(i)}
      />
    );
  }

  render() {
    const rows = new Array(3).fill(null);
    const cols = new Array(3).fill(null);
    return (
      <div>
        {rows.map((rowEl, i) => {
          return (
            <div key={nanoid()} className="board-row">
              {cols.map((colEl, j) => {
                return this.renderSquare(j + i * 3);
              })}
            </div>
          );
        })}
      </div>
    );

    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), col: null, row: null }],
      stepNumber: 0,
      xIsNext: true,
      reverseMoveOrder: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner } = calculateWinner(squares);

    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const { col, row } = mapSquareIndexToColRow(i);
    this.setState({
      history: history.concat([{ squares: squares, col, row }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, victoryLine } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}, (${step.row},${step.col})`
        : "Go to game start";

      const bold = this.state.stepNumber === move;

      return (
        // <li>
        //   <button onClick={() => this.setState({reverseMoveOrder: !reverseMoveOrder})}>Sort Move Order</button>
        // </li>
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={bold ? "makeBold" : "normal"}
          >
            {desc}
          </button>
        </li>
      );
    });

    const sortMoveOrderButton = (
      <button
        onClick={() =>
          this.setState({ reverseMoveOrder: !this.state.reverseMoveOrder })
        }
      >
        Sort Move Order
      </button>
    );

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (!winner && this.state.stepNumber === 9) {
      status = `Draw!`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            victoryLine={victoryLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{sortMoveOrderButton}</div>
          <ol>
            {this.state.reverseMoveOrder ? moves.slice().reverse() : moves}
          </ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], victoryLine: lines[i] };
    }
  }
  return { winner: null, victoryLine: null };
}

function mapSquareIndexToColRow(index) {
  switch (index) {
    case 0:
      return { col: 0, row: 0 };
    case 1:
      return { col: 1, row: 0 };
    case 2:
      return { col: 2, row: 0 };
    case 3:
      return { col: 0, row: 1 };
    case 4:
      return { col: 1, row: 1 };
    case 5:
      return { col: 2, row: 1 };
    case 6:
      return { col: 0, row: 2 };
    case 7:
      return { col: 1, row: 2 };
    case 8:
      return { col: 2, row: 2 };
    default:
      throw new Error("Improper square index");
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
