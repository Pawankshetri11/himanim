import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HeroNavManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('admin_hero_nav');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing hero/nav data:', error);
      }
    }
    return {
      welcomeText: 'Welcome to my portfolio',
      greeting: "Hi, I'm",
      name: 'Himani Singwal',
      title1: 'Data Analyst',
      title2: 'IT Professional',
      description: "BCA Graduate specializing in Data Science, currently working as an IT Executive. Passionate about transforming data into actionable insights through analytics and visualization.",
      heroImage: '',
      email: 'himani.singwal@example.com',
      linkedin: 'https://linkedin.com/in/himani-singwal',
      github: 'https://github.com/himanisingwal',
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_hero_nav', JSON.stringify(formData));
    if (formData.heroImage) {
      localStorage.setItem('admin_hero_image', formData.heroImage);
    }
    toast({
      title: 'Saved!',
      description: 'Hero & Navigation settings updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hero & Navigation Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="welcomeText">Welcome Text</Label>
              <Input
                id="welcomeText"
                value={formData.welcomeText}
                onChange={(e) => setFormData({ ...formData, welcomeText: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="greeting">Greeting</Label>
              <Input
                id="greeting"
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title1">Title 1</Label>
                <Input
                  id="title1"
                  value={formData.title1}
                  onChange={(e) => setFormData({ ...formData, title1: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="title2">Title 2</Label>
                <Input
                  id="title2"
                  value={formData.title2}
                  onChange={(e) => setFormData({ ...formData, title2: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input
                id="heroImage"
                type="url"
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </form>
    </div>
  );
}
