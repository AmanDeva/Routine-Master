import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { signInWithGooglePopup } from '../lib/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateUserProfile: (username: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, username: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: username });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    return await signInWithGooglePopup();
  }

  async function logout() {
    await signOut(auth);
  }

  async function updateUserProfile(username: string) {
    if (!currentUser) throw new Error('No user logged in');
    await updateProfile(currentUser, { displayName: username });
  }

  async function updateUserPassword(newPassword: string) {
    if (!currentUser) throw new Error('No user logged in');
    await updatePassword(currentUser, newPassword);
  }

  async function updateUserEmail(newEmail: string) {
    if (!currentUser) throw new Error('No user logged in');
    await updateEmail(currentUser, newEmail);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
    updateUserPassword,
    updateUserEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}