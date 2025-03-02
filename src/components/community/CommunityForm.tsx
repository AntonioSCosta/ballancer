
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import FriendSelectionList from "./FriendSelectionList";

interface CommunityFormProps {
  friends?: Friend[];
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  communityData: {
    name: string;
    description: string;
  };
  setCommunityData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
  }>>;
  selectedFriends: string[];
  toggleFriend: (friendId: string) => void;
}

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
  };
}

const CommunityForm = ({
  friends,
  isPending,
  onSubmit,
  communityData,
  setCommunityData,
  selectedFriends,
  toggleFriend
}: CommunityFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={communityData.name}
            onChange={(e) => setCommunityData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter community name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={communityData.description}
            onChange={(e) => setCommunityData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your community"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Invite Friends</Label>
          <FriendSelectionList 
            friends={friends}
            selectedFriends={selectedFriends}
            toggleFriend={toggleFriend}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : "Create Community"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CommunityForm;
