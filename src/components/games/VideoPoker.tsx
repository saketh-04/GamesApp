import { useState } from "react";

type Card = {
  value: string;
  suit: string;
};

const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach((s) =>
    values.forEach((v) => {
      deck.push({ value: v, suit: s });
    })
  );
  return deck.sort(() => Math.random() - 0.5);
};

export const VideoPoker = () => {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [drawn, setDrawn] = useState(false);
  const [credits, setCredits] = useState(100);
  const [message, setMessage] = useState("");

  const deal = () => {
    if (credits <= 0) {
      setMessage("No credits left!");
      return;
    }
    setDeck(createDeck());
    setHand(deck.slice(0, 5));
    setHeld([false, false, false, false, false]);
    setDrawn(false);
    setCredits(credits - 1);
    setMessage("");
  };

  const draw = () => {
    let newHand = [...hand];
    let newDeck = [...deck.slice(5)];
    for (let i = 0; i < 5; i++) {
      if (!held[i]) {
        newHand[i] = newDeck.pop()!;
      }
    }
    setHand(newHand);
    setDrawn(true);
    evaluateHand(newHand);
  };

  const toggleHold = (index: number) => {
    if (!drawn && hand.length > 0) {
      setHeld((prev) => prev.map((h, i) => (i === index ? !h : h)));
    }
  };

  const evaluateHand = (hand: Card[]) => {
    const valuesOnly = hand.map((c) => c.value);
    const counts: { [v: string]: number } = {};
    valuesOnly.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
    const pairs = Object.values(counts).filter((c) => c === 2).length;
    const threeKind = Object.values(counts).includes(3);
    const fourKind = Object.values(counts).includes(4);

    if (fourKind) {
      setCredits((c) => c + 25);
      setMessage("Four of a Kind! +25");
    } else if (threeKind && pairs === 1) {
      setCredits((c) => c + 9);
      setMessage("Full House! +9");
    } else if (threeKind) {
      setCredits((c) => c + 3);
      setMessage("Three of a Kind! +3");
    } else if (pairs === 2) {
      setCredits((c) => c + 2);
      setMessage("Two Pair! +2");
    } else if (pairs === 1) {
      const jacksOrBetter = ["J", "Q", "K", "A"];
      const hasHighPair = Object.entries(counts).some(
        ([v, c]) => c === 2 && jacksOrBetter.includes(v)
      );
      if (hasHighPair) {
        setCredits((c) => c + 1);
        setMessage("Pair of Jacks or Better! +1");
      } else {
        setMessage("Pair too low.");
      }
    } else {
      setMessage("No Win.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Video Poker</h1>
      <p className="mb-2">Credits: {credits}</p>

      {hand.length === 0 && (
        <button
          onClick={deal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Deal
        </button>
      )}

      {hand.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            {hand.map((card, i) => (
              <div
                key={i}
                onClick={() => toggleHold(i)}
                className={`w-16 h-24 border rounded flex flex-col items-center justify-center cursor-pointer ${held[i] ? "bg-yellow-300" : "bg-white"
                  }`}
              >
                <span className="text-xl">{card.value}</span>
                <span>{card.suit}</span>
                {held[i] && <span className="text-xs text-gray-700">HOLD</span>}
              </div>
            ))}
          </div>

          {!drawn ? (
            <button
              onClick={draw}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Draw
            </button>
          ) : (
            <button
              onClick={deal}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Deal Again
            </button>
          )}

          {message && <p className="mt-4">{message}</p>}
        </>
      )}
    </div>
  );
};
