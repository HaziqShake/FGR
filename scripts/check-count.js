import './init-env.js';
import { db } from '../lib/firebase-admin.js';

async function checkCount() {
  const coll = db.collection('games');
  
  // Total Count
  const allDocs = await coll.get();
  console.log('--- DATABASE STATUS ---');
  console.log('Total games in Firestore:', allDocs.size);
  
  // Check latest and oldest
  const newestSnap = await coll.orderBy('updatedAt', 'desc').limit(1).get();
  const oldestSnap = await coll.orderBy('updatedAt', 'asc').limit(1).get();
  
  if (!newestSnap.empty) console.log('Newest game:', newestSnap.docs[0].data().title);
  if (!oldestSnap.empty) console.log('Oldest game:', oldestSnap.docs[0].data().title);
  
  process.exit(0);
}

checkCount().catch(err => {
  console.error(err);
  process.exit(1);
});
