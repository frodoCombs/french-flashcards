import React from 'react';
import { Crown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SubscriptionBannerProps {
  isSubscribed: boolean;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ isSubscribed }) => {
  if (isSubscribed) return null;

  const handleUpgrade = () => {
    fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'subscribe' }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      }
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <Alert className="mb-4 py-2 max-w-md flex items-center justify-between bg-[#1F2937] border-gray-700">
      <div className="flex items-center">
        <Crown className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-xs ml-2 text-gray-300">
          Using limited word list. Upgrade to Pro for full access.
        </AlertDescription>
      </div>
      <Button
        onClick={handleUpgrade}
        variant="ghost"
        size="sm"
        className="text-xs text-yellow-500 hover:text-yellow-400 hover:bg-white/5"
      >
        Upgrade
      </Button>
    </Alert>
  );
};

export default SubscriptionBanner;