import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface QuizGameProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function QuizGame({ task, onComplete, disabled }: QuizGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onComplete({
        selectedOption: selectedAnswer,
        isCorrect: selectedAnswer === task.data.correctAnswer
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          {task.title}
        </CardTitle>
        <p className="text-muted-foreground">{task.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-medium">{task.data.question}</h3>
        <div className="space-y-2">
          {task.data.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedAnswer(index)}
              disabled={disabled}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={selectedAnswer === null || disabled}
          className="w-full"
        >
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );
}