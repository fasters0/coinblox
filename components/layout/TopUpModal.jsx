'use client';

import { X, Coins } from 'lucide-react';
import { usePoints, formatPoints } from '../../lib/points-engine';

const GRANT_OPTIONS = [500, 1000, 2500, 5000];

export default function TopUpModal({ open, onClose }) {
  const { balance, payout } = usePoints();

  if (!open) return null;

  const handleGrant = (amount) => {
    payout(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md p-6 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-semibold text-lg">Top up points</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-neutral-400 mb-5">
          Free in-app points for playing CoinBlox games. No cash value, not
          redeemable or transferable.
        </p>

        <div className="text-center mb-5">
          <span className="text-xs text-neutral-400 uppercase tracking-wide">Current balance</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Coins className="w-6 h-6 text-gold-500" />
            <span className="text-3xl font-bold tabular-nums">{formatPoints(balance)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GRANT_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => handleGrant(amount)}
              className="btn-ghost flex flex-col items-center py-4"
            >
              <span className="font-semibold">+{formatPoints(amount)}</span>
              <span className="text-xs text-neutral-400">points</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
