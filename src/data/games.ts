import { Game } from "@/components/GameCard";

export const games: Game[] = [
  // Puzzle Games
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic 3x3 grid game. Get three in a row to win!",
    category: "puzzle",
    difficulty: "easy",
    players: "multi",
    icon: "❌",
    color: "neon-green"
  },
  {
    id: "2048",
    title: "2048",
    description: "Combine tiles to reach the magic number 2048!",
    category: "puzzle", 
    difficulty: "medium",
    players: "single",
    icon: "🔢",
    color: "cyber-blue"
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Fill the 9x9 grid with numbers 1-9 without repeating.",
    category: "puzzle",
    difficulty: "hard",
    players: "single", 
    icon: "🧩",
    color: "electric-purple"
  },
  {
    id: "memory-game",
    title: "Memory Match",
    description: "Find matching pairs by flipping cards. Test your memory!",
    category: "puzzle",
    difficulty: "easy",
    players: "single",
    icon: "🃏",
    color: "neon-pink"
  },
  {
    id: "puzzle-slider",
    title: "Sliding Puzzle", 
    description: "Rearrange tiles to complete the picture.",
    category: "puzzle",
    difficulty: "medium",
    players: "single",
    icon: "🖼️",
    color: "neon-orange"
  },
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Drop checkers to get four in a row vertically, horizontally, or diagonally.",
    category: "puzzle",
    difficulty: "medium", 
    players: "multi",
    icon: "🔴",
    color: "neon-green"
  },

  // Arcade Games
  {
    id: "snake",
    title: "Snake Game",
    description: "Guide the snake to eat food and grow longer without hitting walls!",
    category: "arcade",
    difficulty: "medium",
    players: "single",
    icon: "🐍",
    color: "neon-green"
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "Arrange falling blocks to clear lines and score points!",
    category: "arcade",
    difficulty: "hard",
    players: "single",
    icon: "🧱",
    color: "electric-purple"
  },
  {
    id: "pong",
    title: "Pong",
    description: "Classic paddle game. Hit the ball past your opponent!",
    category: "arcade",
    difficulty: "easy",
    players: "multi",
    icon: "🏓",
    color: "cyber-blue"
  },
  {
    id: "breakout",
    title: "Breakout",
    description: "Break all the bricks with your bouncing ball!",
    category: "arcade",
    difficulty: "medium",
    players: "single",
    icon: "🧱",
    color: "neon-orange"
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    description: "Navigate through pipes by tapping to keep the bird flying!",
    category: "arcade",
    difficulty: "hard",
    players: "single",
    icon: "🐦",
    color: "neon-pink"
  },
  {
    id: "space-invaders",
    title: "Space Invaders",
    description: "Defend Earth from alien invaders!",
    category: "arcade",
    difficulty: "medium",
    players: "single",
    icon: "👾",
    color: "electric-purple"
  },
  {
    id: "maze-runner",
    title: "Maze Runner",
    description: "Find your way through the maze to reach the exit!",
    category: "arcade",
    difficulty: "medium",
    players: "single",
    icon: "🌀",
    color: "cyber-blue"
  },

  // Card Games
  {
    id: "blackjack",
    title: "Blackjack",
    description: "Get as close to 21 as possible without going over!",
    category: "card",
    difficulty: "medium",
    players: "single",
    icon: "🂡",
    color: "neon-green"
  },
  {
    id: "solitaire",
    title: "Solitaire",
    description: "Classic card game. Build four foundation piles from Ace to King!",
    category: "card",
    difficulty: "easy",
    players: "single",
    icon: "♠️",
    color: "neon-orange"
  },
  {
    id: "poker",
    title: "Video Poker",
    description: "Make the best poker hand possible!",
    category: "card",
    difficulty: "medium",
    players: "single",
    icon: "🃏",
    color: "electric-purple"
  },
  {
    id: "war",
    title: "War",
    description: "Simple card game where highest card wins!",
    category: "card",
    difficulty: "easy",
    players: "single",
    icon: "⚔️",
    color: "neon-pink"
  },

  // Brain Games
  {
    id: "simon-says",
    title: "Simon Says", 
    description: "Remember and repeat the color sequence!",
    category: "brain",
    difficulty: "medium",
    players: "single",
    icon: "🎵",
    color: "cyber-blue"
  },
  {
    id: "math-quiz",
    title: "Math Quiz",
    description: "Solve math problems as fast as you can!",
    category: "brain",
    difficulty: "easy",
    players: "single",
    icon: "🧮",
    color: "neon-green"
  },
  {
    id: "word-guess",
    title: "Word Guess", 
    description: "Guess the hidden word letter by letter!",
    category: "brain",
    difficulty: "medium",
    players: "single",
    icon: "🔤",
    color: "neon-orange"
  },
  {
    id: "trivia",
    title: "Trivia Challenge",
    description: "Test your knowledge with fun trivia questions!",
    category: "brain",
    difficulty: "medium",
    players: "single",
    icon: "🧠",
    color: "electric-purple"
  },
  {
    id: "color-match",
    title: "Color Match",
    description: "Match colors as quickly as possible!",
    category: "brain",
    difficulty: "easy",
    players: "single",
    icon: "🎨",
    color: "neon-pink"
  },
  {
    id: "reaction-time",
    title: "Reaction Test",
    description: "Test how fast your reflexes are!",
    category: "brain",
    difficulty: "easy",
    players: "single",
    icon: "⚡",
    color: "cyber-blue"
  },
  {
    id: "number-sequence",
    title: "Number Sequence",
    description: "Remember and repeat number sequences!",
    category: "brain",
    difficulty: "hard",
    players: "single",
    icon: "🔢",
    color: "neon-green"
  },
  {
    id: "pattern-match",
    title: "Pattern Match",
    description: "Identify and complete visual patterns!",
    category: "brain",
    difficulty: "medium",
    players: "single",
    icon: "🔶",
    color: "neon-orange"
  }
];