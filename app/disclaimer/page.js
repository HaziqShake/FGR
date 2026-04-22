'use client';

import Navbar from '../../components/Navbar';

export default function DisclaimerPage() {
  return (
    <div className="container dis-container">
      <Navbar />

      <main className="disclaimer-page">
        <div className="dis-hero">
          <h1>Disclaimer</h1>
          <p className="sub">Legal notice and terms of use for FitCheck</p>
        </div>

        <div className="dis-grid">

          <section className="dis-card">
            <h2>01 Independent Tool</h2>
            <p>FitCheck is an <strong>independent, third-party hardware compatibility tool</strong>. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected to FitGirl, FitGirl Repacks, Valve Corporation (Steam), or any game publisher, developer, or rights holder.</p>
            <p>FitCheck was built by an individual developer as a personal project to help PC gamers make informed decisions about whether their hardware can run a given game.</p>
          </section>

          <section className="dis-card">
            <h2>02 No Game Files Hosted</h2>
            <p>FitCheck does <strong>not</strong> host, distribute, store, serve, or provide access to any game files, software binaries, ISO images, torrents, or any other copyrighted material.</p>
            <p>All download links on game cards point directly to the external FitGirl Repacks website (<a href="https://fitgirl-repacks.site" target="_blank" rel="noopener noreferrer">fitgirl-repacks.site</a>), which is an independent third-party site. FitCheck has no control over that site's content, availability, or legality in your jurisdiction.</p>
          </section>

          <section className="dis-card">
            <h2>03 Metadata & Data Sources</h2>
            <p>FitCheck aggregates publicly available <strong>metadata only</strong> titles, genres, cover images, and system requirements. This data is sourced from:</p>
            <ul>
              <li>The publicly accessible FitGirl Repacks website</li>
              <li>The Steam Store public API (<code>store.steampowered.com/api</code>)</li>
            </ul>
            <p>No login, authentication, or bypassing of access controls is performed. System requirement data may be inaccurate or outdated. Always verify requirements on the official game store page.</p>
          </section>

          <section className="dis-card">
            <h2>04 Hardware Compatibility Scoring</h2>
            <p>The FitCheck Hardware Scoring Engine (HSE) produces compatibility ratings (<em>Perfect, Good, Possible, Unsupported</em>) as <strong>estimates only</strong>. These scores are based on publicly available minimum and recommended system requirements cross-referenced against user-submitted hardware specs.</p>
            <p>FitCheck does <strong>not</strong> guarantee that a game marked "Perfect" will run without issues, nor that a game marked "Unsupported" is absolutely unplayable on your machine. Actual performance depends on many factors including driver versions, OS configuration, and game-specific optimizations.</p>
          </section>

          <section className="dis-card">
            <h2>05 Copyright & DMCA</h2>
            <p>FitCheck respects intellectual property rights. If you believe any metadata displayed on this site infringes your copyright, please contact us and the relevant content will be removed promptly.</p>
            <p>FitCheck acts as a good-faith indexer of publicly available information, similar in function to a search engine or database aggregator. We make no claim of ownership over any game titles, logos, artwork, or related intellectual property displayed on this site.</p>
          </section>

          <section className="dis-card">
            <h2>06 Donations</h2>
            <p>Any donations received via PayPal or UPI are voluntary contributions to support the developer's time in maintaining this tool. Donations do not constitute a purchase of any product, service, or copyrighted content.</p>
          </section>

          <section className="dis-card">
            <h2>07 Limitation of Liability</h2>
            <p>FitCheck and its developer are not liable for any damages, data loss, legal consequences, or other harm arising from:</p>
            <ul>
              <li>Downloading content from any third-party site</li>
              <li>Acting on hardware compatibility estimates from this tool</li>
              <li>The availability or legality of content indexed by this tool</li>
            </ul>
            <p>Use FitCheck and any content it links to at your own discretion and risk.</p>
          </section>

          <section className="dis-card">
            <h2>08 Jurisdiction</h2>
            <p>This tool is made available without any warranty, express or implied. The legality of downloading and using repacked games varies by country. It is your responsibility to understand and comply with the laws of your jurisdiction regarding software licensing and copyright.</p>
          </section>

          <section className="dis-card">
            <h2>09 Windows OS Exclusivity</h2>
            <p>FitCheck is designed <strong>strictly for Windows PC hardware</strong> configurations. FitGirl Repacks consist exclusively of Windows executable binaries (.exe). While it may be possible to run these binaries on macOS (Apple Silicon/Intel) or Linux/SteamOS via translation layers like CrossOver, Whisky, or Proton, FitCheck does not calculate emulation overhead or API compatibility.</p>
            <p>Hardware ratings provided for any non-Windows devices do not guarantee the software will successfully launch or remain stable through a compatibility layer.</p>
            <p className="last-updated">Last updated: April 2026</p>
          </section>

        </div>
      </main>

      <style jsx>{`
        .dis-container { max-width: 1100px; }

        .disclaimer-page { padding: 4rem 0; }
        .dis-hero { text-align: center; margin-bottom: 4rem; }
        .dis-hero h1 { font-size: 3rem; font-weight: 900; color: white; margin-bottom: 0.75rem; }
        .dis-hero .sub { color: rgba(255,255,255,0.4); font-size: 1rem; }

        .dis-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 1.5rem; }
        .dis-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 2rem; }
        .dis-card h2 { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #a1cc2a; margin-bottom: 1rem; }
        .dis-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8; margin-bottom: 0.75rem; }
        .dis-card p:last-child { margin-bottom: 0; }
        .dis-card strong { color: rgba(255,255,255,0.9); }
        .dis-card em { color: rgba(255,255,255,0.75); }
        .dis-card a { color: #67c1f5; }
        .dis-card code { background: rgba(255,255,255,0.08); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.8em; color: #a78bfa; }
        .dis-card ul { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .dis-card ul li { margin-bottom: 0.25rem; }
        .last-updated { font-size: 0.75rem !important; color: rgba(255,255,255,0.3) !important; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}
