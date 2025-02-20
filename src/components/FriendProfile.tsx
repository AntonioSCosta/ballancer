
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Send, MessageCircle, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

interface FriendProfileProps {
  friend: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  open: boolean;
  onClose: () => void;
}

export const FriendProfile = ({ friend, open, onClose }: FriendProfileProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [showUnfriendDialog, setShowUnfriendDialog] = useState(false);
  const [channel, setChannel] = useState<any>(null);

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', friend.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user && !!friend.id && user.id !== friend.id,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("You must be logged in to send messages");
      if (user.id === friend.id) throw new Error("You cannot send messages to yourself");

      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: user.id,
          receiver_id: friend.id,
        });

      if (error) {
        if (error.message.includes('messages_sender_receiver_different')) {
          throw new Error("You cannot send messages to yourself");
        }
        throw error;
      }
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['messages', friend.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Unfriend mutation
  const unfriend = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id_1.eq.${user?.id},user_id_2.eq.${friend.id}),and(user_id_1.eq.${friend.id},user_id_2.eq.${user?.id})`);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      onClose();
      toast.success(`Unfriended ${friend.username}`);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Handle real-time updates
  useEffect(() => {
    if (!open || !user || !friend.id || user.id === friend.id) return;

    const channel = supabase.channel('chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${friend.id},receiver_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages', friend.id] });
        }
      )
      .subscribe();

    setChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [open, friend.id, user?.id, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage.mutate(newMessage.trim());
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with {friend.username}
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowUnfriendDialog(true)}
              >
                <UserMinus className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] pr-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {!messages?.length && (
                      <p className="text-center text-muted-foreground py-4">
                        No messages yet. Start the conversation!
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={sendMessage.isPending || user?.id === friend.id}>
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnfriendDialog} onOpenChange={setShowUnfriendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfriend {friend.username}</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {friend.username} from your friends list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => unfriend.mutate()}
              disabled={unfriend.isPending}
            >
              {unfriend.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Unfriending...
                </>
              ) : (
                'Unfriend'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
