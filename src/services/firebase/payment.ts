import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './db';
import { getSubscriptionStatus } from './subscription';

// Test mode key - this should be replaced with production key in production
const RAZORPAY_KEY_ID = 'rzp_test_YyQVSGLKXP9zXK';

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
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
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
    throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.');
  }

  const amount = 700; // Rs. 7 in paise (Razorpay expects amount in paise)
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
        console.log('Payment cancelled by user');
      }
    }
  };

  try {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      ...options,
      handler: async (response: any) => {
        try {
          await handlePaymentSuccess(user.uid, response);
        } catch (error) {
          console.error('Payment success handler error:', error);
          throw new Error('Failed to process payment confirmation');
        }
      },
    });

    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      throw new Error(response.error.description || 'Payment failed');
    });

    rzp.open();
  } catch (error) {
    console.error('Razorpay initialization error:', error);
    throw new Error('Failed to initialize payment. Please try again.');
  }
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
      amount: 700, // Keep amount in paise for consistency
      currency: 'INR',
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Record payment
    const paymentRef = doc(db, 'users', userId, 'payments', response.razorpay_payment_id);
    await setDoc(paymentRef, {
      amount: 700, // Keep amount in paise for consistency
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
