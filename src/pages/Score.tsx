import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Share2, RefreshCw, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function Score() {
  const navigate = useNavigate();
  const { state, dispatch } = useQuiz();

  useEffect(() => {
    // Redirect if challenge is not completed
    if (!state.isCompleted || !state.score) {
      navigate('/');
      toast.error('Please complete the challenge first');
    }
  }, [state.isCompleted, state.score, navigate]);

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
    toast.success('Game reset successfully. Start again for a new score!');
  };

  const handleShare = async () => {
    const shareText = `I just scored ${state.score} on the Finance Challenge! Test your financial knowledge: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Finance Challenge Score',
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Score copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const timeTaken = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000 / 60) : 0;

  if (!state.isCompleted || !state.score) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Main Score Card */}
        <Card className="text-center shadow-elegant border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Congratulations! 🎉
            </CardTitle>
            <p className="text-muted-foreground">
              You've completed the Finance Challenge
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your Financial IQ Score</p>
              <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {state.score}
              </div>
              <Badge variant="secondary" className="text-sm">
                Unique Score ID
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{timeTaken} minutes</p>
                <p className="text-xs text-muted-foreground">Time taken</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 mx-auto mb-1 text-secondary" />
                <p className="text-sm font-medium">{state.answers.length} tasks</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleShare}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Score
              </Button>
              <Button 
                onClick={handleRestart}
                variant="hero"
                className="flex-1 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Take Challenge Again
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="shadow-elegant">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="font-semibold text-lg">About Your Score</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Your score is a unique 6-digit identifier that reflects your completion of the challenge.
              </p>
              <p className="font-medium text-foreground">
                To get a new score, please start the challenge again from the beginning.
              </p>
              <p className="text-xs">
                Note: Sharing this URL with others won't show them your score unless they complete the full challenge themselves.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ad Space */}
        <Card className="border-dashed border-muted-foreground/30">
          <CardContent className="p-6 text-center text-muted-foreground">
            <p className="text-sm">Advertisement Space</p>
            <p className="text-xs mt-1">Thank you for completing our challenge!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}