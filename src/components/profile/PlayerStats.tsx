
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, Trophy } from "lucide-react";
import PlayerAttributes from "@/components/PlayerAttributes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@/types/profile";

interface PlayerStatsProps {
  profile: Profile;
}

export const PlayerStats = ({ profile }: PlayerStatsProps) => {
  const { data: evaluations } = useQuery({
    queryKey: ['player-evaluations', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_evaluations')
        .select('*')
        .eq('player_id', profile.id);

      if (error) throw error;
      return data;
    },
  });

  const aggregatedAttributes = evaluations?.length ? evaluations.reduce((acc, curr: any) => {
    Object.entries(curr.attributes).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = 0;
      acc[key] += Number(value);
    });
    return acc;
  }, {}) : profile.attributes;

  // Calculate average ratings if there are evaluations
  const averageAttributes = evaluations?.length ? 
    Object.entries(aggregatedAttributes).reduce((acc, [key, value]) => {
      acc[key] = Math.round(Number(value) / evaluations.length);
      return acc;
    }, {} as Record<string, number>) : 
    profile.attributes;

  const winRate = profile.matches_played ? 
    Math.round((profile.wins / profile.matches_played) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-4 h-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">{profile.matches_played || 0}</div>
            <p className="text-xs text-muted-foreground">Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-4 h-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">{profile.wins || 0}</div>
            <p className="text-xs text-muted-foreground">Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="w-4 h-4 mx-auto mb-2" />
            <div className="text-2xl font-bold">{winRate}%</div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerAttributes
            position={profile.favorite_position || "Forward"}
            attributes={averageAttributes}
            readOnly
          />
          <p className="text-sm text-muted-foreground mt-4">
            {evaluations?.length 
              ? `Based on ${evaluations.length} evaluation${evaluations.length === 1 ? '' : 's'}`
              : 'No evaluations yet'}
          </p>
        </CardContent>
      </Card>

      {evaluations?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Evaluations</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[200px]">
            <CardContent>
              {evaluations.map((evaluation: any) => (
                <div key={evaluation.id} className="py-4 border-b last:border-0">
                  <div className="text-sm text-muted-foreground">
                    {new Date(evaluation.created_at).toLocaleDateString()}
                  </div>
                  {evaluation.comment && (
                    <p className="mt-2 text-sm">{evaluation.comment}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};
