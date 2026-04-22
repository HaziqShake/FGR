/**
 * Hardware Scoring Engine (HSE) v2.0
 * 
 * Now powered by real Steam Store system requirements.
 * Tiers: 1 (Entry/IGPU) → 10 (High-End Enthusiast)
 */

// ─── GPU TIER MAP ─────────────────────────────────────────────────────────────
const GPU_TIERS = {
  // Tier 10: Top-of-the-line
  'rtx 4090': 10, 'rtx 4080': 10, 'rtx 3090': 10, 'rx 7900 xtx': 10,
  // Tier 9: High-end
  'rtx 4070': 9, 'rtx 3080': 9, 'rx 7900': 9, 'rx 6900': 9,
  // Tier 8: Upper mid-range
  'rtx 4060 ti': 8, 'rtx 3070': 8, 'rx 6800': 8, 'rx 7800': 8,
  // Tier 7: Solid 1080p
  'rtx 4060': 7, 'rtx 3060': 7, 'rtx 2080': 7, 'rx 6700': 7, 'rx 7700': 7,
  // Tier 6: 1080p capable
  'rtx 3050': 6, 'rtx 2060': 6, 'gtx 1080': 6, 'rx 6600': 6, 'rx 5700': 6,
  // Tier 5: Mainstream
  'gtx 1660': 5, 'gtx 1070': 5, 'rx 580': 5, 'rx 5600': 5, 'rx 6500': 5,
  // Tier 4: Entry dedicated
  'gtx 1060': 4, 'gtx 1050 ti': 4, 'rx 570': 4, 'rx 480': 4, '980m': 4,
  // Tier 3: Budget dedicated
  'gtx 1050': 3, 'gtx 960': 3, 'rx 560': 3, 'rx 470': 3, '970m': 3, 'mx550': 3, 'mx450': 3,
  // Tier 2: Very low-end dedicated / IGPU (good)
  'gt 1030': 2, 'gtx 750': 2, 'gtx 950': 2, 'intel iris xe': 2, 'radeon vega': 2, '960m': 2, '950m': 2, 'mx350': 2, 'mx250': 2, 'mx150': 2,
  // Tier 1: Integrated / Absolutely minimal
  'intel iris': 1, 'radeon graphics': 1, 'uhd graphics': 1, 'uhd 630': 1,
  'uhd 620': 1, 'intel hd': 1, 'microsoft basic': 1, 'integrated graphics': 1, 'integrated': 1,
};

// ─── CPU TIER MAP ─────────────────────────────────────────────────────────────
const CPU_TIERS = {
  // Tier 10: HEDT / Latest gen flagship
  'i9': 10, 'ryzen 9': 10, 'threadripper': 10,
  // Tier 9: Latest gen high-end
  'i7-14': 9, 'i7-13': 9, 'i7-12': 9, 'ryzen 7 7': 9, 'ryzen 7 5': 9,
  // Tier 8: Previous gen high-end
  'i7-11': 8, 'i7-10': 8, 'ryzen 7 3': 8, 'i7': 8, 'ryzen 7': 8,
  // Tier 7: Latest gen mid-range
  'i5-14': 7, 'i5-13': 7, 'i5-12': 7, 'ryzen 5 7': 7, 'ryzen 5 5': 7,
  // Tier 6: Previous gen mid-range
  'i5-11': 6, 'i5-10': 6, 'i5': 6, 'ryzen 5': 6,
  // Tier 4: Entry-level
  'i3': 4, 'ryzen 3': 4,
  // Tier 2: Very old / low-end
  'pentium': 2, 'athlon': 2, 'celeron': 2,
};

// ─── TIER LOOKUP FUNCTIONS ────────────────────────────────────────────────────

export function getGPUTier(name = '') {
  if (!name) return 1;
  const lower = name.toLowerCase();
  for (const [key, tier] of Object.entries(GPU_TIERS)) {
    if (lower.includes(key)) return tier;
  }
  return 3; // Default: assume a basic dedicated GPU exists
}

export function getCPUTier(name = '') {
  if (!name) return 1;
  const lower = name.toLowerCase();
  for (const [key, tier] of Object.entries(CPU_TIERS)) {
    if (lower.includes(key)) return tier;
  }
  return 3; // Default fallback
}

// ─── FALLBACK: Title-based requirements (when Steam data is unavailable) ──────
function getFallbackRequirements(title = '') {
  const lower = title.toLowerCase();

  // UE5 / Known Demanding Titles
  if (lower.includes('wukong') || lower.includes('hellblade') || lower.includes('alan wake 2') || lower.includes('black myth')) {
    return { minGPUTier: 7, recGPUTier: 9, minRAMgb: 16, recRAMgb: 16 };
  }
  // Modern AAA (2020+)
  if (lower.includes('cyberpunk') || lower.includes('elden ring') || lower.includes('starfield') || lower.includes('remnant 2')) {
    return { minGPUTier: 5, recGPUTier: 8, minRAMgb: 12, recRAMgb: 16 };
  }
  // Typical AAA
  if (lower.includes('call of duty') || lower.includes('modern warfare') || lower.includes('battlefield')) {
    return { minGPUTier: 4, recGPUTier: 7, minRAMgb: 8, recRAMgb: 16 };
  }
  // Indie / Mid-range default
  return { minGPUTier: 3, recGPUTier: 5, minRAMgb: 8, recRAMgb: 16 };
}

// ─── MAIN COMPATIBILITY ENGINE ───────────────────────────────────────────────

/**
 * Calculates a compatibility level between user hardware and a game.
 * 
 * Priority: Real Steam Specs > Fallback Title Detection
 * 
 * Returns: 'perfect' | 'good' | 'possible' | 'unsupported' | 'unknown'
 */
export function calculateCompatibility(userSpecs, gameSpecs) {
  if (!userSpecs || !gameSpecs) return 'unknown';

  // ── User Hardware ──────────────────────────────────────────────────────────
  const userGPUTier = userSpecs.gpuTier !== undefined
    ? userSpecs.gpuTier
    : getGPUTier(userSpecs.gpu);

  const userCPUTier = userSpecs.cpuTier !== undefined
    ? userSpecs.cpuTier
    : getCPUTier(userSpecs.cpu);

  const userRAM = parseInt(userSpecs.ram) || 0;

  // ── Game Requirements ──────────────────────────────────────────────────────
  let minGPUTier, recGPUTier, minRAMgb, recRAMgb;

  const hasSteamData = gameSpecs.minGPUTier != null && gameSpecs.minRAMgb != null;

  if (hasSteamData) {
    // Use real Steam specs
    minGPUTier = gameSpecs.minGPUTier;
    recGPUTier = gameSpecs.recGPUTier ?? minGPUTier + 2;
    minRAMgb   = gameSpecs.minRAMgb;
    recRAMgb   = gameSpecs.recRAMgb ?? minRAMgb * 2;
  } else {
    // Fall back to title-based estimation
    const fb = getFallbackRequirements(gameSpecs.title || '');
    minGPUTier = fb.minGPUTier;
    recGPUTier = fb.recGPUTier;
    minRAMgb   = fb.minRAMgb;
    recRAMgb   = fb.recRAMgb;
  }

  // ── IGPU Hard Wall ─────────────────────────────────────────────────────────
  // IGPUs (Tier 1-2) cannot run anything above Tier 4 minimum
  if (userGPUTier <= 2 && minGPUTier >= 5) return 'unsupported';

  // ── Scoring: Two-Band (Min vs Rec) ─────────────────────────────────────────

  const meetsRecGPU = userGPUTier >= recGPUTier;
  const meetsRecRAM = userRAM >= recRAMgb;
  const meetsMinGPU = userGPUTier >= minGPUTier;
  const meetsMinRAM = userRAM >= minRAMgb;

  // PERFECT: Meets or beats recommended requirements
  if (meetsRecGPU && meetsRecRAM) return 'perfect';

  // GOOD: Meets minimum requirements
  if (meetsMinGPU && meetsMinRAM) return 'good';

  // POSSIBLE: GPU or RAM slightly below minimum (within 1 tier / 2GB)
  const closeGPU = userGPUTier >= minGPUTier - 1;
  const closeRAM = userRAM >= minRAMgb - 2;
  if (closeGPU && closeRAM) return 'possible';

  return 'unsupported';
}
