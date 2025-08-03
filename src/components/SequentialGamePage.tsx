import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Lock } from 'lucide-react';
import { GameRenderer } from './GameRenderer';

interface GameTask {
  id: string;
  type: 'quiz' | 'puzzle' | 'memory' | 'math' | 'word';
  title: string;
  description: string;
  data: any;
  page: number;
}

interface SequentialGamePageProps {
  tasks: GameTask[];
  onComplete: (answers: {[key: string]: any}) => void;
  disabled?: boolean;
}

export function SequentialGamePage({ 
  tasks, 
  onComplete, 
  disabled = false 
}: SequentialGamePageProps) {
  const [answers, setAnswers] = useState<{[key: string]: any}>({});
  const [canPlay, setCanPlay] = useState<{[key: string]: boolean}>({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingForTask, setWaitingForTask] = useState<string | null>(null);

  // Initialize first task as playable, rest as locked
  useEffect(() => {
    if (tasks.length > 0) {
      const initialCanPlay: {[key: string]: boolean} = {};
      tasks.forEach((task, index) => {
        initialCanPlay[task.id] = index === 0; // Only first task is playable
      });
      setCanPlay(initialCanPlay);
    }
  }, [tasks]);

  const handleTaskComplete = (taskId: string, answer: any) => {
    if (!canPlay[taskId] || isWaiting || disabled) return;

    const newAnswers = { ...answers, [taskId]: answer };
    setAnswers(newAnswers);

    // Start 3-second wait
    setIsWaiting(true);
    setWaitingForTask(taskId);

    setTimeout(() => {
      setIsWaiting(false);
      setWaitingForTask(null);
      
      // Enable next task
      const currentIndex = tasks.findIndex(t => t.id === taskId);
      if (currentIndex < tasks.length - 1) {
        const nextTask = tasks[currentIndex + 1];
        setCanPlay(prev => ({ ...prev, [nextTask.id]: true }));
      }

      // Check if all tasks are completed
      if (Object.keys(newAnswers).length === tasks.length) {
        onComplete(newAnswers);
      }
    }, 3000);
  };

  const getTaskStatus = (taskId: string, index: number) => {
    if (answers[taskId] !== undefined) return 'completed';
    if (canPlay[taskId]) return 'current';
    return 'locked';
  };

  const isTaskLocked = (taskId: string) => {
    return !canPlay[taskId] && answers[taskId] === undefined;
  };

  const getStatusIcon = (taskId: string, index: number) => {
    const status = getTaskStatus(taskId, index);
    
    if (status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (status === 'current' && waitingForTask === taskId) {
      return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
    }
    if (status === 'locked') {
      return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
    return null;
  };

  const getCardClassName = (taskId: string) => {
    const status = getTaskStatus(taskId, 0);
    const baseClass = "transition-all duration-300";
    
    if (status === 'completed') {
      return `${baseClass} border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20`;
    }
    if (status === 'current') {
      return `${baseClass} border-primary shadow-elegant hover:shadow-primary`;
    }
    return `${baseClass} border-muted bg-muted/20 opacity-60`;
  };

  return (
    <div className="space-y-6">
      {tasks.map((task, index) => {
        const taskStatus = getTaskStatus(task.id, index);
        const isLocked = isTaskLocked(task.id);
        const isCurrentlyWaiting = waitingForTask === task.id;
        const isCompleted = answers[task.id] !== undefined;

        return (
          <React.Fragment key={task.id}>
            <Card className={getCardClassName(task.id)}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant={taskStatus === 'completed' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    Task {index + 1}
                  </Badge>
                  {getStatusIcon(task.id, index)}
                  {isCurrentlyWaiting && (
                    <Badge variant="outline" className="text-xs text-orange-600">
                      Please wait 3 seconds...
                    </Badge>
                  )}
                </div>

                {isLocked ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Complete the previous task first</p>
                    <p className="text-xs mt-1 opacity-75">{task.title}</p>
                  </div>
                ) : (
                  <div className={`${isCurrentlyWaiting ? 'opacity-50 pointer-events-none' : ''}`}>
                    <GameRenderer 
                      task={task}
                      onComplete={(answer) => handleTaskComplete(task.id, answer)}
                      disabled={isCompleted || isCurrentlyWaiting || disabled}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advertisement Space after each task (except the last one) */}
            {index < tasks.length - 1 && (
              <Card className="border-dashed border-muted-foreground/30 my-6">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p className="text-sm">Advertisement Space</p>
                  <p className="text-xs mt-1">Ads help keep our games free</p>
                </CardContent>
              </Card>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}