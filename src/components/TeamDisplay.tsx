
import { motion } from "framer-motion";
import SimplePlayerCard from "./SimplePlayerCard";
import { Team } from "@/utils/teamDistribution";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamDisplayProps {
  team: Team;
  index: number;
}

const TeamDisplay = ({ team, index }: TeamDisplayProps) => {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="flex flex-col gap-4"
    >
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'} mb-4`}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 dark:text-gray-100`}>
            Team {index + 1}
          </h2>
          <div className={`${isMobile ? 'px-2 py-1' : 'px-3 py-1'} bg-primary/10 rounded-full ${isMobile ? 'self-start' : ''}`}>
            <span className={`text-primary font-semibold ${isMobile ? 'text-sm' : ''}`}>
              Rating: {team.rating}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {team.players.map((player) => (
            <SimplePlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDisplay;
