import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Player, PlayerPosition } from "@/types/player";
import { AttributeBar } from "./player/AttributeBar";
import { PlayerStatsDisplay } from "./player/PlayerStats";
import { getPlayerStats, calculateWinRate, getInitials, getAttributes } from "@/utils/playerCardUtils";
import { User } from "lucide-react";
interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  className?: string;
}
export const PlayerCard = ({
  player,
  className = ""
}: PlayerCardProps) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const handleEdit = () => {
    navigate("/", {
      state: {
        player
      }
    });
  };
  const stats = getPlayerStats(player.id);
  const winRate = calculateWinRate(stats);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 20
  }} whileHover={{
    y: -5
  }} transition={{
    duration: 0.2
  }} className={`bg-card rounded-xl shadow-elegant border border-border hover:shadow-glow hover:border-primary/20 overflow-hidden transition-all duration-300 ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        {player.photo && player.photo !== "https://via.placeholder.com/300" ? <img src={player.photo} alt={player.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center bg-muted/50">
            <User className="w-32 h-32 text-muted-foreground" />
          </div>}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1.5 rounded-full shadow-glow backdrop-blur-sm border border-white/20">
          <span className="text-sm font-bold">⭐ {Math.round(player.rating)}</span>
        </div>
        {/* Position indicator */}
        <div className="absolute top-3 left-3 bg-card/95 text-card-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-elegant backdrop-blur-sm border border-border">
          {player.position}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%]">
            <h3 className="text-xl font-bold text-card-foreground truncate mb-2">
              {player.name}
            </h3>
            
          </div>
          <div className="flex gap-2">
            <button onClick={handleEdit} className="w-9 h-9 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent-foreground hover:text-accent border border-accent/20 transition-all duration-200 flex items-center justify-center group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        </div>
        
        {showStats ? <PlayerStatsDisplay stats={stats} winRate={winRate} /> : <div className="grid grid-cols-2 gap-3">
            {getAttributes(player).map((attr, index) => <div key={attr.label} className={index % 2 === 0 ? "col-span-1" : "col-span-1"}>
                <AttributeBar label={attr.label} value={attr.value} />
              </div>)}
          </div>}
      </div>
    </motion.div>;
};
export type { Player, PlayerPosition };