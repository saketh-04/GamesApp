import { useEffect, useState, useRef } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const INVADER_WIDTH = 30;
const INVADER_HEIGHT = 20;

interface Bullet {
  x: number;
  y: number;
}

interface Invader {
  x: number;
  y: number;
}

export const SpaceInvaders = () => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<number | null>(null);

  useEffect(() => {
    initGame();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gameRef.current) cancelAnimationFrame(gameRef.current);
    };
  }, []);

  const initGame = () => {
    const inv = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        inv.push({ x: col * 40 + 20, y: row * 40 + 20 });
      }
    }
    setInvaders(inv);
    setBullets([]);
    setScore(0);
    setGameOver(false);
    if (gameRef.current) cancelAnimationFrame(gameRef.current);
    gameRef.current = requestAnimationFrame(gameLoop);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPlayerX((x) => Math.max(0, x - 20));
    } else if (e.key === "ArrowRight") {
      setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 20));
    } else if (e.key === " ") {
      setBullets((prev) => [...prev, { x: playerX + PLAYER_WIDTH / 2 - 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 10 }]);
    } else if (e.key === "Enter" && gameOver) {
      initGame();
    }
  };

  const gameLoop = () => {
    setBullets((prevBullets) =>
      prevBullets
        .map((b) => ({ ...b, y: b.y - 5 }))
        .filter((b) => b.y > 0)
    );

    setInvaders((prevInvaders) => {
      const updated = prevInvaders.map((inv) => ({ ...inv, y: inv.y + 0.2 }));
      updated.forEach((inv) => {
        if (inv.y + INVADER_HEIGHT >= GAME_HEIGHT - PLAYER_HEIGHT) {
          setGameOver(true);
        }
      });
      return updated;
    });

    // Collision detection
    setBullets((prevBullets) => {
      const newBullets: Bullet[] = [];
      const newInvaders: Invader[] = [];
      invaders.forEach((inv) => {
        let hit = false;
        prevBullets.forEach((b) => {
          if (
            b.x > inv.x &&
            b.x < inv.x + INVADER_WIDTH &&
            b.y > inv.y &&
            b.y < inv.y + INVADER_HEIGHT
          ) {
            hit = true;
            setScore((s) => s + 10);
          }
        });
        if (!hit) newInvaders.push(inv);
      });
      setInvaders(newInvaders);
      return newBullets;
    });

    if (!gameOver) {
      gameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Space Invaders</h1>
      <div className="mb-2 text-lg">Score: {score}</div>
      {gameOver && (
        <div className="text-red-600 font-bold mb-2">
          Game Over! Press ENTER to restart.
        </div>
      )}
      <div
        className="relative bg-black overflow-hidden border"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Player */}
        <div
          className="absolute bg-green-500"
          style={{
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            bottom: 10,
            left: playerX,
          }}
        />

        {/* Bullets */}
        {bullets.map((b, i) => (
          <div
            key={i}
            className="absolute bg-yellow-400"
            style={{
              width: 4,
              height: 10,
              left: b.x,
              top: b.y,
            }}
          />
        ))}

        {/* Invaders */}
        {invaders.map((inv, i) => (
          <div
            key={i}
            className="absolute bg-red-500"
            style={{
              width: INVADER_WIDTH,
              height: INVADER_HEIGHT,
              left: inv.x,
              top: inv.y,
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">Use ← → to move, SPACE to shoot</p>
    </div>
  );
};
