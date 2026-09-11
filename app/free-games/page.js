'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, ExternalLink, ChevronLeft, ChevronRight, Search, Loader2, Gamepad2, AlertCircle, RefreshCw } from 'lucide-react';
import { getSteamRatingLabel, getRatingColorClass } from '../../utils/parse-requirements.js';

// ─── SKELETON CARD ─────────────────────────────────────────────────────────────
function SteamSkeleton() {
  return (
    <div className="steam-card skeleton">
      <div className="steam-card-img skeleton-block" />
      <div className="steam-card-body">
        <div className="skeleton-block" style={{ height: '1rem', width: '80%', marginBottom: '0.5rem' }} />
        <div className="skeleton-block" style={{ height: '0.75rem', width: '50%', marginBottom: '0.75rem' }} />
        <div className="skeleton-block" style={{ height: '0.65rem', width: '40%' }} />
      </div>
    </div>
  );
}

// ─── GAME CARD ─────────────────────────────────────────────────────────────────
function SteamGameCard({ game }) {
  const [imgState, setImgState] = useState('loading');
  const ratingLabel      = game.ratingLabel || getSteamRatingLabel(game.ratingScore);
  const ratingColorClass = getRatingColorClass(ratingLabel);

  return (
    <a
      href={game.steamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="steam-card"
      id={`steam-game-${game.appId}`}
    >
      <div className="steam-card-img-wrapper">
        {imgState === 'loading' && (
          <div className="steam-img-loader">
            <div className="shimmer-overlay" />
            <Loader2 className="spin-icon" size={24} />
          </div>
        )}
        <img
          src={game.headerImage || game.imageUrl || `https://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/header.jpg`}
          alt={game.name}
          className={`steam-card-img ${imgState === 'loaded' ? 'visible' : ''}`}
          onLoad={() => setImgState('loaded')}
          onError={() => setImgState('error')}
        />
        {imgState === 'error' && (
          <div className="steam-img-fallback">
            <Gamepad2 size={28} style={{ color: 'var(--accent)', opacity: 0.4 }} />
          </div>
        )}
        <div className="steam-card-img-gradient" />
        <span className="free-pill-overlay">FREE</span>
      </div>

      <div className="steam-card-body">
        <h3 className="steam-card-title" title={game.name}>{game.name}</h3>

        {/* Genres */}
        {game.genres?.length > 0 && (
          <div className="steam-genres">
            {game.genres.slice(0, 3).map(g => (
              <span key={g} className="steam-genre-tag">{g}</span>
            ))}
          </div>
        )}

        {/* Release date */}
        {game.releaseDate && (
          <p className="steam-release">
            {game.releaseDate}
          </p>
        )}

        {/* Rating */}
        <div className={`steam-rating ${ratingColorClass}`}>
          <Star size={11} />
          <span>
            {game.ratingScore != null
              ? `${game.ratingScore} — ${ratingLabel}`
              : ratingLabel === 'N/A' ? 'No Rating' : ratingLabel}
          </span>
        </div>

        <div className="steam-card-footer">
          <span className="steam-link-hint">
            View on Steam <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function FreeSteamGamesPage() {
  const [games, setGames]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const LIMIT = 30;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page:   String(page),
        limit:  String(LIMIT),
        sort:   'newest',           // sorted by Steam listing date
        search: debouncedSearch,
      });
      const res = await fetch(`/api/steam-games?${params}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setGames(data.games || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const changePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="free-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="free-hero">
        <div className="free-hero-glow" />
        <div className="container">
          <div className="free-hero-inner">
            <span className="free-eyebrow">Steam Store</span>
            <h1 className="free-title">Free to Play</h1>
            <p className="free-subtitle">
              Browse free Steam games — sorted by newest listing date. Includes adult titles.
            </p>

            {/* Search */}
            <div className="free-search-wrap">
              <Search size={16} className="free-search-icon" />
              <input
                id="free-games-search"
                className="free-search-input"
                type="text"
                placeholder="Search free games..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="free-search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="container free-content">

        {/* Results bar */}
        <div className="free-toolbar">
          <span className="free-count">
            {loading ? 'Loading…' : error ? 'Error' : `${total.toLocaleString()} free games`}
          </span>
          <span className="free-sort-label">Sorted by: <strong>Newest on Steam</strong></span>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="free-error glass">
            <AlertCircle size={20} />
            <p>Steam API unavailable: {error}</p>
            <button className="retry-btn" onClick={fetchGames}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="steam-grid">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SteamSkeleton key={i} />)
            : games.map(game => <SteamGameCard key={game.appId} game={game} />)
          }
        </div>

        {/* Empty state */}
        {!loading && !error && games.length === 0 && (
          <div className="free-empty glass">
            <Gamepad2 size={32} style={{ color: 'var(--accent)', opacity: 0.4 }} />
            <p>No games found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="free-pagination" id="free-pagination">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) {
                p = i + 1;
              } else if (page <= 4) {
                p = i + 1;
              } else if (page >= totalPages - 3) {
                p = totalPages - 6 + i;
              } else {
                p = page - 3 + i;
              }
              return (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => changePage(p)}
                >
                  {p}
                </button>
              );
            })}

            <button
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => changePage(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Page Layout ──────────────────────────────────────────────────── */
        .free-page { min-height: 100vh; padding-bottom: 6rem; }

        .free-hero {
          position: relative;
          padding: 5rem 0 3.5rem;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .free-hero-glow {
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse at center, rgba(161,204,42,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .free-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        .free-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--accent);
          opacity: 0.8;
        }
        .free-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .free-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.6;
        }

        /* ── Search ───────────────────────────────────────────────────────── */
        .free-search-wrap {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin-top: 0.5rem;
        }
        .free-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }
        .free-search-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .free-search-input:focus { border-color: var(--accent); }
        .free-search-input::placeholder { color: var(--text-secondary); }
        .free-search-clear {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.25rem;
          line-height: 1;
        }
        .free-search-clear:hover { color: white; }

        /* ── Toolbar ──────────────────────────────────────────────────────── */
        .free-content { padding-top: 2rem; }
        .free-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .free-count { font-weight: 600; }
        .free-sort-label strong { color: white; }

        /* ── Game Grid ────────────────────────────────────────────────────── */
        .steam-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* ── Card ─────────────────────────────────────────────────────────── */
        .steam-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .steam-card:hover {
          transform: translateY(-4px);
          border-color: rgba(161,204,42,0.4);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(161,204,42,0.1);
        }

        /* Image */
        .steam-card-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 460/215;
          background: #0c0c0c;
          overflow: hidden;
          flex-shrink: 0;
        }
        .steam-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.4s ease;
          display: block;
        }
        .steam-card-img.visible { opacity: 1; }
        .steam-card-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%);
          pointer-events: none;
        }
        .steam-img-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0c0c0c;
        }
        .steam-img-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0c0c0c;
        }
        .spin-icon {
          color: var(--accent);
          animation: spin 1s linear infinite;
          opacity: 0.5;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .shimmer-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          animation: shimmer 1.8s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* FREE pill */
        .free-pill-overlay {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.4);
          color: #34d399;
          font-size: 0.6rem;
          font-weight: 900;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        /* Card body */
        .steam-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-grow: 1;
        }
        .steam-card-title {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.3;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .steam-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .steam-genre-tag {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .steam-release {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 0.1rem;
        }
        .steam-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          margin-top: auto;
          padding-top: 0.35rem;
        }
        .steam-card-footer {
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
          margin-top: 0.25rem;
        }
        .steam-link-hint {
          font-size: 0.68rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s;
        }
        .steam-card:hover .steam-link-hint { color: var(--accent); }

        /* Rating colours */
        .rating-overwhelmingly-positive { color: #4ade80; }
        .rating-very-positive           { color: #86efac; }
        .rating-mostly-positive         { color: #a3e635; }
        .rating-mixed                   { color: #fbbf24; }
        .rating-mostly-negative         { color: #fb923c; }
        .rating-overwhelmingly-negative { color: #f87171; }
        .rating-na                      { color: #64748b; }

        /* Skeleton */
        .skeleton { pointer-events: none; }
        .skeleton-block {
          background: rgba(255,255,255,0.04);
          border-radius: 6px;
          animation: skeletonPulse 1.5s ease-in-out infinite;
        }
        .steam-card.skeleton .steam-card-img {
          width: 100%;
          aspect-ratio: 460/215;
          display: block;
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Error / empty */
        .free-error, .free-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem 2rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          flex-direction: column;
          text-align: center;
          margin: 2rem 0;
        }
        .retry-btn {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .retry-btn:hover { background: rgba(255,255,255,0.1); }

        /* Pagination */
        .free-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        .page-btn {
          min-width: 2.25rem;
          height: 2.25rem;
          padding: 0 0.6rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(161,204,42,0.05);
        }
        .page-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #000;
        }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Responsive */
        @media (max-width: 600px) {
          .free-hero { padding: 3.5rem 0 2.5rem; }
          .steam-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.9rem; }
          .free-toolbar { flex-direction: column; align-items: flex-start; gap: 0.25rem; }
        }
      `}</style>
    </main>
  );
}
