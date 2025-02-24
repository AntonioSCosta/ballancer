
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Player } from "@/types/player";
import { AttributeBar } from "./player/AttributeBar";
import { PlayerStatsDisplay } from "./player/PlayerStats";
import { getPlayerStats, calculateWinRate, getInitials, getAttributes } from "@/utils/playerCardUtils";

interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  className?: string;
}

export const PlayerCard = ({ player, className = "" }: PlayerCardProps) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  const handleEdit = () => {
    navigate("/", { state: { player } });
  };

  const stats = getPlayerStats(player.id);
  const winRate = calculateWinRate(stats);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="relative aspect-square overflow-hidden">
        {player.photo && player.photo !== "https://via.placeholder.com/300" ? (
          <img
            src={player.photo}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-500">
            <span className="text-4xl font-bold text-white">
              {getInitials(player.name)}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-medium">{Math.round(player.rating)}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-[80%]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {player.name}
            </h3>
            <span className="text-sm text-primary font-medium">
              {player.position}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        </div>
        
        {showStats ? (
          <PlayerStatsDisplay stats={stats} winRate={winRate} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {getAttributes(player).map((attr, index) => (
              <div key={attr.label} className={index % 2 === 0 ? "col-span-1" : "col-span-1"}>
                <AttributeBar
                  label={attr.label}
                  value={attr.value}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
