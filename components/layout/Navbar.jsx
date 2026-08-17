'use client';

import { useState } from 'react';
import { Coins, ChevronDown, User, LogOut, Settings, Plus } from 'lucide-react';
import { usePoints, formatPoints } from '../../lib/points-engine';
import TopUpModal from './TopUpModal';

export default function Navbar() {
  const { balance } = usePoints();
  const [profileOpen, setProfileOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [authed, setAuthed] = useState(true); // mock auth toggle

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel rounded-none border-x-0 border-t-0 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Coins className="w-8 h-8 text-gold-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Coin<span className="text-gold-500">Blox</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
            <a href="/" className="hover:text-white transition-colors">Lobby</a>
            <a href="/games/crash" className="hover:text-white transition-colors">Crash</a>
            <a href="/games/mines" className="hover:text-white transition-colors">Mines</a>
            <a href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {authed ? (
              <>
                {/* Balance pill */}
                <div className="flex items-center gap-2 bg-base-900 border border-base-600 rounded-xl pl-3 pr-1 py-1.5">
                  <Coins className="w-4 h-4 text-gold-500" />
                  <span className="font-semibold text-sm tabular-nums">
                    {formatPoints(balance)}
                  </span>
                  <button
                    onClick={() => setTopUpOpen(true)}
                    className="ml-1 bg-gold-500 hover:bg-gold-400 text-base-950 rounded-lg p-1.5 transition-colors"
                    aria-label="Top up points"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-1.5 bg-base-700/50 hover:bg-base-700 border border-base-600 rounded-xl px-2 py-1.5 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-xs font-bold text-base-950">
                      MP
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-panel p-1.5 shadow-card">
                      <DropdownItem icon={User} label="Profile" />
                      <DropdownItem icon={Settings} label="Settings" />
                      <div className="h-px bg-base-600 my-1" />
                      <DropdownItem
                        icon={LogOut}
                        label="Log out"
                        danger
                        onClick={() => setAuthed(false)}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setAuthed(true)} className="btn-ghost text-sm px-4 py-2">
                  Log in
                </button>
                <button onClick={() => setAuthed(true)} className="btn-gold text-sm px-4 py-2">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </>
  );
}

function DropdownItem({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
        ${danger ? 'text-lose hover:bg-lose/10' : 'text-neutral-400 hover:bg-base-700 hover:text-white'}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
