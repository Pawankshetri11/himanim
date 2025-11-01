import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfileManagement() {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('admin_hero_image') || '';
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatar(result);
        localStorage.setItem('admin_hero_image', result);
        toast({
          title: 'Saved!',
          description: 'Profile image updated successfully.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile Image</h2>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Upload Profile Image</Label>
          <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageUpload"
              onChange={handleImageUpload}
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              {avatar ? (
                <img src={avatar} alt="Profile" className="max-w-full h-48 mx-auto object-cover rounded" />
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">Recommended: 800x600px or similar</p>
                </>
              )}
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
