import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ResumeManagement() {
  const { toast } = useToast();
  const [resumeUrl, setResumeUrl] = useState(() => {
    return localStorage.getItem('admin_resume_url') || '';
  });

  const handleSave = () => {
    localStorage.setItem('admin_resume_url', resumeUrl);
    toast({
      title: 'Saved!',
      description: 'Resume URL updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resume Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>Resume URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resumeUrl">Resume File URL</Label>
            <Input
              id="resumeUrl"
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/resume.pdf"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload your resume to a cloud storage service (Google Drive, Dropbox, etc.) and paste the public link here.
            </p>
          </div>

          {resumeUrl && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(resumeUrl, '_blank')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Preview Resume
              </Button>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Resume URL
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Upload your resume PDF to a cloud storage service like:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Google Drive (Make sure to set sharing to "Anyone with the link")</li>
            <li>Dropbox (Generate a public link)</li>
            <li>GitHub (Upload to a public repository)</li>
          </ul>
          <p>2. Copy the public/shareable link</p>
          <p>3. Paste it in the Resume File URL field above</p>
          <p>4. Click Save to update your resume</p>
        </CardContent>
      </Card>
    </div>
  );
}
