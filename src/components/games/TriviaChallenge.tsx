import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correct: string;
};

const quiz: Question[] = [
  {
    question: "Which language is used with React for styling?",
    options: ["HTML", "CSS", "Python", "C++"],
    correct: "CSS",
  },
  {
    question: "Which company developed React?",
    options: ["Google", "Facebook", "Microsoft", "Twitter"],
    correct: "Facebook",
  },
  {
    question: "What hook is used to manage state in functional components?",
    options: ["useEffect", "useContext", "useState", "useReducer"],
    correct: "useState",
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["<!-- -->", "//", "/* */", "#"],
    correct: "//",
  },
];

export const TriviaChallenge = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [finished, setFinished] = useState(false);

  const currentQuestion = quiz[index];

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === currentQuestion.correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (index + 1 < quiz.length) {
        setIndex(index + 1);
        setSelected("");
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setSelected("");
    setFinished(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Trivia Challenge</h1>

      {!finished ? (
        <>
          <p className="text-lg mb-4">
            Question {index + 1} of {quiz.length}
          </p>
          <p className="mb-4 font-semibold">{currentQuestion.question}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-4 py-2 rounded border ${
                  selected === option
                    ? option === currentQuestion.correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                disabled={!!selected}
              >
                {option}
              </button>
            ))}
          </div>

          <p className="mb-4">Score: {score}</p>
        </>
      ) : (
        <>
          <p className="text-xl mb-4">🎉 Final Score: {score}/{quiz.length}</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
};
