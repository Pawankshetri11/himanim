import React from 'react';
import { QuizGame } from './games/QuizGame';
import { PuzzleGame } from './games/PuzzleGame';
import { MathGame } from './games/MathGame';
import { MemoryGame } from './games/MemoryGame';
import { WordGame } from './games/WordGame';

interface GameRendererProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function GameRenderer({ task, onComplete, disabled }: GameRendererProps) {
  switch (task.type) {
    case 'quiz':
      return <QuizGame task={task} onComplete={onComplete} disabled={disabled} />;
    case 'puzzle':
      return <PuzzleGame task={task} onComplete={onComplete} disabled={disabled} />;
    case 'math':
      return <MathGame task={task} onComplete={onComplete} disabled={disabled} />;
    case 'memory':
      return <MemoryGame task={task} onComplete={onComplete} disabled={disabled} />;
    case 'word':
      return <WordGame task={task} onComplete={onComplete} disabled={disabled} />;
    default:
      return <div>Unknown game type: {task.type}</div>;
  }
}