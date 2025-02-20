
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { PlayerPosition } from "@/components/PlayerCard";
import PlayerAttributes from "@/components/PlayerAttributes";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_ATTRIBUTES = {
  speed: 50,
  shooting: 50,
  passing: 50,
  dribbling: 50,
  defending: 50,
  physical: 50,
};

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    favorite_position: "Forward" as PlayerPosition,
    attributes: DEFAULT_ATTRIBUTES,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          username: data.username || "",
          favorite_position: data.favorite_position || "Forward",
          attributes: data.attributes || DEFAULT_ATTRIBUTES,
        });
      }
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: typeof formData) => {
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

  const handleAttributeChange = (attr: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value[0],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/settings")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your profile information and attributes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Preferred Position</Label>
              <Select
                value={formData.favorite_position}
                onValueChange={(value: PlayerPosition) => 
                  setFormData(prev => ({ ...prev, favorite_position: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Forward">Forward</SelectItem>
                  <SelectItem value="Midfielder">Midfielder</SelectItem>
                  <SelectItem value="Defender">Defender</SelectItem>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <PlayerAttributes
              position={formData.favorite_position}
              attributes={formData.attributes}
              onAttributeChange={handleAttributeChange}
            />

            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProfileSettings;
