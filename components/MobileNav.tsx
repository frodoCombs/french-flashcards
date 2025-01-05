'use client'

import React from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Home, BookOpen, MessageSquare, Settings, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'

const MobileNav = () => {
  const pathname = usePathname()
  const { user } = useUser()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubscription = async (action: 'subscribe' | 'unsubscribe') => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
        return
      }

      await user?.reload()

    } catch (err) {
      setError('Failed to update subscription')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const isSubscribed = user?.publicMetadata?.subscribed as boolean

  const navLinks = [
    {
      label: 'Home',
      icon: Home,
      route: '/',
      color: 'text-sky-500'
    },
    {
      label: 'Words',
      icon: BookOpen,
      route: '/words',
      color: 'text-emerald-500'
    },
    {
      label: 'Phrases',
      icon: MessageSquare,
      route: '/phrases',
      color: 'text-violet-500'
    },
    {
      label: 'Settings',
      icon: Settings,
      route: '/settings',
      color: 'text-gray-500'
    }
  ]

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-background border-b">
      <Link href="/" className="text-xl font-bold">
        French Gender
      </Link>
      
      <nav className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0 bg-[#111827]">
              <div className="space-y-4 py-4 flex flex-col h-full">
                <div className="px-3 py-2 flex-1">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.route}
                        href={link.route}
                        className={cn(
                          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                          pathname === link.route ? "text-white bg-white/10" : "text-zinc-400"
                        )}
                      >
                        <div className="flex items-center flex-1">
                          <link.icon className={cn("h-5 w-5 mr-3", link.color)} />
                          {link.label}
                        </div>
                      </Link>
                    ))}

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
            </SheetContent>
          </Sheet>
        </SignedIn>
        
        <SignedOut>
          <Button asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default MobileNav