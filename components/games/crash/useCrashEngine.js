'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Crash round state machine:
 *   waiting  -> countdown -> running -> crashed -> waiting (loop)
 *
 * In a real deployment the crash point + multiplier tick would come from
 * a server-authoritative Socket.io stream (provably-fair seed, verified
 * client-side). Here it's simulated locally so the component is fully
 * self-contained and demonstrates the exact same UI states.
 */

const PHASES = {
  WAITING: 'waiting',
  COUNTDOWN: 'countdown',
  RUNNING: 'running',
  CRASHED: 'crashed',
};

const COUNTDOWN_SECONDS = 5;
const WAITING_MS = 3000;
const CRASHED_DISPLAY_MS = 2500;
const TICK_MS = 50;

// Simulated growth curve: multiplier grows exponentially with time.
function multiplierAtTime(elapsedMs) {
  const t = elapsedMs / 1000;
  return Math.max(1, Math.pow(1.055, t * 12));
}

// Simulated crash point generator (would be server-seeded + verifiable).
function generateCrashPoint() {
  const r = Math.random();
  // Weighted toward lower multipliers, occasional high spikes — mirrors
  // typical crash-game distributions.
  const point = 0.99 / (1 - r * 0.97);
  return Math.max(1.0, Math.min(point, 100));
}

export function useCrashEngine({ onRoundEnd } = {}) {
  const [phase, setPhase] = useState(PHASES.WAITING);
  const [multiplier, setMultiplier] = useState(1.0);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [crashPoint, setCrashPoint] = useState(null);
  const [history, setHistory] = useState([]);
  const [curvePoints, setCurvePoints] = useState([{ t: 0, m: 1 }]);

  const [bet, setBet] = useState(null); // { amount, cashedOutAt } | null
  const [autoCashout, setAutoCashout] = useState(null);

  const roundStartRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const crashPointRef = useRef(null);
  const betRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // --- Phase: WAITING -> COUNTDOWN ---
  const startCountdown = useCallback(() => {
    setPhase(PHASES.COUNTDOWN);
    setCountdown(COUNTDOWN_SECONDS);

    let remaining = COUNTDOWN_SECONDS;
    const tick = () => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        startRound();
      } else {
        timeoutRef.current = setTimeout(tick, 1000);
      }
    };
    timeoutRef.current = setTimeout(tick, 1000);
  }, []);

  // --- Phase: COUNTDOWN -> RUNNING ---
  const startRound = useCallback(() => {
    const point = generateCrashPoint();
    crashPointRef.current = point;
    setCrashPoint(null);
    setPhase(PHASES.RUNNING);
    setMultiplier(1.0);
    setCurvePoints([{ t: 0, m: 1 }]);
    roundStartRef.current = performance.now();

    const loop = (now) => {
      const elapsed = now - roundStartRef.current;
      const m = multiplierAtTime(elapsed);

      if (m >= crashPointRef.current) {
        finishRound(crashPointRef.current);
        return;
      }

      setMultiplier(m);
      setCurvePoints((pts) => [...pts.slice(-200), { t: elapsed, m }]);

      // Auto-cashout check
      const currentBet = betRef.current;
      if (currentBet && !currentBet.cashedOutAt && currentBet.autoCashout && m >= currentBet.autoCashout) {
        cashOut(m);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // --- Phase: RUNNING -> CRASHED ---
  const finishRound = useCallback((finalMultiplier) => {
    clearTimers();
    setPhase(PHASES.CRASHED);
    setMultiplier(finalMultiplier);
    setCrashPoint(finalMultiplier);
    setHistory((h) => [finalMultiplier, ...h].slice(0, 20));

    const currentBet = betRef.current;
    if (currentBet && !currentBet.cashedOutAt) {
      // Bet was not cashed out in time — lost.
      onRoundEnd?.({ result: 'lost', bet: currentBet });
    }

    timeoutRef.current = setTimeout(() => {
      resetToWaiting();
    }, CRASHED_DISPLAY_MS);
  }, [clearTimers, onRoundEnd]);

  // --- Phase: CRASHED -> WAITING ---
  const resetToWaiting = useCallback(() => {
    setPhase(PHASES.WAITING);
    setBet(null);
    betRef.current = null;
    setAutoCashout(null);
    timeoutRef.current = setTimeout(startCountdown, WAITING_MS);
  }, [startCountdown]);

  const placeBet = useCallback((amount, autoCashoutAt) => {
    if (phase !== PHASES.WAITING && phase !== PHASES.COUNTDOWN) return false;
    const newBet = { amount, cashedOutAt: null, autoCashout: autoCashoutAt || null };
    setBet(newBet);
    betRef.current = newBet;
    return true;
  }, [phase]);

  const cashOut = useCallback((atMultiplier) => {
    const currentBet = betRef.current;
    if (!currentBet || currentBet.cashedOutAt || phase !== PHASES.RUNNING) return;

    const m = atMultiplier ?? multiplier;
    const updated = { ...currentBet, cashedOutAt: m };
    betRef.current = updated;
    setBet(updated);
    onRoundEnd?.({ result: 'won', bet: updated, payout: currentBet.amount * m });
  }, [phase, multiplier, onRoundEnd]);

  // Kick off the loop on mount
  useEffect(() => {
    timeoutRef.current = setTimeout(startCountdown, 1000);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    phase,
    PHASES,
    multiplier,
    countdown,
    crashPoint,
    history,
    curvePoints,
    bet,
    placeBet,
    cashOut,
  };
}
