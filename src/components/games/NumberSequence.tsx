import { useEffect, useState } from "react";

const generateSequence = (size: number) => {
  const nums = Array.from({ length: size }, (_, i) => i + 1);
  return nums.sort(() => Math.random() - 0.5);
};

export const NumberSequence = () => {
  const [numbers, setNumbers] = useState<number[]>(generateSequence(16));
  const [nextNumber, setNextNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const size = 16;

  const handleClick = (num: number) => {
    if (finished) return;

    if (num === nextNumber) {
      if (nextNumber === 1) setStartTime(Date.now());
      if (num === size) {
        setEndTime(Date.now());
        setFinished(true);
      }
      setNextNumber(num + 1);
    }
  };

  const resetGame = () => {
    setNumbers(generateSequence(size));
    setNextNumber(1);
    setStartTime(null);
    setEndTime(null);
    setFinished(false);
  };

  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  useEffect(() => {
    setNumbers(generateSequence(size));
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Number Sequence</h1>
      <p className="mb-2">Click numbers from 1 to {size} in order!</p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            className={`w-12 h-12 flex items-center justify-center rounded text-lg font-bold ${
              num < nextNumber ? "bg-green-400" : "bg-gray-200 hover:bg-gray-300"
            }`}
            disabled={num < nextNumber || finished}
          >
            {num}
          </button>
        ))}
      </div>

      {finished && (
        <p className="mb-4 text-lg">🎉 Finished! Time: {timeTaken} seconds</p>
      )}

      <button
        onClick={resetGame}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Restart
      </button>
    </div>
  );
};
