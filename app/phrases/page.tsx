'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import ProGate from '@/components/ProGate';
import { Phrase, frenchPhrases } from '@/utils/phrases'

export default function PhrasesPage() {
  const { user } = useUser();
  const [currentPhrase, setCurrentPhrase] = useState<Phrase>(frenchPhrases[0])
  const [showExplanation, setShowExplanation] = useState(false)

  const isSubscribed = user?.publicMetadata?.subscribed as boolean;

  return (
    <ProGate isSubscribed={isSubscribed}>
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="w-full max-w-2xl">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{currentPhrase.french}</h2>          
          {showExplanation ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{currentPhrase.explanation}</p>
              <p className="text-lg text-muted-foreground mb-4">{currentPhrase.english}</p>

            </div>
          ) : (
            <Button 
              onClick={() => setShowExplanation(true)}
              className="w-full"
            >
              Show Explanation
            </Button>
          )}
        </Card>

        <div className="mt-4">
          <Button 
            onClick={() => {
              const nextIndex = (frenchPhrases.indexOf(currentPhrase) + 1) % frenchPhrases.length
              setCurrentPhrase(frenchPhrases[nextIndex])
              setShowExplanation(false)
            }}
            className="w-full"
          >
            Next Phrase
          </Button>
        </div>
      </div>
    </main>
    </ProGate>
  )
}