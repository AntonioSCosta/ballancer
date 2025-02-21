
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import CreateCommunityDialog from "@/components/community/CreateCommunityDialog";
import CommunityCard from "@/components/community/CommunityCard";

interface Community {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
  image_url: string | null;
  members: {
    count: number;
  }[];
}

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
  };
}

const Communities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: communities, isLoading } = useQuery({
    queryKey: ['user-communities'],
    queryFn: async () => {
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      if (!memberData?.length) return [];

      const communityIds = memberData.map(m => m.community_id);

      const { data, error } = await supabase
        .from('communities')
        .select('*, members:community_members(count)')
        .in('id', communityIds);
      
      if (error) throw error;
      return data as Community[];
    },
    enabled: !!user?.id
  });

  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id_1,
          user_id_2,
          friend:profiles!friends_user_id_2_fkey(id, username)
        `)
        .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`);
      
      if (error) throw error;
      
      return data.map(friendship => ({
        ...friendship,
        friend: friendship.user_id_1 === user?.id ? friendship.friend : friendship.friend
      })) as Friend[];
    },
    enabled: !!user?.id
  });

  const handleCommunityClick = (communityId: string) => {
    navigate(`/communities/${communityId}`);
  };

  return (
    <div className="container px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Communities</h1>
          <p className="text-sm text-muted-foreground">Join or create communities to organize matches</p>
        </div>
        <CreateCommunityDialog friends={friends} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {communities?.map((community, index) => (
          <CommunityCard
            key={community.id}
            community={community}
            index={index}
            onClick={handleCommunityClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Communities;
