import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground mb-6">
        Encore
      </h1>
      <h2 className="font-bold tracking-tight sm:text-2xl text-foreground mb-6">
        A Simple French Practice App
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mb-4">
        Repetition is <a 
          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5625023/#abstract1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-sky-500 hover:text-sky-600 underline-offset-4 hover:underline"
        >key</a> to learning a new language. Practice with our curated list of words and phrases.
      </p>
      <div className="text-muted-foreground max-w-2xl mb-6 space-y-2">
        <p>Start with 100 of the most common French words, or upgrade to access:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Over 350 essential French words</li>
          <li>Complete set of 80 everyday phrases</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/words">
            Practice Words
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/phrases">
            Learn Phrases
          </Link>
        </Button>
      </div>
    </div>
  )
}