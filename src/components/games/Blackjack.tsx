import { useState } from "react";

type Card = {
  value: string;
  suit: string;
};

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const generateDeck = () => {
  const deck: Card[] = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateHandValue = (hand: Card[]) => {
  let value = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (["J", "Q", "K"].includes(card.value)) {
      value += 10;
    } else if (card.value === "A") {
      value += 11;
      aces++;
    } else {
      value += parseInt(card.value);
    }
  });

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

export const Blackjack = () => {
  const [deck, setDeck] = useState<Card[]>(generateDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);

  const startGame = () => {
    const newDeck = generateDeck();
    const player = [newDeck.pop()!, newDeck.pop()!];
    const dealer = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setGameOver(false);
    setMessage("");
    setStarted(true);
  };

  const hit = () => {
    if (gameOver) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];

    if (calculateHandValue(newHand) > 21) {
      setMessage("💥 You Busted!");
      setGameOver(true);
    }

    setPlayerHand(newHand);
    setDeck(newDeck);
  };

  const stand = () => {
    let dealer = [...dealerHand];
    let deckCopy = [...deck];

    while (calculateHandValue(dealer) < 17) {
      dealer.push(deckCopy.pop()!);
    }

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealer);

    if (dealerValue > 21 || playerValue > dealerValue) {
      setMessage("✅ You Win!");
    } else if (playerValue < dealerValue) {
      setMessage("❌ Dealer Wins!");
    } else {
      setMessage("🤝 It's a Tie!");
    }

    setDealerHand(dealer);
    setDeck(deckCopy);
    setGameOver(true);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Blackjack</h1>
      {!started && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={startGame}
        >
          Start Game
        </button>
      )}

      {started && (
        <div className="mt-4">
          <div className="mb-2">
            <h2 className="font-bold text-lg">Dealer's Hand</h2>
            <div className="flex gap-2">
              {dealerHand.map((card, i) => (
                <div key={i} className="p-2 bg-white border rounded shadow">
                  {gameOver || i === 0 ? (
                    <span>{card.value}{card.suit}</span>
                  ) : (
                    <span>🂠</span>
                  )}
                </div>
              ))}
            </div>
            {gameOver && <p>Value: {calculateHandValue(dealerHand)}</p>}
          </div>

          <div className="mb-2">
            <h2 className="font-bold text-lg">Your Hand</h2>
            <div className="flex gap-2">
              {playerHand.map((card, i) => (
                <div key={i} className="p-2 bg-white border rounded shadow">
                  {card.value}{card.suit}
                </div>
              ))}
            </div>
            <p>Value: {calculateHandValue(playerHand)}</p>
          </div>

          {!gameOver && (
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={hit}
              >
                Hit
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                onClick={stand}
              >
                Stand
              </button>
            </div>
          )}

          {gameOver && (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={startGame}
            >
              Play Again
            </button>
          )}

          {message && <p className="mt-4 font-bold">{message}</p>}
        </div>
      )}
    </div>
  );
};
