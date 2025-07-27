import { useEffect, useState } from "react";

const colors = ["red", "green", "blue", "yellow"];

export const SimonSays = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [showing, setShowing] = useState(true);
  const [message, setMessage] = useState("");

  const startGame = () => {
    const newSeq = Array.from({ length: level }, () =>
      Math.floor(Math.random() * colors.length)
    );
    setSequence(newSeq);
    setUserSequence([]);
    setShowing(true);
    setMessage("");
    setTimeout(() => setShowing(false), level * 1000 + 500);
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleClick = (index: number) => {
    if (showing) return;

    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    // Check if correct so far
    if (sequence[newUserSeq.length - 1] !== index) {
      setMessage("❌ Wrong! Restarting...");
      setTimeout(() => {
        setLevel(1);
        startGame();
      }, 1500);
      return;
    }

    // If completed
    if (newUserSeq.length === sequence.length) {
      setMessage("✅ Correct! Next level...");
      setTimeout(() => {
        setLevel((prev) => prev + 1);
      }, 1500);
    }
  };

  const colorButton = (color: string, index: number) => {
    const isHighlight = showing && sequence.includes(index);
    return (
      <button
        key={color}
        onClick={() => handleClick(index)}
        className={`w-24 h-24 rounded-lg m-2 ${
          color === "red"
            ? "bg-red-500"
            : color === "green"
            ? "bg-green-500"
            : color === "blue"
            ? "bg-blue-500"
            : "bg-yellow-400"
        } ${isHighlight ? "opacity-100" : "opacity-60"} hover:opacity-90`}
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Simon Says</h1>
      <p className="mb-2">Level: {level}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {colors.map((c, i) => colorButton(c, i))}
      </div>
      <p className="text-lg">{message}</p>
      <button
        onClick={startGame}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Restart
      </button>
    </div>
  );
};
