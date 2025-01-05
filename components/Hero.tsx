import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground mb-6">
        Master French Gender Rules
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Learn French noun genders through interactive exercises. Practice with words, 
        phrases, and get instant feedback on your progress.
      </p>
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