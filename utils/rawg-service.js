/**
 * rawg-service.js
 *
 * Server-side utility that queries the RAWG Video Games Database API
 * (https://rawg.io/apidocs) to retrieve PC system requirements for a given game.
 *
 * Used as a FALLBACK when Steam's appdetails endpoint returns no PC requirements.
 *
 * Environment variable required:
 *   RAWG_API_KEY=your_rawg_key_here   (set in .env.local)
 *
 * RAWG free tier: 20,000 req/month — sufficient for batch enrichment.
 */

const RAWG_BASE = 'https://api.rawg.io/api';
const RAWG_KEY  = process.env.RAWG_API_KEY;

/**
 * Cleans a game title for a RAWG search query.
 * Similar to Steam's cleanTitleForSearch but tuned for RAWG's fuzzy search.
 */
function cleanTitle(title = '') {
  return title
    .replace(/–.*$/u, '')
    .replace(/\s*[vV]\d+(\.\d+)*/g, '')
    .replace(/\s*\+\s*\d+\s*(DLCs?|Bonuses?).*/gi, '')
    .replace(/\s*(Digital|Deluxe|Ultimate|Gold|GOTY|Complete|Edition).*/gi, '')
    .replace(/\s*\(.*?\)/g, '')
    .replace(/[:\-]\s*$/, '')
    .trim();
}

/**
 * Searches RAWG for a game by title and returns the best-matching slug/id.
 * @param {string} title - Raw game title (FitGirl format okay)
 * @returns {Promise<{slug: string, id: number, name: string}|null>}
 */
export async function searchRawgGame(title) {
  if (!RAWG_KEY) {
    console.warn('[RAWG] No RAWG_API_KEY set — skipping RAWG lookup.');
    return null;
  }

  const query = cleanTitle(title);
  if (!query) return null;

  try {
    const url = `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=5&platforms=4`; // platform 4 = PC
    const res = await fetch(url, { next: { revalidate: 86400 } }); // 24h cache in Next.js
    if (!res.ok) {
      console.warn(`[RAWG] Search failed (${res.status}) for "${query}"`);
      return null;
    }

    const data = await res.json();
    const results = data?.results ?? [];
    if (results.length === 0) return null;

    // Find best match: prefer title case-insensitive exact/substring match
    const queryLower = query.toLowerCase();
    const best = results.find(r =>
      r.name.toLowerCase().includes(queryLower) ||
      queryLower.includes(r.name.toLowerCase())
    ) || results[0];

    return { slug: best.slug, id: best.id, name: best.name };
  } catch (err) {
    console.warn(`[RAWG] searchRawgGame error for "${title}":`, err.message);
    return null;
  }
}

/**
 * Fetches detailed game data from RAWG by slug/id and extracts PC requirements.
 *
 * RAWG `/games/{id}` returns a `platforms` array, each with:
 *   { platform: { slug: 'pc', ... }, requirements: { minimum: "...", recommended: "..." } }
 *
 * @param {string|number} gameIdOrSlug
 * @returns {Promise<{minimum: string, recommended: string}|null>}
 */
export async function fetchRawgRequirements(gameIdOrSlug) {
  if (!RAWG_KEY || !gameIdOrSlug) return null;

  try {
    const url = `${RAWG_BASE}/games/${gameIdOrSlug}?key=${RAWG_KEY}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      console.warn(`[RAWG] Detail fetch failed (${res.status}) for "${gameIdOrSlug}"`);
      return null;
    }

    const data = await res.json();

    // Find the PC platform entry
    const pcPlatform = (data.platforms ?? []).find(
      p => p.platform?.slug === 'pc'
    );

    if (!pcPlatform?.requirements) return null;

    const { minimum = '', recommended = '' } = pcPlatform.requirements;
    if (!minimum && !recommended) return null;

    console.log(`  [RAWG] ${data.name} → requirements fetched`);
    return { minimum, recommended };

  } catch (err) {
    console.warn(`[RAWG] fetchRawgRequirements error:`, err.message);
    return null;
  }
}

/**
 * High-level: Search for a game on RAWG by title and return its PC requirements.
 * Returns null if not found or RAWG_API_KEY is unset.
 *
 * @param {string} title - Game title
 * @returns {Promise<{minimum: string, recommended: string}|null>}
 */
export async function getRequirementsFromRawg(title) {
  const match = await searchRawgGame(title);
  if (!match) return null;
  return await fetchRawgRequirements(match.id);
}
