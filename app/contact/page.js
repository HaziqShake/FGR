'use client';

import { Mail, Terminal, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container">

      <main className="contact-page">
        <div className="contact-card glass">
          <div className="contact-header">
            <MessageSquare size={32} className="header-icon" />
            <h1>Get in Touch</h1>
          </div>
          <p className="sub">Have feedback or found a bug? Let me know.</p>

          <div className="contact-links">
            <a href="mailto:shaikhhaziq75@gmail.com" className="contact-btn email">
              <Mail size={18} /> 
              <span className="btn-text">shaikhhaziq75@gmail.com</span>
            </a>
            <a href="https://github.com/HaziqShake" target="_blank" rel="noopener noreferrer" className="contact-btn github">
              <Terminal size={18} /> 
              <span className="btn-text">github.com/HaziqShake</span>
            </a>
          </div>
        </div>
      </main>

      <style jsx>{`
        .contact-page {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 1.5rem;
        }

        .contact-card {
          padding: 3rem 2rem;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .contact-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .header-icon {
          color: var(--accent);
        }

        .contact-card h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .contact-card .sub {
          color: rgba(255,255,255,0.6);
          margin-bottom: 2.5rem;
        }

        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.1rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          overflow: hidden;
        }

        .btn-text {
          word-break: break-all;
          font-size: 0.95rem;
        }

        .contact-btn:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          border-color: var(--accent);
        }

        @media (max-width: 768px) {
          .contact-card { padding: 2rem 1.5rem; }
          .contact-card h1 { font-size: 1.8rem; }
          .contact-btn { padding: 1rem; }
          .btn-text { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
