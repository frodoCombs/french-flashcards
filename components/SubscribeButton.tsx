'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscribeButton() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Upgrade to Pro'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-2">Current subscription status: {String(!!user?.publicMetadata?.subscribed)}</p>
    </div>
  );
}