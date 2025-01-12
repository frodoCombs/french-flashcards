import React from 'react';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link';


interface ProGateProps {
  isSubscribed: boolean;
  children: React.ReactNode;
}

const ProGate: React.FC<ProGateProps> = ({ isSubscribed, children }) => {
  if (isSubscribed) {
    return <>{children}</>;
  }

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
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignedIn>  
      <Card className="w-full max-w-md bg-[#1F2937] border-gray-700">
        <CardHeader className="text-center">
          <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-2xl text-white">Pro Feature</CardTitle>
          <CardDescription className="text-gray-300">
            Upgrade to Pro to access our complete collection of French phrases
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
          >
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
      </SignedIn>
      <SignedOut>
        <Card className="w-full max-w-md bg-[#1F2937] border-gray-700">
          <CardHeader className="text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <CardTitle className="text-2xl text-white">Pro Feature</CardTitle>
            <CardDescription className="text-gray-300">
              Login and upgrade to Pro to access our complete collection of French phrases
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
          </CardContent>
        </Card>        
      </SignedOut>
    </div>
  );
};

export default ProGate;