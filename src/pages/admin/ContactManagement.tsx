import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Mail, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactManagement() {
  const { toast } = useToast();
  
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem('admin_contact_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing contact info:', error);
      }
    }
    return {
      email: 'himani.singwal@example.com',
      linkedin: 'https://linkedin.com/in/himani-singwal',
      github: 'https://github.com/himanisingwal',
    };
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('contact_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleContactInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_contact_info', JSON.stringify(contactInfo));
    toast({
      title: 'Saved!',
      description: 'Contact information updated successfully.',
    });
  };

  const deleteSubmission = (id: string) => {
    const updated = submissions.filter((s: any) => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem('contact_submissions', JSON.stringify(updated));
    toast({
      title: 'Deleted',
      description: 'Contact submission deleted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Contact Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <p className="text-sm text-muted-foreground">Update your contact details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactInfoSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                type="url"
                value={contactInfo.linkedin}
                onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                type="url"
                value={contactInfo.github}
                onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Contact Info
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Form Messages Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Form Messages</h2>
        <div className="text-sm text-muted-foreground">
          View messages from the contact form
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission: any) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {submission.name}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteSubmission(submission.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> {submission.email}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong> {new Date(submission.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>Message:</strong>
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {submission.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
