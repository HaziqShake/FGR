'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function RandomGamePage() {
  const router = useRouter();

  useEffect(() => {
    const getRandomGame = async () => {
      try {
        // Fetch all games (excluding non-games)
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('isNonGame', '!=', true));
        const snapshot = await getDocs(q);

        const games = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(game =>
            game.imageUrl &&
            game.title &&
            !/call for donation|upcoming repacks|site news|updates digest|repack updated/i.test(game.title)
          );

        if (games.length === 0) {
          // No games found, redirect to home
          router.push('/');
          return;
        }

        // Pick a random game
        const randomIndex = Math.floor(Math.random() * games.length);
        const randomGame = games[randomIndex];

        // Redirect to home with hash to open the game in side panel
        router.push(`/#game-${randomGame.id}`);

      } catch (error) {
        console.error('Error fetching random game:', error);
        router.push('/');
      }
    };

    getRandomGame();
  }, [router]);

  return (
    <div className="random-loader">
      <div className="loader-content">
        <Loader2 className="spinner" size={48} />
        <h2>Finding a random repack...</h2>
        <p>Rolling the dice 🎲</p>
      </div>

      <style jsx>{`
        .random-loader {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
          padding: 2rem;
        }

        .spinner {
          color: var(--accent);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        p {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
