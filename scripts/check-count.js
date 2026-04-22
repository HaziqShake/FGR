import './init-env.js';
import { db } from '../lib/firebase.js';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';

async function checkCount() {
  const coll = collection(db, 'games');
  
  // Total Count
  const allDocs = await getDocs(coll);
  console.log('--- DATABASE STATUS ---');
  console.log('Total games in Firestore:', allDocs.size);
  
  // Check latest and oldest
  const newestQ = query(coll, orderBy('updatedAt', 'desc'), limit(1));
  const oldestQ = query(coll, orderBy('updatedAt', 'asc'), limit(1));
  
  const newestSnap = await getDocs(newestQ);
  const oldestSnap = await getDocs(oldestQ);
  
  if (!newestSnap.empty) console.log('Newest game:', newestSnap.docs[0].data().title);
  if (!oldestSnap.empty) console.log('Oldest game:', oldestSnap.docs[0].data().title);
  
  process.exit(0);
}

checkCount().catch(err => {
  console.error(err);
  process.exit(1);
});
