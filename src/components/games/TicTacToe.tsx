import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Player = "X" | "O" | null;

export const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Player[]) => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      toast.success(`Player ${gameWinner} wins! 🎉`);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      toast("It's a draw! 🤝");
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
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
          <h1 className="text-3xl font-bold glow-text">Tic Tac Toe</h1>
          <div className="w-32" />
        </div>

        {/* Score Board */}
        <Card className="game-card mb-8">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-primary">❌</div>
              <div className="text-sm text-muted-foreground">Player X</div>
              <div className="text-xl font-bold">{scores.X}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">🤝</div>
              <div className="text-sm text-muted-foreground">Draws</div>
              <div className="text-xl font-bold">{scores.draws}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">⭕</div>
              <div className="text-sm text-muted-foreground">Player O</div>
              <div className="text-xl font-bold">{scores.O}</div>
            </div>
          </div>
        </Card>

        {/* Game Status */}
        <div className="text-center mb-8">
          {gameOver ? (
            winner ? (
              <Badge className="text-lg p-2 bg-primary text-primary-foreground">
                🎉 Player {winner} Wins!
              </Badge>
            ) : (
              <Badge className="text-lg p-2 bg-secondary text-secondary-foreground">
                🤝 It's a Draw!
              </Badge>
            )
          ) : (
            <Badge className="text-lg p-2 bg-accent text-accent-foreground">
              Current Turn: {currentPlayer === "X" ? "❌" : "⭕"} Player {currentPlayer}
            </Badge>
          )}
        </div>

        {/* Game Board */}
        <Card className="game-card mb-8">
          <div className="grid grid-cols-3 gap-2 p-4">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className="aspect-square bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center text-4xl font-bold transition-all duration-200 hover:scale-105 cyber-border"
                disabled={gameOver || cell !== null}
              >
                {cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}
              </button>
            ))}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={resetGame} className="neon-button">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          <Button onClick={resetScores} variant="outline">
            Reset Scores
          </Button>
        </div>
      </div>
    </div>
  );
};