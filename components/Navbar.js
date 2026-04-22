'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ showAdult = false }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="logo">Fit<span>Check</span></Link>
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
          <a href="https://fitgirl-repacks.site" target="_blank" rel="noopener noreferrer" className="nav-link" onClick={() => setMobileMenuOpen(false)}>FitGirl Repacks</a>
          <Link href="/disclaimer" className={`nav-link ${pathname === '/disclaimer' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Disclaimer</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <div className="donate-split">
            <a href="https://paypal.me/haziqshake" target="_blank" rel="noopener noreferrer" className="paypal">PayPal</a>
            <a href="https://razorpay.me/@haziqshake" target="_blank" rel="noopener noreferrer" className="upi">UPI</a>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          align-items: center;
        }
        .nav-links :global(.nav-link.active) {
          color: var(--accent);
        }
        .donate-split {
          display: flex;
          align-items: center;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .donate-split a {
          padding: 0.5rem 1rem;
          font-weight: 800;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.3s, color 0.3s;
          position: relative;
        }
        .donate-split a.paypal {
          background: rgba(0, 69, 124, 0.4);
          color: #60a5fa;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .donate-split a.paypal:hover { background: rgba(0, 69, 124, 0.8); }
        .donate-split a.upi {
          background: rgba(51, 153, 204, 0.3);
          color: #38bdf8;
          z-index: 1;
        }
        .donate-split a.upi::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 153, 51, 0.95) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(19, 136, 8, 0.95) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          border-radius: inherit;
        }
        .donate-split a.upi:hover {
          color: black;
          background: transparent;
        }
        .donate-split a.upi:hover::before {
          opacity: 1;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 901;
        }

        .mobile-close {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-close {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-links {
            position: fixed;
            top: 0; right: 0; bottom: 0; left: 0;
            background: #111;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2.5rem;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 900;
          }
          .nav-links.mobile-open {
            transform: translateX(0);
          }
          .nav-link {
            font-size: 1.5rem;
            font-weight: 800;
            text-align: center;
            width: 100%;
          }
          .donate-split {
            flex-direction: column;
            width: 80%;
            max-width: 300px;
          }
          .donate-split a {
            width: 100%;
            justify-content: center;
            padding: 1rem;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
        }
      `}</style>
    </>
  );
}
