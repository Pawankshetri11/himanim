import { useState } from 'react';
import { useExperiences } from '@/hooks/useExperiences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function ExperienceManagement() {
  const { experiences, createExperience, updateExperience, deleteExperience } = useExperiences();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
    logo_url: '',
    order_index: 0,
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      location: '',
      logo_url: '',
      order_index: 0,
    });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      end_date: formData.is_current ? null : formData.end_date || null,
    };
    
    if (editingId) {
      updateExperience({ id: editingId, ...data });
    } else {
      createExperience(data);
    }
    resetForm();
  };

  const handleEdit = (exp: any) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description || '',
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      location: exp.location || '',
      logo_url: exp.logo_url || '',
      order_index: exp.order_index,
    });
    setEditingId(exp.id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Experience Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })}
                />
                <Label htmlFor="is_current">Currently working here</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">Company Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experiences?.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div>{exp.position}</div>
                  <div className="text-sm font-normal text-muted-foreground">{exp.company}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {format(new Date(exp.start_date), 'MMM yyyy')} - {exp.is_current ? 'Present' : format(new Date(exp.end_date!), 'MMM yyyy')}
              </p>
              {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
              {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
