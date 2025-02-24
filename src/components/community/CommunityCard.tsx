
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Community {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
  members: { count: number }[];
}

interface CommunityCardProps {
  community: Community;
  index: number;
  onClick: (id: string) => void;
}

const CommunityCard = ({ community, index, onClick }: CommunityCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isCreator = user?.id === community.creator_id;

  const deleteCommunity = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', community.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      toast.success("Community deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete community: ${error.message}`);
    },
  });

  const leaveCommunity = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', community.id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
      toast.success("Left community successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to leave community: ${error.message}`);
    },
  });

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer relative group"
      onClick={() => onClick(community.id)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{community.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {community.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {community.members[0]?.count || 0}
            </span>
          </div>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {isCreator ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Community</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this community? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteCommunity.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Community</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this community?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => leaveCommunity.mutate()}
                  >
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
