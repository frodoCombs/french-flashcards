'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SubscriptionButton() {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscription = async (action: 'subscribe' | 'unsubscribe') => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/update-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) {
                throw new Error('Failed to update subscription');
            }

            await user?.reload();
            console.log('Updated user metadata:', user?.publicMetadata);

        } catch (err) {
            setError('Failed to update subscription. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user is subscribed
    const isSubscribed = user?.publicMetadata?.subscribed;

    return (
        <div className="space-y-4">
            {!isSubscribed ? (
                <button
                    onClick={() => handleSubscription('subscribe')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? 'Updating...' : 'Upgrade to Pro'}
                </button>
            ) : (
                <button
                    onClick={() => handleSubscription('unsubscribe')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                    {isLoading ? 'Updating...' : 'Cancel Subscription'}
                </button>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}