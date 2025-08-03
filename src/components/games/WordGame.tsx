import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Type } from 'lucide-react';

interface WordGameProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function WordGame({ task, onComplete, disabled }: WordGameProps) {
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');

  const handleLetterClick = (index: number) => {
    if (disabled || selectedLetters.includes(index)) return;
    
    const newSelected = [...selectedLetters, index];
    const newWord = newSelected.map(i => task.data.letters[i]).join('');
    
    setSelectedLetters(newSelected);
    setCurrentWord(newWord);
  };

  const handleReset = () => {
    if (disabled) return;
    setSelectedLetters([]);
    setCurrentWord('');
  };

  const handleSubmit = () => {
    const isCorrect = currentWord === task.data.target;
    onComplete({
      word: currentWord,
      isCorrect
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          {task.title}
        </CardTitle>
        <p className="text-muted-foreground">{task.description}</p>
        <p className="text-sm text-muted-foreground">Hint: {task.data.hint}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Current word:</p>
          <div className="text-2xl font-bold min-h-[3rem] flex items-center justify-center bg-secondary rounded-lg">
            {currentWord || 'Click letters to form a word'}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {task.data.letters.map((letter: string, index: number) => (
            <Button
              key={index}
              variant={selectedLetters.includes(index) ? "default" : "outline"}
              className="h-12 text-lg font-bold"
              onClick={() => handleLetterClick(index)}
              disabled={disabled || selectedLetters.includes(index)}
            >
              {letter}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleReset}
            disabled={disabled || selectedLetters.length === 0}
            className="flex-1"
          >
            Reset
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={currentWord.length === 0 || disabled}
            className="flex-1"
          >
            Submit Word
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}