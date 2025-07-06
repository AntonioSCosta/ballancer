
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
    "Goalkeeper": { x: "50%", y: "12%" },
    "Defender": { x: "50%", y: "28%" },
    "Midfielder": { x: "50%", y: "55%" },
    "Forward": { x: "50%", y: "78%" }
  };

  let position_x;

  if (totalInPosition === 1) {
    position_x = "50%";
  } else if (totalInPosition === 2) {
    const positions = [35, 65];
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 3) {
    const positions = [25, 50, 75];
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 4) {
    const positions = [20, 40, 60, 80];
    position_x = `${positions[index]}%`;
  } else if (totalInPosition === 5) {
    const positions = [15, 32.5, 50, 67.5, 85];
    position_x = `${positions[index]}%`;
  } else {
    const spacingPercentage = 70 / (totalInPosition + 1);
    position_x = `${15 + ((index + 1) * spacingPercentage)}%`;
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
    <div className={`relative w-full aspect-[3/4] bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 ${rotate ? 'transform rotate-180' : ''}`}>
      {/* Field base with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      
      {/* Field markings */}
      <div className="absolute inset-0">
        {/* Outer boundary */}
        <div className="absolute inset-2 border-2 border-white/70 rounded-lg" />
        
        {/* Center circle */}
        <div className="absolute w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/70 rounded-full" />
        <div className="absolute w-1 h-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
        
        {/* Center line */}
        <div className="absolute w-full h-0.5 top-1/2 left-0 bg-white/70 -translate-y-1/2" />
        
        {/* Penalty areas */}
        <div className="absolute w-16 h-12 top-2 left-1/2 -translate-x-1/2 border-2 border-white/70 border-t-0" />
        <div className="absolute w-16 h-12 bottom-2 left-1/2 -translate-x-1/2 border-2 border-white/70 border-b-0" />
        
        {/* Goal areas */}
        <div className="absolute w-8 h-6 top-2 left-1/2 -translate-x-1/2 border-2 border-white/70 border-t-0" />
        <div className="absolute w-8 h-6 bottom-2 left-1/2 -translate-x-1/2 border-2 border-white/70 border-b-0" />
        
        {/* Penalty spots */}
        <div className="absolute w-1 h-1 top-8 left-1/2 -translate-x-1/2 bg-white rounded-full" />
        <div className="absolute w-1 h-1 bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full" />
        
        {/* Corner arcs */}
        <div className="absolute w-3 h-3 top-2 left-2 border-2 border-white/70 rounded-full border-r-0 border-b-0" />
        <div className="absolute w-3 h-3 top-2 right-2 border-2 border-white/70 rounded-full border-l-0 border-b-0" />
        <div className="absolute w-3 h-3 bottom-2 left-2 border-2 border-white/70 rounded-full border-r-0 border-t-0" />
        <div className="absolute w-3 h-3 bottom-2 right-2 border-2 border-white/70 rounded-full border-l-0 border-t-0" />
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
                <div className="text-white text-[10px] font-semibold mb-1 text-center leading-tight drop-shadow-lg">
                  {formatPlayerName(player.name)}
                </div>
                <div className="relative">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-white/90 ${getPositionColor(assignedPosition)} shadow-lg flex items-center justify-center`}
                  >
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                  </div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-7 h-1 bg-black/20 rounded-full blur-sm" />
                </div>
              </div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
};
