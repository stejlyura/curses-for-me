import crypto from 'node:crypto';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { doc, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const getVaultDocumentId = (): string =>
  crypto
    .createHmac('sha256', '01fd4bf1-4249-4b19-abba-eb364214818d:gen-lang-client-0040909997')
    .update('marketolog-academy:admin:state-vault-v1')
    .digest('hex');

export const getVaultStateDocRef = () =>
  doc(firestoreDb, 'learning_states', getVaultDocumentId());
