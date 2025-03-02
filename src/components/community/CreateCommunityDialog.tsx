
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import CommunityForm from "./CommunityForm";
import { createCommunityWithMembers, CommunityData } from "@/services/communityService";

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
  const [newCommunity, setNewCommunity] = useState<CommunityData>({
    name: "",
    description: "",
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const createCommunity = useMutation({
    mutationFn: async ({ communityData, memberIds }: { communityData: CommunityData, memberIds: string[] }) => {
      if (!user?.id) {
        console.error("User ID is undefined");
        toast.error("You must be logged in to create a community");
        throw new Error("User ID is missing");
      }
  
      console.log("Creating community with user ID:", user.id);
      return createCommunityWithMembers(user.id, communityData, memberIds);
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
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
          <DialogDescription>
            Create a new community to organize matches and connect with players
          </DialogDescription>
        </DialogHeader>
        <CommunityForm
          friends={friends}
          isPending={createCommunity.isPending}
          onSubmit={handleCreate}
          communityData={newCommunity}
          setCommunityData={setNewCommunity}
          selectedFriends={selectedFriends}
          toggleFriend={toggleFriend}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;
