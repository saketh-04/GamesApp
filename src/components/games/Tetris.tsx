import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ROWS = 20;
const COLS = 10;
const EMPTY_ROW = Array(COLS).fill(0);

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

type Piece = {
  shape: number[][];
  x: number;
  y: number;
};

function getRandomShape(): Piece {
  const keys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
  const shape = SHAPES[keys[Math.floor(Math.random() * keys.length)]];
  return { shape, x: Math.floor(COLS / 2) - 1, y: 0 };
}

export const Tetris = () => {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => [...EMPTY_ROW])
  );
  const [piece, setPiece] = useState<Piece>(getRandomShape());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const dropInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") movePiece(-1);
      if (e.key === "ArrowRight") movePiece(1);
      if (e.key === "ArrowDown") moveDown();
      if (e.key === "ArrowUp") rotatePiece();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [piece, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    dropInterval.current = setInterval(moveDown, 500);
    return () => clearInterval(dropInterval.current!);
  }, [piece, board, gameOver]);

  const checkCollision = (p: Piece, brd: number[][] = board) => {
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x]) {
          const newY = p.y + y;
          const newX = p.x + x;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && brd[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = (p: Piece, brd: number[][]) => {
    const newBoard = brd.map(row => [...row]);
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x]) {
          newBoard[p.y + y][p.x + x] = 1;
        }
      }
    }
    return newBoard;
  };

  const clearLines = (brd: number[][]) => {
    let linesCleared = 0;
    const newBoard = brd.filter(row => {
      if (row.every(cell => cell === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (newBoard.length < ROWS) {
      newBoard.unshift([...EMPTY_ROW]);
    }
    setScore(score + linesCleared * 100);
    return newBoard;
  };

  const moveDown = () => {
    const newPiece = { ...piece, y: piece.y + 1 };
    if (checkCollision(newPiece)) {
      const newBoard = mergePiece(piece, board);
      const cleared = clearLines(newBoard);
      setBoard(cleared);
      const nextPiece = getRandomShape();
      if (checkCollision(nextPiece, cleared)) {
        setGameOver(true);
      } else {
        setPiece(nextPiece);
      }
    } else {
      setPiece(newPiece);
    }
  };

  const movePiece = (dir: number) => {
    const newPiece = { ...piece, x: piece.x + dir };
    if (!checkCollision(newPiece)) setPiece(newPiece);
  };

  const rotatePiece = () => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    const newPiece = { ...piece, shape: rotated };
    if (!checkCollision(newPiece)) setPiece(newPiece);
  };

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => [...EMPTY_ROW]));
    setPiece(getRandomShape());
    setScore(0);
    setGameOver(false);
  };

  const displayBoard = () => {
    const tempBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) =>
      row.forEach((val, x) => {
        if (val && piece.y + y >= 0) {
          tempBoard[piece.y + y][piece.x + x] = 1;
        }
      })
    );
    return tempBoard;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">Tetris</h1>

      <p className="mb-2">Score: {score}</p>
      {gameOver && <p className="text-red-500 font-bold mb-2">Game Over!</p>}

      <Card className="p-1">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 20px)`,
            gridTemplateRows: `repeat(${ROWS}, 20px)`,
          }}
        >
          {displayBoard().flat().map((cell, i) => (
            <div
              key={i}
              className={`w-5 h-5 ${
                cell ? "bg-blue-500" : "bg-gray-200"
              } border border-gray-300`}
            />
          ))}
        </div>
      </Card>

      <Button className="mt-4" onClick={resetGame}>
        New Game
      </Button>
    </div>
  );
};
