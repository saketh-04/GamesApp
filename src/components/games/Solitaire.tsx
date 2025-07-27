import { useState } from "react";

type Card = {
  value: number; // 1-13 (Ace=1, King=13)
  suit: string;  // ♠ ♥ ♦ ♣
  faceUp: boolean;
};

const suits = ["♠", "♥", "♦", "♣"];
const values = Array.from({ length: 13 }, (_, i) => i + 1);

const createDeck = (): Card[] => {
  let deck: Card[] = [];
  suits.forEach((s) =>
    values.forEach((v) => deck.push({ value: v, suit: s, faceUp: false }))
  );
  return deck.sort(() => Math.random() - 0.5);
};

export const Solitaire = () => {
  const [stock, setStock] = useState<Card[]>(createDeck());
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>(() => {
    const deck = createDeck();
    const piles: Card[][] = Array.from({ length: 7 }, () => []);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck.pop()!;
        card.faceUp = j === i;
        piles[i].push(card);
      }
    }
    setStock(deck);
    return piles;
  });

  const drawCard = () => {
    if (stock.length === 0) {
      setStock([...waste].reverse().map((c) => ({ ...c, faceUp: false })));
      setWaste([]);
    } else {
      const card = stock[stock.length - 1];
      card.faceUp = true;
      setWaste([...waste, card]);
      setStock(stock.slice(0, -1));
    }
  };

  const cardToString = (c: Card) =>
    `${c.value === 1 ? "A" : c.value === 11 ? "J" : c.value === 12 ? "Q" : c.value === 13 ? "K" : c.value
    }${c.suit}`;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Solitaire (Simplified)</h1>

      {/* Stock & Waste */}
      <div className="flex gap-4 mb-4">
        <div
          className="w-16 h-24 bg-green-900 border flex items-center justify-center cursor-pointer"
          onClick={drawCard}
        >
          {stock.length > 0 ? "🂠" : "↩️"}
        </div>
        <div className="w-16 h-24 bg-white border flex items-center justify-center">
          {waste.length > 0 && cardToString(waste[waste.length - 1])}
        </div>
      </div>

      {/* Foundations */}
      <div className="flex gap-4 mb-6">
        {foundations.map((pile, i) => (
          <div
            key={i}
            className="w-16 h-24 bg-white border flex items-center justify-center"
          >
            {pile.length > 0 ? cardToString(pile[pile.length - 1]) : "—"}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex gap-4">
        {tableau.map((pile, i) => (
          <div key={i} className="flex flex-col">
            {pile.map((card, j) => (
              <div
                key={j}
                className={`w-16 h-24 border mb-[-80px] flex items-center justify-center text-sm ${card.faceUp ? "bg-white" : "bg-green-900"
                  }`}
              >
                {card.faceUp ? cardToString(card) : "🂠"}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Click stock to draw cards. Drag-and-drop not implemented yet.
      </p>
    </div>
  );
};
