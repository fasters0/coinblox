'use client';

import { useState, useCallback, useMemo } from 'react';

const GRID_SIZE = 25; // 5x5

/** Fisher-Yates shuffle to place N mines among 25 tiles. */
function placeMines(count) {
  const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return new Set(indices.slice(0, count));
}

/**
 * Multiplier for revealing `revealed` safe tiles out of GRID_SIZE with
 * `mineCount` mines, using a standard combinatorial house-edge formula:
 * fair odds * (1 - houseEdge).
 */
function multiplierForReveal(revealed, mineCount, houseEdge = 0.03) {
  if (revealed === 0) return 1;
  let fairMultiplier = 1;
  for (let i = 0; i < revealed; i++) {
    const safeTilesLeft = GRID_SIZE - mineCount - i;
    const tilesLeft = GRID_SIZE - i;
    fairMultiplier *= tilesLeft / safeTilesLeft;
  }
  return fairMultiplier * (1 - houseEdge);
}

export function useMinesEngine() {
  const [mineCount, setMineCount] = useState(3);
  const [status, setStatus] = useState('idle'); // idle | active | busted | cashed
  const [mines, setMines] = useState(new Set());
  const [revealedTiles, setRevealedTiles] = useState(new Set());
  const [wager, setWagerAmount] = useState(0);

  const revealedSafeCount = revealedTiles.size;
  const currentMultiplier = useMemo(
    () => multiplierForReveal(revealedSafeCount, mineCount),
    [revealedSafeCount, mineCount]
  );
  const nextMultiplier = useMemo(
    () => multiplierForReveal(revealedSafeCount + 1, mineCount),
    [revealedSafeCount, mineCount]
  );

  const startGame = useCallback((betAmount) => {
    setMines(placeMines(mineCount));
    setRevealedTiles(new Set());
    setWagerAmount(betAmount);
    setStatus('active');
  }, [mineCount]);

  const revealTile = useCallback((index) => {
    if (status !== 'active' || revealedTiles.has(index)) return null;

    if (mines.has(index)) {
      setStatus('busted');
      setRevealedTiles((prev) => new Set(prev).add(index));
      return { hit: 'mine' };
    }

    const newRevealed = new Set(revealedTiles).add(index);
    setRevealedTiles(newRevealed);

    // Auto-win if every safe tile has been revealed
    if (newRevealed.size === GRID_SIZE - mineCount) {
      setStatus('cashed');
      return { hit: 'gem', autoWin: true };
    }

    return { hit: 'gem' };
  }, [status, revealedTiles, mines, mineCount]);

  const cashOut = useCallback(() => {
    if (status !== 'active' || revealedSafeCount === 0) return null;
    setStatus('cashed');
    return { payout: wager * currentMultiplier };
  }, [status, revealedSafeCount, wager, currentMultiplier]);

  const reset = useCallback(() => {
    setStatus('idle');
    setMines(new Set());
    setRevealedTiles(new Set());
  }, []);

  return {
    GRID_SIZE,
    mineCount,
    setMineCount,
    status,
    mines,
    revealedTiles,
    revealedSafeCount,
    currentMultiplier,
    nextMultiplier,
    wager,
    startGame,
    revealTile,
    cashOut,
    reset,
  };
}
