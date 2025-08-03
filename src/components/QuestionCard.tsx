import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface QuizQuestion {
  id: string;
  question: string;
  description: string;
  options: string[];
  correctAnswer: number;
  page: number;
}

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswer?: number;
  onAnswerChange: (questionId: string, selectedOption: number) => void;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  selectedAnswer,
  onAnswerChange 
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string>(selectedAnswer?.toString() || '');

  const handleValueChange = (value: string) => {
    setSelected(value);
    onAnswerChange(question.id, parseInt(value));
  };

  return (
    <Card className="shadow-elegant hover:shadow-primary transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Question {questionNumber}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {question.question}
            </CardTitle>
          </div>
        </div>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {question.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <RadioGroup 
          value={selected} 
          onValueChange={handleValueChange}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
              onClick={() => handleValueChange(index.toString())}
            >
              <RadioGroupItem 
                value={index.toString()} 
                id={`${question.id}-${index}`}
                className="mt-0.5"
              />
              <Label 
                htmlFor={`${question.id}-${index}`}
                className="flex-1 cursor-pointer leading-relaxed"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}