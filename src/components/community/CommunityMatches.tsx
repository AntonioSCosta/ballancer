import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Match {
  id: string;
  scheduled_for: string;
  status: string;
  team1_players: any[];
  team2_players: any[];
  location: string;
  pitch_price: number;
  start_time: string;
}

interface CommunityMatchesProps {
  communityId: string;
}

export const CommunityMatches = ({ communityId }: CommunityMatchesProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    price: "",
  });

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

  const createMatch = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: newMatch, error: matchError } = await supabase
        .rpc('create_match_with_notifications', {
          p_community_id: communityId,
          p_created_by: user?.id,
          p_scheduled_for: `${data.date}T${data.time}`,
          p_location: data.location,
          p_pitch_price: parseFloat(data.price),
          p_start_time: data.time
        });

      if (matchError) throw matchError;
      return newMatch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-matches', communityId] });
      setIsOpen(false);
      setFormData({ date: "", time: "", location: "", price: "" });
      toast.success("Match scheduled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.location || !formData.price) {
      toast.error("Please fill in all fields");
      return;
    }
    createMatch.mutate(formData);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Matches</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Schedule New Match</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter match location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Pitch Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter pitch price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMatch.isPending}>
                  {createMatch.isPending ? "Scheduling..." : "Schedule Match"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {matches?.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{format(new Date(`2000-01-01T${match.start_time}`), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>${match.pitch_price.toFixed(2)}</span>
                  </div>
                </div>
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
