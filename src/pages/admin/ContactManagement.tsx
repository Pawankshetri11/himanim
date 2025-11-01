import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactManagement() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('contact_submissions');
    return saved ? JSON.parse(saved) : [];
  });

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <div className="text-sm text-muted-foreground">
          Total: {submissions.length} submission(s)
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No contact submissions yet.</p>
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
