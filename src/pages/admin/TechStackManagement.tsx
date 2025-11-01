import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function TechStackManagement() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
  });

  const [techStack, setTechStack] = useState(() => {
    const saved = localStorage.getItem('admin_techstack');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing tech stack:', error);
      }
    }
    return [
      { id: '1', name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { id: '2', name: 'NumPy', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
      { id: '3', name: 'Pandas', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
      { id: '4', name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { id: '5', name: 'Power BI', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
      { id: '6', name: 'Excel', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg' },
    ];
  });

  const saveTechStack = (updated: any[]) => {
    setTechStack(updated);
    localStorage.setItem('admin_techstack', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData({ name: '', logo: '' });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = techStack.map((tech: any) =>
        tech.id === editingId ? { ...tech, ...formData } : tech
      );
      saveTechStack(updated);
    } else {
      const newTech = { id: Date.now().toString(), ...formData };
      saveTechStack([...techStack, newTech]);
    }
    toast({
      title: 'Saved!',
      description: `Tech stack ${editingId ? 'updated' : 'added'} successfully.`,
    });
    resetForm();
  };

  const handleEdit = (tech: any) => {
    setFormData({ name: tech.name, logo: tech.logo });
    setEditingId(tech.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = techStack.filter((tech: any) => tech.id !== id);
    saveTechStack(updated);
    toast({
      title: 'Deleted',
      description: 'Tech stack item deleted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tech Stack Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Technology</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Technology Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  required
                  placeholder="https://example.com/logo.svg"
                />
              </div>
              {formData.logo && (
                <div className="flex justify-center">
                  <img src={formData.logo} alt="Preview" className="w-16 h-16 object-contain" />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techStack.map((tech: any) => (
          <Card key={tech.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={tech.logo} alt={tech.name} className="w-8 h-8 object-contain" />
                  <span>{tech.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(tech)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(tech.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
