import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfileManagement() {
  const { toast } = useToast();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('admin_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
    return {
      fullName: 'Himani Singwal',
      email: 'himani.singwal@example.com',
      phone: '',
      location: '',
      bio: "I'm a passionate data professional on a mission to bridge the gap between data and decision-making.",
      avatar: '',
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_profile', JSON.stringify(formData));
    toast({
      title: 'Saved!',
      description: 'Profile settings updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label>Hero Section Image</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({ ...formData, avatar: reader.result as string });
                        localStorage.setItem('admin_hero_image', reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="max-w-full h-48 mx-auto object-cover rounded" />
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-muted-foreground">Click to upload a rectangular image</p>
                      <p className="text-xs text-muted-foreground">Recommended: 800x600px or similar aspect ratio</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </form>
    </div>
  );
}
