
import { Player } from "./PlayerCard";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";

interface FootballFieldProps {
  players: Player[];
  teamName: string;
}

const getPositionCoordinates = (position: string, index: number, totalInPosition: number) => {
  const basePositions = {
    "Goalkeeper": { x: "10%", y: "50%" },
    "Defender": { x: "30%", y: "0" },
    "Midfielder": { x: "50%", y: "0" },
    "Forward": { x: "70%", y: "0" }
  };

  const position_y = ((index + 1) * (100 / (totalInPosition + 1))) + "%";
  
  return {
    x: basePositions[position as keyof typeof basePositions]?.x || "50%",
    y: position_y
  };
};

const getPlayersInPosition = (players: Player[], position: string) => {
  return players.filter(player => player.position === position);
};

export const FootballField = ({ players, teamName }: FootballFieldProps) => {
  const goalkeepers = getPlayersInPosition(players, "Goalkeeper");
  const defenders = getPlayersInPosition(players, "Defender");
  const midfielders = getPlayersInPosition(players, "Midfielder");
  const forwards = getPlayersInPosition(players, "Forward");

  return (
    <div className="relative w-full aspect-[3/2] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20">
      {/* Field markings */}
      <div className="absolute inset-0">
        {/* Main outline */}
        <div className="absolute w-full h-full border-2 border-white/40" />
        
        {/* Penalty area (33% width, 56% height) */}
        <div className="absolute w-[33%] h-[56%] left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        
        {/* Goal area (15% width, 25% height) */}
        <div className="absolute w-[15%] h-[25%] left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        
        {/* Half way line */}
        <div className="absolute right-0 top-0 bottom-0 border-2 border-white/40" />
        
        {/* Center circle - Now a proper semicircle with half the size */}
        <div className="absolute w-[25%] aspect-square -right-[12.5%] top-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full" />
        
        {/* Penalty arc - Now starts from penalty box line and shifted right */}
        <div className="absolute w-[33%] aspect-square left-[5%] top-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full 
                      [clip-path:polygon(50%_22%,100%_22%,100%_78%,50%_78%)]" />
        
        {/* Corner arcs */}
        <div className="absolute w-[5%] h-[3%] left-0 top-0 border-r-2 border-b-2 border-white/40 rounded-br-full" />
        <div className="absolute w-[5%] h-[3%] left-0 bottom-0 border-r-2 border-t-2 border-white/40 rounded-tr-full" />
      </div>

      {/* Team name */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
        <span className="text-white text-sm font-medium">{teamName}</span>
      </div>

      {/* Players */}
      {[
        { players: goalkeepers, position: "Goalkeeper" },
        { players: defenders, position: "Defender" },
        { players: midfielders, position: "Midfielder" },
        { players: forwards, position: "Forward" }
      ].map(({ players: positionPlayers, position }) => (
        positionPlayers.map((player, index) => {
          const coords = getPositionCoordinates(position, index, positionPlayers.length);
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: coords.x, top: coords.y }}
            >
              <div className="relative group">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                  <AvatarImage src={player.photo} alt={player.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {player.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {player.name}
                </div>
              </div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
};
