import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';

interface PuzzleGameProps {
  task: any;
  onComplete: (answer: any) => void;
  disabled?: boolean;
}

export function PuzzleGame({ task, onComplete, disabled }: PuzzleGameProps) {
  const getItems = () => {
    if (task.data.items) return task.data.items;
    if (task.data.categories) return task.data.categories;
    if (task.data.debts) return task.data.debts.map((debt: any) => debt.name);
    return [];
  };

  const items = getItems();
  const [currentOrder, setCurrentOrder] = useState<number[]>(
    Array.from({ length: items.length }, (_, i) => i)
  );

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(task.data.correctOrder);
    onComplete({
      order: currentOrder,
      isCorrect
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-primary" />
          {task.title}
        </CardTitle>
        <p className="text-muted-foreground">{task.description}</p>
        <p className="text-sm text-muted-foreground">{task.data.instruction}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentOrder.map((itemIndex, position) => (
            <div
              key={position}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <span className="font-medium text-sm">{position + 1}.</span>
              <span className="flex-1">{items[itemIndex]}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveItem(position, Math.max(0, position - 1))}
                  disabled={position === 0 || disabled}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moveItem(position, Math.min(currentOrder.length - 1, position + 1))}
                  disabled={position === currentOrder.length - 1 || disabled}
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={disabled} className="w-full">
          Submit Order
        </Button>
      </CardContent>
    </Card>
  );
}