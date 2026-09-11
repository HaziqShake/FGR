/**
 * enrich-missing.mjs
 *
 * Queries Firestore for game documents that are missing PC hardware data
 * (minGPUTier == null OR minRAMgb == null), then re-runs Steam + RAWG lookup
 * on each one and writes the results back.
 *
 * Run with:  node scripts/enrich-missing.mjs
 * Options:
 *   --dry-run     Print what would be updated, but don't write to Firestore
 *   --limit=N     Only process N games (default: all)
 *   --delay=N     Ms between each Steam API call (default: 2000)
 */

import './init-env.js';
import { db } from '../lib/firebase-admin.js';
import { getGPUTier, getCPUTier } from '../utils/hardware-tiers.js';
import { parseRAMFromText, parseGPUFromText, parseCPUFromText, getSteamRatingLabel } from '../utils/parse-requirements.js';
import { getRequirementsFromRawg } from '../utils/rawg-service.js';

const isDryRun  = process.argv.includes('--dry-run');
const limitArg  = process.argv.find(a => a.startsWith('--limit='));
const delayArg  = process.argv.find(a => a.startsWith('--delay='));
const MAX_GAMES = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;
const DELAY_MS  = delayArg ? parseInt(delayArg.split('=')[1], 10) : 2000;

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ─── HELPERS (re-implemented inline so this script is self-contained) ─────────

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n').trim();
}

function cleanTitleForSearch(title = '') {
  return title
    .replace(/–.*$/u, '')
    .replace(/\s*[vV]\d+(\.\d+)*.*/g, '')
    .replace(/\s*\+\s*\d+\s*(DLCs?|Bonuses?).*/gi, '')
    .replace(/\s*(Digital|Deluxe|Ultimate|Gold|GOTY|Complete|Edition).*/gi, '')
    .replace(/\s*\(.*\)/, '')
    .trim();
}

/**
 * Looks up a game by its existing steamAppId (fast path) or by title search.
 * Returns enriched spec fields or null.
 */
async function enrichGame(doc) {
  const data    = doc.data();
  const title   = data.title || '';
  const appId   = data.steamAppId;

  let detailData = null;

  // Fast path: we already have the appId stored, skip search
  if (appId) {
    try {
      const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=en`;
      const detailRes = await fetch(detailUrl);
      if (detailRes.ok) {
        const json = await detailRes.json();
        detailData = json?.[String(appId)]?.data;
      }
    } catch (e) {
      console.warn(`  [STEAM] Detail fetch failed for appId ${appId}:`, e.message);
    }
  } else {
    // Slow path: search by title
    const query = cleanTitleForSearch(title);
    try {
      const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&cc=us&l=en`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const items = searchData?.items || [];
        const queryLower = query.toLowerCase();
        const match = items.find(i =>
          i.name.toLowerCase().includes(queryLower) ||
          queryLower.includes(i.name.toLowerCase())
        ) || items[0];

        if (match) {
          await wait(DELAY_MS);
          const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${match.id}&l=en`;
          const detailRes = await fetch(detailUrl);
          if (detailRes.ok) {
            const json = await detailRes.json();
            detailData = json?.[String(match.id)]?.data;
          }
        }
      }
    } catch (e) {
      console.warn(`  [STEAM] Search failed for "${title}":`, e.message);
    }
  }

  // ── Parse Steam requirements ────────────────────────────────────────────────
  let minText = stripHtml(detailData?.pc_requirements?.minimum || '');
  let recText = stripHtml(detailData?.pc_requirements?.recommended || '');

  let minGPUname = parseGPUFromText(minText)?.name ?? null;
  let recGPUname = parseGPUFromText(recText)?.name ?? null;
  let minCPUname = parseCPUFromText(minText)?.name ?? null;
  let recCPUname = parseCPUFromText(recText)?.name ?? null;
  let minRAMgb   = parseRAMFromText(minText);
  let recRAMgb   = parseRAMFromText(recText);

  // ── RAWG Fallback ─────────────────────────────────────────────────────────
  let rawgFallback = false;
  if (!minText && !recText) {
    console.log(`  [RAWG] No Steam PC reqs, trying RAWG for "${title}"...`);
    try {
      const rawgReqs = await getRequirementsFromRawg(title);
      if (rawgReqs) {
        rawgFallback = true;
        minText    = rawgReqs.minimum || '';
        recText    = rawgReqs.recommended || '';
        minGPUname = parseGPUFromText(minText)?.name ?? null;
        recGPUname = parseGPUFromText(recText)?.name ?? null;
        minCPUname = parseCPUFromText(minText)?.name ?? null;
        recCPUname = parseCPUFromText(recText)?.name ?? null;
        minRAMgb   = parseRAMFromText(minText);
        recRAMgb   = parseRAMFromText(recText);
      }
    } catch (e) {
      console.warn(`  [RAWG] Failed for "${title}":`, e.message);
    }
  }

  // If we got nothing from either source, skip
  if (!minGPUname && !minRAMgb) {
    return null;
  }

  // ── Rating enrichment ──────────────────────────────────────────────────────
  const metaScore   = detailData?.metacritic?.score ?? null;
  const ratingLabel = getSteamRatingLabel(metaScore);

  const patch = {
    // Requirements
    minGPUname, recGPUname,
    minCPUname, recCPUname,
    minGPUTier:  minGPUname ? getGPUTier(minGPUname) : null,
    recGPUTier:  recGPUname ? getGPUTier(recGPUname) : null,
    minCPUTier:  minCPUname ? getCPUTier(minCPUname) : null,
    recCPUTier:  recCPUname ? getCPUTier(recCPUname) : null,
    minRAMgb,
    recRAMgb,
    minSpecsRaw: minText || null,
    recSpecsRaw: recText || null,
    rawgFallback,
    // Rating
    steamRatingScore: metaScore,
    steamRatingLabel: ratingLabel,
    steamRating:      metaScore,      // backward compat
    steamIsFree:      detailData?.is_free ?? data.steamIsFree ?? false,
    // Metadata (fill gaps)
    steamAppId:  detailData ? (detailData.steam_appid ?? data.steamAppId) : data.steamAppId,
    steamName:   detailData?.name ?? data.steamName ?? null,
    steamGenres: detailData?.genres?.map(g => g.description) ?? data.steamGenres ?? [],
    developer:   detailData?.developers?.[0] ?? data.developer ?? null,
    publisher:   detailData?.publishers?.[0] ?? data.publisher ?? null,
    // Timestamp
    updatedAt:   new Date().toISOString(),
  };

  return patch;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 FitCheck — Enrich Missing Specs\n');
  if (isDryRun) console.log('⚠️  DRY RUN — no writes will happen\n');

  const gamesRef = db.collection('games');

  // Fetch all non-game documents are already filtered in the UI, so just grab everything
  // and filter client-side for missing data (Firestore can't query for null efficiently)
  console.log('📥 Fetching games from Firestore...');
  const snap = await gamesRef.get();
  console.log(`   Total documents: ${snap.size}`);

  // Filter: missing minGPUTier OR minRAMgb AND not a non-game post
  const missing = snap.docs.filter(doc => {
    const d = doc.data();
    if (d.isNonGame || d.isUpdatesDigest) return false;
    if (!d.imageUrl) return false;
    // Target: real games with no hardware spec data
    return d.minGPUTier == null || d.minRAMgb == null;
  });

  console.log(`   Missing specs:   ${missing.length}`);
  console.log(`   Processing up to: ${MAX_GAMES === Infinity ? 'all' : MAX_GAMES}\n`);

  if (missing.length === 0) {
    console.log('✅ All games already have spec data. Nothing to do.');
    return;
  }

  let processed = 0, enriched = 0, skipped = 0;

  for (const doc of missing) {
    if (processed >= MAX_GAMES) break;

    const data  = doc.data();
    const label = data.title || doc.id;

    process.stdout.write(`[${processed + 1}/${Math.min(missing.length, MAX_GAMES)}] ${label.slice(0, 60)}... `);

    try {
      const patch = await enrichGame(doc);

      if (!patch) {
        console.log('⏭  no data found');
        skipped++;
      } else {
        const source = patch.rawgFallback ? '(RAWG)' : '(Steam)';
        console.log(`✅ ${patch.minGPUname || '?'} / ${patch.minRAMgb ?? '?'}GB RAM ${source}`);

        if (!isDryRun) {
          await doc.ref.update(patch);
        }
        enriched++;
      }
    } catch (err) {
      console.log(`❌ error: ${err.message}`);
      skipped++;
    }

    processed++;
    await wait(DELAY_MS);
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Done.`);
  console.log(`   Enriched: ${enriched}`);
  console.log(`   Skipped (no data): ${skipped}`);
  console.log(`   Total processed: ${processed}`);
  if (isDryRun) console.log(`\n(Dry run — no Firestore writes occurred)`);
}

main().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
