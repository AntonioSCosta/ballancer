
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    username: string;
  };
}

interface CommunityChatProps {
  communityId: string;
}

export const CommunityChat = ({ communityId }: CommunityChatProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  const { data: messages } = useQuery({
    queryKey: ['community-messages', communityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          sender:profiles!sender_id(username)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!communityId
  });

  
  useEffect(() => {
    const channel = supabase.channel('community_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['community-messages', communityId] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [communityId, queryClient]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    try {
      const { error } = await supabase
        .from('community_messages')
        .insert({
          content: newMessage.trim(),
          community_id: communityId,
          sender_id: user.id
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <ScrollArea className="h-[400px]">
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
                  <p className="text-xs font-medium mb-1">{message.sender.username}</p>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
