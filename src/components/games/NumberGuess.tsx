import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, RotateCcw, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const NumberGuess = () => {
  const navigate = useNavigate();
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState("I'm thinking of a number between 1 and 100...");
  const [guessHistory, setGuessHistory] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number>(
    localStorage.getItem("numberGuessBestScore") ? parseInt(localStorage.getItem("numberGuessBestScore")!) : Infinity
  );

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      toast.error("Please enter a number between 1 and 100");
      return;
    }

    if (guessHistory.includes(guessNum)) {
      toast.error("You already guessed that number!");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory(prev => [...prev, guessNum]);
    setGuess("");

    if (guessNum === targetNumber) {
      setWon(true);
      setGameOver(true);
      setHint(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`);
      if (newAttempts < bestScore) {
        setBestScore(newAttempts);
        localStorage.setItem("numberGuessBestScore", newAttempts.toString());
        toast.success(`New best score: ${newAttempts} attempts! 🏆`);
      } else {
        toast.success(`You won in ${newAttempts} attempts! 🎉`);
      }
    } else if (guessNum < targetNumber) {
      setHint(`📈 ${guessNum} is too low! Try higher...`);
      toast.info("Too low! Try higher");
    } else {
      setHint(`📉 ${guessNum} is too high! Try lower...`);
      toast.info("Too high! Try lower");
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setGameOver(false);
    setWon(false);
    setHint("I'm thinking of a number between 1 and 100...");
    setGuessHistory([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !gameOver) {
      handleGuess();
    }
  };

  const getDifficultyRating = (attempts: number) => {
    if (attempts <= 5) return { text: "🏆 Incredible!", color: "text-neon-green" };
    if (attempts <= 7) return { text: "🎯 Excellent!", color: "text-primary" };
    if (attempts <= 10) return { text: "👍 Good!", color: "text-secondary" };
    if (attempts <= 15) return { text: "😊 Not bad!", color: "text-accent" };
    return { text: "😅 Keep trying!", color: "text-muted-foreground" };
  };

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
          <h1 className="text-3xl font-bold glow-text">Number Guess</h1>
          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="game-card text-center p-4">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{attempts}</div>
            <div className="text-sm text-muted-foreground">Attempts</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-neon-green">
              {bestScore === Infinity ? "--" : bestScore}
            </div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">{guessHistory.length}</div>
            <div className="text-sm text-muted-foreground">Unique Guesses</div>
          </Card>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <Badge className={`text-lg p-2 ${
            gameOver 
              ? won 
                ? "bg-primary text-primary-foreground" 
                : "bg-destructive text-destructive-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}>
            {hint}
          </Badge>
        </div>

        {/* Game Area */}
        <Card className="game-card mb-8">
          <div className="p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <div className="mb-6">
              <div className="flex gap-2 max-w-xs mx-auto">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your guess..."
                  disabled={gameOver}
                  className="text-center text-lg"
                />
                <Button 
                  onClick={handleGuess} 
                  disabled={gameOver || !guess}
                  className="neon-button"
                >
                  Guess
                </Button>
              </div>
            </div>

            {won && (
              <div className="mb-4">
                <div className={`text-xl font-bold ${getDifficultyRating(attempts).color}`}>
                  {getDifficultyRating(attempts).text}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Guess History */}
        {guessHistory.length > 0 && (
          <Card className="game-card mb-8">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Previous Guesses</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {guessHistory.map((prevGuess, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className={`${
                      prevGuess < targetNumber 
                        ? "border-red-500 text-red-400" 
                        : "border-blue-500 text-blue-400"
                    }`}
                  >
                    {prevGuess} {prevGuess < targetNumber ? "↑" : "↓"}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Range Helper */}
        <Card className="game-card mb-8">
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Current Range</h3>
            <div className="text-sm text-muted-foreground mb-2">
              Based on your guesses, the number is between:
            </div>
            <div className="text-xl font-bold text-primary">
              {Math.max(1, ...guessHistory.filter(g => g < targetNumber)) + 1 || 1} - {Math.min(100, ...guessHistory.filter(g => g > targetNumber)) - 1 || 100}
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={resetGame} className="neon-button">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};