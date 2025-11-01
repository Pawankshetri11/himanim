import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectsManagement() {
  const { projects, categories, createProject, updateProject, deleteProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    image_url: '',
    technologies: [] as string[],
    github_url: '',
    live_url: '',
    order_index: 0,
  });
  const [techInput, setTechInput] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      image_url: '',
      technologies: [],
      github_url: '',
      live_url: '',
      order_index: 0,
    });
    setTechInput('');
    setEditingId(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject({ id: editingId, ...formData });
    } else {
      createProject(formData);
    }
    resetForm();
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      category_id: project.category_id || '',
      image_url: project.image_url || '',
      technologies: project.technologies || [],
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      order_index: project.order_index,
    });
    setEditingId(project.id);
    setIsOpen(true);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
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
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div>
                <Label>Technologies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-2">
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
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
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {project.title}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies?.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{tech}</span>
                ))}
              </div>
              {project.image_url && (
                <img src={project.image_url} alt={project.title} className="w-32 h-32 object-cover rounded mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
