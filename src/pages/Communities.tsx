
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import CreateCommunityDialog from "@/components/community/CreateCommunityDialog";
import CommunityCard from "@/components/community/CommunityCard";
import { Loader2 } from "lucide-react";

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

  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['user-communities'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching communities for user:", user.id);
      
      // Get communities where the user is a member
      const { data: userCommunities, error } = await supabase
        .from('community_members')
        .select(`
          community_id,
          community:communities(
            id,
            name,
            description,
            creator_id,
            created_at,
            image_url,
            members:community_members(count)
          )
        `)
        .eq('user_id', user.id);
  
      if (error) {
        console.error("Error fetching communities:", error);
        throw error;
      }
      
      console.log("Received user communities data:", userCommunities);
      
      // Extract communities correctly
      const extractedCommunities = userCommunities
        .filter(uc => uc.community) // Filter out null values
        .map(uc => uc.community) as Community[];
        
      console.log("Extracted communities:", extractedCommunities);
      return extractedCommunities;
    },
    enabled: !!user?.id
  });

  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id_1,
          user_id_2,
          friend:profiles!friends_user_id_2_fkey(id, username)
        `)
        .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);
      
      if (error) throw error;
      
      return data.map(friendship => ({
        ...friendship,
        friend: friendship.user_id_1 === user.id ? friendship.friend : friendship.friend
      })) as Friend[];
    },
    enabled: !!user?.id
  });

  const handleCommunityClick = (communityId: string) => {
    navigate(`/communities/${communityId}`);
  };

  if (error) {
    console.error("Error in Communities component:", error);
    return (
      <div className="container px-4 sm:px-6 max-w-6xl mx-auto py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Error Loading Communities</h1>
        <p className="text-red-500">There was an error loading your communities. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 max-w-6xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Communities</h1>
          <p className="text-sm text-muted-foreground">Join or create communities to organize matches</p>
        </div>
        <CreateCommunityDialog friends={friends} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : communities && communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {communities.map((community, index) => (
            <CommunityCard
              key={community.id}
              community={community}
              index={index}
              onClick={handleCommunityClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No communities yet</h3>
          <p className="text-muted-foreground mb-4">Create your first community to get started</p>
        </div>
      )}
    </div>
  );
};

export default Communities;
