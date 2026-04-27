<div align="center">
  <h1>FitCheck</h1>
  <p><strong>A hardware compatibility checker for FitGirl Repacks.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Made%20with-❤-red?style=flat" alt="Made with heart" />
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Firebase-v9-FFCA28?style=flat&logo=firebase" alt="Firebase" />
    <img src="https://img.shields.io/badge/Lucide-Icons-pink?style=flat" alt="Lucide Icons" />
  </p>

  <p>
    <a href="https://fit-check-sandy.vercel.app">
      <img src="https://img.shields.io/badge/Visit%20Website-fit--check--sandy.vercel.app-a1cc2a?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit Website" />
    </a>
  </p>
</div>

---

### Why FitCheck?

I built this project because I had three specific problems when using FitGirl repacks:

1.  **Limited Filtering:** The official site has basic filtering. I wanted a way to find games across multiple genres at once, like finding something that is both an RPG and a Horror game.
2.  **Hardware Specs:** All repacks require you to check Steam for requirements. I wanted a way to know at a glance if my current machine could actually run a game before starting a huge download.
3.  **Hypervisor Repacks:** A lot of Hypervisor Repacks don't explicitly show they're Hypervisor until you've already clicked into the repack.

---

### Key Features

*   **Auto-Hardware Detection:** Detects your RAM, GPU, and CPU configuration through the browser so you don't have to type it in manually.
*   **Compatibility Scoring:** Gives you an estimated performance score (Perfect, Good, Possible, Unsupported) based on the game's requirements and your specs.
*   **Advanced Filtering:** Search with multiple tags, toggle NSFW content, and filter for Hypervisor-specific repacks.
*   **Dark UI:** Just a personal preference.

---

### Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **Next.js** | Core Framework |
| **Firebase** | Database (Firestore) |
| **Lucide React** | Iconography |
| **Inter** | Primary Typeface |

---

### Recent Updates

- **Modular Architecture Refactor**: Split the monolithic `GameGrid` into focused sub-components (`SearchBar`, `TagCloud`, `GameCard`, `Pagination`) to drastically reduce client-side lag and improve code maintainability.
- **UI & Iconography Overhaul**: Replaced all legacy emojis with Lucide icons and refined the mobile navigation menu with solid backgrounds and improved accessibility.

#### Hardware Database Overhaul

- **Massively expanded CPU coverage**: Intel now spans **6th gen (Skylake) through 14th gen (Raptor Lake Refresh) and Core Ultra 200 (Arrow Lake)**, with every generation broken out by product line (i9/i7/i5/i3). AMD coverage now runs from **Ryzen 1000 (Zen 1) through Ryzen 9000 (Zen 5)**, including all X3D variants, mobile H/HX/HS chips, and APU-only G-series parts.
- **Added missing laptop CPU families**: U-series ultrabook CPUs (6th–8th gen), H-series gaming laptop CPUs (9th gen), and modern mobile lines (Ryzen Mobile, Core Ultra H) were entirely absent and are now included.
- **Purged fabricated SKUs**: Removed CPU model numbers that don't exist in the real world — including `Ryzen 9 7900X3D` (AMD never shipped this), plain-F suffix i9 variants (`i9-14900F`, `i9-13900F`, `i9-12900F`), non-existent i7 F-variants (`i7-14700F`, `i7-13700F`, `i7-9700F`), and other hallucinated SKUs.
- **Expanded GPU coverage**: Added **GTX 900 Series**, **GTX 700 Series**, **NVIDIA MX laptop GPUs** (MX150–MX570), **AMD RX 5000 / 500 / 400 Series**, **Vega 56/64**, and the **R9/R7 legacy** lineup.
- **Rebuilt integrated graphics section**: Split into four groups — AMD APU Modern (Radeon 890M–660M), AMD APU Legacy (Vega 3–11 from Ryzen 1000–4000 era), Intel Arc & Iris (modern), and Intel UHD/HD Legacy (UHD 630 down to HD 4000).

#### Search & UX

- **Global search across all hardware**: The CPU/GPU dropdown search now queries every brand and series simultaneously. Typing a partial model number (e.g. `8265U`, `3070`, `5600`) instantly surfaces all matches in a flat results list — no need to drill through brand → series → model first. Each result card shows its series as a subtitle for context. An empty-state message is shown when no results match.

#### Scraper & Automation

- **Incremental sync mode (`--new-only`)**: Added a new scraper mode that starts from the newest FitGirl page and stops automatically the moment it hits a slug already in the database. This means catching up on new repacks takes seconds instead of re-crawling all 800+ pages.
- **GitHub Actions automation**: The scraper now runs automatically every day at midnight UTC via a GitHub Actions workflow (`.github/workflows/scraper.yml`). It installs Playwright, writes credentials from repository secrets, and runs the incremental sync — no manual intervention needed.
- **New npm scripts**: `npm run scraper` (full crawl), `npm run scraper:resume` (resume interrupted crawl), `npm run scraper:new` (incremental, new repacks only).

---

### Files & Functions

| File | Function |
| :--- | :--- |
| `app/page.js` | Main entry point; orchestrates the core layout and components. |
| `components/GameGrid.js` | The central data hub; handles filtering, sorting, and pagination. |
| `components/Scanner.js` | Hardware selection interface; allows users to configure their rig. |
| `components/GameSidePanel.js` | Detailed game view; displays full specs and compatibility explanations. |
| `components/SearchBar.js` | Search and filtering UI logic. |
| `components/GameCard.js` | Modular component for individual repack displays. |
| `utils/hardware-data.js` | The source of truth for all CPU/GPU tiers and models. |
| `utils/hardware-tiers.js` | The scoring engine logic for compatibility calculation. |
| `hooks/useScanner.js` | Custom hook for managing persistent local storage of user specs. |

---

### Legal Disclaimer

> FitCheck is an independent, third-party hardware compatibility tool. It is not affiliated with, endorsed by, sponsored by, or in any way officially connected to FitGirl, FitGirl Repacks, Valve Corporation (Steam), or any game publisher, developer, or rights holder.
>
> FitCheck was built by an individual developer as a personal project to help PC gamers make informed decisions about whether their hardware can run a given game.
>
> The legality of downloading and using repacked games varies by country. It is your responsibility to understand and comply with the laws of your jurisdiction regarding software licensing and copyright.