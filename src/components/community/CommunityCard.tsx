
import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    members: {
      count: number;
    }[];
  };
  index: number;
  onClick: (id: string) => void;
}

const CommunityCard = ({ community, index, onClick }: CommunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onClick(community.id)}
      className="cursor-pointer"
    >
      <Card className="hover:shadow-lg transition-shadow">
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
    </motion.div>
  );
};

export default CommunityCard;
