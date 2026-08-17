'use client';

import { Users } from 'lucide-react';

export default function GameCard({ title, icon: Icon, players, accentClass, href }) {
  return (
    <a href={href} className="game-card p-5 flex flex-col justify-between h-44">
      <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="flex items-center gap-1 text-xs text-neutral-400 bg-base-900/60 px-2 py-1 rounded-full">
          <Users className="w-3 h-3" /> {players}
        </span>
      </div>

      <div className="relative">
        <h3 className="font-display font-semibold text-lg group-hover:text-gold-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">Play now</p>
      </div>
    </a>
  );
}
