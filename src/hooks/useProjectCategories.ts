import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProjectCategory {
  id: string;
  name: string;
  description?: string | null;
}

export function useProjectCategories() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['project_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ProjectCategory[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: Omit<ProjectCategory, 'id'>) => {
      const { data, error } = await supabase
        .from('project_categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_categories'] });
      toast.success('Category created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_categories'] });
      toast.success('Category updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_categories'] });
      toast.success('Category deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
  };
}
