import { useState } from "react";

type Card = {
  value: number; // 2–14 (Jack=11, Queen=12, King=13, Ace=14)
  suit: string;
};

const suits = ["♠", "♥", "♦", "♣"];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (let v = 2; v <= 14; v++) {
    suits.forEach((s) => {
      deck.push({ value: v, suit: s });
    });
  }
  return deck.sort(() => Math.random() - 0.5);
};

const cardToString = (card: Card) => {
  const names: { [k: number]: string } = {
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
  };
  return `${names[card.value] || card.value}${card.suit}`;
};

export const War = () => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [computerCard, setComputerCard] = useState<Card | null>(null);
  const [message, setMessage] = useState("");

  const playRound = () => {
    if (deck.length < 2) {
      if (playerScore > computerScore) setMessage("🎉 You win the game!");
      else if (playerScore < computerScore) setMessage("💻 Computer wins!");
      else setMessage("🤝 It's a tie!");
      return;
    }

    const newDeck = [...deck];
    const pCard = newDeck.pop()!;
    const cCard = newDeck.pop()!;
    setPlayerCard(pCard);
    setComputerCard(cCard);

    if (pCard.value > cCard.value) {
      setPlayerScore((s) => s + 1);
      setMessage("You win this round!");
    } else if (pCard.value < cCard.value) {
      setComputerScore((s) => s + 1);
      setMessage("Computer wins this round!");
    } else {
      setMessage("War! It's a tie round.");
    }

    setDeck(newDeck);
  };

  const resetGame = () => {
    setDeck(createDeck());
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerCard(null);
    setComputerCard(null);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">War Card Game</h1>
      <p className="mb-2">Deck Remaining: {deck.length}</p>
      <p className="mb-2">Score: You {playerScore} - {computerScore} Computer</p>

      <div className="flex gap-6 mb-4">
        <div className="w-20 h-28 border flex items-center justify-center bg-white">
          {playerCard ? cardToString(playerCard) : "?"}
        </div>
        <div className="w-20 h-28 border flex items-center justify-center bg-white">
          {computerCard ? cardToString(computerCard) : "?"}
        </div>
      </div>

      <button
        onClick={playRound}
        disabled={deck.length < 2}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
      >
        Play Round
      </button>

      <button
        onClick={resetGame}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Restart Game
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};
