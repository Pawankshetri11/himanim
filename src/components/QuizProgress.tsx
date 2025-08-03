import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface QuizProgressProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function QuizProgress({ currentPage, totalPages, className = "" }: QuizProgressProps) {
  const progress = (currentPage / totalPages) * 100;
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-quiz-progress" />
          <span className="font-medium">{currentPage} of {totalPages}</span>
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 bg-quiz-neutral"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Started</span>
        <span>{progress.toFixed(0)}% Complete</span>
        <span>Finish</span>
      </div>
    </div>
  );
}