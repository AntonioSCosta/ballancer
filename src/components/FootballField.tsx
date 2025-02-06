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
    <div className="relative w-full aspect-[2/3] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20">
      {/* Field markings */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full border-2 border-white/40" />
        <div className="absolute w-1/3 h-1/6 left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        <div className="absolute w-20 h-32 left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        <div className="absolute w-full h-full">
          <div className="absolute w-40 h-40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-2 border-white/40" />
        </div>
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