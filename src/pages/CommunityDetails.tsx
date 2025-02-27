
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Users, 
  Calendar, 
  ArrowLeft, 
  MessageCircle, 
  LogOut, 
  Trash2, 
  CalendarCheck 
} from "lucide-react";
import { toast } from "sonner";
import { CommunityChat } from "@/components/community/CommunityChat";
import { CommunityMembers } from "@/components/community/CommunityMembers";
import { CommunityMatches } from "@/components/community/CommunityMatches";
import { useAuth } from "@/components/AuthProvider";

const CommunityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: membership, isLoading: membershipLoading } = useQuery({
    queryKey: ['community-membership', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', id)
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user?.id,
  });

  // Immediately redirect if not a member
  useEffect(() => {
    if (!membershipLoading && !membership) {
      toast.error("You are not a member of this community");
      navigate('/communities');
    }
  }, [membership, membershipLoading, navigate]);

  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          members:community_members(count),
          creator_id
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!membership // Only fetch if user is a member
  });

  // Check if there are any scheduled matches
  const { data: scheduledMatches } = useQuery({
    queryKey: ['community-scheduled-matches', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .eq('community_id', id)
        .eq('status', 'scheduled');
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!membership
  });

  const hasScheduledMatches = scheduledMatches && scheduledMatches.length > 0;

  const leaveCommunity = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) {
        throw new Error("Missing community ID or user ID");
      }
      
      // Delete the community membership
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Successfully left the community");
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      navigate('/communities');
    },
    onError: (error: any) => {
      console.error("Error leaving community:", error);
      toast.error(error.message || "Failed to leave community");
    }
  });

  const deleteCommunity = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) {
        throw new Error("Missing community ID or user ID");
      }

      // First delete all community_members
      const { error: membersError } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', id);

      if (membersError) throw membersError;

      // Delete all community messages
      const { error: messagesError } = await supabase
        .from('community_messages')
        .delete()
        .eq('community_id', id);

      if (messagesError) throw messagesError;

      // Delete all matches for this community
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .eq('community_id', id);

      if (matchesError) throw matchesError;

      // Finally delete the community itself
      const { error: communityError } = await supabase
        .from('communities')
        .delete()
        .eq('id', id);

      if (communityError) throw communityError;
    },
    onSuccess: () => {
      toast.success("Community deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      navigate('/communities');
    },
    onError: (error: any) => {
      console.error("Error deleting community:", error);
      toast.error(error.message || "Failed to delete community");
    }
  });

  const handleLeaveCommunity = () => {
    if (community?.creator_id === user?.id) {
      toast.error("Community creators cannot leave their own community");
      return;
    }
    
    if (confirm("Are you sure you want to leave this community?")) {
      leaveCommunity.mutate();
    }
  };

  const handleDeleteCommunity = () => {
    if (confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      deleteCommunity.mutate();
    }
  };

  if (membershipLoading || communityLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!membership || !community) {
    return null;
  }

  const isCreator = user?.id === community.creator_id;

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
        
        <div className="flex gap-2">
          {isCreator ? (
            <Button 
              variant="destructive" 
              onClick={handleDeleteCommunity}
              disabled={deleteCommunity.isPending}
              className="gap-2"
            >
              {deleteCommunity.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Community
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              onClick={handleLeaveCommunity}
              disabled={leaveCommunity.isPending}
              className="gap-2"
            >
              {leaveCommunity.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Leave Community
            </Button>
          )}
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
          <TabsTrigger value="matches" className="relative">
            <Calendar className="w-4 h-4 mr-2" />
            Matches
            {hasScheduledMatches && (
              <CalendarCheck className="w-4 h-4 absolute -top-1 -right-1 text-green-500" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <CommunityChat communityId={id!} />
        </TabsContent>

        <TabsContent value="members">
          <CommunityMembers communityId={id!} />
        </TabsContent>

        <TabsContent value="matches">
          <CommunityMatches communityId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDetails;
