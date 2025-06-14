
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { FriendsList } from "@/components/FriendsList";
import { FriendRequests } from "@/components/FriendRequests";
import { FriendSearch } from "@/components/FriendSearch";
import { UserProfile } from "@/components/UserProfile";
import { useFriends } from "@/hooks/useFriends";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Profile, FriendRequest } from "@/hooks/useFriends";

const Friends = () => {
  const { user } = useAuth();
  const { friends, loading } = useFriends();
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Search for users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', searchUsername],
    queryFn: async () => {
      if (searchUsername.length < 3) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchUsername}%`)
        .limit(10);
      
      if (error) throw error;
      return data as Profile[];
    },
    enabled: searchUsername.length >= 3,
  });

  // Fetch friend requests
  const { data: friendRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender:profiles!friend_requests_sender_id_fkey(id, username, avatar_url),
          status,
          created_at
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data as FriendRequest[];
    },
    enabled: !!user,
  });

  // Send friend request
  const sendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
      setSearchUsername('');
    },
    onError: (error) => {
      toast.error('Failed to send friend request');
      console.error(error);
    },
  });

  // Accept friend request
  const acceptRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase.rpc('accept_friend_request', {
        request_id: requestId,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request accepted!');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      toast.error('Failed to accept friend request');
      console.error(error);
    },
  });

  // Decline friend request
  const declineRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase.rpc('decline_friend_request', {
        request_id: requestId,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request declined');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error) => {
      toast.error('Failed to decline friend request');
      console.error(error);
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to manage your friends.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 space-y-6"
    >
      <h1 className="text-3xl font-bold text-center">Friends</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FriendSearch
          searchUsername={searchUsername}
          onSearchChange={setSearchUsername}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelectUser={setSelectedUserId}
          sendRequest={sendRequest}
        />
        
        <FriendRequests
          requests={friendRequests}
          isLoading={requestsLoading}
          onSelectUser={setSelectedUserId}
          acceptRequest={acceptRequest}
          declineRequest={declineRequest}
        />
      </div>

      <FriendsList
        friends={friends}
        isLoading={loading}
        onSelectUser={setSelectedUserId}
      />

      {selectedUserId && (
        <UserProfile
          userId={selectedUserId}
          open={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </motion.div>
  );
};

export default Friends;
