
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
      <div className="bg-card rounded-xl shadow-elegant border border-border hover:shadow-glow transition-all duration-300 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">{index + 1}</span>
            </div>
            Team {index + 1}
          </h2>
          <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
            <span className="text-primary font-semibold text-sm">
              ⭐ {team.rating}
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          {team.players.map((player, playerIndex) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.2) + (playerIndex * 0.05) }}
            >
              <SimplePlayerCard player={player} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDisplay;
