import { useState } from "react";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { games } from "@/data/games";
import { Search, Gamepad2, Trophy, Users, Zap } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Games", icon: Gamepad2, count: games.length },
    { id: "puzzle", label: "Puzzle", icon: Trophy, count: games.filter(g => g.category === "puzzle").length },
    { id: "arcade", label: "Arcade", icon: Zap, count: games.filter(g => g.category === "arcade").length },
    { id: "card", label: "Card", icon: Users, count: games.filter(g => g.category === "card").length },
    { id: "brain", label: "Brain", icon: Trophy, count: games.filter(g => g.category === "brain").length }
  ];

  const difficulties = ["all", "easy", "medium", "hard"];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold mb-6 glow-text bg-gradient-gaming bg-clip-text text-transparent">
            CYBER ARCADE
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the ultimate gaming portal with 25+ incredible games. 
            From classic puzzles to modern arcade challenges!
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{games.length}+</div>
              <div className="text-sm text-muted-foreground">Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">4</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">Free</div>
              <div className="text-sm text-muted-foreground">To Play</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="cyber-border p-6 mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "neon-button" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label} ({category.count})
                </Button>
              );
            })}
          </div>

          {/* Difficulty Filters */}
          <div className="flex gap-2">
            {difficulties.map(difficulty => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedDifficulty === difficulty ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty === "all" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">No games found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;