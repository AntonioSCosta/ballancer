
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Match {
  id: string;
  scheduled_for: string;
  status: string;
  team1_players: any[];
  team2_players: any[];
}

interface CommunityMatchesProps {
  communityId: string;
}

export const CommunityMatches = ({ communityId }: CommunityMatchesProps) => {
  const { data: matches } = useQuery({
    queryKey: ['community-matches', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as Match[];
    },
    enabled: !!communityId
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Matches</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Match</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">Match scheduling coming soon!</p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {matches?.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {format(new Date(match.scheduled_for), 'PPP')}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {match.status}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {matches?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No matches scheduled yet
          </p>
        )}
      </div>
    </>
  );
};
