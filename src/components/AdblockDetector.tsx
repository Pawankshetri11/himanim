import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AdblockDetectorProps {
  isVisible: boolean;
  onRetry: () => void;
}

export function AdblockDetector({ isVisible, onRetry }: AdblockDetectorProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-warning/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold">AdBlock Detected</h3>
          </div>
          
          <p className="text-muted-foreground mb-6">
            You have enabled ad block. Please disable ad block to access the quiz and continue your financial learning journey.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={onRetry} 
              className="w-full" 
              variant="hero"
            >
              I've Disabled AdBlock
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">How to disable AdBlock:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Click the AdBlock icon in your browser</li>
                <li>Select "Pause on this site" or "Disable"</li>
                <li>Refresh the page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}