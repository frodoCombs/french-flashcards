import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

interface FeedbackBannerProps {
  isCorrect: boolean;
  isVisible: boolean;
  onNext: () => void;
}

export const FeedbackBanner = ({ 
  isCorrect, 
  isVisible, 
  onNext 
}: FeedbackBannerProps) => {
  return (
    <div className={`
      absolute left-0 right-0 -bottom-40
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}
    `}>
      <Card className="mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${isCorrect ? 'bg-green-100' : 'bg-red-100'}
            `}>
              {isCorrect ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <p className="text-xl mt-2 text-muted-foreground">
                {isCorrect 
                  ? 'Great job! Keep going!' 
                  : 'Don\'t worry, keep practicing!'}
              </p>
            </div>
            
            <Button
              onClick={onNext}
              size="lg"
              className={`
                text-xl px-8 py-6 font-semibold
                ${isCorrect 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'}
                text-white
              `}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackBanner;