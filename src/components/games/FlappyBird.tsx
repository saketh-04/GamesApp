import { useState, useEffect, useRef } from "react";

const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;

interface Pipe {
  x: number;
  height: number;
}

export const FlappyBird = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<number | null>(null);

  useEffect(() => {
    resetGame();
    window.addEventListener("keydown", handleJump);
    return () => {
      window.removeEventListener("keydown", handleJump);
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, []);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([{ x: GAME_WIDTH, height: Math.random() * 200 + 50 }]);
    setScore(0);
    setGameOver(false);
    if (gameRef.current) cancelAnimationFrame(gameRef.current);
    gameRef.current = requestAnimationFrame(gameLoop);
  };

  const handleJump = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      if (gameOver) {
        resetGame();
      } else {
        setVelocity(JUMP);
      }
    }
  };

  const gameLoop = () => {
    setBirdY((prev) => prev + velocity);
    setVelocity((prev) => prev + GRAVITY);

    setPipes((prev) => {
      let updated = prev.map((pipe) => ({ ...pipe, x: pipe.x - 3 }));
      if (updated[0].x + PIPE_WIDTH < 0) {
        updated.shift();
        updated.push({
          x: GAME_WIDTH,
          height: Math.random() * 200 + 50,
        });
        setScore((s) => s + 1);
      }
      return updated;
    });

    checkCollision();
    if (!gameOver) {
      gameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const checkCollision = () => {
    if (birdY > GAME_HEIGHT || birdY < 0) {
      setGameOver(true);
      return;
    }
    pipes.forEach((pipe) => {
      if (
        pipe.x < 80 &&
        pipe.x + PIPE_WIDTH > 20 &&
        (birdY < pipe.height || birdY > pipe.height + PIPE_GAP)
      ) {
        setGameOver(true);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Flappy Bird</h1>
      <div className="mb-2 text-lg">Score: {score}</div>
      {gameOver && (
        <div className="text-red-600 font-bold mb-2">Game Over! Press Space to restart.</div>
      )}
      <div
        className="relative bg-sky-200 overflow-hidden border"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Bird */}
        <div
          className="absolute bg-yellow-400 rounded-full"
          style={{
            width: 30,
            height: 30,
            left: 50,
            top: birdY,
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            <div
              className="absolute bg-green-600"
              style={{
                width: PIPE_WIDTH,
                height: pipe.height,
                left: pipe.x,
                top: 0,
              }}
            />
            <div
              className="absolute bg-green-600"
              style={{
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.height - PIPE_GAP,
                left: pipe.x,
                top: pipe.height + PIPE_GAP,
              }}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">Press SPACE to jump</p>
    </div>
  );
};
