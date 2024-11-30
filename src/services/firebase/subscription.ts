import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './db';
import { User } from 'firebase/auth';

export interface SubscriptionStatus {
  isActive: boolean;
  trialEnd: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
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
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Failed to fetch subscription status');
  }
}

export async function startFreeTrial(user: User): Promise<void> {
  if (!user.uid) {
    throw new Error('User ID is required');
  }

  try {
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
  } catch (error) {
    console.error('Error starting free trial:', error);
    throw new Error('Failed to start free trial');
  }
}

export async function checkSubscriptionStatus(userId: string): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const status = await getSubscriptionStatus(userId);
    
    if (status.currentPeriodEnd && new Date() > status.currentPeriodEnd) {
      const subscriptionRef = doc(db, 'users', userId, 'subscription', 'status');
      await setDoc(subscriptionRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw new Error('Failed to check subscription status');
  }
}