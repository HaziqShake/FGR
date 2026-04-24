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
    <nav className="nav-wrapper">
      <div className="container nav-content">
        <Link href="/" className="logo">Fit<span>Check</span></Link>
        <button className={`mobile-toggle ${mobileMenuOpen ? 'hidden' : ''}`} onClick={() => setMobileMenuOpen(true)}>
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
      </div>
    </nav>


    </>
  );
}
