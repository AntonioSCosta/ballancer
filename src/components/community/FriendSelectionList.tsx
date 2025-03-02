
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
  };
}

interface FriendSelectionListProps {
  friends?: Friend[];
  selectedFriends: string[];
  toggleFriend: (friendId: string) => void;
}

const FriendSelectionList = ({ 
  friends, 
  selectedFriends, 
  toggleFriend 
}: FriendSelectionListProps) => {
  return (
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
  );
};

export default FriendSelectionList;
