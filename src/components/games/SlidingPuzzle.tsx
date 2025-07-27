import { useState, useEffect } from "react";

const GRID_SIZE = 3; // 3x3 puzzle

const generateInitialTiles = () => {
  const tiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
  do {
    tiles.sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles) || isSolved(tiles));
  return tiles;
};

const isSolvable = (tiles: number[]) => {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

const isSolved = (tiles: number[]) =>
  tiles.every((tile, index) => tile === index);

export const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setTiles(generateInitialTiles());
  }, []);

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - GRID_SIZE,
      emptyIndex + GRID_SIZE,
    ];

    if (validMoves.includes(index) && isAdjacent(emptyIndex, index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [
        newTiles[index],
        newTiles[emptyIndex],
      ];
      setTiles(newTiles);
      setMoves((m) => m + 1);
    }
  };

  const isAdjacent = (empty: number, target: number) => {
    const rowEmpty = Math.floor(empty / GRID_SIZE);
    const colEmpty = empty % GRID_SIZE;
    const rowTarget = Math.floor(target / GRID_SIZE);
    const colTarget = target % GRID_SIZE;
    return (
      (rowEmpty === rowTarget && Math.abs(colEmpty - colTarget) === 1) ||
      (colEmpty === colTarget && Math.abs(rowEmpty - rowTarget) === 1)
    );
  };

  const resetGame = () => {
    setTiles(generateInitialTiles());
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Sliding Puzzle</h1>
      <div className="mb-2 text-lg">Moves: {moves}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)` }}>
        {tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold border rounded 
              ${tile === 0 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {tile !== 0 ? tile : ""}
          </button>
        ))}
      </div>
      {isSolved(tiles) && (
        <div className="mt-4 text-green-600 font-semibold">
          🎉 Puzzle Solved in {moves} moves!
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Restart
      </button>
    </div>
  );
};
