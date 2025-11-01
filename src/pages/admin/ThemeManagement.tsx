import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ThemeManagement() {
  const { toast } = useToast();
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem('admin_theme_colors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing theme colors:', error);
      }
    }
    return {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#FFFFFF',
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_theme_colors', JSON.stringify(colors));
    
    // Apply colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    
    toast({
      title: 'Saved!',
      description: 'Theme colors updated. Refresh the page to see changes.',
    });
  };

  const resetDefaults = () => {
    const defaults = {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#FFFFFF',
    };
    setColors(defaults);
    localStorage.setItem('admin_theme_colors', JSON.stringify(defaults));
    toast({
      title: 'Reset!',
      description: 'Theme colors reset to defaults.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theme Color Settings</h2>
        <Button variant="outline" onClick={resetDefaults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="background">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={colors.background}
                    onChange={(e) => setColors({ ...colors, background: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={colors.background}
                    onChange={(e) => setColors({ ...colors, background: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="surface">Surface Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="surface"
                    type="color"
                    value={colors.surface}
                    onChange={(e) => setColors({ ...colors, surface: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={colors.surface}
                    onChange={(e) => setColors({ ...colors, surface: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="text">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text"
                    type="color"
                    value={colors.text}
                    onChange={(e) => setColors({ ...colors, text: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={colors.text}
                    onChange={(e) => setColors({ ...colors, text: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4" style={{ backgroundColor: colors.background }}>
              <div className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
                <h3 style={{ color: colors.text }}>Sample Heading</h3>
                <p style={{ color: colors.text, opacity: 0.7 }}>This is how your text will look</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    className="px-4 py-2 rounded"
                    style={{ backgroundColor: colors.primary, color: '#fff' }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded"
                    style={{ backgroundColor: colors.secondary, color: '#fff' }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Theme
        </Button>
      </form>
    </div>
  );
}
