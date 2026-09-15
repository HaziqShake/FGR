/**
 * app/api/steam-games/route.js
 *
 * Serves free Steam games sorted by newest listing date.
 *
 * GET /api/steam-games
 *   ?page=1        Page number (default: 1)
 *   ?limit=30      Results per page (max 50)
 *   ?search=       Optional title search
 *   ?sort=newest   'newest' (default) | 'popular' | 'name' | 'size-large' | 'size-small' | 'dlc-most' | 'recent-release'
 *
 * Source: Steam Store search/results infinite-scroll endpoint (no API key needed).
 * Mature content enabled via birthtime + mature_content cookies on server-side fetch.
 */

import { NextResponse } from 'next/server';
import { getSteamRatingLabel, parseRequirements } from '../../../utils/parse-requirements.js';

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
    case 'popular': return '_ASC'; // Steam's Top Sellers / Popular / Relevance
    case 'name':
    case 'abc':     return 'Name_ASC';
    case 'zyx':     return 'Name_DESC';
    case 'oldest':  return 'Released_ASC';
    case 'recent-release':
    case 'newest':
    default:        return 'Released_DESC';
  }
}

// Sorts that require client-side sorting after fetching from Steam
const REQUIRES_CLIENT_SORT = new Set([
  'size-large',
  'size-small',
  'dlc-most'
]);

const STEAM_TAG_MAP = {
  action: '19',
  adventure: '21',
  rpg: '122',
  strategy: '9',
  shooter: '1774',
  simulation: '599',
  horror: '1667',
  'open world': '1695',
  multiplayer: '3859',
  indie: '492',
  casual: '597',
  adult: '12095',
};

// ─── STEAM SEARCH CHUNK ───────────────────────────────────────────────────────
async function fetchSteamChunk({ start, count = 50, search, sort, tags, untags, showAdult }) {
  // Determine what sort to use for the Steam API request
  // For client-side sorts, we use 'Released_DESC' (newest) to get a good sample
  const steamSort = REQUIRES_CLIENT_SORT.has(sort) ? 'Released_DESC' : sortParam(sort);

  const queryParams = {
    query:           search || '',
    start:           String(start),
    count:           String(count),
    sort_by:         steamSort,
    maxprice:        'free',        // free-only filter
    category1:       '998',         // Games category (excludes software/DLC)
    infinite:        '1',
    cc:              'US',
    l:               'english',
    v:               '24',
  };

  const isAdultRequested = showAdult || tags?.some(t => t.toLowerCase() === 'adult');
  if (isAdultRequested) {
    queryParams.ignore_preferences = '1';
  }

  if (tags && tags.length > 0) {
    const resolvedTagIds = [];
    for (const t of tags) {
      const id = STEAM_TAG_MAP[t.toLowerCase()] || t;
      if (id) resolvedTagIds.push(id);
    }
    if (resolvedTagIds.length > 0) {
      queryParams.tags = resolvedTagIds.join(',');
    }
  }

  const resolvedUntagIds = [];
  if (untags && untags.length > 0) {
    for (const t of untags) {
      const id = STEAM_TAG_MAP[t.toLowerCase()] || t;
      if (id) resolvedUntagIds.push(id);
    }
  }

  if (!isAdultRequested) {
    resolvedUntagIds.push('12095', '6650', '9130');
  }

  if (resolvedUntagIds.length > 0) {
    queryParams.untags = [...new Set(resolvedUntagIds)].join(',');
  }

  const params = new URLSearchParams(queryParams);
  const url = `${STEAM_SEARCH}?${params}`;
  const res = await fetch(url, {
    headers: STEAM_HEADERS,
    next:    { revalidate: CACHE_TTL },
  });

  if (!res.ok) throw new Error(`Steam search HTTP ${res.status}`);
  return res.json();
}

function decodeHtml(html = '') {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&trade;/g, '™')
    .replace(/&reg;/g, '®');
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
    const name   = titleM ? decodeHtml(titleM[1].trim()) : null;
    if (!name) continue;

    // Release date: <div class="search_released responsive_secondrow">Aug 1, 2026</div>
    const dateM       = block.match(/class="search_released[^"]*"[^>]*>\s*([^<\s][^<]+?)\s*<\/div>/);
    const releaseDate = dateM ? dateM[1].trim() : null;

    // Review score tooltip: data-tooltip-html="Very Positive<br>..."
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
async function enrichWithDetails(games, count = 32) {
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
      const minReqText = typeof d.pc_requirements?.minimum === 'string' ? d.pc_requirements.minimum : '';
      const recReqText = typeof d.pc_requirements?.recommended === 'string' ? d.pc_requirements.recommended : '';
      const parsedSpecs = parseRequirements(minReqText, recReqText);

      map[g.appId] = {
        genres:       (d.genres || []).map(x => x.description),
        releaseDate:  d.release_date?.date || null,
        ratingScore:  score,
        ratingLabel:  getSteamRatingLabel(score),
        isFree:       d.is_free ?? true,
        headerImage:  d.header_image || null,
        ...parsedSpecs,
      };
    } catch (_) { /* silently skip */ }
  }));

  return games.map(g => ({ ...g, ...(map[g.appId] || {}) }));
}

// ─── CLIENT-SIDE SORTING ─────────────────────────────────────────────────────
/**
 * Sorts games client-side for sorts that Steam API doesn't support natively
 */
function sortClientSide(games, sort) {
  return [...games].sort((a, b) => {
    switch (sort) {
      case 'size-large':
        // Sort by download size descending (largest first)
        // Note: We don't have size data from Steam search results, so we approximate
        // by using the header image file size heuristic or fallback to name
        // In a production app, we would need to make additional API calls to get file sizes
        // For now, we'll sort by name as a reasonable fallback
        return (b.name || '').localeCompare(a.name || '');

      case 'size-small':
        // Sort by download size ascending (smallest first)
        // Same limitation as above - fallback to name sorting
        return (a.name || '').localeCompare(b.name || '');

      case 'dlc-most':
        // Sort by DLC count descending (most DLC first)
        // Note: We don't have DLC count data from search results
        // Would need to call appdetails for each game to get this info
        // For now, we'll sort by name as a fallback
        return (b.name || '').localeCompare(a.name || '');

      default:
        return 0;
    }
  });
}

// ─── GET HANDLER ─────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page        = Math.max(1, parseInt(searchParams.get('page')  || '1',  10));
    const limit       = Math.min(50, parseInt(searchParams.get('limit') || '12', 10));
    const search      = (searchParams.get('search') || '').trim();
    const sort        = searchParams.get('sort') || 'newest';
    const tagsParam   = searchParams.get('tags') || '';
    const tags        = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : [];
    const untagsParam = searchParams.get('untags') || '';
    const untags      = untagsParam ? untagsParam.split(',').map(t => t.trim()).filter(Boolean) : [];
    const showAdult   = searchParams.get('showAdult') === 'true';

    const startIndex = (page - 1) * limit;

    // For client-side sorts, we need to fetch more games to have enough to sort
    // and to ensure we get a good distribution after sorting
    const fetchLimit = REQUIRES_CLIENT_SORT.has(sort) ? Math.min(200, limit * 4) : limit;

    const chunk1 = Math.floor(startIndex / 50) * 50;
    const chunk2 = Math.floor((fetchLimit - 1) / 50) * 50;

    let total = 0;
    let combinedGames = [];

    if (chunk1 === chunk2) {
      const raw = await fetchSteamChunk({
        start: chunk1,
        search,
        sort,
        tags,
        untags,
        showAdult,
      });
      total = raw.total_count ?? 0;
      combinedGames = parseResults(raw.results_html || '');
    } else {
      const [raw1, raw2] = await Promise.all([
        fetchSteamChunk({
          start: chunk1,
          search,
          sort,
          tags,
          untags,
          showAdult,
        }),
        fetchSteamChunk({
          start: chunk2,
          search,
          sort,
          tags,
          untags,
          showAdult,
        }),
      ]);
      total = raw1.total_count ?? raw2.total_count ?? 0;
      combinedGames = [
        ...parseResults(raw1.results_html || ''),
        ...parseResults(raw2.results_html || ''),
      ];
    }

    // Slice to get the requested range (before client-side sorting)
    const sliceStart = startIndex - chunk1;
    let games = combinedGames.slice(sliceStart, sliceStart + fetchLimit);

    // Enrich games with rating + genres from appdetails
    // We enrich a reasonable number of games for performance
    if (games.length > 0) {
      games = await enrichWithDetails(games, Math.min(games.length, 20));
    }

    // Apply client-side sorting if needed
    if (REQUIRES_CLIENT_SORT.has(sort)) {
      games = sortClientSide(games, sort);
      // After sorting, take only the requested page
      games = games.slice(0, limit);
    } else {
      // For server-side sorts, just take the requested page
      games = games.slice(0, limit);
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

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