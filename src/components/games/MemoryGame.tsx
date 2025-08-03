import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface MemoryGameProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function MemoryGame({ task, onComplete, disabled }: MemoryGameProps) {
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const terms = task.data.pairs.map((pair: any) => pair.term);
  const definitions = task.data.pairs.map((pair: any) => pair.definition);

  const handleTermClick = (term: string) => {
    if (disabled) return;
    setSelectedTerm(term);
  };

  const handleDefinitionClick = (definition: string) => {
    if (disabled || !selectedTerm) return;
    
    const newMatches = { ...matches, [selectedTerm]: definition };
    setMatches(newMatches);
    setSelectedTerm(null);
  };

  const handleSubmit = () => {
    const correctMatches = task.data.pairs.reduce((acc: any, pair: any) => {
      acc[pair.term] = pair.definition;
      return acc;
    }, {});
    
    const isCorrect = JSON.stringify(matches) === JSON.stringify(correctMatches);
    onComplete({
      matches,
      isCorrect
    });
  };

  const allMatched = Object.keys(matches).length === task.data.pairs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          {task.title}
        </CardTitle>
        <p className="text-muted-foreground">{task.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Terms</h4>
            <div className="space-y-2">
              {terms.map((term: string) => (
                <Button
                  key={term}
                  variant={selectedTerm === term ? "default" : matches[term] ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => handleTermClick(term)}
                  disabled={disabled || !!matches[term]}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Definitions</h4>
            <div className="space-y-2">
              {definitions.map((definition: string) => (
                <Button
                  key={definition}
                  variant={Object.values(matches).includes(definition) ? "secondary" : "outline"}
                  className="w-full text-left h-auto p-3"
                  onClick={() => handleDefinitionClick(definition)}
                  disabled={disabled || Object.values(matches).includes(definition)}
                >
                  {definition}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={!allMatched || disabled}
          className="w-full"
        >
          Submit Matches
        </Button>
      </CardContent>
    </Card>
  );
}