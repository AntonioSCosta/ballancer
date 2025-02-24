
import { motion } from "framer-motion";
import { Users, Calendar, Trash2, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    creator_id: string;
    members: {
      count: number;
    }[];
  };
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onClick(community.id)}
      >
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">{community.name}</CardTitle>
          <CardDescription className="line-clamp-2">{community.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {community.members[0]?.count || 0} members
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(community.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
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
    </motion.div>
  );
};

export default CommunityCard;
