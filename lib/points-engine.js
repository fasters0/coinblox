'use client';

import { createContext, useContext, useState, useCallback } from 'react';

/**
 * PointsContext — tracks the user's in-app points balance.
 * Points have no cash value, cannot be deposited/withdrawn, and are
 * granted on signup + earned/lost through gameplay only.
 */
const PointsContext = createContext(null);

const STARTING_BALANCE = 1000;

export function PointsProvider({ children }) {
  const [balance, setBalance] = useState(STARTING_BALANCE);

  const wager = useCallback((amount) => {
    setBalance((b) => Math.max(0, b - amount));
  }, []);

  const payout = useCallback((amount) => {
    setBalance((b) => b + amount);
  }, []);

  const canAfford = useCallback((amount) => balance >= amount, [balance]);

  return (
    <PointsContext.Provider value={{ balance, wager, payout, canAfford }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}

export function formatPoints(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
