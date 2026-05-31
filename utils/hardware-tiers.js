/**
 * Hardware Scoring Engine (HSE) v2.0
 * 
 * Now powered by real Steam Store system requirements.
 * Tiers: 1 (Entry/IGPU) → 10 (High-End Enthusiast)
 */

// ─── GPU TIER MAP ─────────────────────────────────────────────────────────────
const GPU_TIERS = {
  // Laptop/Mobile GPUs - MUST BE CHECKED FIRST to avoid matching desktop keys
  'rtx 4090 laptop': 9, 'rtx 4090 mobile': 9,
  'rtx 4080 laptop': 8, 'rtx 4080 mobile': 8,
  'rtx 4070 laptop': 7, 'rtx 4070 mobile': 7,
  'rtx 4060 laptop': 6, 'rtx 4060 mobile': 6,
  'rtx 4050 laptop': 5, 'rtx 4050 mobile': 5,
  'rtx 3080 ti laptop': 8, 'rtx 3080 ti mobile': 8,
  'rtx 3080 laptop': 7, 'rtx 3080 mobile': 7,
  'rtx 3070 ti laptop': 7, 'rtx 3070 ti mobile': 7,
  'rtx 3070 laptop': 6, 'rtx 3070 mobile': 6,
  'rtx 3060 laptop': 5, 'rtx 3060 mobile': 5,
  'rtx 3050 ti laptop': 4, 'rtx 3050 ti mobile': 4,
  'rtx 3050 laptop': 3, 'rtx 3050 mobile': 3,
  'rtx 2050 laptop': 3, 'rtx 2050 mobile': 3,
  'gtx 1660 ti laptop': 4, 'gtx 1660 ti mobile': 4,
  'gtx 1650 ti laptop': 3, 'gtx 1650 ti mobile': 3,
  'gtx 1650 laptop': 3, 'gtx 1650 mobile': 3,

  // Tier 10: Top-of-the-line Desktop
  'rtx 5090': 10, 'rtx 5080': 10, 'rtx 4090': 10, 'rtx 4080': 10, 'rtx 3090': 10, 'rx 7900 xtx': 10, 'rx 7900 xt': 10, 'rx 6950 xt': 10,
  // Tier 9: High-end
  'rtx 5070': 9, 'rtx 4070': 9, 'rtx 3080': 9, 'rx 7900': 9, 'rx 6900': 9, 'rx 6800 xt': 9, 'rx 9070': 9, 'rtx 3070 ti': 8,
  // Tier 8: Upper mid-range
  'rtx 4060 ti': 8, 'rtx 3070': 8, 'rx 6800': 8, 'rx 7800': 8, 'rx 6750 xt': 8, 'radeon vii': 8,
  // Tier 7: Solid 1080p
  'rtx 4060': 7, 'rtx 3060 ti': 7, 'rtx 2080 ti': 8, 'rtx 2080': 7, 'rx 6700 xt': 7, 'rx 6700': 6, 'rx 7700': 7, 'rx vega 64': 7,
  // Tier 6: 1080p capable
  'rtx 3060': 6, 'rtx 3050': 6, 'rtx 2070': 6, 'rtx 2060': 6, 'gtx 1080 ti': 7, 'gtx 1080': 6, 'rx 7600': 6, 'rx 6650 xt': 6, 'rx 6600': 5, 'rx 5700': 6, 'rx vega 56': 6, 'arc a770': 6, 'arc a750': 6, 'arc b580': 6,
  // Tier 5: Mainstream
  'gtx 1660': 5, 'gtx 1070': 5, 'gtx 980 ti': 5, 'gtx 980': 5, 'rx 590': 5, 'rx 580': 5, 'rx 480': 5, 'rx 5500': 5, 'rx 5600': 5, 'rx 6500': 5, 'arc a580': 5,
  // Tier 4: Entry dedicated
  'gtx 1060': 4, 'gtx 1650': 4, 'gtx 970': 4, 'gtx 780': 4, 'rx 570': 4, 'rx 470': 4, '980m': 4, 'mx570': 4, 'radeon 890m': 4,
  // Tier 3: Budget dedicated
  'gtx 1050 ti': 4, 'gtx 1050': 3, 'gtx 960': 3, 'gtx 770': 3, 'gtx 760': 3, 'rx 560': 3, 'rx 460': 3, '970m': 3, 'mx550': 3, 'mx450': 3, 'radeon 780m': 3, 'radeon 880m': 3,
  // Tier 2: Very low-end dedicated / IGPU (good)
  'gt 1030': 2, 'gtx 750': 2, 'gtx 950': 2, 'intel iris xe': 2, 'radeon vega': 2, '960m': 2, '950m': 2, 'mx350': 2, 'mx250': 2, 'mx150': 2, 'radeon 760m': 2, 'radeon 680m': 2,
  // Tier 1: Integrated / Absolutely minimal
  'intel iris': 1, 'radeon graphics': 1, 'uhd graphics': 1, 'uhd 630': 1, 'uhd 620': 1, 'intel hd': 1, 'microsoft basic': 1, 'integrated': 1,
};

// ─── CPU TIER MAP ─────────────────────────────────────────────────────────────
const CPU_TIERS = {
  // Laptop/Mobile specific series - MUST BE CHECKED FIRST
  'i9-14900hx': 9, 'i9-13950hx': 10, 'i9-13900hx': 9, 'i9-12950hx': 9, 'i9-12900hk': 8,
  'i7-14700hx': 8, 'i7-13700hx': 8, 'i7-13700h': 7, 'i7-12700h': 7, 'i7-11800h': 6,
  'i5-14500hx': 7, 'i5-13500hx': 7, 'i5-13500h': 6, 'i5-12500h': 6, 'i5-11400h': 5,
  'i7-1165g7': 5, 'i7-1065g7': 4, 'i5-1135g7': 4, 'i5-1035g1': 3,
  
  // Ultra low power Laptop (U-Series)
  'i7-1355u': 5, 'i7-1255u': 5, 'i7-1165u': 4, 'i7-10710u': 5, 'i7-10510u': 4, 'i7-8565u': 4, 'i7-8550u': 4, 'i7-7500u': 3, 'i7-6500u': 3,
  'i5-1335u': 4, 'i5-1235u': 4, 'i5-1135u': 4, 'i5-10210u': 4, 'i5-8265u': 3, 'i5-8250u': 3, 'i5-7200u': 3, 'i5-6200u': 2,
  'i3-1315u': 4, 'i3-1215u': 3, 'i3-1115g4': 3, 'i3-10110u': 3, 'i3-8145u': 3, 'i3-7100u': 2, 'i3-6100u': 2,

  // AMD Laptop/Mobile CPUs
  'ryzen AI 9 hx 370': 9, 'ryzen AI 9 365': 8,
  'ryzen 9 7945hx': 9, 'ryzen 9 7940hx': 9, 'ryzen 9 6900hx': 8, 'ryzen 9 5900hx': 8, 'ryzen 9 4900h': 7,
  'ryzen 7 7840hs': 8, 'ryzen 7 7735hs': 7, 'ryzen 7 6800h': 7, 'ryzen 7 5800h': 7, 'ryzen 7 4800h': 7,
  'ryzen 5 7640hs': 7, 'ryzen 5 7535hs': 6, 'ryzen 5 6600h': 6, 'ryzen 5 5600h': 6, 'ryzen 5 4600h': 6,
  'ryzen 7 8840u': 6, 'ryzen 7 7840u': 6, 'ryzen 7 5825u': 5, 'ryzen 7 5700u': 5, 'ryzen 7 4700u': 4, 'ryzen 7 3700u': 4,
  'ryzen 5 8640u': 5, 'ryzen 5 7540u': 5, 'ryzen 5 5625u': 5, 'ryzen 5 5500u': 4, 'ryzen 5 4500u': 4, 'ryzen 5 3500u': 4,

  // Desktop Flagship
  'i9': 10, 'ryzen 9': 10, 'threadripper': 10,
  
  // Refined Generations (Desktop & HX) - Intel i7
  'i7-14': 9, 'i7-13': 9, 'i7-12': 9, 'i7-11': 8, 'i7-10': 8, 'i7-9': 6, 'i7-8': 6, 'i7-7': 5, 'i7-6': 4, 'i7-5': 4, 'i7-4': 3, 'i7-3': 2, 'i7-2': 2,
  // Intel i5
  'i5-14': 7, 'i5-13': 7, 'i5-12': 7, 'i5-11': 6, 'i5-10': 6, 'i5-9': 5, 'i5-8': 4, 'i5-7': 3, 'i5-6': 3, 'i5-5': 2, 'i5-4': 2, 'i5-3': 2, 'i5-2': 1,
  // Intel i3
  'i3-14': 5, 'i3-13': 5, 'i3-12': 5, 'i3-11': 4, 'i3-10': 4, 'i3-9': 3, 'i3-8': 3, 'i3-7': 2, 'i3-6': 2, 'i3-4': 1, 'i3-3': 1, 'i3-2': 1,

  // AMD Desktop Ryzen 7
  'ryzen 7 9800x3d': 10, 'ryzen 7 7800x3d': 10, 'ryzen 7 5800x3d': 9,
  'ryzen 7 9700': 9, 'ryzen 7 7700': 9, 'ryzen 7 5700': 8, 'ryzen 7 3800': 7, 'ryzen 7 3700': 7, 'ryzen 7 2700': 6, 'ryzen 7 1800': 5, 'ryzen 7 1700': 5,
  // AMD Desktop Ryzen 5
  'ryzen 5 9600': 8, 'ryzen 5 7600': 8, 'ryzen 5 5600': 7, 'ryzen 5 5500': 5, 'ryzen 5 3600': 6, 'ryzen 5 3500': 5, 'ryzen 5 2600': 5, 'ryzen 5 1600': 4,
  // AMD Desktop Ryzen 3
  'ryzen 3 5300': 4, 'ryzen 3 4300': 4, 'ryzen 3 3300': 4, 'ryzen 3 3100': 4, 'ryzen 3 3200': 3, 'ryzen 3 2200': 3, 'ryzen 3 1300': 3, 'ryzen 3 1200': 3,

  // Legacy & Low end
  'pentium': 2, 'athlon': 2, 'celeron': 2, 'fx-9': 2, 'fx-8': 2, 'fx-6': 1, 'fx-4': 1,
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

  if (!hasSteamData) {
    return 'unknown';
  }

  // Use real Steam specs
  minGPUTier = gameSpecs.minGPUTier;
  recGPUTier = gameSpecs.recGPUTier ?? minGPUTier + 2;
  minRAMgb   = gameSpecs.minRAMgb;
  recRAMgb   = gameSpecs.recRAMgb ?? minRAMgb * 2;

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
