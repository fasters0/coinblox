'use client';

import { useState, useCallback } from 'react';
import { Rocket, TrendingUp } from 'lucide-react';
import { useCrashEngine } from './useCrashEngine';
import CrashChart from './CrashChart';
import { usePoints, formatPoints } from '../../../lib/points-engine';

export default function CrashGame() {
  const { balance, wager, payout, canAfford } = usePoints();
  const [wagerInput, setWagerInput] = useState(50);
  const [autoCashoutInput, setAutoCashoutInput] = useState('');

  const handleRoundEnd = useCallback(({ result, bet, payout: winAmount }) => {
    if (result === 'won') payout(winAmount);
    // 'lost' — points were already deducted when the bet was placed.
  }, [payout]);

  const engine = useCrashEngine({ onRoundEnd: handleRoundEnd });
  const { phase, PHASES, multiplier, countdown, bet, placeBet, cashOut } = engine;

  const canBet = (phase === PHASES.WAITING || phase === PHASES.COUNTDOWN) && !bet;
  const canCashOut = phase === PHASES.RUNNING && bet && !bet.cashedOutAt;

  const handlePlaceBet = () => {
    if (wagerInput <= 0 || !canAfford(wagerInput)) return;
    const auto = autoCashoutInput ? parseFloat(autoCashoutInput) : null;
    const ok = placeBet(wagerInput, auto);
    if (ok) wager(wagerInput);
  };

  const handleCashOut = () => cashOut();

  const potentialWin = bet ? (bet.amount * multiplier).toFixed(0) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Chart + phase banner */}
      <div className="space-y-4">
        <PhaseBanner phase={phase} countdown={countdown} PHASES={PHASES} />
        <CrashChart
          points={engine.curvePoints}
          multiplier={multiplier}
          phase={phase}
          crashPoint={engine.crashPoint}
        />
        <RoundHistory history={engine.history} />
      </div>

      {/* Bet controls */}
      <div className="glass-panel p-5 space-y-4 h-fit">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Rocket className="w-4 h-4 text-gold-500" /> Place your bet
        </h3>

        <div>
          <label className="text-xs text-neutral-400 mb-1 block">Wager (points)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={wagerInput}
              disabled={!canBet}
              onChange={(e) => setWagerInput(Number(e.target.value))}
              className="input-bet disabled:opacity-50"
            />
            <button
              className="btn-ghost px-3 text-xs"
              disabled={!canBet}
              onClick={() => setWagerInput((v) => Math.floor(v / 2) || 1)}
            >
              1/2
            </button>
            <button
              className="btn-ghost px-3 text-xs"
              disabled={!canBet}
              onClick={() => setWagerInput((v) => v * 2)}
            >
              2x
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-neutral-400 mb-1 block">Auto cash-out at</label>
          <input
            type="number"
            min={1.01}
            step={0.01}
            placeholder="e.g. 2.00"
            value={autoCashoutInput}
            disabled={!canBet}
            onChange={(e) => setAutoCashoutInput(e.target.value)}
            className="input-bet disabled:opacity-50"
          />
        </div>

        {!bet && (
          <button
            onClick={handlePlaceBet}
            disabled={!canBet || wagerInput <= 0 || !canAfford(wagerInput)}
            className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {canBet ? 'Place bet' : 'Round in progress'}
          </button>
        )}

        {bet && !bet.cashedOutAt && phase === PHASES.RUNNING && (
          <button onClick={handleCashOut} className="w-full bg-win hover:brightness-110 text-base-950 font-semibold py-3 rounded-xl shadow-glow-win transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cash out {formatPoints(Number(potentialWin))}
            </div>
          </button>
        )}

        {bet && bet.cashedOutAt && (
          <div className="text-center py-3 bg-win/10 border border-win/30 rounded-xl">
            <span className="text-win font-semibold">
              Cashed out at {bet.cashedOutAt.toFixed(2)}x
            </span>
          </div>
        )}

        {bet && !bet.cashedOutAt && phase === PHASES.CRASHED && (
          <div className="text-center py-3 bg-lose/10 border border-lose/30 rounded-xl">
            <span className="text-lose font-semibold">Bet lost</span>
          </div>
        )}

        <p className="text-xs text-neutral-500 text-center">
          Balance: {formatPoints(balance)} pts
        </p>
      </div>
    </div>
  );
}

function PhaseBanner({ phase, countdown, PHASES }) {
  const label = {
    [PHASES.WAITING]: 'Preparing next round…',
    [PHASES.COUNTDOWN]: `Starting in ${countdown}s`,
    [PHASES.RUNNING]: 'Round in progress',
    [PHASES.CRASHED]: 'Round ended',
  }[phase];

  return (
    <div className="flex items-center justify-between text-sm text-neutral-400">
      <span>{label}</span>
      <span className="badge-live">
        <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" /> Live
      </span>
    </div>
  );
}

function RoundHistory({ history }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {history.map((m, i) => (
        <span
          key={i}
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full
            ${m >= 2 ? 'bg-win/10 text-win border border-win/30' : 'bg-lose/10 text-lose border border-lose/30'}`}
        >
          {m.toFixed(2)}x
        </span>
      ))}
    </div>
  );
}
