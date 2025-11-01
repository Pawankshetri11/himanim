import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProjectCategoriesManagement() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('admin_project_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing project categories:', error);
      }
    }
    return [
      { id: '1', name: 'AI/ML', description: 'Artificial Intelligence and Machine Learning Projects' },
      { id: '2', name: 'Web Development', description: 'Web Application Projects' },
      { id: '3', name: 'Data Analysis', description: 'Data Analytics Projects' },
      { id: '4', name: 'Game Development', description: 'Game Development Projects' },
    ];
  });

  const saveCategories = (updated: any[]) => {
    setCategories(updated);
    localStorage.setItem('admin_project_categories', JSON.stringify(updated));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = categories.map((cat: any) =>
        cat.id === editingId ? { ...cat, ...formData } : cat
      );
      saveCategories(updated);
    } else {
      const newCat = { id: Date.now().toString(), ...formData };
      saveCategories([...categories, newCat]);
    }
    toast({
      title: 'Saved!',
      description: `Category ${editingId ? 'updated' : 'added'} successfully.`,
    });
    resetForm();
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category.id);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = categories.filter((cat: any) => cat.id !== id);
    saveCategories(updated);
    toast({
      title: 'Deleted',
      description: 'Category deleted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Categories Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Project Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {category.name}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            {category.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
