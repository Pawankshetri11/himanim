import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdblockDetector } from '@/components/AdblockDetector';
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  TrendingUp,
  Brain,
  Shield,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/hero-finance.jpg';

const Index = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useQuiz();
  const [showAdblock, setShowAdblock] = useState(false);

  useEffect(() => {
    // Show adblock detector after a delay
    const timer = setTimeout(() => {
      setShowAdblock(state.hasAdblock);
    }, 2000);

    return () => clearTimeout(timer);
  }, [state.hasAdblock]);

  const handleStartQuiz = () => {
    dispatch({ type: 'START_GAME' });
    navigate('/quiz/1');
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
      }, 100);
    }, 100);
  };

  const highlights = [
    {
      icon: Brain,
      title: 'Comprehensive Assessment',
      description: 'Test your knowledge across key financial concepts'
    },
    {
      icon: Trophy,
      title: 'Instant Scoring',
      description: 'Get your unique Financial IQ score immediately'
    },
    {
      icon: Target,
      title: 'Learn Key Concepts',
      description: 'Discover important financial literacy topics'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement over time'
    },
    {
      icon: Users,
      title: 'Free Access',
      description: 'Available to everyone at no cost'
    }
  ];

  return (
    <div className={`min-h-screen ${showAdblock ? 'blur-sm' : ''}`}>
      <AdblockDetector isVisible={showAdblock} onRetry={handleRetryAdblock} />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">FinanceQuiz</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="text-sm"
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  Finance Education Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Test Your{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Financial Knowledge
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Take our comprehensive finance quiz and discover your Financial IQ. 
                  Learn essential concepts while testing your money management skills.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleStartQuiz}
                  size="xl"
                  variant="hero"
                  className="group"
                >
                  Start Quiz Now
                  <Trophy className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5-10 minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>12 questions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Finance Quiz Hero" 
                  className="w-full h-auto rounded-2xl shadow-elegant"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Why Take Our Quiz?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your financial literacy with our carefully designed assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-primary transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <highlight.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                10,000+
              </div>
              <p className="text-muted-foreground">Quiz Takers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                12
              </div>
              <p className="text-muted-foreground">Key Topics Covered</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                95%
              </div>
              <p className="text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Test Your Financial IQ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of others who have improved their financial knowledge through our quiz
            </p>
          </div>
          
          <Button 
            onClick={handleStartQuiz}
            size="xl"
            variant="hero"
            className="group"
          >
            Start Your Quiz Journey
            <CheckCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Ad Space */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <Card className="border-dashed border-muted-foreground/30">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Advertisement Space</p>
              <p className="text-xs mt-1">Ads help keep our quiz free for everyone</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Finance Quiz. All rights reserved. Empowering financial literacy through education.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
