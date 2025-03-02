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
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!membership,
  });

  const leaveCommunity = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error("Missing community ID or user ID");
      console.log("Attempting to leave community...");
      
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
      toast.error(error.message || "Failed to leave community");
    }
  });

  const deleteCommunity = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error("Missing community ID or user ID");
      console.log("Starting community deletion process for ID:", id);
      
      const [{ error: membersError }, { error: messagesError }, { error: matchesError }] = await Promise.all([
        supabase.from('community_members').delete().eq('community_id', id),
        supabase.from('community_messages').delete().eq('community_id', id),
        supabase.from('matches').delete().eq('community_id', id),
      ]);

      if (membersError) throw membersError;
      if (messagesError) throw messagesError;
      if (matchesError) throw matchesError;
      
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
      toast.error(error.message || "Failed to delete community");
    }
  });

  if (membershipLoading || communityLoading) {
    return <div className="flex justify-center items-center min-h-[200px]"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!membership || !community) return null;

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/communities")} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">{community.name}</h1>
        <Button variant="destructive" onClick={() => deleteCommunity.mutate()}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat"><MessageCircle className="w-4 h-4" /> Chat</TabsTrigger>
          <TabsTrigger value="members"><Users className="w-4 h-4" /> Members</TabsTrigger>
          <TabsTrigger value="matches"><Calendar className="w-4 h-4" /> Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="chat"><CommunityChat communityId={id!} /></TabsContent>
        <TabsContent value="members"><CommunityMembers communityId={id!} /></TabsContent>
        <TabsContent value="matches"><CommunityMatches communityId={id!} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDetails;