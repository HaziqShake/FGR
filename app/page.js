'use client';

import Scanner from "../components/Scanner";
import GameGrid from "../components/GameGrid";
import Navbar from "../components/Navbar";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Navbar />

      <main>
        <Scanner />
        <GameGrid />
      </main>
    </div>
  );
}

