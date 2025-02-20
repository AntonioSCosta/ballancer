
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy, Calendar, Star } from "lucide-react";

interface UserProfileProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

interface UserStats {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  favorite_position: string | null;
  matches_played: number;
  wins: number;
  losses: number;
}

export const UserProfile = ({ userId, open, onClose }: UserProfileProps) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserStats;
    },
    enabled: !!userId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Player Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : profile ? (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  {profile.favorite_position && (
                    <Badge variant="outline" className="mt-1">
                      {profile.favorite_position}
                    </Badge>
                  )}
                </div>
              </div>

              {profile.bio && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="w-4 h-4 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{profile.matches_played}</div>
                    <p className="text-xs text-muted-foreground">Matches</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Trophy className="w-4 h-4 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{profile.wins}</div>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Star className="w-4 h-4 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {profile.matches_played > 0
                        ? Math.round((profile.wins / profile.matches_played) * 100)
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Profile not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
