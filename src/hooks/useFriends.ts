
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface FriendRequest {
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

export const useFriends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchUsername, setSearchUsername] = useState("");

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
      return data as FriendRequest[];
    },
  });

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
      return data as Profile[];
    },
    enabled: searchUsername.length >= 3,
  });

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

  return {
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
  };
};
