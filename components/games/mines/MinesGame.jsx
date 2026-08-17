'use client';

import { useState } from 'react';
import { Gem, TrendingUp } from 'lucide-react';
import { useMinesEngine } from './useMinesEngine';
import MinesGrid from './MinesGrid';
import { usePoints, formatPoints } from '../../../lib/points-engine';

export default function MinesGame() {
  const { balance, wager: deductWager, payout, canAfford } = usePoints();
  const [wagerInput, setWagerInput] = useState(50);

  const engine = useMinesEngine();
  const {
    GRID_SIZE, mineCount, setMineCount, status,
    mines, revealedTiles, revealedSafeCount,
    currentMultiplier, nextMultiplier, wager,
    startGame, revealTile, cashOut, reset,
  } = engine;

  const isActive = status === 'active';
  const isIdle = status === 'idle';

  const handleStart = () => {
    if (wagerInput <= 0 || !canAfford(wagerInput)) return;
    deductWager(wagerInput);
    startGame(wagerInput);
  };

  const handleTileClick = (index) => {
    const result = revealTile(index);
    if (result?.autoWin) {
      // All safe tiles revealed — auto cash-out at max multiplier
      payout(wager * currentMultiplier);
    }
  };

  const handleCashOut = () => {
    const result = cashOut();
    if (result) payout(result.payout);
  };

  const handlePlayAgain = () => reset();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Config + controls */}
      <div className="glass-panel p-5 space-y-4 h-fit order-2 lg:order-1">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Gem className="w-4 h-4 text-gold-500" /> Mines
        </h3>

        <div>
          <label className="text-xs text-neutral-400 mb-1 block">Wager (points)</label>
          <input
            type="number"
            min={1}
            value={wagerInput}
            disabled={!isIdle}
            onChange={(e) => setWagerInput(Number(e.target.value))}
            className="input-bet disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 mb-1 block">
            Mines: {mineCount}
          </label>
          <input
            type="range"
            min={1}
            max={24}
            value={mineCount}
            disabled={!isIdle}
            onChange={(e) => setMineCount(Number(e.target.value))}
            className="w-full accent-gold-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
            <span>1</span>
            <span>24</span>
          </div>
        </div>

        {isIdle && (
          <button
            onClick={handleStart}
            disabled={wagerInput <= 0 || !canAfford(wagerInput)}
            className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start game
          </button>
        )}

        {isActive && (
          <>
            <div className="bg-base-900 rounded-xl p-3 space-y-1.5 text-sm">
              <Row label="Current multiplier" value={`${currentMultiplier.toFixed(2)}x`} highlight />
              <Row label="Next tile pays" value={`${nextMultiplier.toFixed(2)}x`} />
              <Row label="Cash-out value" value={`${formatPoints(Math.round(wager * currentMultiplier))} pts`} />
            </div>
            <button
              onClick={handleCashOut}
              disabled={revealedSafeCount === 0}
              className="w-full bg-win hover:brightness-110 text-base-950 font-semibold py-3 rounded-xl shadow-glow-win transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cash out
              </div>
            </button>
          </>
        )}

        {status === 'busted' && (
          <div className="space-y-3">
            <div className="text-center py-3 bg-lose/10 border border-lose/30 rounded-xl">
              <span className="text-lose font-semibold">Hit a mine — bet lost</span>
            </div>
            <button onClick={handlePlayAgain} className="btn-ghost w-full">Play again</button>
          </div>
        )}

        {status === 'cashed' && (
          <div className="space-y-3">
            <div className="text-center py-3 bg-win/10 border border-win/30 rounded-xl">
              <span className="text-win font-semibold">
                Cashed out at {currentMultiplier.toFixed(2)}x
              </span>
            </div>
            <button onClick={handlePlayAgain} className="btn-ghost w-full">Play again</button>
          </div>
        )}

        <p className="text-xs text-neutral-500 text-center">
          Balance: {formatPoints(balance)} pts
        </p>
      </div>

      {/* Grid */}
      <div className="glass-panel p-6 order-1 lg:order-2">
        <MinesGrid
          gridSize={GRID_SIZE}
          mines={mines}
          revealedTiles={revealedTiles}
          status={status}
          onTileClick={handleTileClick}
        />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-400">{label}</span>
      <span className={`font-semibold tabular-nums ${highlight ? 'text-gold-500' : ''}`}>
        {value}
      </span>
    </div>
  );
}
