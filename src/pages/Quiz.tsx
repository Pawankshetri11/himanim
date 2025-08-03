import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { GameRenderer } from '@/components/GameRenderer';
import { QuizProgress } from '@/components/QuizProgress';
import { AdblockDetector } from '@/components/AdblockDetector';
import { SequentialGamePage } from '@/components/SequentialGamePage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Quiz() {
  const { page } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const { state, dispatch, tasks, generateScore, getCurrentPageTasks } = useQuiz();
  const [showAdblock, setShowAdblock] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [taskAnswers, setTaskAnswers] = useState<{[key: string]: any}>({});

  const currentPageNum = parseInt(page || '1');
  const totalPages = Math.max(...tasks.map(t => t.page));
  const pageTasks = getCurrentPageTasks();

  useEffect(() => {
    // Check if user has started the game
    if (state.currentPage === 0 && currentPageNum > 1) {
      navigate('/');
      toast.error('Please start the game from the beginning');
      return;
    }

    // Check if user is trying to skip pages
    if (currentPageNum > state.currentPage + 1) {
      navigate(`/quiz/${state.currentPage || 1}`);
      toast.error('Please complete the game in order');
      return;
    }

    // Update context to current page
    if (state.currentPage !== currentPageNum) {
      dispatch({ type: 'NEXT_PAGE' });
    }
  }, [currentPageNum, state.currentPage, navigate, dispatch]);

  useEffect(() => {
    // Show adblock detector after a delay
    const timer = setTimeout(() => {
      setShowAdblock(state.hasAdblock);
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.hasAdblock]);

  const handleTaskComplete = (taskId: string, answer: any) => {
    const task = pageTasks.find(t => t.id === taskId);
    if (!task) return;

    const gameAnswer = {
      taskId: taskId,
      answer: answer,
      page: currentPageNum,
      completedAt: Date.now()
    };

    dispatch({ type: 'SUBMIT_ANSWER', payload: gameAnswer });
    setCompletedTasks(prev => new Set([...prev, taskId]));
    setTaskAnswers(prev => ({ ...prev, [taskId]: answer }));
    
    toast.success('Task completed!');
  };

  const handleSequentialComplete = (answers: {[key: string]: any}) => {
    // Handle completion of all sequential questions
    Object.keys(answers).forEach(questionId => {
      const gameAnswer = {
        taskId: questionId,
        answer: answers[questionId],
        page: currentPageNum,
        completedAt: Date.now()
      };
      dispatch({ type: 'SUBMIT_ANSWER', payload: gameAnswer });
    });
    
    setCompletedTasks(prev => new Set([...prev, ...Object.keys(answers)]));
    setTaskAnswers(prev => ({ ...prev, ...answers }));
    toast.success('All questions completed!');
  };

  const handleNextPage = () => {
    const allTasksCompleted = pageTasks.every(task => completedTasks.has(task.id));
    
    if (!allTasksCompleted) {
      toast.error('Please complete all tasks before proceeding');
      return;
    }

    const isLastPage = currentPageNum >= totalPages;
    
    if (isLastPage) {
      // Game completed
      const score = generateScore();
      dispatch({ type: 'COMPLETE_GAME', payload: score });
      navigate('/score');
    } else {
      // Go to next page
      navigate(`/quiz/${currentPageNum + 1}`);
      setCompletedTasks(new Set());
      setTaskAnswers({});
    }
  };

  const handleBack = () => {
    if (currentPageNum > 1) {
      navigate(`/quiz/${currentPageNum - 1}`);
    } else {
      navigate('/');
    }
  };

  const handleRetryAdblock = () => {
    setShowAdblock(false);
    // Re-run adblock detection
    setTimeout(() => {
      const adElement = document.createElement('div');
      adElement.innerHTML = '&nbsp;';
      adElement.className = 'adsbox';
      adElement.style.position = 'absolute';
      adElement.style.left = '-9999px';
      document.body.appendChild(adElement);
      
      setTimeout(() => {
        const isBlocked = adElement.offsetHeight === 0;
        dispatch({ type: 'SET_ADBLOCK', payload: isBlocked });
        setShowAdblock(isBlocked);
        document.body.removeChild(adElement);
        
        if (!isBlocked) {
          toast.success('AdBlock disabled successfully!');
        }
      }, 100);
    }, 100);
  };

  if (pageTasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Game page not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allTasksCompleted = pageTasks.every(task => completedTasks.has(task.id));
  const completedCount = completedTasks.size;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/30 ${showAdblock ? 'blur-sm' : ''}`}>
      <AdblockDetector isVisible={showAdblock} onRetry={handleRetryAdblock} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Finance Games Challenge
            </h1>
            <QuizProgress 
              currentPage={currentPageNum} 
              totalPages={totalPages}
              className="max-w-md mx-auto"
            />
            <div className="text-sm text-muted-foreground">
              Completed {completedCount} of {pageTasks.length} tasks - Page {currentPageNum}
            </div>
          </div>

          {/* Universal Sequential Games */}
          <div className="max-w-4xl mx-auto">
            <SequentialGamePage 
              tasks={pageTasks}
              onComplete={handleSequentialComplete}
              disabled={allTasksCompleted}
            />
          </div>

          {/* Ad Space */}
          <Card className="border-dashed border-muted-foreground/30">
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">Advertisement Space</p>
              <p className="text-xs mt-1">Ads help keep our games free</p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentPageNum > 1 ? 'Previous' : 'Home'}
            </Button>

            <div className="text-center">
              {allTasksCompleted ? (
                <p className="text-sm text-green-600 font-medium">
                  All tasks completed! Ready to proceed.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete all tasks to proceed to the next page
                </p>
              )}
            </div>

            <Button 
              onClick={handleNextPage}
              disabled={!allTasksCompleted}
              variant={allTasksCompleted ? "hero" : "outline"}
              className="flex items-center gap-2"
            >
              {currentPageNum >= totalPages ? 'View Score' : 'Next Page'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}