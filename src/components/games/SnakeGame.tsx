import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = "RIGHT";

export const SnakeGame = () => {
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(
    localStorage.getItem("snakeHighScore") ? parseInt(localStorage.getItem("snakeHighScore")!) : 0
  );
  const [speed, setSpeed] = useState(150);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setSpeed(150);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const pauseGame = () => {
    setGameStarted(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          e.preventDefault();
          gameStarted ? pauseGame() : startGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snakeHighScore", score.toString());
            toast.success(`New high score: ${score}! 🏆`);
          } else {
            toast.error(`Game Over! Score: ${score}`);
          }
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snakeHighScore", score.toString());
            toast.success(`New high score: ${score}! 🏆`);
          } else {
            toast.error(`Game Over! Score: ${score}`);
          }
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood());
          setSpeed(prev => Math.max(prev - 2, 80)); // Increase speed
          toast.success("+10 points! 🍎");
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, gameStarted, gameOver, food, generateFood, score, highScore, speed]);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0]?.x === x && snake[0]?.y === y;

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-4 h-4 ${
              isSnake
                ? isHead
                  ? "bg-primary border border-primary-foreground"
                  : "bg-primary/80"
                : isFood
                ? "bg-destructive animate-pulse"
                : "bg-muted/20"
            } ${isFood ? "rounded-full" : ""}`}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <h1 className="text-3xl font-bold glow-text">Snake Game</h1>
          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-neon-green">{highScore}</div>
            <div className="text-sm text-muted-foreground">High Score</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">{snake.length}</div>
            <div className="text-sm text-muted-foreground">Length</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-accent">{Math.max(151 - speed, 1)}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </Card>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          {gameOver ? (
            <Badge className="text-lg p-2 bg-destructive text-destructive-foreground">
              💀 Game Over! Press New Game to restart
            </Badge>
          ) : gameStarted ? (
            <Badge className="text-lg p-2 bg-primary text-primary-foreground">
              🐍 Use arrow keys to move • Space to pause
            </Badge>
          ) : (
            <Badge className="text-lg p-2 bg-secondary text-secondary-foreground">
              Press Play to start! 🎮
            </Badge>
          )}
        </div>

        {/* Game Board */}
        <Card className="game-card mb-8 flex justify-center">
          <div 
            className="grid gap-0 p-4 cyber-border"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: "fit-content"
            }}
          >
            {renderGrid()}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-4">
          {!gameStarted && !gameOver ? (
            <Button onClick={startGame} className="neon-button">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          ) : gameStarted ? (
            <Button onClick={pauseGame} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : null}
          
          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto md:hidden">
          <div></div>
          <Button 
            variant="outline" 
            onClick={() => direction !== "DOWN" && setDirection("UP")}
            disabled={!gameStarted || gameOver}
          >
            ↑
          </Button>
          <div></div>
          <Button 
            variant="outline" 
            onClick={() => direction !== "RIGHT" && setDirection("LEFT")}
            disabled={!gameStarted || gameOver}
          >
            ←
          </Button>
          <div></div>
          <Button 
            variant="outline" 
            onClick={() => direction !== "LEFT" && setDirection("RIGHT")}
            disabled={!gameStarted || gameOver}
          >
            →
          </Button>
          <div></div>
          <Button 
            variant="outline" 
            onClick={() => direction !== "UP" && setDirection("DOWN")}
            disabled={!gameStarted || gameOver}
          >
            ↓
          </Button>
          <div></div>
        </div>
      </div>
    </div>
  );
};