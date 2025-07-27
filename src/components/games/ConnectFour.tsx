import { useState } from "react";

const ROWS = 6;
const COLS = 7;

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const checkWinner = (board: (string | null)[][]) => {
  // Check horizontal, vertical, and diagonal lines
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row][col];
      if (!player) continue;

      // Horizontal
      if (
        col + 3 < COLS &&
        player === board[row][col + 1] &&
        player === board[row][col + 2] &&
        player === board[row][col + 3]
      )
        return player;

      // Vertical
      if (
        row + 3 < ROWS &&
        player === board[row + 1][col] &&
        player === board[row + 2][col] &&
        player === board[row + 3][col]
      )
        return player;

      // Diagonal down-right
      if (
        row + 3 < ROWS &&
        col + 3 < COLS &&
        player === board[row + 1][col + 1] &&
        player === board[row + 2][col + 2] &&
        player === board[row + 3][col + 3]
      )
        return player;

      // Diagonal up-right
      if (
        row - 3 >= 0 &&
        col + 3 < COLS &&
        player === board[row - 1][col + 1] &&
        player === board[row - 2][col + 2] &&
        player === board[row - 3][col + 3]
      )
        return player;
    }
  }
  return null;
};

export const ConnectFour = () => {
  const [board, setBoard] = useState<(string | null)[][]>(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState("🔴");
  const [winner, setWinner] = useState<string | null>(null);

  const dropDisc = (col: number) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentPlayer;
        break;
      }
    }

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "🔴" ? "🟡" : "🔴");
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer("🔴");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Connect Four</h1>
      <div className="mb-2 text-lg">
        {winner ? `Winner: ${winner}` : `Turn: ${currentPlayer}`}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 60px)` }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => dropDisc(colIndex)}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center 
                ${cell ? "" : "bg-blue-400 hover:bg-blue-500"}`}
              style={{
                backgroundColor: cell
                  ? cell === "🔴"
                    ? "#e63946"
                    : "#f1c40f"
                  : "#3498db",
              }}
            >
              {cell || ""}
            </button>
          ))
        )}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Restart
      </button>
    </div>
  );
};
