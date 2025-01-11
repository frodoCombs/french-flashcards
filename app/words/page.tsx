'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { WordCard } from '@/components/Card'
import { FeedbackBanner } from '@/components/FeedbackBanner'
import { words, Word } from '@/utils/words'
import { useUser } from '@clerk/nextjs'
import SubscriptionBanner from '@/components/SubscriptionBanner'

export default function WordsPage() {
  const { user } = useUser();
  const [currentWord, setCurrentWord] = useState<Word>(words[0])
  const [showDefinition, setShowDefinition] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const isSubscribed = user?.publicMetadata?.subscribed as boolean;

  const getRandomWord = () => {
    // Limit non-subscribed users to first 50 words
    const availableWords = isSubscribed ? words : words.slice(0, 100)
    const randomIndex = Math.floor(Math.random() * availableWords.length)
    return availableWords[randomIndex]
  }

  const handleGuess = (guess: 'masculine' | 'feminine') => {
    const correct = guess === currentWord.gender
    setIsCorrect(correct)
    setShowFeedback(true)
    setShowDefinition(true)
  }

  const nextWord = () => {
    setCurrentWord(getRandomWord())
    setShowDefinition(false)
    setShowFeedback(false)
  }

  useEffect(() => {
    nextWord()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
    <SubscriptionBanner isSubscribed={isSubscribed} />
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
    <div className="relative flex flex-col items-center w-full max-w-md min-h-[300px]">        <WordCard 
          word={currentWord.word} 
          definition={currentWord.definition} 
          showDefinition={showDefinition} 
        />
        <div className="mt-8 space-x-4">
          <Button 
            variant="outline" 
            size="lg"
            className="text-xl px-8 py-6 font-semibold"
            onClick={() => handleGuess('masculine')} 
            disabled={showDefinition}
          >
            Masculine
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-xl px-8 py-6 font-semibold"
            onClick={() => handleGuess('feminine')} 
            disabled={showDefinition}
          >
            Feminine
          </Button>
        <FeedbackBanner
            isCorrect={isCorrect}
            isVisible={showFeedback}
            onNext={nextWord}
          />
          </div>
      </div>
    </main>
  </div>
  )
}