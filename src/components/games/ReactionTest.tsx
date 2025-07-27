import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type GameState = "waiting" | "ready" | "go" | "clicked" | "too-early";

export const ReactionTest = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(
    localStorage.getItem("reactionTestBestTime") ? parseInt(localStorage.getItem("reactionTestBestTime")!) : null
  );
  const [allTimes, setAllTimes] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setGameState("ready");
    setReactionTime(null);
    
    // Random delay between 2-6 seconds
    const delay = Math.random() * 4000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("go");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      setGameState("too-early");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      toast.error("Too early! Wait for the signal!");
    } else if (gameState === "go") {
      // Correct click
      const endTime = Date.now();
      const reactionMs = endTime - startTimeRef.current;
      setReactionTime(reactionMs);
      setGameState("clicked");
      setRound(prev => prev + 1);
      
      const newTimes = [...allTimes, reactionMs];
      setAllTimes(newTimes);
      
      if (!bestTime || reactionMs < bestTime) {
        setBestTime(reactionMs);
        localStorage.setItem("reactionTestBestTime", reactionMs.toString());
        toast.success(`New best time: ${reactionMs}ms! ⚡`);
      } else {
        toast.success(`Reaction time: ${reactionMs}ms!`);
      }
    }
  };

  const resetGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    setRound(0);
    setAllTimes([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getAverageTime = () => {
    if (allTimes.length === 0) return null;
    return Math.round(allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length);
  };

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: "⚡ Superhuman!", color: "text-neon-green" };
    if (time < 250) return { text: "🏆 Excellent!", color: "text-primary" };
    if (time < 300) return { text: "👍 Good!", color: "text-secondary" };
    if (time < 350) return { text: "😊 Average", color: "text-accent" };
    return { text: "🐌 Keep practicing!", color: "text-muted-foreground" };
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getStateDisplay = () => {
    switch (gameState) {
      case "waiting":
        return {
          bg: "bg-muted",
          text: "Click START to begin",
          icon: "🎯",
          canClick: false
        };
      case "ready":
        return {
          bg: "bg-red-500",
          text: "Wait for it...",
          icon: "⏰",
          canClick: true
        };
      case "go":
        return {
          bg: "bg-green-500",
          text: "CLICK NOW!",
          icon: "⚡",
          canClick: true
        };
      case "clicked":
        return {
          bg: "bg-primary",
          text: `${reactionTime}ms`,
          icon: "🎉",
          canClick: false
        };
      case "too-early":
        return {
          bg: "bg-destructive",
          text: "Too early! Try again",
          icon: "❌",
          canClick: false
        };
    }
  };

  const stateDisplay = getStateDisplay();

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
          <h1 className="text-3xl font-bold glow-text">Reaction Test</h1>
          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="game-card text-center p-4">
            <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">
              {reactionTime ? `${reactionTime}ms` : "--"}
            </div>
            <div className="text-sm text-muted-foreground">Last Time</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-neon-green">
              {bestTime ? `${bestTime}ms` : "--"}
            </div>
            <div className="text-sm text-muted-foreground">Best Time</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">
              {getAverageTime() ? `${getAverageTime()}ms` : "--"}
            </div>
            <div className="text-sm text-muted-foreground">Average</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-accent">{round}</div>
            <div className="text-sm text-muted-foreground">Attempts</div>
          </Card>
        </div>

        {/* Rating */}
        {reactionTime && (
          <div className="text-center mb-8">
            <Badge className={`text-lg p-2 ${getReactionRating(reactionTime).color}`}>
              {getReactionRating(reactionTime).text}
            </Badge>
          </div>
        )}

        {/* Game Area */}
        <Card className="game-card mb-8">
          <button
            onClick={handleClick}
            disabled={!stateDisplay.canClick}
            className={`w-full h-96 ${stateDisplay.bg} rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 cursor-pointer disabled:cursor-default`}
          >
            <div className="text-center text-white">
              <div className="text-8xl mb-4">{stateDisplay.icon}</div>
              <div className="text-3xl font-bold">{stateDisplay.text}</div>
              {gameState === "ready" && (
                <div className="text-lg mt-4 opacity-80">
                  Don't click yet! Wait for green!
                </div>
              )}
              {gameState === "go" && (
                <div className="text-lg mt-4 opacity-80">
                  Click as fast as you can!
                </div>
              )}
            </div>
          </button>
        </Card>

        {/* Instructions */}
        <Card className="game-card mb-8">
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">How to Play</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>1. Click START to begin the test</p>
              <p>2. Wait for the RED screen (don't click yet!)</p>
              <p>3. When it turns GREEN, click as fast as possible</p>
              <p>4. Try to beat your best reaction time!</p>
            </div>
          </div>
        </Card>

        {/* Results History */}
        {allTimes.length > 0 && (
          <Card className="game-card mb-8">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Recent Times</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {allTimes.slice(-10).map((time, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className={time === bestTime ? "border-primary text-primary" : ""}
                  >
                    {time}ms {time === bestTime && "👑"}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {gameState === "waiting" || gameState === "clicked" || gameState === "too-early" ? (
            <Button onClick={startTest} className="neon-button">
              {gameState === "waiting" ? "Start Test" : "Try Again"}
            </Button>
          ) : null}
          
          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
};