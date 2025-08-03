import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Lock } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  description?: string;
  options: string[];
  correctAnswer: number;
}

interface SequentialQuestionPageProps {
  questions: Question[];
  onComplete: (answers: {[key: string]: any}) => void;
  disabled?: boolean;
}

export function SequentialQuestionPage({ 
  questions, 
  onComplete, 
  disabled = false 
}: SequentialQuestionPageProps) {
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [canAnswer, setCanAnswer] = useState<{[key: string]: boolean}>({});
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingForQuestion, setWaitingForQuestion] = useState<string | null>(null);

  // Initialize first question as answerable, rest as locked
  useEffect(() => {
    if (questions.length > 0) {
      const initialCanAnswer: {[key: string]: boolean} = {};
      questions.forEach((question, index) => {
        initialCanAnswer[question.id] = index === 0; // Only first question is answerable
      });
      setCanAnswer(initialCanAnswer);
    }
  }, [questions]);

  const handleAnswerChange = (questionId: string, selectedOption: number) => {
    if (!canAnswer[questionId] || isWaiting || disabled) return;

    const newAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(newAnswers);

    // Start 3-second wait
    setIsWaiting(true);
    setWaitingForQuestion(questionId);

    setTimeout(() => {
      setIsWaiting(false);
      setWaitingForQuestion(null);
      
      // Enable next question
      const currentIndex = questions.findIndex(q => q.id === questionId);
      if (currentIndex < questions.length - 1) {
        const nextQuestion = questions[currentIndex + 1];
        setCanAnswer(prev => ({ ...prev, [nextQuestion.id]: true }));
      }

      // Check if all questions are answered
      if (Object.keys(newAnswers).length === questions.length) {
        const finalAnswers = questions.reduce((acc, question) => {
          acc[question.id] = {
            selectedOption: newAnswers[question.id],
            isCorrect: newAnswers[question.id] === question.correctAnswer
          };
          return acc;
        }, {} as {[key: string]: any});
        
        onComplete(finalAnswers);
      }
    }, 3000);
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    if (answers[questionId] !== undefined) return 'completed';
    if (canAnswer[questionId]) return 'current';
    return 'locked';
  };

  const isQuestionLocked = (questionId: string) => {
    return !canAnswer[questionId] && answers[questionId] === undefined;
  };

  const getStatusIcon = (questionId: string, index: number) => {
    const status = getQuestionStatus(questionId, index);
    
    if (status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (status === 'current' && waitingForQuestion === questionId) {
      return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
    }
    if (status === 'locked') {
      return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
    return null;
  };

  const getCardClassName = (questionId: string) => {
    const status = getQuestionStatus(questionId, 0);
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
      {questions.map((question, index) => {
        const questionStatus = getQuestionStatus(question.id, index);
        const isLocked = isQuestionLocked(question.id);
        const isCurrentlyWaiting = waitingForQuestion === question.id;
        const selectedAnswer = answers[question.id];

        return (
          <React.Fragment key={question.id}>
            <Card className={getCardClassName(question.id)}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant={questionStatus === 'completed' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        Question {index + 1}
                      </Badge>
                      {getStatusIcon(question.id, index)}
                      {isCurrentlyWaiting && (
                        <Badge variant="outline" className="text-xs text-orange-600">
                          Please wait 3 seconds...
                        </Badge>
                      )}
                    </div>
                    <CardTitle className={`text-lg leading-relaxed ${isLocked ? 'text-muted-foreground' : ''}`}>
                      {question.question}
                    </CardTitle>
                  </div>
                </div>
                {question.description && (
                  <p className={`text-sm mt-2 ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {question.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                {isLocked ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Please answer the previous question first</p>
                  </div>
                ) : (
                  <RadioGroup 
                    value={selectedAnswer?.toString() || ''} 
                    onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                    className="space-y-3"
                    disabled={isCurrentlyWaiting || disabled || selectedAnswer !== undefined}
                  >
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                          selectedAnswer !== undefined 
                            ? 'border-border bg-muted/50' 
                            : 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                        } ${isCurrentlyWaiting ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (selectedAnswer === undefined && !isCurrentlyWaiting && !isLocked) {
                            handleAnswerChange(question.id, optionIndex);
                          }
                        }}
                      >
                        <RadioGroupItem 
                          value={optionIndex.toString()} 
                          id={`${question.id}-${optionIndex}`}
                          className="mt-0.5"
                          disabled={isCurrentlyWaiting || disabled || selectedAnswer !== undefined || isLocked}
                        />
                        <Label 
                          htmlFor={`${question.id}-${optionIndex}`}
                          className={`flex-1 leading-relaxed ${
                            selectedAnswer !== undefined || isLocked ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          {option}
                        </Label>
                        {selectedAnswer === optionIndex && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Advertisement Space after each question */}
            {index < questions.length - 1 && (
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