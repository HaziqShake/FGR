import './init-env.js';
import { db } from '../lib/firebase.js';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// ── Config ────────────────────────────────────────────────────────────────────
const TITLE_SEARCH = process.argv[2] || '';
const OVERRIDES = {};

for (const arg of process.argv.slice(3)) {
  const [key, raw] = arg.split('=');
  if (!key || raw === undefined) continue;
  if (raw === 'true') OVERRIDES[key] = true;
  else if (raw === 'false') OVERRIDES[key] = false;
  else if (!isNaN(raw)) OVERRIDES[key] = Number(raw);
  else OVERRIDES[key] = raw;
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function patch() {
  const gamesRef = collection(db, 'games');
  const snap = await getDocs(gamesRef);

  const lower = TITLE_SEARCH.toLowerCase();
  const matches = snap.docs.filter(d =>
    d.data().title?.toLowerCase().includes(lower)
  );

  if (matches.length === 0) {
    console.error(`❌ No games found matching "${TITLE_SEARCH}"`);
    process.exit(1);
  }

  for (const match of matches) {
    const data = match.data();
    console.log(`\nFound: ${data.title}`);
    console.log(`  Slug: ${data.slug}`);
    console.log(`  Current values:`, Object.fromEntries(Object.keys(OVERRIDES).map(k => [k, data[k]])));
    console.log(`  → Applying:`, OVERRIDES);

    await updateDoc(doc(db, 'games', match.id), {
      ...OVERRIDES,
      updatedAt: new Date().toISOString(),
    });
    console.log(`  ✅ Updated.`);
  }
}

patch().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
