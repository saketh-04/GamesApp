import { useState, useEffect } from "react";

const SIZE = 10; // 10x10 grid
const CELL_SIZE = 40;
const WALL = 1;
const PATH = 0;
const PLAYER = 2;
const EXIT = 3;

const generateMaze = () => {
  const maze: number[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(WALL)
  );

  // Simple random DFS maze generation
  const carve = (x: number, y: number) => {
    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ].sort(() => Math.random() - 0.5);

    maze[y][x] = PATH;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        ny > 0 &&
        ny < SIZE - 1 &&
        nx > 0 &&
        nx < SIZE - 1 &&
        maze[ny][nx] === WALL
      ) {
        maze[y + dy / 2][x + dx / 2] = PATH;
        carve(nx, ny);
      }
    }
  };

  carve(1, 1);
  maze[1][1] = PLAYER; // Player start
  maze[SIZE - 2][SIZE - 2] = EXIT; // Exit

  return maze;
};

export const MazeRunner = () => {
  const [maze, setMaze] = useState<number[][]>(generateMaze);
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [won, setWon] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (won) return;
      let { x, y } = player;
      if (e.key === "ArrowUp") y--;
      else if (e.key === "ArrowDown") y++;
      else if (e.key === "ArrowLeft") x--;
      else if (e.key === "ArrowRight") x++;

      if (maze[y] && maze[y][x] !== WALL) {
        if (maze[y][x] === EXIT) {
          setWon(true);
        }
        setPlayer({ x, y });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, maze, won]);

  const resetGame = () => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayer({ x: 1, y: 1 });
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Maze Runner</h1>
      {won && (
        <div className="text-green-600 font-bold mb-2">
          🎉 You Escaped! Press R to restart.
        </div>
      )}
      <div
        className="grid bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            let color = "#333";
            if (x === player.x && y === player.y) color = "yellow";
            else if (cell === WALL) color = "#000";
            else if (cell === PATH) color = "#555";
            else if (cell === EXIT) color = "green";
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: color,
                }}
              />
            );
          })
        )}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Restart
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Use Arrow Keys to move. Reach the green exit!
      </p>
    </div>
  );
};
