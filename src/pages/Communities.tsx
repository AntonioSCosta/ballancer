import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

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
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { data: communities, isLoading } = useQuery({
    queryKey: ['user-communities'],
    queryFn: async () => {
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

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
  });

  const createCommunity = useMutation({
    mutationFn: async ({ communityData, memberIds }: { communityData: typeof newCommunity, memberIds: string[] }) => {
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          creator_id: user?.id,
        })
        .select()
        .single();
      
      if (communityError) throw communityError;

      const { error: creatorError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user?.id,
          role: 'admin'
        });
      
      if (creatorError) throw creatorError;

      if (memberIds.length > 0) {
        const membersToAdd = memberIds.map(memberId => ({
          community_id: community.id,
          user_id: memberId,
          role: 'member'
        }));

        const { error: membersError } = await supabase
          .from('community_members')
          .insert(membersToAdd);
        
        if (membersError) throw membersError;
      }

      return community;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      setIsCreating(false);
      setNewCommunity({ name: "", description: "" });
      setSelectedFriends([]);
      toast.success("Community created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCommunity.mutate({
      communityData: newCommunity,
      memberIds: selectedFriends,
    });
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

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
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
                <DialogDescription>
                  Create a new community to organize matches and connect with players
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter community name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your community"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invite Friends</Label>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-2">
                      {friends?.map((friendship) => (
                        <div
                          key={friendship.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={selectedFriends.includes(friendship.friend.id)}
                            onCheckedChange={() => toggleFriend(friendship.friend.id)}
                          />
                          <Label>{friendship.friend.username}</Label>
                        </div>
                      ))}
                      {!friends?.length && (
                        <p className="text-sm text-muted-foreground">
                          Add friends to invite them to your community
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createCommunity.isPending}
                >
                  {createCommunity.isPending ? "Creating..." : "Create Community"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {communities?.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleCommunityClick(community.id)}
            className="cursor-pointer"
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{community.name}</CardTitle>
                <CardDescription className="line-clamp-2">{community.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {community.members[0]?.count || 0} members
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(community.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Communities;
