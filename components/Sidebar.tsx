'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Crown, BookOpen, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10",
    },
  };

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

  const navLinks = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      color: 'text-sky-500'
    },
    {
      label: 'Words',
      icon: BookOpen,
      href: '/words',
      color: 'text-emerald-500'
    },
    {
      label: 'Phrases',
      icon: MessageSquare,
      href: '/phrases',
      color: 'text-violet-500'
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
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
          <SignedIn >
          {isSubscribed ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isLoading}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    "text-zinc-400"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <Crown className="h-5 w-5 mr-3 text-yellow-500" />
                    {isLoading ? 'Processing...' : 'Unsubscribe'}
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1F2937] border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Confirm Unsubscribe</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    Are you sure you want to cancel your subscription? You'll lose access to all Pro features at the end of your current billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleSubscription('unsubscribe')}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Unsubscribe
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <button
              onClick={() => handleSubscription('subscribe')}
              disabled={isLoading}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <Crown className="h-5 w-5 mr-3 text-zinc-400" />
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </div>
            </button>
          )}
          </SignedIn>

          {error && (
            <div className="px-3 py-1 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>      
      </div>
      <div className="p-3">
        <div className="flex items-center text-sm group p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400">
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
          <SignedIn>
          <UserButton appearance={userButtonAppearance}/>
          <span className="ml-3">Profile</span>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;