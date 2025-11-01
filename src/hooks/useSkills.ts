import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Skill {
  id: string;
  category_id: string | null;
  name: string;
  level: string | null;
  logo_url: string | null;
  order_index: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string | null;
  color: string | null;
  order_index: number;
}

export function useSkills() {
  const queryClient = useQueryClient();

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as Skill[];
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as SkillCategory[];
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (newSkill: Omit<Skill, 'id'>) => {
      const { data, error } = await supabase
        .from('skills')
        .insert([newSkill])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill added!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add skill');
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Skill> & { id: string }) => {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update skill');
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete skill');
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (newCategory: Omit<SkillCategory, 'id'>) => {
      const { data, error } = await supabase
        .from('skill_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      toast.success('Category created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SkillCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('skill_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      toast.success('Category updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skill_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill_categories'] });
      toast.success('Category deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  return {
    skills,
    categories,
    isLoading: skillsLoading || categoriesLoading,
    createSkill: createSkillMutation.mutate,
    updateSkill: updateSkillMutation.mutate,
    deleteSkill: deleteSkillMutation.mutate,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
}
