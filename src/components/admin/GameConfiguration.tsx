import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Settings, 
  Calendar,
  Gamepad2,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface GameType {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  avgCompletionTime: number;
}

interface GameConfiguration {
  id: string;
  name: string;
  totalPages: number;
  gamesPerPage: number;
  gameTypes: string[];
  isActive: boolean;
  schedule: {
    startDate: string;
    endDate: string;
    dailyUpdate: boolean;
  };
  rewards: {
    completionBonus: number;
    perfectScoreBonus: number;
  };
}

export function GameConfiguration() {
  const [gameTypes, setGameTypes] = useState<GameType[]>([
    { id: 'quiz', name: 'Quiz', description: 'Multiple choice questions', icon: '❓', enabled: true, difficulty: 'easy', avgCompletionTime: 30 },
    { id: 'puzzle', name: 'Puzzle', description: 'Drag and drop sorting', icon: '🧩', enabled: true, difficulty: 'medium', avgCompletionTime: 45 },
    { id: 'math', name: 'Math', description: 'Calculation problems', icon: '🔢', enabled: true, difficulty: 'medium', avgCompletionTime: 60 },
    { id: 'memory', name: 'Memory', description: 'Match pairs game', icon: '🧠', enabled: true, difficulty: 'hard', avgCompletionTime: 90 },
    { id: 'word', name: 'Word', description: 'Letter arrangement', icon: '📝', enabled: true, difficulty: 'easy', avgCompletionTime: 40 },
  ]);

  const [configurations, setConfigurations] = useState<GameConfiguration[]>([
    {
      id: 'config-1',
      name: 'Daily Finance Challenge',
      totalPages: 3,
      gamesPerPage: 4,
      gameTypes: ['quiz', 'puzzle', 'math', 'memory'],
      isActive: true,
      schedule: {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        dailyUpdate: true
      },
      rewards: {
        completionBonus: 100,
        perfectScoreBonus: 250
      }
    }
  ]);

  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingConfig, setIsAddingConfig] = useState(false);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);

  const [newGameType, setNewGameType] = useState<Partial<GameType>>({
    name: '',
    description: '',
    icon: '🎮',
    enabled: true,
    difficulty: 'medium',
    avgCompletionTime: 60
  });

  const [newConfig, setNewConfig] = useState<Partial<GameConfiguration>>({
    name: '',
    totalPages: 3,
    gamesPerPage: 4,
    gameTypes: [],
    isActive: false,
    schedule: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyUpdate: true
    },
    rewards: {
      completionBonus: 100,
      perfectScoreBonus: 250
    }
  });

  const handleAddGameType = () => {
    if (!newGameType.name || !newGameType.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const gameType: GameType = {
      id: `game-${Date.now()}`,
      name: newGameType.name!,
      description: newGameType.description!,
      icon: newGameType.icon || '🎮',
      enabled: newGameType.enabled || true,
      difficulty: newGameType.difficulty || 'medium',
      avgCompletionTime: newGameType.avgCompletionTime || 60
    };

    setGameTypes(prev => [...prev, gameType]);
    setNewGameType({
      name: '',
      description: '',
      icon: '🎮',
      enabled: true,
      difficulty: 'medium',
      avgCompletionTime: 60
    });
    setIsAddingGame(false);
    toast.success('Game type added successfully');
  };

  const handleAddConfiguration = () => {
    if (!newConfig.name || !newConfig.gameTypes?.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    const config: GameConfiguration = {
      id: `config-${Date.now()}`,
      name: newConfig.name!,
      totalPages: newConfig.totalPages || 3,
      gamesPerPage: newConfig.gamesPerPage || 4,
      gameTypes: newConfig.gameTypes || [],
      isActive: newConfig.isActive || false,
      schedule: newConfig.schedule || {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyUpdate: true
      },
      rewards: newConfig.rewards || {
        completionBonus: 100,
        perfectScoreBonus: 250
      }
    };

    setConfigurations(prev => [...prev, config]);
    setNewConfig({
      name: '',
      totalPages: 3,
      gamesPerPage: 4,
      gameTypes: [],
      isActive: false,
      schedule: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyUpdate: true
      },
      rewards: {
        completionBonus: 100,
        perfectScoreBonus: 250
      }
    });
    setIsAddingConfig(false);
    toast.success('Game configuration added successfully');
  };

  const toggleGameType = (id: string) => {
    setGameTypes(prev => prev.map(game => 
      game.id === id ? { ...game, enabled: !game.enabled } : game
    ));
    toast.success('Game type updated');
  };

  const toggleConfiguration = (id: string) => {
    setConfigurations(prev => prev.map(config => 
      config.id === id ? { ...config, isActive: !config.isActive } : config
    ));
    toast.success('Configuration updated');
  };

  const deleteGameType = (id: string) => {
    setGameTypes(prev => prev.filter(game => game.id !== id));
    toast.success('Game type deleted');
  };

  const deleteConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
    toast.success('Configuration deleted');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
          <Gamepad2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Game Configuration
          </h2>
          <p className="text-muted-foreground">
            Manage game types, pages, and daily updates
          </p>
        </div>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid grid-cols-2 bg-muted/30 backdrop-blur-sm">
          <TabsTrigger value="types" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gamepad2 className="h-4 w-4 mr-2" />
            Game Types
          </TabsTrigger>
          <TabsTrigger value="configs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Configurations
          </TabsTrigger>
        </TabsList>

        {/* Game Types Management */}
        <TabsContent value="types" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Available Game Types</h3>
            <Dialog open={isAddingGame} onOpenChange={setIsAddingGame}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Game Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Game Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newGameType.name || ''}
                        onChange={(e) => setNewGameType({...newGameType, name: e.target.value})}
                        placeholder="e.g., Strategy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input
                        value={newGameType.icon || ''}
                        onChange={(e) => setNewGameType({...newGameType, icon: e.target.value})}
                        placeholder="🎮"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newGameType.description || ''}
                      onChange={(e) => setNewGameType({...newGameType, description: e.target.value})}
                      placeholder="Brief description of the game type"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={newGameType.difficulty} onValueChange={(value: any) => setNewGameType({...newGameType, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Avg. Time (seconds)</Label>
                      <Input
                        type="number"
                        value={newGameType.avgCompletionTime || 60}
                        onChange={(e) => setNewGameType({...newGameType, avgCompletionTime: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddGameType} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Game Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {gameTypes.map((game) => (
              <Card key={game.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{game.icon}</div>
                      <div>
                        <h4 className="font-semibold">{game.name}</h4>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getDifficultyColor(game.difficulty)}>
                            {game.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {game.avgCompletionTime}s
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={game.enabled}
                        onCheckedChange={() => toggleGameType(game.id)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => deleteGameType(game.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Configurations Management */}
        <TabsContent value="configs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Game Configurations</h3>
            <Dialog open={isAddingConfig} onOpenChange={setIsAddingConfig}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Configuration Name</Label>
                    <Input
                      value={newConfig.name || ''}
                      onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                      placeholder="e.g., Weekly Challenge"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Pages</Label>
                      <Input
                        type="number"
                        value={newConfig.totalPages || 3}
                        onChange={(e) => setNewConfig({...newConfig, totalPages: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Games Per Page</Label>
                      <Input
                        type="number"
                        value={newConfig.gamesPerPage || 4}
                        onChange={(e) => setNewConfig({...newConfig, gamesPerPage: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Game Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {gameTypes.filter(g => g.enabled).map((game) => (
                        <div key={game.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={game.id}
                            checked={newConfig.gameTypes?.includes(game.id)}
                            onChange={(e) => {
                              const gameTypes = newConfig.gameTypes || [];
                              if (e.target.checked) {
                                setNewConfig({...newConfig, gameTypes: [...gameTypes, game.id]});
                              } else {
                                setNewConfig({...newConfig, gameTypes: gameTypes.filter(id => id !== game.id)});
                              }
                            }}
                          />
                          <label htmlFor={game.id} className="text-sm flex items-center gap-1">
                            {game.icon} {game.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newConfig.schedule?.startDate || ''}
                        onChange={(e) => setNewConfig({
                          ...newConfig, 
                          schedule: {
                            startDate: e.target.value,
                            endDate: newConfig.schedule?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            dailyUpdate: newConfig.schedule?.dailyUpdate || true
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newConfig.schedule?.endDate || ''}
                        onChange={(e) => setNewConfig({
                          ...newConfig, 
                          schedule: {
                            startDate: newConfig.schedule?.startDate || new Date().toISOString().split('T')[0],
                            endDate: e.target.value,
                            dailyUpdate: newConfig.schedule?.dailyUpdate || true
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newConfig.schedule?.dailyUpdate || false}
                      onCheckedChange={(checked) => setNewConfig({
                        ...newConfig,
                        schedule: {
                          startDate: newConfig.schedule?.startDate || new Date().toISOString().split('T')[0],
                          endDate: newConfig.schedule?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          dailyUpdate: checked
                        }
                      })}
                    />
                    <Label>Daily Content Updates</Label>
                  </div>
                  <Button onClick={handleAddConfiguration} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Add Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {configurations.map((config) => (
              <Card key={config.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-semibold text-lg">{config.name}</h4>
                        {config.isActive && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span>{config.totalPages} pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-primary" />
                          <span>{config.gamesPerPage} games/page</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{config.schedule.dailyUpdate ? 'Daily' : 'Static'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{config.gameTypes.length} game types</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {config.gameTypes.map((typeId) => {
                          const gameType = gameTypes.find(g => g.id === typeId);
                          return gameType ? (
                            <Badge key={typeId} variant="outline" className="text-xs">
                              {gameType.icon} {gameType.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => toggleConfiguration(config.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteConfiguration(config.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}