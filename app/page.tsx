import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <Hero />
      </main>
      <footer className="w-full flex justify-center py-4">
        <p className="p-4 text-sm text-muted-foreground max-w-2xl text-center">
          We're constantly expanding our content and improving the app. Need help? Contact us at{' '}
          <a 
            href="mailto:help@encorefrench.com"
            className="font-medium text-sky-500 hover:text-sky-600 underline-offset-4 hover:underline"
          >
            help@encorefrench.com
          </a>
        </p>
      </footer>
    </div>
  )
}