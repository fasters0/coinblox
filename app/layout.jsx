import './globals.css';
import { PointsProvider } from '../lib/points-engine';
import Navbar from '../components/layout/Navbar';

export const metadata = {
  title: 'CoinBlox',
  description: 'CoinBlox — play Crash, Mines, Towers and CoinFlip with points.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base-900">
        <PointsProvider>
          <Navbar />
          {children}
        </PointsProvider>
      </body>
    </html>
  );
}
