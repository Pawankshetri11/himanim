import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  image_url: string | null;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  order_index: number;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: categories } = useQuery({
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
    mutationFn: async (newProject: Omit<Project, 'id'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  return {
    projects,
    categories,
    isLoading,
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
  };
}
