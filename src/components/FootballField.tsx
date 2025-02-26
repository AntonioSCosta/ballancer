
import { Player } from "@/types/player";
import { motion } from "framer-motion";
import { determinePlayerPosition } from "@/utils/positionUtils";

interface FootballFieldProps {
  players: Player[];
  teamName: string;
  rotate?: boolean;
}

const getPositionCoordinates = (position: string, index: number, totalInPosition: number) => {
  const basePositions = {
    "Goalkeeper": { x: "45%", y: "10%" },
    "Defender": { x: "0", y: "35%" },
    "Midfielder": { x: "0", y: "55%" },
    "Forward": { x: "0", y: "75%" }
  };

  let position_x;
  let position_offset = 0;

  if (totalInPosition === 1) {
    position_x = "45%";
  } else if (totalInPosition === 2) {
    const positions = [22.5, 72.5]; 
    position_x = `${position_offset + positions[index]}%`;
  } else if (totalInPosition === 3) {
    const positions = [22.5, 45, 72.5]; 
    position_x = `${position_offset + positions[index]}%`;
  } else if (totalInPosition === 4) {
    const positions = [11.25, 33.75, 56.25, 82.75]; 
    position_x = `${position_offset + positions[index]}%`; 
  } else {
    const spacingPercentage = 100 / (totalInPosition + 1);
    position_x = `${position_offset + ((index + 1) * spacingPercentage)}%`;
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

const formatPlayerName = (name: string) => {
  const nameParts = name.split(" ");
  return nameParts.map((part, i) => (
    <div key={i}>{part}</div>
  ));
};

export const FootballField = ({ players, rotate = false }: FootballFieldProps) => {
  const currentDefenders = players.filter(p => p.position === "Defender").length;
  const currentMidfielders = players.filter(p => p.position === "Midfielder").length;

  const goalkeepers = players.filter(p => determinePlayerPosition(p, currentDefenders, currentMidfielders) === "Goalkeeper");
  const defenders = players.filter(p => determinePlayerPosition(p, currentDefenders, currentMidfielders) === "Defender");
  const midfielders = players.filter(p => determinePlayerPosition(p, currentDefenders, currentMidfielders) === "Midfielder");
  const forwards = players.filter(p => determinePlayerPosition(p, currentDefenders, currentMidfielders) === "Forward");

  return (
    <div className={`relative w-full aspect-[2/2.25] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20 football-field ${rotate ? 'transform rotate-180' : ''}`}>
      <div className="absolute inset-0">
        <div className="absolute w-full h-full border-2 border-white/40" />
        <div className="absolute h-[33%] w-[56%] top-0 left-1/2 -translate-x-1/2 border-2 border-white/40" />
        <div className="absolute h-[15%] w-[25%] top-0 left-1/2 -translate-x-1/2 border-2 border-white/40" />
        <div className="absolute bottom-0 left-0 right-0 border-2 border-white/40" />
        <div className="absolute h-[25%] aspect-square -bottom-[12.5%] left-1/2 -translate-x-1/2 border-2 border-white/40 rounded-full" />
        <div className="absolute h-[33%] aspect-square top-[10px] left-1/2 -translate-x-1/2 border-2 border-white/40 rounded-full [clip-path:polygon(22%_33%,22%_100%,78%_100%,78%_33%)]" />
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
              className="absolute z-10"
              style={{ left: defaultCoords.x, top: defaultCoords.y }}
            >
              <div className={`relative flex flex-col items-center ${rotate ? 'transform rotate-180' : ''}`}>
                <div className="text-white text-xs font-medium mb-1 text-center">
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
