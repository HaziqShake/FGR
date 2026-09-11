/**
 * sync-hardware-db.js
 *
 * Automated ingestion script: pulls CPU and GPU data from the BuildCores OpenDB
 * GitHub repository (https://github.com/buildcores/buildcores-open-db) and
 * merges it with the existing utils/hardware-data.js schema.
 *
 * Run with:  node scripts/sync-hardware-db.js
 * Add to package.json: "sync-hardware": "node scripts/sync-hardware-db.js"
 *
 * Strategy:
 *   1. Fetch GPU and CPU JSON files from buildcores/buildcores-open-db via GitHub API
 *   2. Map BuildCores tier scores → our 1–10 scale
 *   3. Merge NEW entries only (won't overwrite hand-tuned tiers for known models)
 *   4. Emit a summary of additions
 *   5. Write an enriched hardware-data.js (or hardware-data.enriched.js for review)
 *
 * NOTE: This script does NOT automatically overwrite hardware-data.js.
 *       It writes hardware-data.enriched.js for manual review / CI diff.
 *       To apply: rename / merge manually.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/buildcores/buildcores-open-db/main';
const OUTPUT_PATH     = path.join(ROOT, 'utils', 'hardware-data.enriched.js');

// ─── BUILDCORES TIER → OUR TIER MAPPING ─────────────────────────────────────
// BuildCores uses a different numeric scale. We normalise to 1–10.
// Their tier field is typically a rank 1–5 or 1–10 depending on category.
// We clamp and map conservatively.

function mapBuildCoresTier(bcTier, category = 'gpu') {
  // BuildCores uses 1 (entry) → 5 (flagship) roughly
  // We expand to our 1–10 scale
  const t = parseInt(bcTier, 10);
  if (isNaN(t)) return 5; // Default mid-tier
  const scaled = Math.round((t / 5) * 10);
  return Math.max(1, Math.min(10, scaled));
}

// ─── FETCH HELPERS ───────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/**
 * Lists JSON files available in a BuildCores OpenDB directory.
 * Uses the GitHub Contents API.
 */
async function listRepoFiles(repoPath) {
  const url = `https://api.github.com/repos/buildcores/buildcores-open-db/contents/${repoPath}`;
  const headers = { 'User-Agent': 'FitCheck-HWSync/1.0' };
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`[BuildCores] Cannot list ${repoPath} (${res.status}). Skipping.`);
    return [];
  }
  const files = await res.json();
  return Array.isArray(files) ? files.filter(f => f.name.endsWith('.json')) : [];
}

// ─── GPU INGESTION ───────────────────────────────────────────────────────────

/**
 * Downloads and normalises GPU data from BuildCores OpenDB.
 * Returns an array compatible with GPU_DATA format in hardware-data.js:
 *   [{ brand, series, models: [{ name, tier, source }] }]
 */
async function ingestGPUs() {
  console.log('📥 Fetching GPU data from BuildCores OpenDB...');
  const newSeries = [];

  try {
    // BuildCores stores GPUs in /gpus/ directory as brand JSON files
    const files = await listRepoFiles('gpus');
    console.log(`  Found ${files.length} GPU files.`);

    for (const file of files) {
      try {
        const data = await fetchJSON(file.download_url);

        // BuildCores schema: { brand, series: [{ name, models: [{ name, tier, ... }] }] }
        // OR flat: { brand, models: [...] }
        const brand = data.brand || file.name.replace('.json', '').toUpperCase();

        if (Array.isArray(data.series)) {
          for (const s of data.series) {
            const models = (s.models || []).map(m => ({
              name:   m.name || m.model,
              tier:   mapBuildCoresTier(m.tier ?? m.score ?? 3, 'gpu'),
              source: 'buildcores',
            })).filter(m => m.name);

            if (models.length > 0) {
              newSeries.push({ brand, series: s.name || s.series, models });
            }
          }
        } else if (Array.isArray(data.models)) {
          const models = data.models.map(m => ({
            name:   m.name || m.model,
            tier:   mapBuildCoresTier(m.tier ?? m.score ?? 3, 'gpu'),
            source: 'buildcores',
          })).filter(m => m.name);

          if (models.length > 0) {
            newSeries.push({ brand, series: `${brand} (BuildCores)`, models });
          }
        }
      } catch (e) {
        console.warn(`  [GPU] Skipping ${file.name}: ${e.message}`);
      }
    }
  } catch (err) {
    console.warn('[GPU] BuildCores fetch failed:', err.message);
    console.warn('  → Will generate hardware-data.enriched.js with only existing data.');
  }

  return newSeries;
}

// ─── CPU INGESTION ───────────────────────────────────────────────────────────

async function ingestCPUs() {
  console.log('📥 Fetching CPU data from BuildCores OpenDB...');
  const newSeries = [];

  try {
    const files = await listRepoFiles('cpus');
    console.log(`  Found ${files.length} CPU files.`);

    for (const file of files) {
      try {
        const data = await fetchJSON(file.download_url);
        const brand = data.brand || file.name.replace('.json', '').toUpperCase();

        if (Array.isArray(data.series)) {
          for (const s of data.series) {
            const models = (s.models || []).map(m => ({
              name:   m.name || m.model,
              tier:   mapBuildCoresTier(m.tier ?? m.score ?? 3, 'cpu'),
              source: 'buildcores',
            })).filter(m => m.name);

            if (models.length > 0) {
              newSeries.push({ brand, series: s.name || s.series, models });
            }
          }
        } else if (Array.isArray(data.models)) {
          const models = data.models.map(m => ({
            name:   m.name || m.model,
            tier:   mapBuildCoresTier(m.tier ?? m.score ?? 3, 'cpu'),
            source: 'buildcores',
          })).filter(m => m.name);

          if (models.length > 0) {
            newSeries.push({ brand, series: `${brand} (BuildCores)`, models });
          }
        }
      } catch (e) {
        console.warn(`  [CPU] Skipping ${file.name}: ${e.message}`);
      }
    }
  } catch (err) {
    console.warn('[CPU] BuildCores fetch failed:', err.message);
  }

  return newSeries;
}

// ─── MERGE LOGIC ─────────────────────────────────────────────────────────────

/**
 * Merges new BuildCores series into existing data. Does NOT overwrite existing
 * entries — only appends series/models that are new (by name comparison).
 */
function mergeData(existing, incoming) {
  const merged = [...existing];
  let addedSeries = 0;
  let addedModels = 0;

  for (const newSeries of incoming) {
    // Check if we already have this series
    const existingSeries = merged.find(
      s => s.brand === newSeries.brand &&
           s.series.toLowerCase() === newSeries.series?.toLowerCase()
    );

    if (existingSeries) {
      // Add only models not already present
      const existingNames = new Set(existingSeries.models.map(m => m.name.toLowerCase()));
      const uniqueModels = newSeries.models.filter(
        m => !existingNames.has(m.name.toLowerCase())
      );
      existingSeries.models.push(...uniqueModels);
      addedModels += uniqueModels.length;
    } else {
      merged.push(newSeries);
      addedSeries++;
      addedModels += newSeries.models.length;
    }
  }

  console.log(`  ✅ Merged: +${addedSeries} new series, +${addedModels} new models`);
  return merged;
}

// ─── CODE GENERATOR ──────────────────────────────────────────────────────────

function serializeEntry(entry) {
  const modelsStr = entry.models.map(m => {
    const src = m.source ? `, source: '${m.source}'` : '';
    return `    { name: '${m.name.replace(/'/g, "\\'")}', tier: ${m.tier}${src} }`;
  }).join(',\n');

  return `  { brand: '${entry.brand}', series: '${entry.series.replace(/'/g, "\\'")}', models: [\n${modelsStr}\n  ]}`;
}

function generateFileContent(gpuData, cpuData, ramOptions) {
  const header = `/**
 * Hardware Library (Enriched)
 * Auto-generated by scripts/sync-hardware-db.js
 * Generated: ${new Date().toISOString()}
 * 
 * Tiers: 1 (Integrated) to 10 (Enthusiast)
 * Entries with source: 'buildcores' were ingested from buildcores/buildcores-open-db.
 * All other entries are hand-curated.
 */

`;

  const gpuSection = `export const GPU_DATA = [\n${gpuData.map(serializeEntry).join(',\n')}\n];\n`;
  const cpuSection = `\nexport const CPU_DATA = [\n${cpuData.map(serializeEntry).join(',\n')}\n];\n`;
  const ramSection = `\nexport const RAM_OPTIONS = ${JSON.stringify(ramOptions, null, 2)};\n`;

  return header + gpuSection + cpuSection + ramSection;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔧 FitCheck Hardware DB Sync — BuildCores OpenDB\n');

  // Load existing hardware-data.js dynamically
  const hwDataPath = path.join(ROOT, 'utils', 'hardware-data.js');
  const hwDataUrl  = `file:///${hwDataPath.replace(/\\/g, '/')}`;

  let GPU_DATA, CPU_DATA, RAM_OPTIONS;
  try {
    const existing = await import(hwDataUrl);
    GPU_DATA    = existing.GPU_DATA;
    CPU_DATA    = existing.CPU_DATA;
    RAM_OPTIONS = existing.RAM_OPTIONS;
    console.log(`📂 Loaded existing hardware-data.js:`);
    console.log(`   GPUs: ${GPU_DATA.reduce((a, s) => a + s.models.length, 0)} models across ${GPU_DATA.length} series`);
    console.log(`   CPUs: ${CPU_DATA.reduce((a, s) => a + s.models.length, 0)} models across ${CPU_DATA.length} series`);
  } catch (err) {
    console.error('❌ Failed to load hardware-data.js:', err.message);
    process.exit(1);
  }

  // Fetch from BuildCores
  const newGPUs = await ingestGPUs();
  const newCPUs = await ingestCPUs();

  // Merge
  console.log('\n🔀 Merging GPU data...');
  const mergedGPUs = mergeData(GPU_DATA, newGPUs);

  console.log('🔀 Merging CPU data...');
  const mergedCPUs = mergeData(CPU_DATA, newCPUs);

  // Write enriched output
  const content = generateFileContent(mergedGPUs, mergedCPUs, RAM_OPTIONS);
  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');

  console.log(`\n✅ Written: ${OUTPUT_PATH}`);
  console.log(`   Total GPUs: ${mergedGPUs.reduce((a, s) => a + s.models.length, 0)}`);
  console.log(`   Total CPUs: ${mergedCPUs.reduce((a, s) => a + s.models.length, 0)}`);
  console.log(`\n💡 Review hardware-data.enriched.js, then rename to hardware-data.js to apply.\n`);
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
