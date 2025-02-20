
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Loader2 } from "lucide-react";
import type { Profile } from "@/hooks/useFriends";
import { UseMutationResult } from "@tanstack/react-query";

interface FriendSearchProps {
  searchUsername: string;
  onSearchChange: (value: string) => void;
  searchResults: Profile[] | undefined;
  isSearching: boolean;
  onSelectUser: (userId: string) => void;
  sendRequest: UseMutationResult<void, Error, string>;
}

export const FriendSearch = ({
  searchUsername,
  onSearchChange,
  searchResults,
  isSearching,
  onSelectUser,
  sendRequest,
}: FriendSearchProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by username..."
            value={searchUsername}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {isSearching && searchUsername.length >= 3 && (
          <div className="flex justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {searchResults && searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <button
                  className="font-medium hover:underline"
                  onClick={() => onSelectUser(profile.id)}
                >
                  {profile.username}
                </button>
                <Button
                  size="sm"
                  onClick={() => sendRequest.mutate(profile.id)}
                  disabled={sendRequest.isPending}
                >
                  {sendRequest.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
