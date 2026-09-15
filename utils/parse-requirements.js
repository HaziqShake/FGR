/**
 * parse-requirements.js
 * 
 * Parses raw PC system requirement strings (from Steam or RAWG) into structured
 * spec objects. Works hand-in-hand with hardware-tiers.js to convert text like:
 *   "Graphics: NVIDIA GeForce GTX 1060 / AMD Radeon RX 580"
 * into { gpuName: 'GTX 1060', gpuTier: 4 }
 */

import { getGPUTier, getCPUTier } from './hardware-tiers.js';

// ─── HTML CLEANER ─────────────────────────────────────────────────────────────
function cleanHtml(html = '') {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<\s*\/?\s*(?:li|br|p|div|tr|h\d)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ');
}

// ─── RAM PARSER ──────────────────────────────────────────────────────────────

/**
 * Extracts RAM in GB from a requirements string.
 * Handles "16 GB RAM", "16GB RAM", "16 GB of RAM", "Memory: 16 GB".
 */
export function parseRAMFromText(text = '') {
  if (!text) return null;
  const clean = cleanHtml(text);
  const match = clean.match(/(?:memory|ram):\s*([0-9.]+)\s*(GB|MB)/i) ||
                clean.match(/([0-9.]+)\s*(GB|MB)(?:\s+(?:of\s+)?RAM)?/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;
  if (match[2].toUpperCase() === 'MB') {
    return Math.round(num / 1024);
  }
  return Math.round(num);
}

// ─── GPU PARSER ──────────────────────────────────────────────────────────────

/**
 * Normalises a raw GPU string into a clean model name.
 * e.g. "NVIDIA GeForce RTX 2060 6GB" → "RTX 2060"
 *      "AMD Radeon RX 580 8GB"       → "RX 580"
 */
export function normaliseGPUName(raw = '') {
  return raw
    .replace(/nvidia\s+geforce\s*/gi, '')
    .replace(/geforce\s*/gi, '')
    .replace(/amd\s+radeon\s*/gi, '')
    .replace(/radeon\s*/gi, '')
    .replace(/intel\s+/gi, '')
    .replace(/\s*\d+\s*gb\s*(vram|gddr\w*)?/gi, '') // strip VRAM
    .replace(/\s*\(.*?\)/g, '')                      // strip parentheticals
    .replace(/™|®/g, '')
    .replace(/or\s+(?:equivalent|better|higher|greater)/gi, '')
    .trim();
}

/**
 * Extracts a GPU model name from a requirement line.
 * Handles slash/comma-separated alternatives and picks the first.
 * Returns { name, tier }.
 */
export function parseGPUFromText(text = '') {
  if (!text) return null;

  const clean = cleanHtml(text);

  // Match "Graphics: <model>" or "Video Card: <model>" or "Video: <model>"
  const lineMatch = clean.match(
    /(?:graphics|gpu|video\s*card|video):\s*([^\n;•]+)/i
  );
  if (!lineMatch) return null;

  const raw = lineMatch[1]
    .split(/\s*[\/|,]\s*/)[0]  // take first alternative
    .replace(/or\s+better|or\s+equivalent|or\s+higher/gi, '')
    .trim();

  const name = normaliseGPUName(raw);
  if (!name || name.length < 2) return null;

  return { name, tier: getGPUTier(name) };
}

// ─── CPU PARSER ──────────────────────────────────────────────────────────────

/**
 * Normalises a raw CPU string.
 * e.g. "Intel Core i5-4460 @ 3.20GHz" → "i5-4460"
 *      "AMD FX-6300"                    → "FX-6300"
 *      "AMD Ryzen 5 3600"               → "Ryzen 5 3600"
 */
export function normaliseCPUName(raw = '') {
  return raw
    .replace(/intel\s+core\s*/gi, '')
    .replace(/intel\s+/gi, '')
    .replace(/amd\s+/gi, '')
    .replace(/@\s*[\d.]+\s*GHz/gi, '')  // strip clock speed
    .replace(/\s*\(.*?\)/g, '')         // strip parentheticals
    .replace(/\s*processor/gi, '')
    .replace(/\s*cpu/gi, '')
    .replace(/™|®/g, '')
    .replace(/or\s+(?:equivalent|better|higher|greater)/gi, '')
    .trim();
}

/**
 * Extracts a CPU model name from a requirement line.
 * Returns { name, tier }.
 */
export function parseCPUFromText(text = '') {
  if (!text) return null;

  const clean = cleanHtml(text);

  const lineMatch = clean.match(
    /(?:processor|cpu|processor\s*\/\s*cpu):\s*([^\n;•]+)/i
  );
  if (!lineMatch) return null;

  const raw = lineMatch[1]
    .split(/\s*[\/|,]\s*/)[0]
    .replace(/or\s+better|or\s+equivalent|or\s+higher/gi, '')
    .trim();

  const name = normaliseCPUName(raw);
  if (!name || name.length < 2) return null;

  return { name, tier: getCPUTier(name) };
}

// ─── MAIN PARSER ─────────────────────────────────────────────────────────────

/**
 * Parses a pair of minimum/recommended requirement strings into a structured
 * spec object that can be stored in Firestore or passed to calculateCompatibility().
 *
 * @param {string} minText - Raw minimum requirements text
 * @param {string} recText - Raw recommended requirements text
 * @returns {{
 *   minGPUname: string|null, minGPUTier: number|null,
 *   recGPUname: string|null, recGPUTier: number|null,
 *   minCPUname: string|null, minCPUTier: number|null,
 *   recCPUname: string|null, recCPUTier: number|null,
 *   minRAMgb:   number|null, recRAMgb:   number|null,
 * }}
 */
export function parseRequirements(minText = '', recText = '') {
  const minGPU = parseGPUFromText(minText);
  const recGPU = parseGPUFromText(recText);
  const minCPU = parseCPUFromText(minText);
  const recCPU = parseCPUFromText(recText);

  return {
    minGPUname: minGPU?.name ?? null,
    minGPUTier: minGPU?.tier ?? null,
    recGPUname: recGPU?.name ?? null,
    recGPUTier: recGPU?.tier ?? null,
    minCPUname: minCPU?.name ?? null,
    minCPUTier: minCPU?.tier ?? null,
    recCPUname: recCPU?.name ?? null,
    recCPUTier: recCPU?.tier ?? null,
    minRAMgb:   parseRAMFromText(minText),
    recRAMgb:   parseRAMFromText(recText),
  };
}

// ─── STEAM RATING LABEL ──────────────────────────────────────────────────────

/**
 * Converts a Metacritic/review score (0–100) to a Steam-style sentiment label.
 * @param {number|null} score 
 * @returns {string}
 */
export function getSteamRatingLabel(score) {
  if (score == null || score === undefined) return 'N/A';
  if (score >= 95) return 'Overwhelmingly Positive';
  if (score >= 85) return 'Very Positive';
  if (score >= 70) return 'Mostly Positive';
  if (score >= 50) return 'Mixed';
  if (score >= 30) return 'Mostly Negative';
  return 'Overwhelmingly Negative';
}

/**
 * Returns a colour class name for a rating label.
 * @param {string} label 
 * @returns {string}
 */
export function getRatingColorClass(label) {
  switch (label) {
    case 'Overwhelmingly Positive': return 'rating-overwhelmingly-positive';
    case 'Very Positive':           return 'rating-very-positive';
    case 'Mostly Positive':         return 'rating-mostly-positive';
    case 'Mixed':                   return 'rating-mixed';
    case 'Mostly Negative':         return 'rating-mostly-negative';
    case 'Overwhelmingly Negative': return 'rating-overwhelmingly-negative';
    default:                        return 'rating-na';
  }
}
