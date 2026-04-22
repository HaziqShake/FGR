'use client';

import Navbar from '../../components/Navbar';

export default function ContactPage() {
  return (
    <div className="container">
      <Navbar />

      <main className="contact-page">
        <div className="contact-card glass">
          <h1>Get in Touch</h1>
          <p className="sub">Have feedback or found a bug? Let me know.</p>

          <div className="contact-links">
            <a href="mailto:shaikhhaziq75@gmail.com" className="contact-btn email">
              <span className="icon">✉️</span> shaikhhaziq75@gmail.com
            </a>
            <a href="https://github.com/HaziqShake" target="_blank" rel="noopener noreferrer" className="contact-btn github">
              <span className="icon">🐙</span> github.com/HaziqShake
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
          padding: 4rem 0;
        }

        .contact-card {
          padding: 3rem;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .contact-card h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: white;
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
          padding: 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }

        .contact-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .contact-btn.email:hover {
          border-color: #f87171;
        }

        .contact-btn.github:hover {
          border-color: #a78bfa;
        }

        .icon {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}
