import { useEffect, useState } from "react";

const GRID_SIZE = 4;

const generateEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));

const getRandomEmptyCell = (grid: number[][]) => {
  const emptyCells: { row: number; col: number }[] = [];
  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push({ row: i, col: j });
    })
  );
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addNewTile = (grid: number[][]) => {
  const newGrid = grid.map((row) => [...row]);
  const cell = getRandomEmptyCell(newGrid);
  if (cell) {
    newGrid[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

const combineRow = (row: number[]) => {
  let newRow = row.filter((val) => val !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter((val) => val !== 0);
  while (newRow.length < GRID_SIZE) {
    newRow.push(0);
  }
  return newRow;
};

export const Game2048 = () => {
  const [grid, setGrid] = useState<number[][]>(generateEmptyGrid);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let newGrid = generateEmptyGrid();
    newGrid = addNewTile(newGrid);
    newGrid = addNewTile(newGrid);
    setGrid(newGrid);
  }, []);

  const handleMove = (direction: string) => {
    let rotated = grid.map((row) => [...row]);

    const rotateGrid = (g: number[][]) => {
      const newGrid = generateEmptyGrid();
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          newGrid[i][j] = g[j][GRID_SIZE - 1 - i];
        }
      }
      return newGrid;
    };

    let moved = false;
    let totalScore = 0;

    const moveLeft = (g: number[][]) => {
      const newGrid = g.map((row) => {
        const newRow = combineRow(row);
        const gained = row.reduce((acc, v, idx) => {
          if (newRow[idx] !== v) acc += newRow[idx];
          return acc;
        }, 0);
        totalScore += gained;
        if (JSON.stringify(newRow) !== JSON.stringify(row)) moved = true;
        return newRow;
      });
      return newGrid;
    };

    if (direction === "left") {
      rotated = moveLeft(rotated);
    } else if (direction === "right") {
      rotated = rotated.map((row) => row.reverse());
      rotated = moveLeft(rotated);
      rotated = rotated.map((row) => row.reverse());
    } else if (direction === "up") {
      rotated = rotateGrid(rotated);
      rotated = moveLeft(rotated);
      rotated = rotateGrid(rotateGrid(rotateGrid(rotated)));
    } else if (direction === "down") {
      rotated = rotateGrid(rotated);
      rotated = rotated.map((row) => row.reverse());
      rotated = moveLeft(rotated);
      rotated = rotated.map((row) => row.reverse());
      rotated = rotateGrid(rotateGrid(rotateGrid(rotated)));
    }

    if (moved) {
      rotated = addNewTile(rotated);
      setGrid(rotated);
      setScore((prev) => prev + totalScore);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handleMove("left");
    if (e.key === "ArrowRight") handleMove("right");
    if (e.key === "ArrowUp") handleMove("up");
    if (e.key === "ArrowDown") handleMove("down");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">2048</h1>
      <div className="mb-4 text-xl font-semibold">Score: {score}</div>
      <div className="grid gap-2">
        {grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={j}
                className="w-16 h-16 flex items-center justify-center border bg-gray-200 text-xl font-bold"
                style={{
                  backgroundColor: cell ? "#f2b179" : "#cdc1b4",
                }}
              >
                {cell !== 0 ? cell : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Use Arrow Keys to play
      </p>
    </div>
  );
};
