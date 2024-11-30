import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './db';
import { getSubscriptionStatus } from './subscription';

const RAZORPAY_KEY_ID = 'VV6e4Rn71GItuKNOGSawMaXq';

interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initializePayment(user: User): Promise<void> {
  if (!user.uid) {
    throw new Error('User ID is required');
  }

  const subscriptionStatus = await getSubscriptionStatus(user.uid);
  
  if (subscriptionStatus.isActive) {
    throw new Error('You already have an active subscription');
  }

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const amount = 700; // Rs. 7 in paise
  const options: PaymentOptions = {
    amount,
    currency: 'INR',
    name: 'Routine Master',
    description: 'Monthly Subscription (₹7/month)',
    orderId: `order_${Date.now()}`,
    prefill: {
      name: user.displayName || '',
      email: user.email || '',
    },
    theme: {
      color: '#0c87e8'
    },
    modal: {
      ondismiss: () => {
        console.log('Payment cancelled');
      }
    }
  };

  const rzp = new window.Razorpay({
    key: RAZORPAY_KEY_ID,
    ...options,
    handler: async (response: any) => {
      await handlePaymentSuccess(user.uid, response);
    },
  });

  rzp.open();
}

async function handlePaymentSuccess(userId: string, response: any): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const nextPeriodEnd = new Date();
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    // Update subscription status
    const subscriptionRef = doc(db, 'users', userId, 'subscription', 'status');
    await setDoc(subscriptionRef, {
      isActive: true,
      currentPeriodEnd: nextPeriodEnd,
      cancelAtPeriodEnd: false,
      lastPaymentId: response.razorpay_payment_id,
      amount: 700,
      currency: 'INR',
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Record payment
    const paymentRef = doc(db, 'users', userId, 'payments', response.razorpay_payment_id);
    await setDoc(paymentRef, {
      amount: 700,
      currency: 'INR',
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      status: 'success',
      type: 'subscription',
      period: 'monthly',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
}