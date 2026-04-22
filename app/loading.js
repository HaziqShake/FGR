'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] z-[9999]">
      <div className="pulse-logo">
        Fit<span>Check</span>
      </div>
      <div className="loading-bar">
        <div className="progress"></div>
      </div>
      
      <style jsx>{`
        .fixed {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0e0e0e;
          z-index: 9999;
        }
        .pulse-logo {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -2px;
          color: white;
          margin-bottom: 2rem;
          animation: logoPulse 1.5s infinite ease-in-out;
        }
        .pulse-logo span { color: #a1cc2a; }
        
        .loading-bar {
          width: 200px;
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          overflow: hidden;
        }
        .progress {
          width: 40%;
          height: 100%;
          background: #a1cc2a;
          animation: loadingPhase 2s infinite ease-in-out;
        }

        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; text-shadow: 0 0 20px rgba(161, 204, 42, 0.4); }
        }
        @keyframes loadingPhase {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
