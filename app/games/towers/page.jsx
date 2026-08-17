import { Building2 } from 'lucide-react';

export const metadata = { title: 'Towers — CoinBlox' };

export default function TowersPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
      <Building2 className="w-10 h-10 text-gold-500 mb-4" />
      <h1 className="font-display font-bold text-2xl mb-2">Towers</h1>
      <p className="text-neutral-400">Coming soon — this game hasn't been built out yet.</p>
    </main>
  );
}
