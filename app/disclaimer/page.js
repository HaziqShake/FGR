'use client';

import { Shield, Info, FileText, Zap, Copyright, OctagonAlert, Globe, Monitor } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="container dis-container">

      <main className="disclaimer-page">
        <div className="dis-hero">
          <h1>Disclaimer</h1>
          <p className="sub">Legal notice and terms of use for FitCheck</p>
        </div>

        <div className="dis-grid">

          <section className="dis-card">
            <div className="card-header">
              <Shield size={20} className="header-icon" />
              <h2>Independent Tool</h2>
            </div>
            <p>FitCheck is an <strong>independent, third-party hardware compatibility tool</strong>. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected to FitGirl, FitGirl Repacks, Valve Corporation (Steam), or any game publisher, developer, or rights holder.</p>
            <p>FitCheck was built by an individual developer as a personal project to help PC gamers make informed decisions about whether their hardware can run a given game.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <FileText size={20} className="header-icon" />
              <h2>No Game Files Hosted</h2>
            </div>
            <p>FitCheck does <strong>not</strong> host, distribute, store, serve, or provide access to any game files, software binaries, ISO images, torrents, or any other copyrighted material.</p>
            <p>All download links on game cards point directly to the external FitGirl Repacks website (<a href="https://fitgirl-repacks.site" target="_blank" rel="noopener noreferrer">fitgirl-repacks.site</a>), which is an independent third-party site. FitCheck has no control over that site's content, availability, or legality in your jurisdiction.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <Info size={20} className="header-icon" />
              <h2>Metadata & Data Sources</h2>
            </div>
            <p>FitCheck aggregates publicly available <strong>metadata only</strong> titles, genres, cover images, and system requirements. This data is sourced from:</p>
            <ul>
              <li>The publicly accessible FitGirl Repacks website</li>
              <li>The Steam Store public API (<code>store.steampowered.com/api</code>)</li>
            </ul>
            <p>No login, authentication, or bypassing of access controls is performed. System requirement data may be inaccurate or outdated. Always verify requirements on the official game store page.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <Zap size={20} className="header-icon" />
              <h2>Hardware Scoring</h2>
            </div>
            <p>The FitCheck Hardware Scoring Engine (HSE) produces compatibility ratings (<em>Perfect, Good, Possible, Unsupported</em>) as <strong>estimates only</strong>. These scores are based on publicly available minimum and recommended system requirements cross-referenced against user-submitted hardware specs.</p>
            <p>FitCheck does <strong>not</strong> guarantee that a game marked "Perfect" will run without issues, nor that a game marked "Unsupported" is absolutely unplayable on your machine. Actual performance depends on many factors including driver versions, OS configuration, and game-specific optimizations.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <Copyright size={20} className="header-icon" />
              <h2>Copyright & DMCA</h2>
            </div>
            <p>FitCheck respects intellectual property rights. If you believe any metadata displayed on this site infringes your copyright, please contact us and the relevant content will be removed promptly.</p>
            <p>FitCheck acts as a good-faith indexer of publicly available information, similar in function to a search engine or database aggregator. We make no claim of ownership over any game titles, logos, artwork, or related intellectual property displayed on this site.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <OctagonAlert size={20} className="header-icon" />
              <h2>Limitation of Liability</h2>
            </div>
            <p>FitCheck and its developer are not liable for any damages, data loss, legal consequences, or other harm arising from acting on hardware compatibility estimates or downloading third-party content.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <Globe size={20} className="header-icon" />
              <h2>Jurisdiction</h2>
            </div>
            <p>This tool is made available without any warranty. The legality of downloading and using repacked games varies by country. It is your responsibility to understand and comply with the laws of your jurisdiction.</p>
          </section>

          <section className="dis-card">
            <div className="card-header">
              <Monitor size={20} className="header-icon" />
              <h2>Windows Exclusivity</h2>
            </div>
            <p>FitCheck is designed <strong>strictly for Windows PC hardware</strong>. It does not calculate emulation overhead for macOS or Linux/SteamOS via translation layers like CrossOver or Proton.</p>
            <p className="last-updated">Last updated: April 2026</p>
          </section>

        </div>
      </main>

      <style jsx>{`
        .dis-container { max-width: 1100px; padding: 0 1.5rem; }

        .disclaimer-page { padding: 4rem 0; }
        .dis-hero { text-align: center; margin-bottom: 4rem; }
        .dis-hero h1 { font-size: 3rem; font-weight: 900; color: white; margin-bottom: 0.75rem; }
        .dis-hero .sub { color: rgba(255,255,255,0.4); font-size: 1rem; }

        .dis-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .dis-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; }
        
        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
        .header-icon { color: var(--accent); opacity: 0.8; }
        .dis-card h2 { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #fff; }
        
        .dis-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8; margin-bottom: 0.75rem; }
        .dis-card p:last-child { margin-bottom: 0; }
        .dis-card strong { color: rgba(255,255,255,0.9); }
        .dis-card em { color: rgba(255,255,255,0.75); }
        .dis-card a { color: #67c1f5; }
        .dis-card code { background: rgba(255,255,255,0.08); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.8em; color: #a78bfa; }
        .dis-card ul { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .dis-card ul li { margin-bottom: 0.25rem; }
        .last-updated { font-size: 0.75rem !important; color: rgba(255,255,255,0.3) !important; margin-top: auto; padding-top: 1.5rem; }

        @media (max-width: 768px) {
          .dis-hero h1 { font-size: 2.25rem; }
          .dis-grid { grid-template-columns: 1fr; }
          .dis-card { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
