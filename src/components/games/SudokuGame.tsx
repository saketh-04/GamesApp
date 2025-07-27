import { useState } from "react";
import { Button } from "@/components/ui/button";

const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const SudokuGame = () => {
  const [board, setBoard] = useState(initialPuzzle);

  const handleChange = (row: number, col: number, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 9) return;

    const updated = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? num : c))
    );
    setBoard(updated);
  };

  const resetGame = () => setBoard(initialPuzzle);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Sudoku</h1>
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="text"
              maxLength={1}
              className="w-10 h-10 text-center border border-gray-400"
              value={cell === 0 ? "" : cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={initialPuzzle[i][j] !== 0}
            />
          ))
        )}
      </div>
      <Button onClick={resetGame} className="mt-4">
        Reset
      </Button>
    </div>
  );
};
