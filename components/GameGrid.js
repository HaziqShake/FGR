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
        const q = query(collection(db, 'games'), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setGames(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      const next = current === 'none' ? 'included' : current === 'included' ? 'excluded' : 'none';
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
        return game.genres?.includes(t) || game.steamGenres?.includes(t);
      });
      const hasExcludes = excludedTags.some(t => {
        if (t === 'Adult') return game.isAdult;
        if (t === 'Selective Download') return game.hasSelectiveDownload;
        if (t === 'Has DLC') return game.dlcCount > 0;
        if (t === 'Hypervisor') return game.isHypervisor;
        return game.genres?.includes(t) || game.steamGenres?.includes(t);
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
      if (sortBy === 'size') return (b.downloadSizeGB || 0) - (a.downloadSizeGB || 0);
      if (sortBy === 'popular') return (b.steamRating || 0) - (a.steamRating || 0);
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

      <style jsx global>{`
        .search-platform { margin-top: 2rem; }
        .search-hero { margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .search-container { width: 100%; max-width: 900px; display: flex; align-items: center; padding: 0.75rem 1.5rem; border-radius: 50px; border: 1px solid rgba(161, 204, 42, 0.2); }
        .search-icon { color: var(--accent); margin-right: 1.5rem; }
        .search-container input { background: transparent; border: none; color: white; font-size: 1rem; flex-grow: 1; outline: none; }
        
        .sort-box { display: flex; align-items: center; gap: 0.5rem; padding: 0 1.25rem; border-left: 1px solid var(--border); }
        .sort-box select { background: #1a1a1a; border: 1px solid var(--border); border-radius: 6px; color: white; font-size: 0.7rem; padding: 0.3rem 0.6rem; outline: none; cursor: pointer; appearance: none; }
        
        .nsfw-toggle { 
          display: flex; align-items: center; gap: 0.75rem; padding: 0 1.25rem; border-left: 1px solid var(--border); 
          cursor: pointer; user-select: none; transition: all 0.2s;
        }
        .nsfw-badge { font-family: monospace; font-weight: 900; background: #333; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.6rem; }
        .nsfw-toggle.active .nsfw-badge { background: #f87171; color: white; box-shadow: 0 0 10px rgba(248, 113, 113, 0.3); }
        .nsfw-toggle span { font-size: 0.65rem; font-weight: 800; color: var(--text-secondary); }
        .nsfw-toggle.active span { color: #f87171; }

        .tag-cloud { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; max-width: 900px; }
        .tag-chip { padding: 0.5rem 1.25rem; border-radius: 20px; font-size: 0.8rem; border: 1px solid var(--border); background: rgba(255,255,255,0.03); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .tag-chip.included { background: rgba(74, 222, 128, 0.1); border-color: #4ade80; color: #4ade80; }
        .tag-chip.excluded { background: rgba(248, 113, 113, 0.1); border-color: #f87171; color: #f87171; }

        .results-toolbar { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .results-info { display: flex; justify-content: space-between; align-items: center; }
        
        .legend { display: flex; gap: 0.5rem; }
        .leg-btn { background: none; border: 1px solid transparent; color: var(--text-secondary); font-size: 0.75rem; cursor: pointer; padding: 0.4rem 0.8rem; border-radius: 6px; }
        .leg-btn.active { border-color: white; color: white; background: rgba(255,255,255,0.05); }
        .leg-btn.perfect { color: #4ade80; }
        .leg-btn.good { color: var(--accent); }
        .leg-btn.possible { color: #fbbf24; }
        .leg-btn.unsupported { color: #f87171; }

        .pagination { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 2rem 0; width: 100%; }
        .page-numbers { display: flex; gap: 0.5rem; align-items: center; }
        .num-btn { 
          appearance: none;
          -webkit-appearance: none;
          padding: 0;
          margin: 0;
          font-family: inherit;
          min-width: 38px; 
          height: 38px; 
          border-radius: 8px; 
          border: 1px solid var(--border); 
          background: rgba(255,255,255,0.03); 
          color: white; 
          cursor: pointer; 
          font-size: 0.85rem; 
          font-weight: 700;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .num-btn:hover { border-color: var(--accent); background: rgba(161, 204, 42, 0.05); }
        .num-btn.active { background: var(--accent); color: black; border-color: var(--accent); box-shadow: 0 0 15px rgba(161, 204, 42, 0.2); }
        .pag-btn { 
          appearance: none;
          -webkit-appearance: none;
          padding: 0;
          margin: 0;
          font-family: inherit;
          background: rgba(255,255,255,0.03); 
          border: 1px solid var(--border); 
          color: white; 
          width: 38px;
          height: 38px;
          border-radius: 8px; 
          cursor: pointer; 
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .pag-btn:hover:not(:disabled) { border-color: var(--accent); background: rgba(161, 204, 42, 0.1); }
        .pag-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .dots { color: var(--text-secondary); opacity: 0.8; font-weight: 900; margin: 0 0.5rem; }

        .bottom-pagination { margin-top: 4rem; padding-bottom: 4rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2.5rem; }
        .game-card { display: flex; flex-direction: column; overflow: hidden; position: relative; transition: var(--transition); border: 1px solid var(--border); cursor: pointer; }
        .game-card:hover { transform: translateY(-8px); border-color: var(--border); }
        .game-card.perfect:hover { box-shadow: 0 0 30px rgba(74, 222, 128, 0.15); border-color: #4ade80; }
        .game-card.good:hover { box-shadow: 0 0 30px rgba(161, 204, 42, 0.15); border-color: var(--accent); }
        .game-card.possible:hover { box-shadow: 0 0 30px rgba(251, 191, 36, 0.15); border-color: #fbbf24; }
        .game-card.unsupported:hover { box-shadow: 0 0 30px rgba(248, 113, 113, 0.15); border-color: #f87171; }
        
        .image-wrapper { height: 380px; position: relative; overflow: hidden; }
        .poster { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; transition: transform 0.5s ease; }
        .game-card:hover .poster { transform: scale(1.04); }
        .poster-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }
        
        .status-badge { align-self: flex-start; margin-bottom: 0.5rem; padding: 0.4rem 0.8rem; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-radius: 6px; font-size: 0.65rem; font-weight: 950; text-transform: uppercase; z-index: 3; border: 1px solid rgba(255,255,255,0.05); }
        .perfect .status-badge { color: #4ade80; border-color: rgba(74, 222, 128, 0.2); }
        .good .status-badge { color: var(--accent); border-color: rgba(161, 204, 42, 0.2); }
        .possible .status-badge { color: #fbbf24; border-color: rgba(251, 191, 36, 0.2); }
        .unsupported .status-badge { color: #f87171; border-color: rgba(248, 113, 113, 0.2); }

        .content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
        .content h3 { font-size: 0.95rem; margin-bottom: 0.75rem; color: #fff; }
        .game-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .mini-tag { font-size: 0.6rem; padding: 0.2rem 0.6rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; color: var(--text-secondary); }

        .action-btn { margin-top: auto; text-align: center; padding: 0.9rem; background: var(--accent); color: black; font-weight: 900; font-size: 0.8rem; border-radius: 8px; text-decoration: none; display: block; }

        .specs-line { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .spec-chip { font-size: 0.6rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: var(--text-secondary); white-space: nowrap; }
        .spec-chip.gpu { color: #a78bfa; border-color: rgba(167, 139, 250, 0.2); background: rgba(167, 139, 250, 0.05); max-width: 180px; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
        .spec-chip.ram { color: #60a5fa; border-color: rgba(96, 165, 250, 0.2); background: rgba(96, 165, 250, 0.05); }
        .spec-chip.size { color: #94a3b8; }
        .spec-chip.steam { color: #67c1f5; border-color: rgba(103, 193, 245, 0.3); background: rgba(103, 193, 245, 0.05); text-decoration: none; cursor: pointer; }
        .spec-chip.steam:hover { background: rgba(103, 193, 245, 0.15); }
        .spec-chip.hv { color: #f87171; border-color: rgba(248, 113, 113, 0.3); background: rgba(248, 113, 113, 0.1); }
        .mini-tag.selective { color: #34d399; border-color: rgba(52, 211, 153, 0.2); background: rgba(52, 211, 153, 0.05); }
        .mini-tag.dlc { color: #fbbf24; border-color: rgba(251, 191, 36, 0.2); background: rgba(251, 191, 36, 0.05); }

        @media (max-width: 650px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .image-wrapper { height: 220px; }
          .content { padding: 0.75rem; }
          .content h3 { font-size: 0.75rem; margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .specs-line { gap: 0.25rem; }
          .spec-chip { font-size: 0.55rem; padding: 0.2rem 0.4rem; }
          .spec-chip.gpu { max-width: 100px; }
          .game-tags { gap: 0.25rem; margin-bottom: 1rem; }
          .mini-tag { font-size: 0.55rem; padding: 0.15rem 0.4rem; }
          .action-btn { font-size: 0.7rem; padding: 0.6rem; }
          .status-badge { font-size: 0.55rem; padding: 0.25rem 0.5rem; top: 0.5rem; right: 0.5rem; }
          
          .results-info { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .legend { flex-wrap: wrap; }
          
          .search-container { 
            flex-wrap: wrap; 
            border-radius: 16px; 
            padding: 0.75rem; 
            gap: 0.5rem;
          }
          .search-icon { margin-right: 0.5rem; width: 18px; }
          .search-container input { min-width: 0; font-size: 0.9rem; flex-basis: 60%; }
          .search-container input::placeholder { 
            color: rgba(255, 255, 255, 0.2); 
            font-size: 0.8rem;
          }
          
          .sort-box { border-left: none; padding: 0; flex-grow: 1; justify-content: flex-end; }
          .sort-box select { font-size: 0.65rem; padding: 0.2rem 0.4rem; }
          
          .nsfw-toggle { border-left: none; padding: 0; gap: 0.4rem; }
          .nsfw-toggle span { display: none; }
          .nsfw-badge { font-size: 0.55rem; padding: 0.15rem 0.4rem; }
          
          .search-hero h1 { font-size: 2rem; text-align: center; }
          .clear-btn { margin-left: auto; }
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          gap: 1rem;
        }
        .empty-state h3 { font-size: 1.5rem; color: #fff; }
        .empty-state p { color: var(--text-secondary); margin-bottom: 1rem; }
        .empty-state .btn-secondary { padding: 0.8rem 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; cursor: pointer; transition: 0.2s; }
        .empty-state .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        span.highlight {
          color: var(--accent);
          font-weight: 900;
        }

        .footer {
          margin-top: 4rem;
          padding: 3rem 0;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .footer .credit {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .footer .highlight-link {
          color: var(--accent);
          font-weight: 700;
          text-decoration: none;
        }
        .footer .highlight-link:hover {
          text-decoration: underline;
        }
        .footer .legal {
          color: var(--text-secondary);
          font-size: 0.75rem;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          opacity: 0.5;
        }
        .footer .nav-link { font-weight: bold; color: inherit; }
        .footer .nav-link:hover { color: var(--accent); }

        .scroll-top-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(161, 204, 42, 0.1);
          border: 1px solid rgba(161, 204, 42, 0.3);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          transition: 0.3s;
        }
        .scroll-top-btn:hover {
          background: var(--accent);
          color: black;
          transform: translateY(-4px);
        }
        @media (max-width: 650px) {
          .scroll-top-btn { bottom: 1rem; right: 1rem; }
        }
      `}</style>
    </div>
  );
}
