'use client';

import { Monitor } from 'lucide-react';

const getInitials = (title) => {
  if (!title) return '';
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.charAt(0).toUpperCase();
};

export default function GameCard({ game, status, searchTerm, onClick }) {
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
        {game.imageUrl
          ? <img src={game.imageUrl} alt={game.title} loading="lazy" className="poster" />
          : <div className="poster-fallback">{getInitials(game.title)}</div>
        }
      </div>
      <div className="content">
        <div className={`status-badge ${status}`}>{status}</div>
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
          {game.isHypervisor && <span className="spec-chip hv">Hypervisor</span>}
        </div>
        <div className="game-tags">
          {(game.steamGenres?.length ? game.steamGenres : game.genres)?.filter(g => g.trim() !== '').slice(0, 4).map(genre => (
            <span key={genre} className="mini-tag">{genre}</span>
          ))}
          {game.hasSelectiveDownload && <span className="mini-tag selective">Selective DL</span>}
          {game.dlcCount > 0 && <span className="mini-tag dlc">+{game.dlcCount} DLC</span>}
        </div>
        <a href={game.repackUrl} target="_blank" rel="noopener noreferrer" className="action-btn" onClick={(e) => { e.stopPropagation(); }}>GET REPACK</a>
      </div>
    </div>
  );
}
