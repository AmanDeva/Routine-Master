import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { startFreeTrial } from './subscription';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

async function createOrUpdateUserDocument(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    try {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      // Start free trial for new users
      await startFreeTrial(user);
    } catch (error) {
      console.error('Error creating user document:', error);
      throw new Error('Failed to initialize user data');
    }
  } else {
    try {
      await setDoc(userRef, {
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  }
}

export async function signInWithGooglePopup(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUserDocument(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      toast.error('Popup was blocked. Trying redirect method...');
      try {
        await signInWithRedirect(auth, googleProvider);
        const result = await getRedirectResult(auth);
        if (result) {
          await createOrUpdateUserDocument(result.user);
          return result.user;
        }
      } catch (redirectError: any) {
        handleAuthError(redirectError);
        throw redirectError;
      }
    } else {
      handleAuthError(error);
      throw error;
    }
    return null;
  }
}

function handleAuthError(error: any) {
  switch (error.code) {
    case 'auth/popup-blocked':
      toast.error('Please allow popups for this website to sign in with Google');
      break;
    case 'auth/popup-closed-by-user':
      toast.error('Sign in cancelled. Please try again');
      break;
    case 'auth/cancelled-popup-request':
      break;
    case 'auth/unauthorized-domain':
      toast.error('This domain is not authorized for Google sign in');
      break;
    case 'auth/internal-error':
      toast.error('An internal error occurred. Please try again later.');
      break;
    case 'auth/network-request-failed':
      toast.error('Network error. Please check your internet connection.');
      break;
    default:
      toast.error(error.message || 'Failed to sign in with Google');
  }
}