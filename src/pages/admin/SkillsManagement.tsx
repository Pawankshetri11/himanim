import { useState } from 'react';
import { useSkills } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SkillsManagement() {
  const { skills, categories, createSkill, updateSkill, deleteSkill, createCategory, updateCategory, deleteCategory } = useSkills();
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    level: '',
    logo_url: '',
    category_id: '',
    order_index: 0,
  });

  const [categoryFormData, setCategoryFormData] = useState({
    title: '',
    icon: '',
    color: '',
    order_index: 0,
  });

  const resetSkillForm = () => {
    setSkillFormData({ name: '', level: '', logo_url: '', category_id: '', order_index: 0 });
    setEditingSkillId(null);
    setIsSkillOpen(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ title: '', icon: '', color: '', order_index: 0 });
    setEditingCategoryId(null);
    setIsCategoryOpen(false);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkillId) {
      updateSkill({ id: editingSkillId, ...skillFormData });
    } else {
      createSkill(skillFormData);
    }
    resetSkillForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryId) {
      updateCategory({ id: editingCategoryId, ...categoryFormData });
    } else {
      createCategory(categoryFormData);
    }
    resetCategoryForm();
  };

  const handleEditSkill = (skill: any) => {
    setSkillFormData({
      name: skill.name,
      level: skill.level || '',
      logo_url: skill.logo_url || '',
      category_id: skill.category_id || '',
      order_index: skill.order_index,
    });
    setEditingSkillId(skill.id);
    setIsSkillOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setCategoryFormData({
      title: category.title,
      icon: category.icon || '',
      color: category.color || '',
      order_index: category.order_index,
    });
    setEditingCategoryId(category.id);
    setIsCategoryOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skills Management</h2>

      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Skills</h3>
            <Dialog open={isSkillOpen} onOpenChange={setIsSkillOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetSkillForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSkillId ? 'Edit' : 'Add'} Skill</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSkillSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={skillFormData.category_id} onValueChange={(value) => setSkillFormData({ ...skillFormData, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level (e.g., Advanced, Intermediate)</Label>
                    <Input
                      id="level"
                      value={skillFormData.level}
                      onChange={(e) => setSkillFormData({ ...skillFormData, level: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Logo Image</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="skillLogoUpload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setSkillFormData({ ...skillFormData, logo_url: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="skillLogoUpload" className="cursor-pointer">
                        {skillFormData.logo_url ? (
                          <img src={skillFormData.logo_url} alt="Preview" className="w-16 h-16 mx-auto object-contain" />
                        ) : (
                          <p className="text-sm text-muted-foreground">Click to upload logo</p>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="order_index">Order Index</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={skillFormData.order_index}
                      onChange={(e) => setSkillFormData({ ...skillFormData, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingSkillId ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="outline" onClick={resetSkillForm}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {skills?.map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {skill.logo_url && <img src={skill.logo_url} alt={skill.name} className="w-8 h-8 object-contain" />}
                      <span>{skill.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditSkill(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteSkill(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{skill.level}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Skill Categories</h3>
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetCategoryForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategoryId ? 'Edit' : 'Add'} Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={categoryFormData.title}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon (lucide-react name, e.g., Code2)</Label>
                    <Input
                      id="icon"
                      value={categoryFormData.icon}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color (e.g., #FF6B6B)</Label>
                    <Input
                      id="color"
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order_index">Order Index</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={categoryFormData.order_index}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, order_index: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingCategoryId ? 'Update' : 'Create'}</Button>
                    <Button type="button" variant="outline" onClick={resetCategoryForm}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {category.title}
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => deleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Icon: {category.icon}</p>
                  <p className="text-sm">Color: {category.color}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
