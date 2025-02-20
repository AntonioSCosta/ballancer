
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { PlayerPosition } from "@/components/PlayerCard";
import PlayerAttributes from "@/components/PlayerAttributes";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pendingTheme, setPendingTheme] = useState(theme);
  const [considerPositions, setConsiderPositions] = useState(() => {
    const stored = localStorage.getItem("considerPositions");
    return stored ? JSON.parse(stored) : true;
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
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
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

  useEffect(() => {
    localStorage.setItem("considerPositions", JSON.stringify(considerPositions));
  }, [considerPositions]);

  const handleAttributeChange = (attr: string, value: number[]) => {
    const currentAttributes = profile?.attributes || {};
    updateProfile.mutate({
      attributes: {
        ...currentAttributes,
        [attr]: value[0],
      },
    });
  };

  const handlePositionChange = (position: PlayerPosition) => {
    updateProfile.mutate({ favorite_position: position });
  };

  const handleUsernameChange = (username: string) => {
    updateProfile.mutate({ username });
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setPendingTheme(newTheme);
    setTimeout(() => {
      setTheme(newTheme);
    }, 200);
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
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your profile information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile?.username || ''}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Preferred Position</Label>
            <Select
              value={profile?.favorite_position || undefined}
              onValueChange={(value: PlayerPosition) => handlePositionChange(value)}
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
            position={profile?.favorite_position as PlayerPosition || "Forward"}
            attributes={profile?.attributes || {}}
            onAttributeChange={handleAttributeChange}
          />

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={pendingTheme === 'dark'}
                onCheckedChange={handleThemeChange}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="space-y-0.5">
              <Label>Position-Based Team Distribution</Label>
              <p className="text-sm text-muted-foreground">
                Consider player positions when generating teams
              </p>
            </div>
            <Switch
              checked={considerPositions}
              onCheckedChange={setConsiderPositions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
