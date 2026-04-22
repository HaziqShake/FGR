import './init-env.js';
import { chromium } from 'playwright';
import { db } from '../lib/firebase.js';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getGPUTier, getCPUTier } from '../utils/hardware-tiers.js';
import fs from 'fs';
import path from 'path';

const STATE_FILE = path.resolve('scraper-state.json');

const BASE_URL = 'https://fitgirl-repacks.site';
const DELAY_MS = 1500;       // Delay between FitGirl page loads
const STEAM_DELAY_MS = 2000; // Delay between Steam API calls

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── STEAM API HELPERS ──────────────────────────────────────────────────────

/**
 * Strips FitGirl-specific suffixes from a title to get the clean game name.
 * Example: "Black Myth: Wukong – Digital Deluxe Edition V1.0 + 4 DLCs" → "Black Myth: Wukong"
 */
function cleanTitleForSearch(title) {
  return title
    .replace(/–.*$/u, '')                          // Strip everything after an em-dash
    .replace(/\s*[vV]\d+(\.\d+)*.*/g, '')          // Strip version numbers
    .replace(/\s*\+\s*\d+\s*(DLCs?|Bonuses?).*/gi, '') // Strip "+ 4 DLCs"
    .replace(/\s*(Digital|Deluxe|Ultimate|Gold|GOTY|Complete|Edition).*/gi, '') // Strip edition names
    .replace(/\s*\(.*\)/, '')                       // Strip parenthetical notes
    .trim();
}

/**
 * Parses a RAM amount from a requirement text string.
 * Example: "Memory: 16 GB RAM" → 16
 */
function parseRAM(text = '') {
  const match = text.match(/(\d+)\s*GB\s*RAM/i);
  return match ? parseInt(match[1]) : null;
}

/**
 * Parses a GPU name from a requirement text string.
 * Example: "Graphics: NVIDIA GeForce RTX 2060" → "RTX 2060"
 */
function parseGPUName(text = '') {
  const match = text.match(/(?:Graphics|GPU|Video):\s*([^\n<]+)/i);
  if (!match) return null;
  const raw = match[1].replace(/<[^>]+>/g, '').trim();
  // Simplify: drop "NVIDIA GeForce " prefix etc.
  return raw
    .replace(/NVIDIA GeForce /i, '')
    .replace(/AMD Radeon /i, '')
    .replace(/Intel /i, '')
    .replace(/\s*\d+\s*GB.*/i, '')  // Drop VRAM suffix
    .trim();
}

/**
 * Parses a CPU name from a requirement text string.
 */
function parseCPUName(text = '') {
  const match = text.match(/(?:Processor|CPU):\s*([^\n<]+)/i);
  if (!match) return null;
  return match[1].replace(/<[^>]+>/g, '').trim();
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n').trim();
}

/**
 * Looks up a game on Steam and returns its PC system requirements + metadata.
 */
async function lookupSteamSpecs(rawTitle) {
  const title = cleanTitleForSearch(rawTitle);
  if (!title) return null;

  try {
    // Step 1: Search for the game
    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&cc=us&l=en`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    const items = searchData?.items;
    if (!items || items.length === 0) return null;

    // Find best match: title must roughly match
    const titleLower = title.toLowerCase();
    const match = items.find(item => 
      item.name.toLowerCase().includes(titleLower) ||
      titleLower.includes(item.name.toLowerCase())
    ) || items[0]; // Fallback to first result

    const appId = match.id;

    await wait(STEAM_DELAY_MS); // Rate-limit Steam calls

    // Step 2: Fetch game details
    const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=en`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) return null;
    const detailData = await detailRes.json();

    const gameData = detailData?.[appId]?.data;
    if (!gameData) return null;

    const minText = stripHtml(gameData.pc_requirements?.minimum || '');
    const recText = stripHtml(gameData.pc_requirements?.recommended || '');

    const minGPUname = parseGPUName(minText);
    const recGPUname = parseGPUName(recText);
    const minCPUname = parseCPUName(minText);
    const recCPUname = parseCPUName(recText);

    const steamResult = {
      steamAppId: appId,
      steamName: gameData.name,
      // Real PC Requirements
      minRAMgb: parseRAM(minText),
      recRAMgb: parseRAM(recText),
      minGPUname,
      recGPUname,
      minCPUname,
      recCPUname,
      minGPUTier: minGPUname ? getGPUTier(minGPUname) : null,
      recGPUTier: recGPUname ? getGPUTier(recGPUname) : null,
      minCPUTier: minCPUname ? getCPUTier(minCPUname) : null,
      recCPUTier: recCPUname ? getCPUTier(recCPUname) : null,
      minSpecsRaw: minText || null,
      recSpecsRaw: recText || null,
      // Steam metadata for enrichment
      developer: gameData.developers?.[0] || null,
      publisher: gameData.publishers?.[0] || null,
      steamRating: gameData.metacritic?.score || null,
      releaseYear: gameData.release_date?.date ? new Date(gameData.release_date.date).getFullYear() : null,
      steamGenres: gameData.genres?.map(g => g.description) || [],
      steamCategories: gameData.categories?.map(c => c.description) || [],
    };

    console.log(`  [STEAM] ${gameData.name} → Min: ${minGPUname} / ${steamResult.minRAMgb}GB RAM`);
    return steamResult;

  } catch (err) {
    console.warn(`  [STEAM] Lookup failed for "${title}":`, err.message);
    return null;
  }
}

// ─── FITGIRL SCRAPER ─────────────────────────────────────────────────────────

async function scrapeGameDetails(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log(`Scraping: ${url}`);

    const title = await page.$eval('h1.entry-title', el => el.innerText.trim());
    const content = await page.$eval('.entry-content', el => el.innerText);
    const imageUrl = await page.$eval('.entry-content img', el => el.src).catch(() => null);

    // ── Tags / Genres ────────────────────────────────────────────────────────
    const genres = await page.$$eval('.entry-content p a', anchors =>
      anchors.map(a => a.innerText.trim()).filter(t => t.length > 0 && t.length < 40)
    );

    const isAdult = genres.some(g =>
      g.toLowerCase().includes('adult') ||
      g.toLowerCase().includes('porn') ||
      g.toLowerCase().includes('hentai') ||
      g.toLowerCase().includes('eroge')
    );

    // ── Repack Size (download size) ──────────────────────────────────────────
    // FitGirl usually has "Repack Size: X.X GB" or "Download Size: X.X GB"
    const dlSizeMatch = content.match(/(?:repack|download) size[:\s]+([0-9.]+)\s*(GB|MB)/i);
    let downloadSizeGB = null;
    if (dlSizeMatch) {
      downloadSizeGB = dlSizeMatch[2].toUpperCase() === 'MB'
        ? parseFloat(dlSizeMatch[1]) / 1024
        : parseFloat(dlSizeMatch[1]);
    }

    // ── Original / Installed Size ─────────────────────────────────────────────
    const origSizeMatch = content.match(/(?:original|installed|install) size[:\s]+([0-9.]+)\s*(GB|MB)/i);
    let originalSizeGB = null;
    if (origSizeMatch) {
      originalSizeGB = origSizeMatch[2].toUpperCase() === 'MB'
        ? parseFloat(origSizeMatch[1]) / 1024
        : parseFloat(origSizeMatch[1]);
    }

    // ── Languages ────────────────────────────────────────────────────────────
    const langMatch = content.match(/(?:languages|language)[:\s]+([^\n]+)/i);
    const languages = langMatch
      ? langMatch[1].split(/[,;]/).map(l => l.trim()).filter(l => l.length > 0 && l.length < 30)
      : [];

    // ── DLC Count ────────────────────────────────────────────────────────────
    const dlcMatch = title.match(/\+\s*(\d+)\s*DLC/i) || content.match(/(\d+)\s*DLC/i);
    const dlcCount = dlcMatch ? parseInt(dlcMatch[1]) : 0;

    // ── Selective Download ────────────────────────────────────────────────────
    const hasSelectiveDownload = /selective download/i.test(content);

    // ── Hypervisor / VM Detection ─────────────────────────────────────────────
    const isHypervisor = /hypervisor/i.test(title) || /hypervisor/i.test(content);
    const isUpdatesDigest = /updates digest/i.test(title);
    const isNonGame = 
      !imageUrl ||
      /repack updated/i.test(title) ||
      /call for donation/i.test(title) ||
      /upcoming repacks/i.test(title) ||
      /site news/i.test(title) ||
      /reminder/i.test(title) && !/game/i.test(content) ||
      isUpdatesDigest;

    // ── FitGirl Post Publication Date ─────────────────────────────────────────
    // WordPress renders a machine-readable <time datetime="2024-01-15T..."> element
    const postDate = await page.$eval(
      'time.entry-date',
      el => el.getAttribute('datetime')
    ).catch(() => null);

    // ── Steam Lookup ─────────────────────────────────────────────────────────
    const steamSpecs = await lookupSteamSpecs(title);

    return {
      title,
      slug: url.split('/').filter(Boolean).pop(),
      genres,
      isAdult,
      isHypervisor,
      isUpdatesDigest,
      isNonGame,
      // Sizes
      downloadSizeGB,
      originalSizeGB,
      // Languages
      languages,
      // DLC
      dlcCount,
      hasSelectiveDownload,
      // Dates
      postDate: postDate || new Date().toISOString(), // Real FitGirl publish date
      updatedAt: new Date().toISOString(),            // Last scrape time
      // Steam-enriched data
      ...(steamSpecs || {}),
      // URLs
      imageUrl,
      repackUrl: url,
    };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

async function runScraper(maxPages = null) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Detect total pages
  if (!maxPages) {
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Robust detection: Look for the last number in the pagination
      const pages = await page.$$eval('.page-numbers', els => 
        els.map(el => parseInt(el.innerText)).filter(n => !isNaN(n))
      );
      maxPages = Math.max(...pages, 800); // Default to at least 800 if anything fails
      console.log(`📡 Detected Total Library Depth: ${maxPages} pages`);
    } catch (e) {
      maxPages = 800; // Hard fallback
      console.log(`📡 Failed to detect pages, falling back to ${maxPages}`);
    }
  }

  let startPage = 1;
  const isResume = process.argv.includes('--resume');

  if (isResume && fs.existsSync(STATE_FILE)) {
    try {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      if (state.lastPage && state.lastPage < maxPages) {
        startPage = state.lastPage + 1; // Start with the next page
        console.log(`⏯  Resuming from Page ${startPage}...`);
      } else if (state.lastPage >= maxPages) {
        console.log(`🏁 State file says we already reached page ${state.lastPage}. Starting fresh from Page 1.`);
      }
    } catch (e) {
      console.warn('⚠️ Failed to read state file, starting from Page 1.');
    }
  }

  for (let i = startPage; i <= maxPages; i++) {
    const pageUrl = i === 1 ? BASE_URL : `${BASE_URL}/page/${i}/`;
    console.log(`\n--- Indexing Page ${i} / ${maxPages} ---`);

    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const links = await page.$$eval('h1.entry-title a', anchors => anchors.map(a => a.href));

      for (const link of links) {
        const gameData = await scrapeGameDetails(page, link);

        if (gameData) {
          const gamesRef = collection(db, 'games');
          const q = query(gamesRef, where('slug', '==', gameData.slug));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            await addDoc(gamesRef, gameData);
            console.log(`[NEW] ${gameData.title}`);
          } else {
            const existingDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'games', existingDoc.id), gameData);
            console.log(`[UPD] ${gameData.title}`);
          }
        }
        await wait(DELAY_MS);
      }
    } catch (pageErr) {
      console.error(`Failed to load index page ${i}:`, pageErr.message);
    }
    
    // Save state after completing the page
    fs.writeFileSync(STATE_FILE, JSON.stringify({ lastPage: i }));
  }

  await browser.close();
  console.log('\n--- FULL LIBRARY SYNC COMPLETE ---');
}

runScraper();
