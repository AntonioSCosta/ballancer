
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile, DEFAULT_ATTRIBUTES } from "@/types/profile";
import { useAuth } from "@/components/AuthProvider";

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Profile>({
    id: "",
    username: "",
    avatar_url: "",
    bio: "",
    favorite_position: "Forward",
    attributes: DEFAULT_ATTRIBUTES,
    matches_played: 0,
    wins: 0,
    losses: 0,
    created_at: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        attributes: data.attributes || DEFAULT_ATTRIBUTES,
        favorite_position: data.favorite_position || "Forward"
      } as Profile;
    },
    enabled: !!user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Profile) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user?.id) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile photo updated successfully');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to update profile photo');
    }
  };

  const handleAttributeChange = (attr: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value[0],
      },
    }));
  };

  const handleFormDataChange = (updates: Partial<Profile>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    profile,
    formData,
    isLoading: isLoading || updateProfile.isPending,
    updateProfile,
    handlePhotoChange,
    handleAttributeChange,
    handleFormDataChange,
    setFormData,
  };
};
