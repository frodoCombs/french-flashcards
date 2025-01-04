'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
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

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      await user?.reload();

    } catch (err) {
      setError('Failed to update subscription');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = user?.publicMetadata?.subscribed as boolean;

  // Navigation items that use Next.js Link
  const navLinks = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      color: 'text-sky-500'
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-500'
    }
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {/* Regular navigation links */}
          {navLinks.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}

          {/* Subscription button styled like a nav item */}
          <button
            onClick={() => handleSubscription(isSubscribed ? 'unsubscribe' : 'subscribe')}
            disabled={isLoading}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
              "text-zinc-400"
            )}
          >
            <div className="flex items-center flex-1">
              <Crown className={cn(
                "h-5 w-5 mr-3",
                isSubscribed ? "text-yellow-500" : "text-zinc-400"
              )} />
              {isLoading ? 'Processing...' : (isSubscribed ? 'Subscribed' : 'Upgrade to Pro')}
            </div>
          </button>

          {error && (
            <div className="px-3 py-1 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;