import CrashGame from '../../../components/games/crash/CrashGame';

export const metadata = { title: 'Crash — CoinBlox' };

export default function CrashPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl mb-6">Crash</h1>
      <CrashGame />
    </main>
  );
}
