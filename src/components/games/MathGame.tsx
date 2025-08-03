import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface MathGameProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function MathGame({ task, onComplete, disabled }: MathGameProps) {
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
          <Calculator className="h-5 w-5 text-primary" />
          {task.title}
        </CardTitle>
        <p className="text-muted-foreground">{task.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-secondary rounded-lg">
          <p className="font-medium">{task.data.problem}</p>
          {task.data.formula && (
            <p className="text-sm text-muted-foreground mt-2">
              Formula: {task.data.formula}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {task.data.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
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