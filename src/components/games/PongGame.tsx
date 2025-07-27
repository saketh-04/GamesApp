import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);

  const width = 600;
  const height = 400;
  const paddleHeight = 80;
  const paddleWidth = 10;
  const ballSize = 10;

  const paddleSpeed = 6;
  const ballSpeed = 4;

  let playerY = height / 2 - paddleHeight / 2;
  let aiY = height / 2 - paddleHeight / 2;
  let ballX = width / 2;
  let ballY = height / 2;
  let ballVX = ballSpeed;
  let ballVY = ballSpeed;

  const keys: Record<string, boolean> = {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = () => {
      if (!ctx) return;

      // Player movement
      if (keys["ArrowUp"] && playerY > 0) playerY -= paddleSpeed;
      if (keys["ArrowDown"] && playerY < height - paddleHeight) playerY += paddleSpeed;

      // AI movement
      if (ballY < aiY + paddleHeight / 2) aiY -= paddleSpeed * 0.6;
      else if (ballY > aiY + paddleHeight / 2) aiY += paddleSpeed * 0.6;

      // Ball movement
      ballX += ballVX;
      ballY += ballVY;

      // Wall collision
      if (ballY <= 0 || ballY + ballSize >= height) {
        ballVY = -ballVY;
      }

      // Paddle collisions
      if (
        ballX <= paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
      ) {
        ballVX = -ballVX;
      }
      if (
        ballX + ballSize >= width - paddleWidth &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
      ) {
        ballVX = -ballVX;
      }

      // Scoring
      if (ballX <= 0) {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        resetBall();
      }
      if (ballX + ballSize >= width) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        resetBall();
      }

      // Game over
      if (score.player >= 5 || score.ai >= 5) {
        setGameOver(true);
        return;
      }

      // Draw
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.fillRect(0, playerY, paddleWidth, paddleHeight); // Player
      ctx.fillRect(width - paddleWidth, aiY, paddleWidth, paddleHeight); // AI
      ctx.fillRect(ballX, ballY, ballSize, ballSize); // Ball

      ctx.font = "20px Arial";
      ctx.fillText(`${score.player} : ${score.ai}`, width / 2 - 20, 20);

      requestAnimationFrame(loop);
    };

    const resetBall = () => {
      ballX = width / 2;
      ballY = height / 2;
      ballVX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
      ballVY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    };

    resetBall();
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [score]);

  const restartGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Pong</h1>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-500 mb-4"
      />
      {gameOver && (
        <p className="text-red-500 font-bold mb-2">
          Game Over! {score.player > score.ai ? "You Win!" : "AI Wins!"}
        </p>
      )}
      <Button onClick={restartGame}>Restart</Button>
    </div>
  );
};
