import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { app } from '../../config/firebase';

export const db = getFirestore(app);

export async function setupPersistence() {
  try {
    await enableIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser doesn\'t support persistence.');
    } else {
      console.error('Error enabling persistence:', err);
    }
  }
}

setupPersistence();