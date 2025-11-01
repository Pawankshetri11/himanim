import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  logo_url: string | null;
  order_index: number;
}

export function useExperiences() {
  const queryClient = useQueryClient();

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as Experience[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newExperience: Omit<Experience, 'id'>) => {
      const { data, error } = await supabase
        .from('experiences')
        .insert([newExperience])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience added!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add experience');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Experience> & { id: string }) => {
      const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update experience');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete experience');
    },
  });

  return {
    experiences,
    isLoading,
    createExperience: createMutation.mutate,
    updateExperience: updateMutation.mutate,
    deleteExperience: deleteMutation.mutate,
  };
}
