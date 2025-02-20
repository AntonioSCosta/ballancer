
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { FriendProfile } from "@/components/FriendProfile";

interface Friend {
  id: string;
  friend: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface FriendsListProps {
  friends: Friend[] | undefined;
  isLoading: boolean;
  onSelectUser: (userId: string) => void;
}

export const FriendsList = ({
  friends,
  isLoading,
  onSelectUser,
}: FriendsListProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend["friend"] | null>(null);

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              {friends?.map((friendship) => (
                <div
                  key={friendship.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <button
                    className="font-medium hover:underline"
                    onClick={() => onSelectUser(friendship.friend.id)}
                  >
                    {friendship.friend.username}
                  </button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedFriend(friendship.friend)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              ))}
              {!friends?.length && (
                <p className="text-muted-foreground text-center py-8">
                  You haven't added any friends yet.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFriend && (
        <FriendProfile
          friend={selectedFriend}
          open={!!selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </>
  );
};
