
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CommunityMember {
  user_id: string;
  role: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommunityMembersProps {
  communityId: string;
}

export const CommunityMembers = ({ communityId }: CommunityMembersProps) => {
  const { data: members } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          user_id,
          role,
          profiles:profiles(username, avatar_url)
        `)
        .eq('community_id', communityId);
      
      if (error) throw error;
      return data as CommunityMember[];
    },
    enabled: !!communityId
  });

  return (
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
  );
};
