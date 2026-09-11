/**
 * check-hypervisor.mjs
 *
 * Finds every game in Firestore marked isHypervisor: true, re-visits its
 * FitGirl page, and checks whether the hypervisor requirement has been lifted.
 * If it has, the document is updated (isHypervisor: false) and logged.
 *
 * Usage:
 *   node scripts/check-hypervisor.mjs            # live run — writes to Firestore
 *   node scripts/check-hypervisor.mjs --dry-run  # prints what would change, no writes
 */

import './init-env.js';
import { chromium } from 'playwright';
import { db } from '../lib/firebase-admin.js';

const isDryRun = process.argv.includes('--dry-run');
const DELAY_MS  = 1500; // ms between page loads

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Lightweight hypervisor check ────────────────────────────────────────────
// Mirrors the exact same logic used in scrapeGameDetails() in scraper.mjs so
// results are consistent.
async function checkIsHypervisor(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const title = await page.$eval('h1.entry-title', el => el.innerText.trim())
    .catch(() => '');
  const content = await page.$eval('.entry-content', el => el.innerText)
    .catch(() => '');

  // Only inspect the title + first 5 lines of the post body (same guard as scraper.mjs)
  const firstFewLines = content.split('\n').slice(0, 5).join('\n');
  const isHypervisor = /hypervisor/i.test(title) || /hypervisor/i.test(firstFewLines);

  return { title, isHypervisor };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔍 FitCheck — Hypervisor Status Checker');
  if (isDryRun) console.log('⚠️  DRY RUN — no Firestore writes will happen');
  console.log();

  // 1. Fetch all isHypervisor: true docs from Firestore
  console.log('📥 Querying Firestore for isHypervisor: true...');
  const snap = await db.collection('games').where('isHypervisor', '==', true).get();
  console.log(`   Found ${snap.size} hypervisor-marked game(s).\n`);

  if (snap.size === 0) {
    console.log('✅ No hypervisor games in the database. Nothing to check.');
    return;
  }

  // 2. Launch browser
  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage();
  console.log('✅ Browser ready.\n');

  let checked = 0, cleared = 0, stillHypervisor = 0, errors = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const url  = data.repackUrl;
    const label = data.title || doc.id;
    checked++;

    process.stdout.write(`[${checked}/${snap.size}] ${label.slice(0, 70)}... `);

    if (!url) {
      console.log('⏭  no repackUrl, skipping');
      errors++;
      continue;
    }

    try {
      const { isHypervisor } = await checkIsHypervisor(page, url);

      if (!isHypervisor) {
        // Hypervisor requirement has been lifted!
        console.log('✅ CLEARED — hypervisor removed');
        cleared++;

        if (!isDryRun) {
          await doc.ref.update({
            isHypervisor: false,
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        console.log('🔒 still hypervisor');
        stillHypervisor++;
      }
    } catch (err) {
      console.log(`❌ error: ${err.message}`);
      errors++;
    }

    await wait(DELAY_MS);
  }

  await browser.close();

  console.log('\n─────────────────────────────────────────');
  console.log('✅ Done.');
  console.log(`   Checked:          ${checked}`);
  console.log(`   Cleared (fixed):  ${cleared}`);
  console.log(`   Still hypervisor: ${stillHypervisor}`);
  console.log(`   Errors / skipped: ${errors}`);
  if (isDryRun) console.log('\n(Dry run — no Firestore writes occurred)');
}

main().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
