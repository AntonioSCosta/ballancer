
import { Player } from "./PlayerCard";
import { motion } from "framer-motion";
import { determinePlayerPosition } from "@/utils/positionUtils";

interface FootballFieldProps {
  players: Player[];
  teamName: string;
  rotate?: boolean;
}

const getPositionCoordinates = (position: string, index: number, totalInPosition: number, rotate: boolean) => {
  const basePositions = {
    "Goalkeeper": { x: "50%", y: "10%" },
    "Defender": { x: "0", y: "30%" },
    "Midfielder": { x: "0", y: "55%" },
    "Forward": { x: "0", y: "75%" }
  };

  // Calculate horizontal spacing based on the number of players
  let position_x;
  if (totalInPosition === 1) {
    position_x = "50%"; // Center the player if there's only one
  } else if (totalInPosition === 2) {
    position_x = `${30 + (index * 40)}%`; // 30% and 70% for 2 players
  } else if (totalInPosition === 3) {
    const positions = [25, 55, 85]; // 20%, 50%, 80% for 3 players
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 4) {
    const positions = [10, 40, 60, 90]; // 10%, 40%, 60%, 90% for 4 players
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 5) {
    const positions = [10, 26, 42, 58, 74, 90]; // 10%, 26%, 42%, 58%, 74%, 90% for 5 players
    position_x = `${positions[index]}%`;
  } else {
    // Fallback for more than 5 players: evenly distribute across 80% of the field width
    const spacingPercentage = 80 / (totalInPosition - 1);
    position_x = `${10 + (index * spacingPercentage)}%`;
  }

  return {
    x: `calc(${position_x} - 8px)`, // Adjust for the player's size
    y: basePositions[position as keyof typeof basePositions]?.y || "50%"
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

const getPlayersInPosition = (players: Player[], targetPosition: string, neededDefenders: number, neededMidfielders: number) => {
  return players.filter(player => {
    const assignedPosition = determinePlayerPosition(player, neededDefenders, neededMidfielders);
    return assignedPosition === targetPosition;
  });
};

export const FootballField = ({ players, rotate = false }: FootballFieldProps) => {
  const currentDefenders = players.filter(p => p.position === "Defender").length;
  const currentMidfielders = players.filter(p => p.position === "Midfielder").length;
  
  const goalkeepers = getPlayersInPosition(players, "Goalkeeper", currentDefenders, currentMidfielders);
  const defenders = getPlayersInPosition(players, "Defender", currentDefenders, currentMidfielders);
  const midfielders = getPlayersInPosition(players, "Midfielder", currentDefenders, currentMidfielders);
  const forwards = getPlayersInPosition(players, "Forward", currentDefenders, currentMidfielders);

  return (
    <div className={`relative w-full aspect-[2/2.25] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20 ${rotate ? 'rotate-180' : ''}`}>
      <div className="absolute inset-0">
        <div className="absolute w-full h-full border-2 border-white/40" />
        <div className="absolute h-[33%] w-[56%] top-0 left-1/2 -translate-x-1/2 border-2 border-white/40" />
        <div className="absolute h-[15%] w-[25%] top-0 left-1/2 -translate-x-1/2 border-2 border-white/40" />
        <div className="absolute bottom-0 left-0 right-0 border-2 border-white/40" />
        <div className="absolute h-[25%] aspect-square -bottom-[12.5%] left-1/2 -translate-x-1/2 border-2 border-white/40 rounded-full" />
        <div className="absolute h-[33%] aspect-square top-[10px] left-1/2 -translate-x-1/2 border-2 border-white/40 rounded-full 
                      [clip-path:polygon(22%_33%,22%_100%,78%_100%,78%_33%)]" />
        <div className="absolute h-[5%] w-[3%] top-0 left-0 border-b-2 border-r-2 border-white/40 rounded-br-full" />
        <div className="absolute h-[5%] w-[3%] top-0 right-0 border-b-2 border-l-2 border-white/40 rounded-bl-full" />
      </div>

      {[
        { players: goalkeepers, position: "Goalkeeper" },
        { players: defenders, position: "Defender" },
        { players: midfielders, position: "Midfielder" },
        { players: forwards, position: "Forward" }
      ].map(({ players: positionPlayers, position }) => (
        positionPlayers.map((player, index) => {
          const coords = getPositionCoordinates(position, index, positionPlayers.length, rotate);
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
              <div className={`relative flex flex-col items-center ${rotate ? 'rotate-180' : ''}`}>
                <div className="text-white text-xs font-medium mb-1 whitespace-nowrap">
                  {player.name}
                </div>
                <div className={`w-4 h-4 rounded-full border border-white/40 ${getPositionColor(assignedPosition)}`} />
              </div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
};
