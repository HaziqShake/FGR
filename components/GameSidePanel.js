'use client';

import { X, ExternalLink } from 'lucide-react';
import { calculateCompatibility } from '../utils/hardware-tiers';
import { useScanner } from '../hooks/useScanner';

const getInitials = (title) => {
  if (!title) return '';
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.charAt(0).toUpperCase();
};

export default function GameSidePanel({ game, onClose }) {
  const { specs } = useScanner();

  if (!game) return null;

  const status = calculateCompatibility(specs, game);

  const StatusExplanation = () => {
    switch (status) {
      case 'perfect': return "Your rig comfortably meets or exceeds the recommended hardware requirements for this title.";
      case 'good': return "Your rig meets the minimum requirements and should provide a stable, playable experience on normal/low settings.";
      case 'possible': return "Your rig is slightly below the minimum requirements. The game might run, but expect performance drops, visual artifacts, or crashes.";
      case 'unsupported': return "Your hardware lacks the necessary compute power or architectural features to run this game natively.";
      default: return "Hardware requirements are unknown for this title.";
    }
  };

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <div className="side-panel glass">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>

        <div className="scroll-area">
          <div className="panel-hero">
            {game.imageUrl
              ? <img src={game.imageUrl} alt={game.title} className="panel-poster" />
              : <div className="panel-poster-fallback">{getInitials(game.title)}</div>
            }
            <div className="hero-gradient"></div>
          </div>

          <div className="panel-content">
            <div className="header-row">
              <h2>{game.title}</h2>
              <div className={`status-badge ${status}`}>{status}</div>
            </div>

            <p className="status-desc">{StatusExplanation()}</p>

            <div className="action-row">
              <a href={game.repackUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                GET REPACK <ExternalLink size={14} />
              </a>
              {game.steamAppId && (
                <a href={`https://store.steampowered.com/app/${game.steamAppId}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  STEAM PAGE <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div className="specs-card">
              <h3>System Requirements</h3>
              <div className="spec-grid">
                <div className="spec-col">
                  <h4>Minimum</h4>
                  <div className="spec-item">
                    <span className="label">GPU</span>
                    <span className="val">{game.minGPUname || 'Unknown'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">RAM</span>
                    <span className="val">{game.minRAMgb ? `${game.minRAMgb} GB` : 'Unknown'}</span>
                  </div>
                </div>
                <div className="spec-divider"></div>
                <div className="spec-col">
                  <h4>Recommended</h4>
                  <div className="spec-item">
                    <span className="label">GPU</span>
                    <span className="val">{game.recGPUname || 'Unknown'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">RAM</span>
                    <span className="val">{game.recRAMgb ? `${game.recRAMgb} GB` : 'Unknown'}</span>
                  </div>
                </div>
              </div>
              {(game.downloadSizeGB || game.originalSizeGB) && (
                <div className="storage-info">
                  {game.downloadSizeGB && <span><strong>DL:</strong> {game.downloadSizeGB.toFixed(1)} GB</span>}
                  {game.originalSizeGB && <span><strong>Installed:</strong> {game.originalSizeGB.toFixed(1)} GB</span>}
                </div>
              )}
            </div>

            <div className="metadata-section">
              <h3>Genres & Tags</h3>
              <div className="tags-wrap">
                {(game.steamGenres || game.genres || []).map(g => <span key={g} className="tag">{g}</span>)}
                {game.hasSelectiveDownload && <span className="tag selective">Selective DL</span>}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .panel-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 999;
            animation: fadeIn 0.3s ease;
          }
          
          .side-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            max-width: 450px;
            background: #111;
            z-index: 1000;
            border-left: 1px solid var(--border);
            border-radius: 0;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
          }

          .scroll-area {
            flex-grow: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }

          .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 10;
            background: rgba(0,0,0,0.5);
            border: none;
            color: white;
            padding: 0.5rem;
            border-radius: 50%;
            cursor: pointer;
            backdrop-filter: blur(4px);
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .close-btn:hover { background: rgba(255,255,255,0.2); }

          .panel-hero {
            height: 300px;
            position: relative;
          }
          .panel-poster {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
          }
          .panel-poster-fallback {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            font-weight: 900;
            color: rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
          }
          .hero-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, #111, transparent);
          }

          .panel-content {
            padding: 2rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            position: relative;
            z-index: 2;
          }

          .header-row {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .header-row h2 {
            font-size: 1.8rem;
            font-weight: 900;
            line-height: 1.1;
          }
          
          .status-badge {
            align-self: flex-start;
            padding: 0.4rem 0.8rem;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 900;
            text-transform: uppercase;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .perfect { color: #4ade80; border-color: rgba(74, 222, 128, 0.3); background: rgba(74, 222, 128, 0.1); }
          .good { color: var(--accent); border-color: rgba(161, 204, 42, 0.3); background: rgba(161, 204, 42, 0.1); }
          .possible { color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.1); }
          .unsupported { color: #f87171; border-color: rgba(248, 113, 113, 0.3); background: rgba(248, 113, 113, 0.1); }

          .status-desc {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .action-row {
            display: flex;
            gap: 1rem;
          }
          .btn-primary, .btn-secondary {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.9rem;
            border-radius: 8px;
            font-weight: 800;
            font-size: 0.8rem;
            text-decoration: none;
            transition: all 0.2s;
          }
          .btn-primary {
            background: var(--accent);
            color: black;
          }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(161, 204, 42, 0.2); }
          .btn-secondary {
            background: rgba(255,255,255,0.05);
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .btn-secondary:hover { background: rgba(255,255,255,0.1); }

          .specs-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
          }
          .specs-card h3 { font-size: 1rem; margin-bottom: 1.5rem; color: #fff; }
          
          .spec-grid {
            display: flex;
            gap: 1.5rem;
          }
          .spec-col { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
          .spec-divider { width: 1px; background: var(--border); }
          
          .spec-col h4 { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.5rem; }
          
          .spec-item { display: flex; flex-direction: column; gap: 0.25rem; }
          .spec-item .label { font-size: 0.7rem; color: var(--text-secondary); font-weight: 700; }
          .spec-item .val { font-size: 0.85rem; font-weight: 600; }
          
          .storage-info {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            display: flex;
            gap: 1.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
          }
          .storage-info strong { color: white; }

          .metadata-section h3 { font-size: 1rem; margin-bottom: 1rem; color: #fff; }
          .tags-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .tag {
            padding: 0.3rem 0.75rem;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            font-size: 0.75rem;
            color: var(--text-secondary);
          }
          .tag.selective { color: #34d399; border-color: rgba(52, 211, 153, 0.3); background: rgba(52, 211, 153, 0.1); }

          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @media (max-width: 600px) {
            .side-panel {
              max-width: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
