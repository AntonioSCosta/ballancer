
import { Player } from "./PlayerCard";
import { motion } from "framer-motion";
import { determinePlayerPosition } from "@/utils/positionUtils";
import { shortenPlayerName } from "@/utils/nameUtils";

interface FootballFieldProps {
  players: Player[];
  teamName: string;
  rotate?: boolean;
}

const getPositionCoordinates = (position: string, index: number, totalInPosition: number) => {
  const basePositions = {
    "Goalkeeper": { x: "50%", y: "8%" },
    "Defender": { x: "50%", y: "30%" },
    "Midfielder": { x: "50%", y: "55%" },
    "Forward": { x: "50%", y: "80%" }
  };

  let position_x;

  if (totalInPosition === 1) {
    position_x = "50%"; // Center the player if there's only one
  } else if (totalInPosition === 2) {
    const positions = [30, 70]; // Better spacing for 2 players
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 3) {
    const positions = [25, 50, 75]; // Better spacing for 3 players
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 4) {
    const positions = [20, 40, 60, 80]; // Better spacing for 4 players
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 5) {
    const positions = [15, 32.5, 50, 67.5, 85]; // Better spacing for 5 players
    position_x = `${positions[index]}%`;
  } else {
    // Fallback for more than 5 players
    const spacingPercentage = 80 / (totalInPosition + 1);
    position_x = `${10 + ((index + 1) * spacingPercentage)}%`;
  }

  return {
    x: position_x,
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

const formatPlayerName = (name: string) => {
  const shortName = shortenPlayerName(name);
  const nameParts = shortName.split(" ");
  return nameParts.map((part, i) => (
    <div key={i}>{part}</div>
  ));
};

export const FootballField = ({ players, rotate = false }: FootballFieldProps) => {
  const currentDefenders = players.filter(p => p.position === "Defender").length;
  const currentMidfielders = players.filter(p => p.position === "Midfielder").length;

  const goalkeepers = getPlayersInPosition(players, "Goalkeeper", currentDefenders, currentMidfielders);
  const defenders = getPlayersInPosition(players, "Defender", currentDefenders, currentMidfielders);
  const midfielders = getPlayersInPosition(players, "Midfielder", currentDefenders, currentMidfielders);
  const forwards = getPlayersInPosition(players, "Forward", currentDefenders, currentMidfielders);

  return (
    <div className={`relative w-full aspect-[2/2.25] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20 football-field ${rotate ? 'transform rotate-180' : ''}`}>
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
          const defaultCoords = getPositionCoordinates(position, index, positionPlayers.length);
          const assignedPosition = determinePlayerPosition(player, currentDefenders, currentMidfielders);

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: defaultCoords.x, top: defaultCoords.y }}
            >
              <div className={`relative flex flex-col items-center ${rotate ? 'transform rotate-180' : ''}`}>
                <div className="text-white text-xs font-medium mb-1 text-center leading-tight">
                  {formatPlayerName(player.name)}
                </div>
                <div 
                  className={`w-4 h-4 rounded-full border border-white/40 ${getPositionColor(assignedPosition)}`}
                />
              </div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
};
