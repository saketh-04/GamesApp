import { useState, useEffect } from "react";

const generatePattern = (length: number, max: number) => {
  const pattern: number[] = [];
  for (let i = 0; i < length; i++) {
    pattern.push(Math.floor(Math.random() * max));
  }
  return pattern;
};

export const PatternMatch = () => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [showing, setShowing] = useState(true);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState(1);

  const gridSize = 3;

  const startGame = () => {
    const newPattern = generatePattern(level + 2, gridSize * gridSize);
    setPattern(newPattern);
    setUserInput([]);
    setStep(0);
    setShowing(true);
    setMessage("");
    setTimeout(() => setShowing(false), (level + 2) * 1000);
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleClick = (index: number) => {
    if (showing) return;

    const newInput = [...userInput, index];
    setUserInput(newInput);

    if (pattern[newInput.length - 1] !== index) {
      setMessage("❌ Wrong! Restarting...");
      setTimeout(() => {
        setLevel(1);
        startGame();
      }, 1500);
      return;
    }

    if (newInput.length === pattern.length) {
      setMessage("✅ Correct! Next Level!");
      setTimeout(() => {
        setLevel((prev) => prev + 1);
      }, 1500);
    }
  };

  const renderGrid = () => {
    return Array.from({ length: gridSize * gridSize }).map((_, i) => {
      const highlight = showing && pattern.includes(i);
      return (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`w-20 h-20 m-1 rounded ${
            highlight ? "bg-yellow-400" : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Pattern Match</h1>
      <p className="mb-2">Level: {level}</p>
      <div className="grid grid-cols-3 gap-2">{renderGrid()}</div>
      <p className="mt-4 text-lg">{message}</p>
      <button
        onClick={startGame}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Restart
      </button>
    </div>
  );
};
