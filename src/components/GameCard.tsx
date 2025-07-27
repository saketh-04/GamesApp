import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Game {
  id: string;
  title: string;
  description: string;
  category: "puzzle" | "arcade" | "card" | "brain";
  difficulty: "easy" | "medium" | "hard";
  players: "single" | "multi";
  icon: string;
  color: string;
}

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const categoryColors = {
    puzzle: "bg-neon-green",
    arcade: "bg-electric-purple", 
    card: "bg-neon-orange",
    brain: "bg-cyber-blue"
  };

  const difficultyColors = {
    easy: "bg-neon-green",
    medium: "bg-neon-orange", 
    hard: "bg-destructive"
  };

  return (
    <div className="game-card group cursor-pointer" onClick={() => navigate(`/game/${game.id}`)}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{game.icon}</div>
        <div className="flex gap-2">
          <Badge className={`${categoryColors[game.category]} text-black`}>
            {game.category}
          </Badge>
          <Badge className={`${difficultyColors[game.difficulty]} text-black`}>
            {game.difficulty}
          </Badge>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 glow-text">{game.title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">{game.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {game.players === "multi" ? (
            <><Users className="w-4 h-4" /> Multiplayer</>
          ) : (
            <><Trophy className="w-4 h-4" /> Single Player</>
          )}
        </div>
        
        <Button size="sm" className="neon-button group-hover:scale-110 transition-transform">
          <Play className="w-4 h-4 mr-2" />
          Play
        </Button>
      </div>
    </div>
  );
};