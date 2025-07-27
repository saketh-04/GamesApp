import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(
    localStorage.getItem("memoryGameBestTime") ? parseInt(localStorage.getItem("memoryGameBestTime")!) : null
  );

  const emojis = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setFlippedCards([]);
          checkGameWon();
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards]);

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (!gameStarted) setGameStarted(true);
    
    if (
      cards[index].isFlipped || 
      cards[index].isMatched || 
      flippedCards.length === 2
    ) return;

    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const checkGameWon = () => {
    setTimeout(() => {
      setCards(prev => {
        const allMatched = prev.every(card => card.isMatched);
        if (allMatched) {
          setGameWon(true);
          setGameStarted(false);
          if (!bestTime || time < bestTime) {
            setBestTime(time);
            localStorage.setItem("memoryGameBestTime", time.toString());
            toast.success(`New best time: ${formatTime(time)}! 🏆`);
          } else {
            toast.success(`Congratulations! Game completed in ${formatTime(time)}! 🎉`);
          }
        }
        return prev;
      });
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <h1 className="text-3xl font-bold glow-text">Memory Match</h1>
          <div className="w-32" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-primary">{moves}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </Card>
          <Card className="game-card text-center p-4">
            <Timer className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">
              {cards.filter(card => card.isMatched).length / 2}
            </div>
            <div className="text-sm text-muted-foreground">Pairs Found</div>
          </Card>
          <Card className="game-card text-center p-4">
            <div className="text-2xl font-bold text-neon-green">
              {bestTime ? formatTime(bestTime) : "--:--"}
            </div>
            <div className="text-sm text-muted-foreground">Best Time</div>
          </Card>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          {gameWon ? (
            <Badge className="text-lg p-2 bg-primary text-primary-foreground">
              🎉 Congratulations! All pairs found!
            </Badge>
          ) : gameStarted ? (
            <Badge className="text-lg p-2 bg-accent text-accent-foreground">
              🧠 Find all matching pairs!
            </Badge>
          ) : (
            <Badge className="text-lg p-2 bg-secondary text-secondary-foreground">
              Click any card to start!
            </Badge>
          )}
        </div>

        {/* Game Board */}
        <Card className="game-card mb-8">
          <div className="grid grid-cols-4 gap-3 p-6">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-lg flex items-center justify-center text-4xl font-bold transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-muted hover:bg-muted/80 hover:scale-105"
                } cyber-border`}
                disabled={card.isFlipped || card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "❓"}
              </button>
            ))}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center">
          <Button onClick={initializeGame} className="neon-button">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};