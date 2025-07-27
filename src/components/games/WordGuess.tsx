import { useState, useEffect } from "react";

const words = ["REACT", "JAVASCRIPT", "PROGRAMMING", "GITHUB", "SOLITAIRE", "POKER"];

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

export const WordGuess = () => {
  const [word, setWord] = useState<string>(getRandomWord());
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const maxWrong = 6;

  useEffect(() => {
    const isWinner = word.split("").every((letter) => guessed.includes(letter));
    if (isWinner) {
      setMessage("🎉 You Win!");
      setGameOver(true);
    } else if (wrongGuesses >= maxWrong) {
      setMessage(`💥 You Lost! Word was: ${word}`);
      setGameOver(true);
    }
  }, [guessed, wrongGuesses]);

  const handleGuess = (letter: string) => {
    if (gameOver || guessed.includes(letter)) return;
    if (word.includes(letter)) {
      setGuessed([...guessed, letter]);
    } else {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const resetGame = () => {
    setWord(getRandomWord());
    setGuessed([]);
    setWrongGuesses(0);
    setGameOver(false);
    setMessage("");
  };

  const renderWord = () => {
    return word
      .split("")
      .map((letter, i) => (guessed.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Word Guess</h1>
      <p className="text-lg mb-2">{renderWord()}</p>
      <p className="mb-2">Wrong guesses: {wrongGuesses}/{maxWrong}</p>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {letters.map((letter) => (
          <button
            key={letter}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={guessed.includes(letter) || gameOver}
            onClick={() => handleGuess(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {message && <p className="text-lg font-bold">{message}</p>}

      {gameOver && (
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Play Again
        </button>
      )}
    </div>
  );
};
