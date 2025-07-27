import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ROWS = 6;
const COLS = 7;

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const ConnectFour = () => {
  const [board, setBoard] = useState<number[][]>(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState<number | null>(null);

  const dropDisc = (col: number) => {
    if (winner) return;
    const newBoard = board.map(row => [...row]);

    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === 0) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        if (checkWin(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        return;
      }
    }
  };

  const checkWin = (b: number[][], p: number) => {
    // horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === p && b[r][c + 1] === p && b[r][c + 2] === p && b[r][c + 3] === p) return true;
      }
    }
    // vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 3; r++) {
        if (b[r][c] === p && b[r + 1][c] === p && b[r + 2][c] === p && b[r + 3][c] === p) return true;
      }
    }
    // diagonal (down-right)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === p && b[r + 1][c + 1] === p && b[r + 2][c + 2] === p && b[r + 3][c + 3] === p) return true;
      }
    }
    // diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === p && b[r - 1][c + 1] === p && b[r - 2][c + 2] === p && b[r - 3][c + 3] === p) return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(createBoard);
    setWinner(null);
    setCurrentPlayer(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Connect Four</h1>

      {winner ? (
        <p className="text-green-500 font-bold mb-2">
          🎉 Player {winner} wins!
        </p>
      ) : (
        <p className="mb-2">Player {currentPlayer}'s turn</p>
      )}

      <Card className="p-2 mb-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${COLS}, 60px)` }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => dropDisc(cIdx)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center cursor-pointer ${
                  cell === 0
                    ? "bg-gray-300"
                    : cell === 1
                    ? "bg-red-500"
                    : "bg-yellow-400"
                }`}
              ></div>
            ))
          )}
        </div>
      </Card>

      <Button className="mt-4" onClick={resetGame}>
        New Game
      </Button>
    </div>
  );
};
