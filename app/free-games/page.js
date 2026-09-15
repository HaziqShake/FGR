'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, ExternalLink, ChevronLeft, ChevronRight, Search, Loader2, Gamepad2, AlertCircle, RefreshCw, Monitor } from 'lucide-react';
import { getSteamRatingLabel, getRatingColorClass } from '../../utils/parse-requirements.js';
import { useScanner } from '../../hooks/useScanner';
import { calculateCompatibility } from '../../utils/hardware-tiers';
import SearchBar from '../../components/SearchBar';
import TagCloud from '../../components/TagCloud';
import './page.css';

function decodeHtml(html = '') {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&trade;/g, '™')
    .replace(/&reg;/g, '®');
}

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
function SteamGameCard({ game, specs }) {
  const [imgState, setImgState] = useState('loading');
  const ratingLabel      = game.ratingLabel || getSteamRatingLabel(game.ratingScore);
  const ratingColorClass = getRatingColorClass(ratingLabel);
  const status           = calculateCompatibility(specs, game);

  const handleOpen = (e) => {
    e.preventDefault();
    const appId = game.appId;
    const webUrl = game.steamUrl || `https://store.steampowered.com/app/${appId}/`;
    const steamProtocolUrl = `steam://store/${appId}`;

    let didBlur = false;
    const onBlur = () => {
      didBlur = true;
    };
    window.addEventListener('blur', onBlur, { once: true });

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = steamProtocolUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      if (!didBlur) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 700);
  };

  const titleText = decodeHtml(game.name);

  return (
    <a
      href={game.steamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`steam-card ${status}`}
      id={`steam-game-${game.appId}`}
      onClick={handleOpen}
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
          alt={titleText}
          className={`steam-card-img ${imgState === 'loaded' ? 'visible' : ''}`}
          onLoad={() => setImgState('loaded')}
          onError={() => setImgState('error')}
        />
        {imgState === 'error' && (
          <div className="steam-img-fallback">
            <Gamepad2 size={28} style={{ color: '#67c1f5', opacity: 0.4 }} />
          </div>
        )}
      </div>

      <div className="steam-card-body">
        <div className="steam-card-header">
          <div className={`status-badge ${status}`}>
            {status === 'unknown' ? 'No Specs' : status}
          </div>
        </div>

        <h3 className="steam-card-title" title={titleText}>{titleText}</h3>

        {/* Specs line */}
        <div className="specs-line">
          {game.minGPUname && (
            <span className="spec-chip gpu" title={`Minimum GPU: ${game.minGPUname}`}>
              <Monitor size={11} style={{ marginRight: '3px', verticalAlign: 'middle' }} /> {game.minGPUname}
            </span>
          )}
          {game.minRAMgb && <span className="spec-chip ram" title={`Minimum RAM: ${game.minRAMgb}GB`}>{game.minRAMgb}GB RAM</span>}
          <span className="spec-chip free-badge">FREE</span>
        </div>

        {/* Genres */}
        {game.genres?.length > 0 && (
          <div className="steam-genres">
            {game.genres.slice(0, 3).map(g => (
              <span key={g} className="steam-genre-tag">{decodeHtml(g)}</span>
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
            Play on Steam <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function FreeSteamGamesPage() {
  const { specs }                 = useScanner();
  const [games, setGames]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [compFilter, setCompFilter] = useState('all');
  const LIMIT = 32;

  const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Simulation', 'Horror', 'Open World', 'Multiplayer', 'Indie', 'Casual', 'Adult'];
  const [tagStates, setTagStates] = useState({});
  const [showAdult, setShowAdult] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

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

  const includedTags = useMemo(() => {
    return Object.entries(tagStates)
      .filter(([_, s]) => s === 'included')
      .map(([t]) => t);
  }, [tagStates]);

  const excludedTags = useMemo(() => {
    return Object.entries(tagStates)
      .filter(([_, s]) => s === 'excluded')
      .map(([t]) => t);
  }, [tagStates]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 on any filter or sort change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, showAdult, includedTags, excludedTags, compFilter]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page:   String(page),
        limit:  String(LIMIT),
        sort:   sortBy,
        search: debouncedSearch,
      });
      if (includedTags.length > 0) {
        params.set('tags', includedTags.join(','));
      }
      if (excludedTags.length > 0) {
        params.set('untags', excludedTags.join(','));
      }
      if (showAdult) {
        params.set('showAdult', 'true');
      }
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
  }, [page, debouncedSearch, sortBy, includedTags, excludedTags, showAdult]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filteredGames = useMemo(() => {
    if (compFilter === 'all') return games;
    return games.filter(game => {
      const status = calculateCompatibility(specs, game);
      return status === compFilter;
    });
  }, [games, compFilter, specs]);

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
            <p className="free-subtitle">Free games on Steam</p>

            {/* Exact Search of Repacks Page with Steam Blue Accent */}
            <div className="search-platform">
              <div className="search-hero">
                <SearchBar
                  accentColor="#67c1f5"
                  placeholder="Search free Steam games..."
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
                  accentColor="#67c1f5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="container free-content">

        {/* Results bar */}
        <div className="free-toolbar">
          <div className="free-toolbar-left">
            <span className="free-count">
              {loading ? 'Loading…' : error ? 'Error' : `${(compFilter === 'all' ? total : filteredGames.length).toLocaleString()} free games`}
            </span>
            <div className="legend">
              <button className={`leg-btn perfect ${compFilter === 'perfect' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'perfect' ? 'all' : 'perfect')}>● Perfect</button>
              <button className={`leg-btn good ${compFilter === 'good' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'good' ? 'all' : 'good')}>● Good</button>
              <button className={`leg-btn possible ${compFilter === 'possible' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'possible' ? 'all' : 'possible')}>● Possible</button>
              <button className={`leg-btn unsupported ${compFilter === 'unsupported' ? 'active' : ''}`} onClick={() => setCompFilter(curr => curr === 'unsupported' ? 'all' : 'unsupported')}>● Unsupported</button>
            </div>
          </div>
          <span className="free-sort-label">
            Sorted by: <strong>
              {sortBy === 'newest' ? 'Newest on Steam'
              : sortBy === 'oldest' ? 'Oldest Added'
              : sortBy === 'popular' ? 'Popular'
              : sortBy === 'name' || sortBy === 'abc' ? 'Name A-Z'
              : sortBy === 'zyx' ? 'Name Z-A'
              : sortBy === 'size-large' ? 'Largest Size'
              : sortBy === 'size-small' ? 'Smallest Size'
              : sortBy === 'dlc-most' ? 'Most DLC'
              : sortBy === 'recent-release' ? 'Recent Release'
              : 'Newest on Steam'}
            </strong>
          </span>
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
            : filteredGames.map(game => <SteamGameCard key={game.appId} game={game} specs={specs} />)
          }
        </div>

        {/* Empty state */}
        {!loading && !error && filteredGames.length === 0 && (
          <div className="free-empty glass">
            <Gamepad2 size={32} style={{ color: '#67c1f5', opacity: 0.4 }} />
            <p>No games found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}{compFilter !== 'all' ? ` matching "${compFilter}" compatibility` : ''}.</p>
            {compFilter !== 'all' && (
              <button className="btn-secondary" style={{ marginTop: '0.75rem', padding: '0.35rem 0.85rem', cursor: 'pointer', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid var(--border)' }} onClick={() => setCompFilter('all')}>Show All</button>
            )}
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
    </main>
  );
}
