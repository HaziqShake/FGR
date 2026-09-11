/**
 * app/api/steam-games/route.js
 *
 * Serves free Steam games sorted by newest listing date.
 *
 * GET /api/steam-games
 *   ?page=1        Page number (default: 1)
 *   ?limit=30      Results per page (max 50)
 *   ?search=       Optional title search
 *   ?sort=newest   'newest' (default) | 'popular' | 'name'
 *
 * Source: Steam Store search/results infinite-scroll endpoint (no API key needed).
 * Mature content enabled via birthtime + mature_content cookies on server-side fetch.
 */

import { NextResponse } from 'next/server';
import { getSteamRatingLabel } from '../../../utils/parse-requirements.js';

// This endpoint returns results_html + total_count — same one Steam's infinite scroll uses
const STEAM_SEARCH  = 'https://store.steampowered.com/search/results/';
const STEAM_DETAIL  = 'https://store.steampowered.com/api/appdetails';
const CACHE_TTL     = 3600;   // 1 hour for search results
const DETAIL_TTL    = 43200;  // 12 hours for app details

const STEAM_COOKIES = [
  'birthtime=631152001',
  'mature_content=1',
  'wants_mature_content=1',
  'lastagecheckage=1-0-1990',
].join('; ');

const STEAM_HEADERS = {
  Cookie:            STEAM_COOKIES,
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'X-Requested-With': 'XMLHttpRequest',
  Accept:            'application/json',
};

// ─── SORT MAP ─────────────────────────────────────────────────────────────────
function sortParam(sort) {
  switch (sort) {
    case 'popular': return 'Reviews_DESC';
    case 'name':    return 'Name_ASC';
    case 'newest':
    default:        return 'Released_DESC';
  }
}

// ─── STEAM SEARCH ─────────────────────────────────────────────────────────────
async function steamSearch({ page, limit, search, sort }) {
  const params = new URLSearchParams({
    query:           search || '',
    start:           String((page - 1) * limit),
    count:           String(limit),
    sort_by:         sortParam(sort),
    maxprice:        'free',        // free-only filter
    category1:       '998',         // Games category (excludes software/DLC)
    use_store_query: '1',
    infinite:        '1',
    cc:              'US',
    l:               'english',
    v:               '24',
  });

  const url = `${STEAM_SEARCH}?${params}`;
  const res = await fetch(url, {
    headers: STEAM_HEADERS,
    next:    { revalidate: CACHE_TTL },
  });

  if (!res.ok) throw new Error(`Steam search HTTP ${res.status}`);
  return res.json();
}

// ─── HTML PARSER ──────────────────────────────────────────────────────────────
/**
 * Parses the results_html fragment Steam returns.
 * Each row is an <a> tag with data-ds-appid attribute.
 */
function parseResults(html = '') {
  const games = [];

  // Match result rows: <a ... data-ds-appid="1234" ...>...</a>
  const rowRe = /<a[^>]+data-ds-appid="(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;

  while ((m = rowRe.exec(html)) !== null) {
    const appId = parseInt(m[1], 10);
    const block = m[2];
    if (!appId || isNaN(appId)) continue;

    // Title: <span class="title">Game Name</span>
    const titleM = block.match(/<span class="title">([^<]+)<\/span>/);
    const name   = titleM ? titleM[1].trim() : null;
    if (!name) continue;

    // Release date: <div class="search_released responsive_secondrow">Aug 1, 2026</div>
    const dateM       = block.match(/class="search_released[^"]*"[^>]*>\s*([^<\s][^<]+?)\s*<\/div>/);
    const releaseDate = dateM ? dateM[1].trim() : null;

    // Review score tooltip: data-tooltip-html="Very Positive&lt;br&gt;..."
    const reviewM    = block.match(/data-tooltip-html="([^"&]+)/);
    const reviewHint = reviewM ? reviewM[1].trim() : null;

    // Capsule image from the search_capsule div
    const imgM     = block.match(/class="search_capsule"[^>]*>.*?<img[^>]+src="([^"]+)"/);
    const imageUrl = imgM
      ? imgM[1]
      : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

    // Always use the high-res header CDN URL as well
    const headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

    games.push({
      appId,
      name,
      imageUrl,
      headerImage,
      steamUrl:    `https://store.steampowered.com/app/${appId}/`,
      releaseDate,
      reviewHint,
      isFree: true,
    });
  }

  return games;
}

// ─── DETAIL ENRICHMENT ────────────────────────────────────────────────────────
/** Enriches the first N games with genres, rating, exact release date. */
async function enrichWithDetails(games, count = 12) {
  const slice = games.slice(0, count);
  const map   = {};

  await Promise.allSettled(slice.map(async (g) => {
    try {
      const url = `${STEAM_DETAIL}?appids=${g.appId}&l=english&cc=us`;
      const res = await fetch(url, {
        headers: { Cookie: STEAM_COOKIES },
        next:    { revalidate: DETAIL_TTL },
      });
      if (!res.ok) return;

      const json = await res.json();
      const d    = json?.[String(g.appId)]?.data;
      if (!d) return;

      const score  = d.metacritic?.score ?? null;
      map[g.appId] = {
        genres:       (d.genres || []).map(x => x.description),
        releaseDate:  d.release_date?.date || null,
        ratingScore:  score,
        ratingLabel:  getSteamRatingLabel(score),
        isFree:       d.is_free ?? true,
        headerImage:  d.header_image || null,
      };
    } catch (_) { /* silently skip */ }
  }));

  return games.map(g => ({ ...g, ...(map[g.appId] || {}) }));
}

// ─── GET HANDLER ─────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get('page')  || '1',  10));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '30', 10));
    const search = (searchParams.get('search') || '').trim();
    const sort   = searchParams.get('sort') || 'newest';

    // 1. Fetch game list from Steam
    const raw = await steamSearch({ page, limit, search, sort });

    const total      = raw.total_count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const html       = raw.results_html || '';

    // 2. Parse HTML fragment into structured objects
    let games = parseResults(html);

    // 3. Enrich first 12 with rating + genres from appdetails
    if (games.length > 0) {
      games = await enrichWithDetails(games, 12);
    }

    return NextResponse.json(
      { games, total, page, limit, totalPages },
      {
        status:  200,
        headers: { 'Cache-Control': `s-maxage=${CACHE_TTL}, stale-while-revalidate=86400` },
      }
    );

  } catch (err) {
    console.error('[API /steam-games]', err.message);
    return NextResponse.json(
      { error: err.message, games: [], total: 0, page: 1, totalPages: 1 },
      { status: 500 }
    );
  }
}
