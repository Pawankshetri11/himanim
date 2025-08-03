import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock } from 'lucide-react';

interface TaskTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
  taskTitle: string;
  isCorrect?: boolean;
}

export function TaskTransition({ isVisible, onComplete, taskTitle, isCorrect }: TaskTransitionProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  useEffect(() => {
    if (isVisible) {
      setCountdown(3);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 
              className={`h-16 w-16 ${isCorrect ? 'text-green-500' : 'text-orange-500'}`} 
            />
          </div>
          
          <div>
            <h3 className="text-xl font-bold">
              {isCorrect ? 'Great Job!' : 'Task Complete!'}
            </h3>
            <p className="text-muted-foreground mt-2">
              {taskTitle} finished
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-bold">{countdown}</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Moving to next task...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}