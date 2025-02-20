
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";
import { FriendSearch } from "@/components/FriendSearch";
import { FriendsList } from "@/components/FriendsList";
import { FriendRequests } from "@/components/FriendRequests";
import { UserProfile } from "@/components/UserProfile";

const Friends = () => {
  const {
    searchUsername,
    setSearchUsername,
    searchResults,
    isSearching,
    friends,
    isLoadingFriends,
    friendRequests,
    isLoadingRequests,
    sendRequest,
    acceptRequest,
    declineRequest,
  } = useFriends();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">
            <Users className="w-4 h-4 mr-2" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="requests">
            <UserPlus className="w-4 h-4 mr-2" />
            Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendSearch
            searchUsername={searchUsername}
            onSearchChange={setSearchUsername}
            searchResults={searchResults}
            isSearching={isSearching}
            onSelectUser={setSelectedUserId}
            sendRequest={sendRequest}
          />
          <FriendsList
            friends={friends}
            isLoading={isLoadingFriends}
            onSelectUser={setSelectedUserId}
          />
        </TabsContent>

        <TabsContent value="requests">
          <FriendRequests
            requests={friendRequests}
            isLoading={isLoadingRequests}
            onSelectUser={setSelectedUserId}
            acceptRequest={acceptRequest}
            declineRequest={declineRequest}
          />
        </TabsContent>
      </Tabs>

      {selectedUserId && (
        <UserProfile
          userId={selectedUserId}
          open={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default Friends;
