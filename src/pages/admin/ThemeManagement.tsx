import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ThemeManagement() {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState('280 65% 60%');
  const [customHSL, setCustomHSL] = useState('280 65% 60%');

  const presetColors = [
    { name: 'Purple', hsl: '280 65% 60%', bgClass: 'bg-purple-500' },
    { name: 'Blue', hsl: '217 91% 60%', bgClass: 'bg-blue-500' },
    { name: 'Green', hsl: '142 71% 45%', bgClass: 'bg-green-600' },
    { name: 'Orange', hsl: '25 95% 53%', bgClass: 'bg-orange-500' },
    { name: 'Pink', hsl: '330 81% 60%', bgClass: 'bg-pink-500' },
    { name: 'Red', hsl: '0 84% 60%', bgClass: 'bg-red-500' },
  ];

  const applyTheme = (hsl: string) => {
    localStorage.setItem('admin_theme_primary', hsl);
    const root = document.documentElement;
    root.style.setProperty('--primary', hsl);
    toast({
      title: 'Theme Updated!',
      description: 'Primary color has been changed.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyTheme(selectedColor);
  };

  const handleCustomSubmit = () => {
    if (customHSL.trim()) {
      applyTheme(customHSL);
      setSelectedColor(customHSL);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Portfolio Color Theme
          </CardTitle>
          <p className="text-sm text-muted-foreground">Customize the primary color of your portfolio</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {presetColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.hsl)}
                  className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColor === color.hsl ? 'border-primary ring-2 ring-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: `hsl(${color.hsl})` }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className={`w-12 h-12 rounded-full ${color.bgClass}`}></div>
                    <span className="text-sm font-medium text-card-foreground mt-2">{color.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="customHSL">Custom HSL Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customHSL"
                    value={customHSL}
                    onChange={(e) => setCustomHSL(e.target.value)}
                    placeholder='Enter HSL values (e.g., "280 65% 60%")'
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleCustomSubmit}>
                    Apply
                  </Button>
                </div>
              </div>

              <Card className="border-2 border-dashed border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                  <p className="text-sm text-muted-foreground">This is how your primary color will look across the portfolio</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    type="button"
                    style={{ 
                      backgroundColor: `hsl(${selectedColor})`,
                      color: 'white'
                    }}
                  >
                    Sample Button
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button type="submit" className="w-full mt-6">
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
