import admin from 'firebase-admin';

if (!admin.apps.length) {
  let serviceAccount = null;
  const saEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (saEnv) {
    try {
      serviceAccount = JSON.parse(saEnv);
    } catch (err) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var as JSON:', err.message);
    }
  }

  // Explicitly determine Project ID
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
                    (serviceAccount && serviceAccount.project_id);

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId,
    });
    console.log(`✅ Firebase Admin initialized with Service Account for project: ${projectId}`);
  } else {
    console.log(`⚠️ No valid Service Account found, attempting Application Default Credentials for project: ${projectId}`);
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId,
    });
  }

  if (!projectId) {
    console.error('❌ FATAL: Firebase Project ID is missing! Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set in your .env or .env.local file.');
  }
}

const db = admin.firestore();
export { db };
