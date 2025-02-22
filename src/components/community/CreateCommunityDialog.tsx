
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
  };
}

interface CreateCommunityDialogProps {
  friends?: Friend[];
}

const CreateCommunityDialog = ({ friends }: CreateCommunityDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const createCommunity = useMutation({
    mutationFn: async ({ communityData, memberIds }: { communityData: typeof newCommunity, memberIds: string[] }) => {
      if (!user?.id) {
        throw new Error("You must be logged in to create a community");
      }

      // First create the community
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          creator_id: user.id,
        })
        .select()
        .single();
      
      if (communityError) {
        console.error("Error creating community:", communityError);
        throw new Error("Failed to create community");
      }

      // Add creator as admin member
      const { error: creatorError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.id,
          role: 'admin'
        });
      
      if (creatorError) {
        console.error("Error adding creator as member:", creatorError);
        throw new Error("Failed to add creator as member");
      }

      // Add selected friends as members if any
      if (memberIds.length > 0) {
        const membersToAdd = memberIds.map(memberId => ({
          community_id: community.id,
          user_id: memberId,
          role: 'member'
        }));

        const { error: membersError } = await supabase
          .from('community_members')
          .insert(membersToAdd);
        
        if (membersError) {
          console.error("Error adding members:", membersError);
          throw new Error("Failed to add members");
        }
      }

      return community;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      setIsOpen(false);
      setNewCommunity({ name: "", description: "" });
      setSelectedFriends([]);
      toast.success("Community created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Community creation error:", error);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to create a community");
      return;
    }
    
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};

export default CreateCommunityDialog;
