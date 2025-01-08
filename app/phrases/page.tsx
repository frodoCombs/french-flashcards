'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import ProGate from '@/components/ProGate';


// You'll need to create this type and data
type Phrase = {
  id: number
  french: string
  english: string
  explanation: string
}

const frenchPhrases: Phrase[] = [
  {
    id: 1,
    french: "attendez-nous là",
    english: "wait for us there",
    explanation: "Uses the formal/plural 'attendez' form of 'attendre' (to wait)"
  },
  {
    id: 2,
    french: "avez-vous faim?",
    english: "are you hungry?",
    explanation: "Formal question using inversion ('vous avez' becomes 'avez-vous')"
  },
  {
    id: 3,
    french: "c'est pour vous",
    english: "it is for you",
    explanation: "Uses formal 'vous' form"
  },
  {
    id: 4,
    french: "c'est quoi?",
    english: "what is it?",
    explanation: "Informal way of asking 'qu'est-ce que c'est?'"
  },
  {
    id: 5,
    french: "c'est tout?",
    english: "is that all?",
    explanation: "Common expression using 'c'est' (it is)"
  },
  {
    id: 6,
    french: "c'est très gentil",
    english: "it is very nice",
    explanation: "Uses the adjective 'gentil' which can mean kind or nice"
  },
  {
    id: 7,
    french: "c'est combien?",
    english: "how much is it?",
    explanation: "Common way to ask for a price"
  },
  {
    id: 8,
    french: "c'est grave?",
    english: "is it serious?",
    explanation: "'Grave' means serious or severe in this context"
  },
  {
    id: 9,
    french: "ça n'est pas grave",
    english: "no problem",
    explanation: "Common expression using the negative form of 'être'"
  },
  {
    id: 10,
    french: "ce n'est pas comme ça",
    english: "it is not like that",
    explanation: "Uses the formal negative construction 'ne...pas'"
  },
  {
    id: 11,
    french: "combien cela coûte?",
    english: "how much is this?",
    explanation: "Formal way to ask about price using 'cela' instead of 'ça'"
  },
  {
    id: 12,
    french: "comment as-tu passé...?",
    english: "how have you spent...?",
    explanation: "Informal question using 'tu' form of 'avoir'"
  },
  {
    id: 13,
    french: "comment t'appelles-tu?",
    english: "what's your name?",
    explanation: "Informal reflexive verb construction with 's'appeler'"
  },
  {
    id: 14,
    french: "comment vas-tu?",
    english: "how are you?",
    explanation: "Informal question using inversion with 'tu'"
  },
  {
    id: 15,
    french: "depuis quand?",
    english: "since when?",
    explanation: "'Depuis' is used for duration of time up to the present"
  },
  {
    id: 16,
    french: "il est prêt",
    english: "he is ready",
    explanation: "Uses the masculine form of the adjective 'prêt'"
  },
  {
    id: 17,
    french: "il veut y aller",
    english: "he wants to go there",
    explanation: "Uses 'y' to replace 'là-bas' or a specific place"
  },
  {
    id: 18,
    french: "j'ai déjà dit que",
    english: "I have already said that",
    explanation: "Uses 'déjà' (already) with the passé composé"
  },
  {
    id: 19,
    french: "j'attends mes amis",
    english: "I am waiting for my friends",
    explanation: "Present tense of 'attendre' expressing ongoing action"
  },
  {
    id: 20,
    french: "je ne comprends pas",
    english: "I don't understand",
    explanation: "Negative form of 'comprendre' in present tense"
  },
  {
    id: 21,
    french: "je ne sais pas",
    english: "I don't know",
    explanation: "Common expression using negative form of 'savoir'"
  },
  {
    id: 22,
    french: "je serai à",
    english: "I will be at",
    explanation: "Future tense of 'être' (to be)"
  },
  {
    id: 23,
    french: "je suis arrivé",
    english: "I have arrived",
    explanation: "Masculine form of the passé composé with 'être'"
  },
  {
    id: 24,
    french: "je suis désolé",
    english: "I am sorry",
    explanation: "Masculine form of the adjective 'désolé'"
  },
  {
    id: 25,
    french: "je suis perdu",
    english: "I'm lost",
    explanation: "Masculine form of the adjective 'perdu'"
  },
  {
    id: 26,
    french: "je suis près de",
    english: "I am close to",
    explanation: "Uses 'près de' (close to) with location"
  },
  {
    id: 27,
    french: "je te tiens au courant",
    english: "I'll let you know",
    explanation: "Informal expression using 'tenir au courant' (to keep informed)"
  },
  {
    id: 28,
    french: "je vais être en retard",
    english: "I'll be late",
    explanation: "Uses 'aller' + infinitive to express near future"
  },
  {
    id: 29,
    french: "ne t'inquiète pas!",
    english: "don't worry!",
    explanation: "Informal negative imperative of 's'inquiéter'"
  },
  {
    id: 30,
    french: "nous parlerons plus tard",
    english: "we will speak later",
    explanation: "Simple future tense of 'parler'"
  },
  {
    id: 31,
    french: "où on se retrouve?",
    english: "where do we meet?",
    explanation: "Informal question using 'on' instead of 'nous'"
  },
  {
    id: 32,
    french: "où pouvons-nous manger?",
    english: "where can we eat?",
    explanation: "Formal question using 'nous' form of 'pouvoir'"
  },
  {
    id: 33,
    french: "où sont les toilettes?",
    english: "where is the bathroom?",
    explanation: "Note that 'toilettes' is plural in French"
  },
  {
    id: 34,
    french: "où veux-tu dîner?",
    english: "where do you want to have dinner?",
    explanation: "Informal question using 'tu' form of 'vouloir'"
  },
  {
    id: 35,
    french: "parlez-vous anglais?",
    english: "do you speak English?",
    explanation: "Formal question using inversion with 'vous'"
  },
  {
    id: 36,
    french: "pas du tout",
    english: "not at all",
    explanation: "Common expression to emphasize negation"
  },
  {
    id: 37,
    french: "pas pour moi",
    english: "not for me",
    explanation: "Shortened negative expression (full: 'ce n'est pas pour moi')"
  },
  {
    id: 38,
    french: "peux-tu m'aider?",
    english: "can you help me?",
    explanation: "Informal question using inversion with 'tu'"
  },
  {
    id: 39,
    french: "pourquoi pas?",
    english: "why not?",
    explanation: "Common expression of agreement or possibility"
  },
  {
    id: 40,
    french: "pourriez-vous répéter?",
    english: "can you say it again?",
    explanation: "Formal conditional of 'pouvoir' with inversion"
  },
  {
    id: 41,
    french: "puis-je faire ça?",
    english: "can I do that?",
    explanation: "Formal question using first-person inversion"
  },
  {
    id: 42,
    french: "qu'est-ce qui se passe?",
    english: "what is happening?",
    explanation: "Uses 'qu'est-ce qui' for questions about subject"
  },
  {
    id: 43,
    french: "qu'est-ce que vous recommandez?",
    english: "what do you recommend?",
    explanation: "Formal question using 'qu'est-ce que' construction"
  },
  {
    id: 44,
    french: "que voulez-vous faire?",
    english: "what do you want to do?",
    explanation: "Formal question with inverted 'vous'"
  },
  {
    id: 45,
    french: "qui est-ce?",
    english: "who is it?",
    explanation: "Question using 'qui est-ce' structure"
  },
  {
    id: 46,
    french: "quoi de neuf?",
    english: "what's new?",
    explanation: "Informal expression equivalent to 'what's up?'"
  },
  {
    id: 47,
    french: "tu vas y aller",
    english: "you are going to go there",
    explanation: "Uses 'aller' + infinitive with 'y' (there)"
  },
  {
    id: 48,
    french: "va-t'en!",
    english: "go away!",
    explanation: "Imperative form of 's'en aller' (to go away)"
  },
  {
    id: 49,
    french: "viens avec moi!",
    english: "come with me!",
    explanation: "Informal imperative of 'venir' (to come)"
  }
];


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
          <p className="text-lg text-muted-foreground mb-4">{currentPhrase.english}</p>
          
          {showExplanation ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{currentPhrase.explanation}</p>
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