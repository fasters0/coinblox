'use client';

import { Rocket, Gem, Building2, Coins as CoinsIcon } from 'lucide-react';
import GameCard from '../components/games/GameCard';
import LiveChat from '../components/sidebar/LiveChat';
import LiveFeed from '../components/sidebar/LiveFeed';

const GAMES = [
  { title: 'Crash', icon: Rocket, players: 342, accentClass: 'bg-gold-500/15 text-gold-500', href: '/games/crash' },
  { title: 'Mines', icon: Gem, players: 218, accentClass: 'bg-win/15 text-win', href: '/games/mines' },
  { title: 'Towers', icon: Building2, players: 96, accentClass: 'bg-blue-500/15 text-blue-400', href: '/games/towers' },
  { title: 'CoinFlip', icon: CoinsIcon, players: 154, accentClass: 'bg-pink-500/15 text-pink-400', href: '/games/coinflip' },
];

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <section>
          <h1 className="font-display font-bold text-2xl mb-1">Game lobby</h1>
          <p className="text-neutral-400 text-sm mb-6">Pick a game and start playing with your points.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GAMES.map((g) => (
              <GameCard key={g.title} {...g} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <LiveChat />
          <LiveFeed />
        </aside>
      </div>
    </main>
  );
}
