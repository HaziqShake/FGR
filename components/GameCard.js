'use client';

import { useState } from 'react';
import { Monitor, Loader2, Gamepad2, Star } from 'lucide-react';
import { getSteamRatingLabel, getRatingColorClass } from '../utils/parse-requirements.js';

const getInitials = (title) => {
  if (!title) return '';
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.charAt(0).toUpperCase();
};

export default function GameCard({ game, status, searchTerm, onClick }) {
  const [imgState, setImgState] = useState(game.imageUrl ? 'loading' : 'empty');

  // Rating label derived from score
  const ratingLabel = game.steamRatingLabel || (game.steamRatingScore != null ? getSteamRatingLabel(game.steamRatingScore) : null);
  const ratingColorClass = ratingLabel && ratingLabel !== 'N/A' ? getRatingColorClass(ratingLabel) : 'rating-na';

  // Highlight search matches
  let titleNode = game.title;
  if (searchTerm) {
    const parts = game.title.split(new RegExp(`(${searchTerm})`, 'gi'));
    titleNode = parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase()
        ? <span key={i} className="highlight">{part}</span>
        : part
    );
  }

  return (
    <div className={`game-card glass ${status}`} onClick={() => onClick(game)}>
      <div className="image-wrapper">
        {imgState === 'loading' && (
          <div className="thumbnail-loader">
            <div className="shimmer-overlay"></div>
            <div className="spinner-container">
              <Loader2 className="spinner-icon" size={28} />
              <span className="loader-text">LOADING...</span>
            </div>
          </div>
        )}

        {(imgState === 'empty' || imgState === 'error') && (
          <div className="slick-placeholder">
            <div className="crt-grid"></div>
            <div className="crt-scanline"></div>
            <div className="placeholder-initials">{getInitials(game.title)}</div>
            <div className="placeholder-content">
              <Gamepad2 className="placeholder-icon" size={32} />
              <span className="placeholder-status">NO PREVIEW</span>
            </div>
          </div>
        )}

        {game.imageUrl && imgState !== 'error' && (
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            loading="lazy" 
            className={`poster ${imgState === 'loaded' ? 'visible' : 'hidden'}`}
            onLoad={() => setImgState('loaded')}
            onError={() => setImgState('error')}
          />
        )}
      </div>
      <div className="content">
        <div className={`status-badge ${status}`}>
          {status === 'unknown' ? 'No Specs' : status}
        </div>
        <h3>{titleNode}</h3>
        {/* Real Specs Line from Steam */}
        <div className="specs-line">
          {game.minGPUname && (
            <span className="spec-chip gpu" title="Minimum GPU">
              <Monitor size={12} style={{marginRight: '4px', verticalAlign: 'middle'}} /> {game.minGPUname}
            </span>
          )}
          {game.minRAMgb && <span className="spec-chip ram" title="Minimum RAM">{game.minRAMgb}GB RAM</span>}
          {game.downloadSizeGB && <span className="spec-chip size">{game.downloadSizeGB.toFixed(1)}GB DL</span>}
          {/* Steam Rating chip — shows for all Steam games, N/A if no score */}
          {game.steamAppId && (
            <span
              className={`spec-chip rating-chip ${ratingColorClass}`}
              title={ratingLabel ? `Steam Rating: ${ratingLabel}` : 'No rating available'}
            >
              <Star size={10} style={{marginRight: '3px', verticalAlign: 'middle'}} />
              {game.steamRatingScore != null
                ? `${game.steamRatingScore} · ${ratingLabel}`
                : 'N/A'}
            </span>
          )}
          {game.steamIsFree && <span className="spec-chip free-badge">FREE</span>}
          {game.steamAppId && (
            <a
              href={`https://store.steampowered.com/app/${game.steamAppId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-chip steam"
              onClick={e => e.stopPropagation()}
            >
              Steam ↗
            </a>
          )}
          {game.source === 'steam' && (
            <span className="spec-chip steam-badge" title="Free on Steam">
              Steam
            </span>
          )}
          {game.isHypervisor && <span className="spec-chip hv">Hypervisor</span>}
        </div>
        <div className="game-tags">
          {(game.steamGenres?.length ? game.steamGenres : game.genres)?.filter(g => g.trim() !== '').slice(0, 4).map(genre => (
            <span key={genre} className="mini-tag">{genre}</span>
          ))}
          {game.hasSelectiveDownload && <span className="mini-tag selective">Selective DL</span>}
          {game.dlcCount > 0 && <span className="mini-tag dlc">+{game.dlcCount} DLC</span>}
        </div>
        {game.source === 'steam' ? (
          <a
            href={game.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn steam-action-btn"
            onClick={(e) => { e.stopPropagation(); }}
          >
            FREE ON STEAM →
          </a>
        ) : (
          <a href={game.repackUrl} target="_blank" rel="noopener noreferrer" className="action-btn" onClick={(e) => { e.stopPropagation(); }}>GET REPACK</a>
        )}
      </div>

      <style jsx>{`
        .rating-chip { font-size: 0.65rem !important; }
        .rating-overwhelmingly-positive { color: #4ade80; border-color: rgba(74,222,128,0.3); background: rgba(74,222,128,0.08); }
        .rating-very-positive           { color: #86efac; border-color: rgba(134,239,172,0.3); background: rgba(134,239,172,0.08); }
        .rating-mostly-positive         { color: #a3e635; border-color: rgba(163,230,53,0.3);  background: rgba(163,230,53,0.08); }
        .rating-mixed                   { color: #fbbf24; border-color: rgba(251,191,36,0.3);  background: rgba(251,191,36,0.08); }
        .rating-mostly-negative         { color: #fb923c; border-color: rgba(251,146,60,0.3);  background: rgba(251,146,60,0.08); }
        .rating-overwhelmingly-negative { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.08); }
        .rating-na                      { color: #64748b; border-color: rgba(100,116,139,0.2); background: rgba(100,116,139,0.05); }
        .free-badge {
          color: #34d399 !important;
          border-color: rgba(52,211,153,0.3) !important;
          background: rgba(52,211,153,0.08) !important;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .steam-badge {
          background: rgba(103, 193, 245, 0.05);
          border-color: rgba(103, 193, 245, 0.3);
          color: #67c1f5;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }
        .steam-action-btn {
          background: #67c1f5;
          color: black;
          font-weight: 900;
        }
        .steam-action-btn:hover {
          background: #5ab8f0;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
