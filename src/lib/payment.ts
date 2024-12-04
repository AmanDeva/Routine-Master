import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getSubscriptionStatus } from './subscription';

const RAZORPAY_KEY_ID = 'rzp_live_wA1SpacCoA0tSj';

interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
    confirm_close: boolean;
    escape: boolean;
  };
  retry: {
    enabled: boolean;
    max_count: number;
  };
  notes: {
    userId: string;
    subscriptionType: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function generateOrderId(userId: string, amount: number): Promise<string> {
  try {
    const orderRef = doc(db, 'users', userId, 'orders', Date.now().toString());
    await setDoc(orderRef, {
      amount,
      currency: 'INR',
      status: 'created',
      createdAt: serverTimestamp()
    });
    return orderRef.id;
  } catch (error) {
    console.error('Error generating order:', error);
    throw new Error('Failed to generate order');
  }
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.crossOrigin = 'anonymous';
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

  const amount = 700; // Rs. 7 in paise
  const orderId = await generateOrderId(user.uid, amount);

  const options: PaymentOptions = {
    key: RAZORPAY_KEY_ID,
    amount,
    currency: 'INR',
    name: 'Routine Master',
    description: 'Monthly Subscription (₹7/month)',
    order_id: orderId,
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
      },
      confirm_close: true,
      escape: false
    },
    retry: {
      enabled: true,
      max_count: 3
    },
    notes: {
      userId: user.uid,
      subscriptionType: 'monthly'
    }
  };

  try {
    const rzp = new window.Razorpay(options);

    rzp.on('payment.success', async (response: any) => {
      try {
        await handlePaymentSuccess(user.uid, response);
      } catch (error) {
        console.error('Payment success handler error:', error);
        throw new Error('Failed to process payment confirmation');
      }
    });

    rzp.on('payment.error', (response: any) => {
      console.error('Payment failed:', response.error);
      throw new Error(response.error?.description || 'Payment failed');
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
    // Verify order status
    const orderRef = doc(db, 'users', userId, 'orders', response.razorpay_order_id);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Invalid order');
    }

    const nextPeriodEnd = new Date();
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    // Update order status
    await setDoc(orderRef, {
      status: 'completed',
      paymentId: response.razorpay_payment_id,
      completedAt: serverTimestamp()
    }, { merge: true });

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