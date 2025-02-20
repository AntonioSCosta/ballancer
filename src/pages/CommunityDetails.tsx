import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, Calendar, ArrowLeft, Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface CommunityMember {
  user_id: string;
  role: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface Match {
  id: string;
  scheduled_for: string;
  status: string;
  team1_players: any[];
  team2_players: any[];
}

interface CommunityMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    username: string;
  };
}

const CommunityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          members:community_members(count)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['community-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          user_id,
          role,
          profiles:profiles(username, avatar_url)
        `)
        .eq('community_id', id);
      
      if (error) throw error;
      return data as CommunityMember[];
    },
    enabled: !!id
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['community-messages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_community_messages', { community_id: id })
        .limit(50);
      
      if (error) throw error;
      return data as CommunityMessage[];
    },
    enabled: !!id
  });

  const { data: matches, isLoading: loadingMatches } = useQuery({
    queryKey: ['community-matches', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('community_id', id)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as Match[];
    },
    enabled: !!id
  });

  useEffect(() => {
    const channel = supabase.channel('community_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `community_id=eq.${id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['community-messages', id] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id, queryClient]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    try {
      const { error } = await supabase.rpc('send_community_message', {
        p_community_id: id,
        p_content: newMessage.trim()
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loadingCommunity || loadingMembers || loadingMatches || loadingMessages) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/communities")}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{community.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="matches">
            <Calendar className="w-4 h-4 mr-2" />
            Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">{message.sender.username}</p>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members?.map((member) => (
              <Card key={member.user_id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{member.profiles.username}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDetails;
