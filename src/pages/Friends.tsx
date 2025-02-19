import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Check, X, Users, Search, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

const Friends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<Profile | null>(null);

  // Fetch friend requests
  const { data: friendRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          sender:profiles!friend_requests_sender_id_fkey(id, username, avatar_url)
        `)
        .eq('receiver_id', user?.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data as unknown as FriendRequest[];
    },
  });

  // Fetch friends
  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: friendships, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id_1,
          user_id_2,
          friend:profiles!friends_user_id_2_fkey(id, username, avatar_url)
        `)
        .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`);
      
      if (error) throw error;
      
      return friendships.map(friendship => ({
        ...friendship,
        friend: friendship.user_id_1 === user?.id ? friendship.friend : friendship.friend
      }));
    },
  });

  // Search users with loading state
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', searchUsername],
    queryFn: async () => {
      if (searchUsername.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchUsername}%`)
        .neq('id', user?.id)
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: searchUsername.length >= 3,
  });

  // Send friend request mutation
  const sendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user?.id,
          receiver_id: receiverId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
      setSearchUsername("");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Accept friend request mutation
  const acceptRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .rpc('accept_friend_request', { request_id: requestId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Decline friend request mutation
  const declineRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .rpc('decline_friend_request', { request_id: requestId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Friend request declined");
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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

        <TabsContent value="friends" className="space-y-4">
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
                  onChange={(e) => setSearchUsername(e.target.value)}
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
                      <span className="font-medium">{profile.username}</span>
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

          <Card>
            <CardHeader>
              <CardTitle>Your Friends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingFriends ? (
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
                      <span className="font-medium">{friendship.friend.username}</span>
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
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Friend Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {friendRequests?.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <span className="font-medium">{request.sender.username}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptRequest.mutate(request.id)}
                          disabled={acceptRequest.isPending}
                        >
                          {acceptRequest.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => declineRequest.mutate(request.id)}
                          disabled={declineRequest.isPending}
                        >
                          {declineRequest.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!friendRequests?.length && (
                    <p className="text-muted-foreground text-center py-8">
                      No pending friend requests.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedFriend && (
        <FriendProfile
          friend={selectedFriend}
          open={!!selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
};

export default Friends;
