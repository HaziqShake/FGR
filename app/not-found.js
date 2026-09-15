'use client';

import Link from 'next/link';
import { Home, Gamepad2, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-glow" />

      <div className="not-found-content">
        <div className="error-code-wrapper">
          <div className="error-code">404</div>
          <div className="error-scanline" />
        </div>

        <div className="error-icon-wrapper">
          <AlertTriangle className="error-icon" size={48} />
        </div>

        <h1 className="error-title">Page Not Found</h1>
        <p className="error-subtitle">
          This page doesn't exist or has been removed. Maybe it was a selective download?
        </p>

        <div className="error-actions">
          <Link href="/" className="error-btn primary">
            <Home size={18} />
            Back to Home
          </Link>
          <Link href="/random" className="error-btn secondary">
            <Gamepad2 size={18} />
            Random Game
          </Link>
        </div>

        <div className="error-hint">
          <span>Lost? Try searching for a repack on the homepage.</span>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .not-found-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(
            ellipse at center,
            rgba(248, 113, 113, 0.08) 0%,
            rgba(161, 204, 42, 0.04) 40%,
            transparent 70%
          );
          pointer-events: none;
          animation: glowPulse 8s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-code-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .error-code {
          font-size: clamp(6rem, 15vw, 10rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          background: linear-gradient(
            135deg,
            rgba(248, 113, 113, 0.8) 0%,
            rgba(161, 204, 42, 0.8) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          text-shadow: 0 0 60px rgba(248, 113, 113, 0.3);
        }

        .error-scanline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(161, 204, 42, 0.6) 50%,
            transparent 100%
          );
          animation: scanlineMove 3s linear infinite;
        }

        @keyframes scanlineMove {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(160px); opacity: 0; }
        }

        .error-icon-wrapper {
          animation: iconBounce 2s ease-in-out infinite;
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .error-icon {
          color: #f87171;
          filter: drop-shadow(0 0 20px rgba(248, 113, 113, 0.4));
        }

        .error-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
        }

        .error-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 500px;
          margin: 0;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .error-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1.75rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .error-btn.primary {
          background: var(--accent);
          color: black;
          box-shadow: 0 4px 20px rgba(161, 204, 42, 0.2);
        }

        .error-btn.primary:hover {
          background: #b8e234;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(161, 204, 42, 0.3);
        }

        .error-btn.secondary {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--border);
          color: white;
        }

        .error-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-2px);
        }

        .error-hint {
          margin-top: 2rem;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .not-found-page {
            padding: 1rem;
          }

          .error-code {
            font-size: 5rem;
          }

          .error-actions {
            flex-direction: column;
            width: 100%;
          }

          .error-btn {
            width: 100%;
            justify-content: center;
          }

          .error-hint {
            font-size: 0.75rem;
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
