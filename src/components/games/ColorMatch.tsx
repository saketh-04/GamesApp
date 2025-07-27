import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Timer, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ColorChallenge {
  textColor: string;
  backgroundColor: string;
  word: string;
  isCorrect: boolean;
}

export const ColorMatch = () => {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState<ColorChallenge | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState<number>(
    localStorage.getItem("colorMatchBestScore") ? parseInt(localStorage.getItem("colorMatchBestScore")!) : 0
  );

  const colors = [
    { name: "RED", hex: "#ef4444", textColor: "text-red-500" },
    { name: "BLUE", hex: "#3b82f6", textColor: "text-blue-500" },
    { name: "GREEN", hex: "#22c55e", textColor: "text-green-500" },
    { name: "YELLOW", hex: "#eab308", textColor: "text-yellow-500" },
    { name: "PURPLE", hex: "#a855f7", textColor: "text-purple-500" },
    { name: "ORANGE", hex: "#f97316", textColor: "text-orange-500" },
    { name: "PINK", hex: "#ec4899", textColor: "text-pink-500" },
    { name: "CYAN", hex: "#06b6d4", textColor: "text-cyan-500" }
  ];

  const generateChallenge = (): ColorChallenge => {
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    const isCorrect = Math.random() > 0.5;
    
    return {
      textColor: isCorrect ? wordColor.textColor : displayColor.textColor,
      backgroundColor: displayColor.hex,
      word: wordColor.name,
      isCorrect: isCorrect ? wordColor.name === displayColor.name : wordColor.name !== displayColor.name
    };
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameOver(false);
    setCurrentChallenge(generateChallenge());
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameOver(false);
    setCurrentChallenge(null);
  };

  const handleAnswer = (answer: boolean) => {
    if (!currentChallenge || gameOver) return;

    if (answer === currentChallenge.isCorrect) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast.success(`Correct! +${points} points! 🎉`);
    } else {
      setStreak(0);
      toast.error("Wrong answer! 😅");
    }

    setCurrentChallenge(generateChallenge());
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;
    
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      handleAnswer(true);
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      handleAnswer(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, currentChallenge]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameOver(true);
      setGameStarted(false);
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("colorMatchBestScore", score.toString());
        toast.success(`New best score: ${score}! 🏆`);
      } else {
        toast.error(`Time's up! Final score: ${score}`);
      }
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, timeLeft, score, bestScore]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
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
          <h1 className="text-3xl font-bold glow-text">Color Match</h1>
          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </Card>
          <Card className="game-card text-center p-4">
            <Timer className="w-6 h-6 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold text-destructive">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-neon-green">{streak}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">{bestScore}</div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </Card>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          {gameOver ? (
            <Badge className="text-lg p-2 bg-destructive text-destructive-foreground">
              ⏰ Time's up! Final score: {score}
            </Badge>
          ) : gameStarted ? (
            <Badge className="text-lg p-2 bg-primary text-primary-foreground">
              🎨 Does the word match the color? Be quick!
            </Badge>
          ) : (
            <Badge className="text-lg p-2 bg-secondary text-secondary-foreground">
              🌈 Test your color perception! Answer as fast as you can!
            </Badge>
          )}
        </div>

        {/* Instructions */}
        {!gameStarted && (
          <Card className="game-card mb-8">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-4">How to Play</h3>
              <div className="text-left space-y-2 max-w-md mx-auto">
                <p>• A color word will appear on screen</p>
                <p>• Click "MATCH" if the word matches its text color</p>
                <p>• Click "NO MATCH" if they don't match</p>
                <p>• Use keyboard: ← (A) for MATCH, → (D) for NO MATCH</p>
                <p>• Be fast! You get bonus points for streaks</p>
              </div>
            </div>
          </Card>
        )}

        {/* Game Challenge */}
        {currentChallenge && gameStarted && (
          <Card className="game-card mb-8">
            <div 
              className="p-16 text-center rounded-lg"
              style={{ backgroundColor: currentChallenge.backgroundColor }}
            >
              <div className={`text-6xl font-bold ${currentChallenge.textColor} mb-8`}>
                {currentChallenge.word}
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="text-xl py-6 px-8 bg-green-600 hover:bg-green-500 text-white"
                  disabled={gameOver}
                >
                  MATCH
                  <div className="text-sm mt-1">(← or A)</div>
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  className="text-xl py-6 px-8 bg-red-600 hover:bg-red-500 text-white"
                  disabled={gameOver}
                >
                  NO MATCH
                  <div className="text-sm mt-1">(→ or D)</div>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!gameStarted && !gameOver && (
            <Button onClick={startGame} className="neon-button">
              Start Challenge
            </Button>
          )}
          {gameOver && (
            <Button onClick={startGame} className="neon-button">
              Play Again
            </Button>
          )}
          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};