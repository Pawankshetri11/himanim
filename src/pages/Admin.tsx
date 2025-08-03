import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  HelpCircle, 
  Target, 
  Megaphone, 
  FileText,
  Shield,
  Trash2,
  Plus,
  Eye,
  Upload,
  Download,
  Edit,
  Save,
  RefreshCw,
  Users,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Gamepad2
} from 'lucide-react';
import { toast } from 'sonner';
import { GameConfiguration } from '@/components/admin/GameConfiguration';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    page: 1,
    type: 'quiz',
    question: '',
    description: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  // Enhanced mock admin data
  const [siteSettings, setSiteSettings] = useState({
    logoUrl: '/logo.png',
    headerColor: '#2563eb',
    heroTitle: 'Test Your Financial Knowledge',
    heroSubtitle: 'Take our comprehensive finance quiz and discover your Financial IQ',
    buttonText: 'Start Quiz',
    footerText: '© 2024 Finance Quiz. All rights reserved.',
    highlights: [
      'Comprehensive financial literacy assessment',
      'Instant personalized scoring system',
      'Learn key financial concepts',
      'Track your progress and improvement',
      'Free and accessible to everyone'
    ]
  });

  const [questions, setQuestions] = useState([
    { id: '1-1', page: 1, type: 'quiz', question: 'What is compound interest?', answers: 1247, lastUpdated: '2024-01-15' },
    { id: '1-2', page: 1, type: 'puzzle', question: 'Arrange budget priorities', answers: 1132, lastUpdated: '2024-01-14' },
    { id: '2-1', page: 2, type: 'math', question: 'Calculate monthly savings needed', answers: 891, lastUpdated: '2024-01-13' },
    { id: '3-1', page: 3, type: 'memory', question: 'Match financial terms', answers: 743, lastUpdated: '2024-01-12' },
  ]);

  const [scores] = useState([
    { id: '1', score: '847293', date: '2024-01-15', time: '14:30', userAgent: 'Chrome/Linux' },
    { id: '2', score: '692847', date: '2024-01-15', time: '13:45', userAgent: 'Safari/macOS' },
    { id: '3', score: '731856', date: '2024-01-15', time: '12:20', userAgent: 'Firefox/Windows' },
  ]);

  const [ads, setAds] = useState([
    { id: '1', placement: 'Below Question 1', code: '<script>...</script>', active: true, revenue: '$24.50' },
    { id: '2', placement: 'Header', code: '<div>...</div>', active: true, revenue: '$18.30' },
    { id: '3', placement: 'Interstitial after Page 2', code: '<script>...</script>', active: false, revenue: '$0.00' },
  ]);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        if (!headers.includes('question') || !headers.includes('type') || !headers.includes('page')) {
          toast.error('CSV must contain: question, type, page columns');
          return;
        }

        const newQuestions = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',');
          return {
            id: `import-${Date.now()}-${index}`,
            page: parseInt(values[headers.indexOf('page')]) || 1,
            type: values[headers.indexOf('type')] || 'quiz',
            question: values[headers.indexOf('question')] || '',
            answers: 0,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        });

        setQuestions(prev => [...prev, ...newQuestions]);
        toast.success(`Imported ${newQuestions.length} questions successfully`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csvContent = [
      'id,page,type,question,answers,lastUpdated',
      ...questions.map(q => `${q.id},${q.page},${q.type},"${q.question}",${q.answers},${q.lastUpdated}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Questions exported successfully');
  };

  const handleAddQuestion = () => {
    const question = {
      id: `new-${Date.now()}`,
      page: newQuestion.page,
      type: newQuestion.type,
      question: newQuestion.question,
      answers: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setQuestions(prev => [...prev, question]);
    setNewQuestion({
      page: 1,
      type: 'quiz',
      question: '',
      description: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    setIsAddingQuestion(false);
    toast.success('Question added successfully');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast.success('Question deleted successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground">Secure access to dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">Access Code</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter secure password"
                className="h-12 bg-background/50"
              />
            </div>
            <Button onClick={handleLogin} className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Shield className="h-4 w-4 mr-2" />
              Access Dashboard
            </Button>
            <p className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
              Demo credentials: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-xl mb-4">
            <BarChart3 className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive finance quiz management platform
            </p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-7 bg-muted/30 backdrop-blur-sm p-1 rounded-xl">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Games
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HelpCircle className="h-4 w-4 mr-2" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="scores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="ads" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Megaphone className="h-4 w-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="ads-txt" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                ads.txt
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  <HelpCircle className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-xs text-muted-foreground">Across 3 pages</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completions</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">1,247</div>
                  <p className="text-xs text-muted-foreground">+18% this month</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">$127.50</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
                  <Megaphone className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <p className="text-xs text-muted-foreground">2 placements</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Game Configuration */}
          <TabsContent value="games">
            <GameConfiguration />
          </TabsContent>

          {/* Enhanced Questions Management */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-2xl font-bold">Question Management</h2>
              <div className="flex flex-wrap gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCSVImport}
                  accept=".csv"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-background/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportCSV}
                  className="bg-background/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Question</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Page</Label>
                          <Select value={newQuestion.page.toString()} onValueChange={(value) => setNewQuestion({...newQuestion, page: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Page 1</SelectItem>
                              <SelectItem value="2">Page 2</SelectItem>
                              <SelectItem value="3">Page 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="puzzle">Puzzle</SelectItem>
                              <SelectItem value="math">Math</SelectItem>
                              <SelectItem value="memory">Memory</SelectItem>
                              <SelectItem value="word">Word</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          placeholder="Enter your question here..."
                        />
                      </div>
                      <Button onClick={handleAddQuestion} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Question
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {questions.map((question) => (
                <Card key={question.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Page {question.page}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {question.type}
                          </Badge>
                          <Badge variant="outline" className="text-green-600">
                            {question.answers} responses
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Updated {question.lastUpdated}
                          </span>
                        </div>
                        <p className="font-medium text-lg">{question.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="bg-background/50 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Analytics */}
          <TabsContent value="scores" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Analytics</h2>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-background/50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" className="bg-background/50">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y">
                  {scores.map((score) => (
                    <div key={score.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-xl">{score.score}</p>
                          <p className="text-sm text-muted-foreground">
                            {score.date} at {score.time} • {score.userAgent}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-background/50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Ads Management */}
          <TabsContent value="ads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Revenue Management</h2>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Plus className="h-4 w-4 mr-2" />
                New Ad Unit
              </Button>
            </div>

            <div className="grid gap-4">
              {ads.map((ad) => (
                <Card key={ad.id} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={ad.active ? "default" : "secondary"} className={ad.active ? "bg-green-500" : ""}>
                            {ad.active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-green-600">
                            {ad.revenue} earned
                          </Badge>
                        </div>
                        <p className="font-medium text-lg">{ad.placement}</p>
                        <p className="text-sm text-muted-foreground mt-2 font-mono bg-muted/30 p-2 rounded">
                          {ad.code.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-6 w-6" />
                  Platform Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Brand Logo URL</Label>
                    <Input
                      value={siteSettings.logoUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, logoUrl: e.target.value})}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Theme Color</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={siteSettings.headerColor}
                        onChange={(e) => setSiteSettings({...siteSettings, headerColor: e.target.value})}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.headerColor}
                        onChange={(e) => setSiteSettings({...siteSettings, headerColor: e.target.value})}
                        className="flex-1 bg-background/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Hero Section Title</Label>
                  <Input
                    value={siteSettings.heroTitle}
                    onChange={(e) => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Hero Section Subtitle</Label>
                  <Textarea
                    value={siteSettings.heroSubtitle}
                    onChange={(e) => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                    className="bg-background/50"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Feature Highlights (one per line)</Label>
                  <Textarea
                    value={siteSettings.highlights.join('\n')}
                    onChange={(e) => setSiteSettings({...siteSettings, highlights: e.target.value.split('\n')})}
                    rows={6}
                    className="bg-background/50"
                  />
                </div>

                <Button onClick={handleSaveSettings} className="w-full bg-gradient-to-r from-primary to-accent">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced ads.txt */}
          <TabsContent value="ads-txt" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6" />
                  Advertising Configuration
                </CardTitle>
                <p className="text-muted-foreground">
                  Configure your ads.txt file for ad network verification
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0&#10;..."
                  rows={12}
                  className="font-mono text-sm bg-background/50"
                />
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Save className="h-4 w-4 mr-2" />
                    Update ads.txt
                  </Button>
                  <Button variant="outline" className="bg-background/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}