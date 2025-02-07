
import { motion } from "framer-motion";
import SimplePlayerCard from "./SimplePlayerCard";
import { Team } from "@/utils/teamDistribution";

interface TeamDisplayProps {
  team: Team;
  index: number;
}

const TeamDisplay = ({ team, index }: TeamDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="flex flex-col gap-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Team {index + 1}
          </h2>
          <div className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold">
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
