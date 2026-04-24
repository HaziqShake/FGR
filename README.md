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

*   **Modular Architecture Refactor**: Split the monolithic `GameGrid` into focused sub-components (`SearchBar`, `TagCloud`, `GameCard`, `Pagination`) to drastically reduce client-side lag and improve code maintainability.
- **Vastly Expanded Hardware Database**: Added over 100 new CPU and GPU models including the latest **NVIDIA RTX 50 Series**, **AMD Ryzen 9000 (Zen 5)**, **Intel Core Ultra (Arrow Lake)**, and **AMD RX 8000** series.
- **UI & Iconography Overhaul**: Replaced all legacy emojis with Lucide icons and refined the mobile navigation menu with solid backgrounds and improved accessibility.

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