'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function BillingPageContent() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // Get subscription status from user metadata
  const isSubscribed = user?.publicMetadata?.subscribed as boolean;
  
  // Check URL parameters for payment status
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Handle subscription actions
  const handleSubscriptionAction = async (action: 'subscribe' | 'unsubscribe') => {
    try {
      setLoading(true);
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

      const data = await response.json();
      
      // If there's a checkout URL, redirect to it
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Reload user to get updated metadata
        await user?.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {/* Show success message */}
      {success && (
        <Alert className="mb-6 bg-green-50">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Thank you for subscribing! You now have access to all premium features.
          </AlertDescription>
        </Alert>
      )}

      {/* Show cancellation message */}
      {canceled && (
        <Alert className="mb-6 bg-yellow-50">
          <AlertTitle>Subscription Cancelled</AlertTitle>
          <AlertDescription>
            The subscription process was cancelled. No charges were made.
          </AlertDescription>
        </Alert>
      )}

      {/* Show error message if any */}
      {error && (
        <Alert className="mb-6 bg-red-50" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Premium Subscription</CardTitle>
          <CardDescription>
            Get access to all premium features and support the development of French Flashcards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-2xl font-bold">$9.99/month</div>
            <ul className="space-y-2">
              <li>✓ Unlimited flashcard decks</li>
              <li>✓ Advanced statistics</li>
              <li>✓ Priority support</li>
              <li>✓ New features first</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          {isSubscribed ? (
            <Button
              onClick={() => handleSubscriptionAction('unsubscribe')}
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          ) : (
            <Button
              onClick={() => handleSubscriptionAction('subscribe')}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}