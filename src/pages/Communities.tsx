
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
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { data: communities, isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*, members:community_members(count)');
      
      if (error) throw error;
      return data as Community[];
    },
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
      // Create community
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          creator_id: user?.id,
        })
        .select()
        .single();
      
      if (communityError) throw communityError;

      // Add members
      if (memberIds.length > 0) {
        const { error: membersError } = await supabase
          .from('community_members')
          .insert(
            memberIds.map(memberId => ({
              community_id: community.id,
              user_id: memberId,
            }))
          );
        
        if (membersError) throw membersError;
      }

      return community;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
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

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">Join or create communities to organize matches</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities?.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {community.name}
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                </CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
