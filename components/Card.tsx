import { Card, CardContent } from "@/components/ui/card"

interface CardProps {
  word: string;
  definition: string;
  showDefinition: boolean;
}

export function WordCard({ word, definition, showDefinition }: CardProps) {
  return (
    <div className="flip-card-container">
      <div className={`flip-card ${showDefinition ? 'flipped' : ''}`}>
        <Card className="flip-card-inner w-64 h-64">
          <CardContent className="flip-card-front absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">{word}</span>
          </CardContent>
          <CardContent className="flip-card-back absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-center px-4">{definition}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

