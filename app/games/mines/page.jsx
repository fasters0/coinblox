import MinesGame from '../../../components/games/mines/MinesGame';

export const metadata = { title: 'Mines — CoinBlox' };

export default function MinesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl mb-6">Mines</h1>
      <MinesGame />
    </main>
  );
}
