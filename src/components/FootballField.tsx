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
    "Midfielder": { x: "55%", y: "0" },
    "Forward": { x: "75%", y: "0" }
  };

  let position_y;
  if (totalInPosition === 1) {
    position_y = "50%";
  } else if (totalInPosition === 2) {
    position_y = `${30 + (index * 40)}%`;
  } else if (totalInPosition === 3) {
    position_y = `${20 + (index * 30)}%`;
  } else if (totalInPosition === 4) {
    position_y = `${15 + (index * 23)}%`;
  } else {
    position_y = `${10 + (index * ((80) / (totalInPosition - 1)))}%`;
  }
  
  return {
    x: basePositions[position as keyof typeof basePositions]?.x || "50%",
    y: `calc(${position_y} - 16px)`
  };
};

const getPositionColor = (position: string) => {
  const colors = {
    "Goalkeeper": "bg-orange-500",
    "Defender": "bg-blue-500",
    "Midfielder": "bg-purple-500",
    "Forward": "bg-emerald-500"
  };
  return colors[position as keyof typeof colors] || "bg-gray-500";
};

const determinePlayerPosition = (player: Player, defenders: number, midfielders: number) => {
  if (player.position === "Goalkeeper") return "Goalkeeper";
  
  if (player.position === "Defender") return "Defender";
  
  if (defenders < 3 && player.secondaryPosition === "Defender") {
    return "Defender";
  }
  
  if (player.position === "Midfielder" && midfielders < 5) {
    return "Midfielder";
  }
  
  if (player.secondaryPosition === "Midfielder" && midfielders < 5) {
    return "Midfielder";
  }
  
  return player.position;
};

const getPlayersInPosition = (players: Player[], targetPosition: string, neededDefenders: number, neededMidfielders: number) => {
  return players.filter(player => {
    const assignedPosition = determinePlayerPosition(player, neededDefenders, neededMidfielders);
    return assignedPosition === targetPosition;
  });
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const FootballField = ({ players }: FootballFieldProps) => {
  const currentDefenders = players.filter(p => p.position === "Defender").length;
  const currentMidfielders = players.filter(p => p.position === "Midfielder").length;
  
  const goalkeepers = getPlayersInPosition(players, "Goalkeeper", currentDefenders, currentMidfielders);
  const defenders = getPlayersInPosition(players, "Defender", currentDefenders, currentMidfielders);
  const midfielders = getPlayersInPosition(players, "Midfielder", currentDefenders, currentMidfielders);
  const forwards = getPlayersInPosition(players, "Forward", currentDefenders, currentMidfielders);

  return (
    <div className="relative w-full aspect-[3/2] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20">
      <div className="absolute inset-0">
        <div className="absolute w-full h-full border-2 border-white/40" />
        <div className="absolute w-[33%] h-[56%] left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        <div className="absolute w-[15%] h-[25%] left-0 top-1/2 -translate-y-1/2 border-2 border-white/40" />
        <div className="absolute right-0 top-0 bottom-0 border-2 border-white/40" />
        <div className="absolute w-[25%] aspect-square -right-[12.5%] top-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full" />
        <div className="absolute w-[33%] aspect-square left-[10px] top-1/2 -translate-y-1/2 border-2 border-white/40 rounded-full 
                      [clip-path:polygon(33%_22%,100%_22%,100%_78%,33%_78%)]" />
        <div className="absolute w-[5%] h-[3%] left-0 top-0 border-r-2 border-b-2 border-white/40 rounded-br-full" />
        <div className="absolute w-[5%] h-[3%] left-0 bottom-0 border-r-2 border-t-2 border-white/40 rounded-tr-full" />
      </div>

      {[
        { players: goalkeepers, position: "Goalkeeper" },
        { players: defenders, position: "Defender" },
        { players: midfielders, position: "Midfielder" },
        { players: forwards, position: "Forward" }
      ].map(({ players: positionPlayers, position }) => (
        positionPlayers.map((player, index) => {
          const coords = getPositionCoordinates(position, index, positionPlayers.length);
          const yPosition = parseInt(coords.y);
          const tooltipPosition = yPosition < 30 ? "bottom" : "top";
          const assignedPosition = determinePlayerPosition(player, currentDefenders, currentMidfielders);

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
                <Avatar className={`h-8 w-8 border-2 border-white shadow-lg ${getPositionColor(assignedPosition)}`}>
                  <AvatarFallback className={`text-[10px] font-semibold text-white ${getPositionColor(assignedPosition)}`}>
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute ${
                    tooltipPosition === "top" ? "-top-8" : "top-10"
                  } left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50`}
                >
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
