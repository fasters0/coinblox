'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const USERS = ['zynthex', 'blocklord', 'nova_rae', 'kaidenX', 'pixelpeach', 'ghostwire'];
const GAMES = ['Crash', 'Mines', 'Towers', 'CoinFlip'];

function randomEntry() {
  const won = Math.random() > 0.45;
  const multiplier = won ? (1 + Math.random() * 8).toFixed(2) : (Math.random() * 0.9 + 0.1).toFixed(2);
  const wager = Math.floor(Math.random() * 400 + 10);
  return {
    id: Math.random().toString(36).slice(2),
    user: USERS[Math.floor(Math.random() * USERS.length)],
    game: GAMES[Math.floor(Math.random() * GAMES.length)],
    multiplier,
    payout: won ? Math.floor(wager * multiplier) : 0,
    won,
  };
}

export default function LiveFeed() {
  const [entries, setEntries] = useState(() =>
    Array.from({ length: 8 }, randomEntry)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setEntries((e) => [randomEntry(), ...e].slice(0, 12));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <Activity className="w-4 h-4 text-gold-500" />
        <span className="font-display font-semibold text-sm">Live activity</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-500 text-xs">
              <th className="text-left font-medium px-4 py-2">Player</th>
              <th className="text-left font-medium px-2 py-2">Game</th>
              <th className="text-right font-medium px-2 py-2">Mult.</th>
              <th className="text-right font-medium px-4 py-2">Payout</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-white/5 hover:bg-base-700/30">
                <td className="px-4 py-2 text-neutral-300 truncate max-w-[80px]">{e.user}</td>
                <td className="px-2 py-2 text-neutral-400">{e.game}</td>
                <td className={`px-2 py-2 text-right font-medium tabular-nums ${e.won ? 'text-win' : 'text-lose'}`}>
                  {e.multiplier}x
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-neutral-300">
                  {e.won ? `+${e.payout}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
