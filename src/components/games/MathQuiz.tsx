import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Timer, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Operation = "+" | "-" | "*" | "/";

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

export const MathQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState<number>(
    localStorage.getItem("mathQuizBestScore") ? parseInt(localStorage.getItem("mathQuizBestScore")!) : 0
  );

  const operations: Operation[] = ["+", "-", "*"];

  const generateQuestion = (): Question => {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1: number, num2: number, answer: number;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 10;
        num2 = 5;
        answer = 2;
    }

    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      let wrongAnswer;
      if (operation === "*") {
        wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
      } else {
        wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
      }
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    return {
      num1,
      num2,
      operation,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    };
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    setCurrentQuestion(generateQuestion());
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameStarted(false);
    setGameOver(false);
    setCurrentQuestion(null);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentQuestion || gameOver) return;

    if (selectedAnswer === currentQuestion.answer) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast.success(`Correct! +${points} points! 🎉`);
    } else {
      setStreak(0);
      toast.error(`Wrong! The answer was ${currentQuestion.answer}`);
    }

    setCurrentQuestion(generateQuestion());
  };

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
        localStorage.setItem("mathQuizBestScore", score.toString());
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
          <h1 className="text-3xl font-bold glow-text">Math Quiz</h1>
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
              🧮 Solve as many problems as you can!
            </Badge>
          ) : (
            <Badge className="text-lg p-2 bg-secondary text-secondary-foreground">
              🎯 Test your math skills! You have 30 seconds!
            </Badge>
          )}
        </div>

        {/* Question */}
        {currentQuestion && gameStarted && (
          <Card className="game-card mb-8">
            <div className="text-center p-8">
              <div className="text-4xl font-bold mb-6 glow-text">
                {currentQuestion.num1} {currentQuestion.operation} {currentQuestion.num2} = ?
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="text-xl py-6 neon-button"
                    disabled={gameOver}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!gameStarted && !gameOver && (
            <Button onClick={startGame} className="neon-button">
              Start Quiz
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