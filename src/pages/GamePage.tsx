import { useParams } from "react-router-dom";

import { TicTacToe } from "@/components/games/TicTacToe";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SnakeGame } from "@/components/games/SnakeGame";
import { Tetris } from "@/components/games/Tetris";
import { PongGame } from "@/components/games/PongGame";
import { MathQuiz } from "@/components/games/MathQuiz";
import { NumberGuess } from "@/components/games/NumberGuess";
import { ColorMatch } from "@/components/games/ColorMatch";
import { ReactionTest } from "@/components/games/ReactionTest";
import { SudokuGame } from "@/components/games/SudokuGame";
import { WordGuess } from "@/components/games/WordGuess";
import { TriviaChallenge } from "@/components/games/TriviaChallenge";
import { NumberSequence } from "@/components/games/NumberSequence";
import { PatternMatch } from "@/components/games/PatternMatch";
import { SlidingPuzzle } from "@/components/games/SlidingPuzzle";
import { ConnectFour } from "@/components/games/ConnectFour";
import { FlappyBird } from "@/components/games/FlappyBird";
import { SpaceInvaders } from "@/components/games/SpaceInvaders";
import { MazeRunner } from "@/components/games/MazeRunner";
import { Blackjack } from "@/components/games/Blackjack";
import { Solitaire } from "@/components/games/Solitaire";
import { VideoPoker } from "@/components/games/VideoPoker";

import NotFound from "./NotFound";

const GamePage = () => {
  const { gameId } = useParams();

  const gameComponents: { [key: string]: React.ComponentType } = {
    "tic-tac-toe": TicTacToe,
    "memory-game": MemoryGame,
    "snake": SnakeGame,
    "tetris": Tetris,
    "pong": PongGame,
    "math-quiz": MathQuiz,
    "number-guess": NumberGuess,
    "color-match": ColorMatch,
    "reaction-time": ReactionTest,
    "sudoku": SudokuGame,
    "word-guess": WordGuess,
    "trivia-challenge": TriviaChallenge,
    "number-sequence": NumberSequence,
    "pattern-match": PatternMatch,
    "sliding-puzzle": SlidingPuzzle,
    "connect-four": ConnectFour,
    "flappy-bird": FlappyBird,
    "space-invaders": SpaceInvaders,
    "maze-runner": MazeRunner,
    "blackjack": Blackjack,
    "solitaire": Solitaire,
    "video-poker": VideoPoker,
  };

  const GameComponent = gameId ? gameComponents[gameId] : null;

  if (!GameComponent) {
    return <NotFound />;
  }

  return <GameComponent />;
};

export default GamePage;
