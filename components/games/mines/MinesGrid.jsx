'use client';

import { Gem, Bomb } from 'lucide-react';

export default function MinesGrid({ gridSize, mines, revealedTiles, status, onTileClick }) {
  const revealAll = status === 'busted' || status === 'cashed';

  return (
    <div className="grid grid-cols-5 gap-2.5 aspect-square">
      {Array.from({ length: gridSize }, (_, i) => {
        const isRevealed = revealedTiles.has(i);
        const isMine = mines.has(i);
        const showContent = isRevealed || (revealAll && isMine);

        return (
          <button
            key={i}
            onClick={() => onTileClick(i)}
            disabled={status !== 'active' || isRevealed}
            className={tileClasses({ showContent, isMine, isRevealed, status })}
          >
            {showContent ? (
              isMine ? (
                <Bomb className="w-6 h-6 text-lose animate-tile-flip" />
              ) : (
                <Gem className="w-6 h-6 text-win animate-tile-flip" />
              )
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function tileClasses({ showContent, isMine, isRevealed, status }) {
  const base = 'relative rounded-xl flex items-center justify-center transition-all duration-150';

  if (showContent && isRevealed) {
    return `${base} ${
      isMine
        ? 'bg-lose/20 border-2 border-lose shadow-glow-lose'
        : 'bg-win/20 border-2 border-win shadow-glow-win'
    }`;
  }

  if (showContent && !isRevealed) {
    // revealed-on-loss mines that weren't clicked
    return `${base} bg-base-700/50 border border-lose/40 opacity-60`;
  }

  return `${base} bg-base-700 border border-base-600 hover:border-gold-500/50 hover:bg-base-700/70 active:scale-95 disabled:cursor-not-allowed disabled:hover:border-base-600`;
}
