import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface About {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
}

export function useAbout() {
  const queryClient = useQueryClient();

  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as About[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newAbout: Omit<About, 'id'>) => {
      const { data, error } = await supabase
        .from('about')
        .insert([newAbout])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About section created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create about section');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<About> & { id: string }) => {
      const { data, error } = await supabase
        .from('about')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About section updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update about section');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('about')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About section deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete about section');
    },
  });

  return {
    about,
    isLoading,
    createAbout: createMutation.mutate,
    updateAbout: updateMutation.mutate,
    deleteAbout: deleteMutation.mutate,
  };
}
