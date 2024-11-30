import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SubscriptionStatus {
  isActive: boolean;
  trialEnd: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const subscriptionRef = doc(db, 'users', userId, 'subscription', 'status');
  const snapshot = await getDoc(subscriptionRef);

  if (!snapshot.exists()) {
    return {
      isActive: false,
      trialEnd: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };
  }

  const data = snapshot.data();
  return {
    isActive: data.isActive,
    trialEnd: data.trialEnd?.toDate() || null,
    currentPeriodEnd: data.currentPeriodEnd?.toDate() || null,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd
  };
}

export async function startFreeTrial(user: User): Promise<void> {
  const trialEnd = new Date();
  trialEnd.setMonth(trialEnd.getMonth() + 1); // 1 month trial

  const subscriptionRef = doc(db, 'users', user.uid, 'subscription', 'status');
  await setDoc(subscriptionRef, {
    isActive: true,
    trialEnd: trialEnd,
    currentPeriodEnd: trialEnd,
    cancelAtPeriodEnd: false,
    subscriptionType: 'trial',
    amount: 700, // Amount in paise (₹7)
    currency: 'INR',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function checkSubscriptionStatus(userId: string): Promise<void> {
  const status = await getSubscriptionStatus(userId);
  
  if (status.currentPeriodEnd && new Date() > status.currentPeriodEnd) {
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'status');
    await setDoc(subscriptionRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}