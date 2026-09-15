'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { useScanner } from '../hooks/useScanner';
import { calculateCompatibility } from '../utils/hardware-tiers';
import SkeletonCard from './SkeletonCard';
import GameSidePanel from './GameSidePanel';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

// New Modular Components
import SearchBar from './SearchBar';
import TagCloud from './TagCloud';
import GameCard from './GameCard';
import Pagination from './Pagination';
import './GameGrid.css';


const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Simulation', 'Horror', 'Open World', 'Hypervisor', 'Adult', 'Selective Download', 'Has DLC'];
const ITEMS_PER_PAGE = 30;

export default function GameGrid() {
  const { specs } = useScanner();
  const [mounted, setMounted] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagStates, setTagStates] = useState({});
  const [showAdult, setShowAdult] = useState(false);
  const [compFilter, setCompFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'games'), orderBy('updatedAt', 'desc')));
        const firestoreGames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(firestoreGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tagStates, showAdult, compFilter, sortBy]);

  const cycleTag = (genre) => {
    setTagStates(prev => {
      const current = prev[genre] || 'none';
      let next = 'included';
      if (current === 'none') {
        next = 'included';
      } else if (current === 'included') {
        next = 'excluded';
      } else if (current === 'excluded') {
        next = 'none';
      } else {
        next = 'included';
      }
      return { ...prev, [genre]: next };
    });
  };

  const filteredAndSortedGames = useMemo(() => {
    const filtered = games.filter(game => {
      const titleLower = game.title?.toLowerCase() || '';
      const isNonGame = game.isNonGame ||
        !game.imageUrl ||
        /call for donation/i.test(titleLower) ||
        /upcoming repacks/i.test(titleLower) ||
        /site news/i.test(titleLower) ||
        /updates digest/i.test(titleLower) ||
        /repack updated/i.test(titleLower);
      if (isNonGame) return false;

      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAdult = showAdult || !game.isAdult;
      const status = calculateCompatibility(specs, game);
      const matchesComp = compFilter === 'all' || status === compFilter;
      const entries = Object.entries(tagStates);
      const includedTags = entries.filter(([_, s]) => s === 'included').map(([t]) => t);
      const excludedTags = entries.filter(([_, s]) => s === 'excluded').map(([t]) => t);

      const hasIncludes = includedTags.length === 0 || includedTags.every(t => {
        if (t === 'Adult') return game.isAdult;
        if (t === 'Selective Download') return game.hasSelectiveDownload;
        if (t === 'Has DLC') return game.dlcCount > 0;
        if (t === 'Hypervisor') return game.isHypervisor;
        const tLower = t.toLowerCase();
        return (
          game.genres?.some(g => g.toLowerCase().includes(tLower) || tLower.includes(g.toLowerCase())) ||
          game.steamGenres?.some(g => g.toLowerCase().includes(tLower) || tLower.includes(g.toLowerCase()))
        );
      });
      const hasExcludes = excludedTags.some(t => {
        if (t === 'Adult') return game.isAdult;
        if (t === 'Selective Download') return game.hasSelectiveDownload;
        if (t === 'Has DLC') return game.dlcCount > 0;
        if (t === 'Hypervisor') return game.isHypervisor;
        const tLower = t.toLowerCase();
        return (
          game.genres?.some(g => g.toLowerCase().includes(tLower) || tLower.includes(g.toLowerCase())) ||
          game.steamGenres?.some(g => g.toLowerCase().includes(tLower) || tLower.includes(g.toLowerCase()))
        );
      });

      return matchesSearch && matchesAdult && hasIncludes && !hasExcludes && matchesComp;
    });

    return [...filtered].sort((a, b) => {
      const getTime = (g) => {
        const dateStr = g.postDate || g.updatedAt;
        if (!dateStr) return 0;
        if (typeof dateStr === 'string') return new Date(dateStr).getTime();
        return (dateStr?.seconds || 0) * 1000;
      };
      if (sortBy === 'newest') return getTime(b) - getTime(a);
      if (sortBy === 'oldest') return getTime(a) - getTime(b);
      if (sortBy === 'abc') return a.title.localeCompare(b.title);
      if (sortBy === 'zyx') return b.title.localeCompare(a.title);
      if (sortBy === 'size-large') return (b.downloadSizeGB || 0) - (a.downloadSizeGB || 0);
      if (sortBy === 'size-small') return (a.downloadSizeGB || 0) - (b.downloadSizeGB || 0);
      if (sortBy === 'dlc-most') return (b.dlcCount || 0) - (a.dlcCount || 0);
      if (sortBy === 'recent-release') {
        const aRelease = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const bRelease = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return bRelease - aRelease;
      }
      return 0;
    });
  }, [games, searchTerm, showAdult, specs, compFilter, tagStates, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedGames.length / ITEMS_PER_PAGE);
  const paginatedGames = filteredAndSortedGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      document.getElementById('results-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="search-platform">
      <div className="search-hero">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAdult={showAdult}
          setShowAdult={setShowAdult}
        />

        <TagCloud 
          genres={GENRES}
          tagStates={tagStates}
          cycleTag={cycleTag}
          showAdult={showAdult}
        />
      </div>

      <div className="results-toolbar" id="results-top">
        <div className="results-info">
          <span>{filteredAndSortedGames.length} Results</span>
          <div className="legend">
            <button className={`leg-btn perfect ${compFilter === 'perfect' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'perfect' ? 'all' : 'perfect')}>● Perfect</button>
            <button className={`leg-btn good ${compFilter === 'good' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'good' ? 'all' : 'good')}>● Good</button>
            <button className={`leg-btn possible ${compFilter === 'possible' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'possible' ? 'all' : 'possible')}>● Possible</button>
            <button className={`leg-btn unsupported ${compFilter === 'unsupported' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'unsupported' ? 'all' : 'unsupported')}>● Unsupported</button>
          </div>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="grid">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
        ) : paginatedGames.length === 0 ? (
          <div className="empty-state glass">
            <h3>No repacks found</h3>
            <p>Try adjusting your search criteria or compatibility filter.</p>
            <button className="btn-secondary" onClick={() => {
              setSearchTerm('');
              setCompFilter('all');
              setTagStates({});
            }}>Clear Filters</button>
          </div>
        ) : paginatedGames.map(game => {
          const status = calculateCompatibility(specs, game);
          return (
            <GameCard 
              key={game.id}
              game={game}
              status={status}
              searchTerm={searchTerm}
              onClick={setSelectedGame}
            />
          );
        })}
      </div>

      <div className="bottom-pagination">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {selectedGame && <GameSidePanel game={selectedGame} onClose={() => setSelectedGame(null)} />}

      <footer className="footer">
        <p className="credit">
          Made for gamers with a {showAdult ? 'shitty' : 'crappy'} laptop, by <a href="https://github.com/HaziqShake" target="_blank" rel="noopener noreferrer" className="highlight-link">HaziqShake</a>
        </p>
        <p className="legal">
          <strong>Disclaimer:</strong> FitCheck is an independent hardware compatibility and indexing tool. It is not affiliated with, endorsed by, or connected to FitGirl Repacks, Steam, or their respective publishers. This site acts strictly as a metadata aggregator and hardware scoring engine. FitCheck does not host, provide, or distribute any game files, software, or copyrighted material. <Link href="/disclaimer" className="nav-link">Read full disclaimer →</Link>
        </p>
      </footer>

      {showScrollTop && !selectedGame && (
        <button className="scroll-top-btn glass" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp size={24} />
        </button>
      )}

    </div>
  );
}
