
import { Player } from "./PlayerCard";
import { motion } from "framer-motion";
import { determinePlayerPosition } from "@/utils/positionUtils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Edit2, Check } from "lucide-react";

interface FootballFieldProps {
  players: Player[];
  teamName: string;
  rotate?: boolean;
}

interface PlayerPosition {
  x: string;
  y: string;
}

const getPositionCoordinates = (position: string, index: number, totalInPosition: number, rotate: boolean) => {
  const basePositions = {
    "Goalkeeper": { x: "50%", y: "10%" },
    "Defender": { x: "0", y: "30%" },
    "Midfielder": { x: "0", y: "55%" },
    "Forward": { x: "0", y: "75%" }
  };

  let position_x;
  if (totalInPosition === 1) {
    position_x = "50%";
  } else if (totalInPosition === 2) {
    position_x = `${30 + (index * 40)}`;
  } else if (totalInPosition === 3) {
    const positions = [15, 45, 75];
    position_x = `${positions[index]}`;
  } else if (totalInPosition === 4) {
    const positions = [5, 35, 55, 85];
    position_x = `${positions[index]}`;
  } else if (totalInPosition === 5) {
    const positions = [5, 21, 37, 53, 69, 85];
    position_x = `${positions[index]}`;
  } else {
    const spacingPercentage = 80 / (totalInPosition - 1);
    position_x = `${10 + (index * spacingPercentage)}`;
  }

  return {
    x: `calc(${position_x} - 8px)`,
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
  return name.split(' ').join('\n');
};

export const FootballField = ({ players, rotate = false }: FootballFieldProps) => {
  const currentDefenders = players.filter(p => p.position === "Defender").length;
  const currentMidfielders = players.filter(p => p.position === "Midfielder").length;
  
  const goalkeepers = getPlayersInPosition(players, "Goalkeeper", currentDefenders, currentMidfielders);
  const defenders = getPlayersInPosition(players, "Defender", currentDefenders, currentMidfielders);
  const midfielders = getPlayersInPosition(players, "Midfielder", currentDefenders, currentMidfielders);
  const forwards = getPlayersInPosition(players, "Forward", currentDefenders, currentMidfielders);

  const [customPositions, setCustomPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState<boolean>(false);

  const handleDrag = (playerId: string, info: { point: { x: number, y: number } }) => {
    if (!editingPosition || selectedPlayer !== playerId) return;

    const fieldElement = document.querySelector('.football-field') as HTMLElement;
    if (!fieldElement) return;
    
    const rect = fieldElement.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;
    
    const relativeX = (x / rect.width) * 100;
    const relativeY = (y / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, relativeX));
    const clampedY = Math.max(0, Math.min(100, relativeY));

    setCustomPositions(prev => ({
      ...prev,
      [playerId]: { x: clampedX, y: clampedY }
    }));
  };

  const handlePlayerClick = (playerId: string) => {
    if (editingPosition && selectedPlayer === playerId) {
      // Finish editing
      setEditingPosition(false);
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerId);
      setEditingPosition(false);
    }
  };

  return (
    <div className={`relative w-full aspect-[2/2.25] bg-emerald-600 rounded-xl overflow-hidden border-4 border-white/20 football-field ${rotate ? 'rotate-180' : ''}`}>
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

      {selectedPlayer && !editingPosition && (
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 ${rotate ? 'rotate-180' : ''}`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditingPosition(true)}
            className="bg-white/90 hover:bg-white flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Position
          </Button>
        </div>
      )}

      {editingPosition && selectedPlayer && (
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 ${rotate ? 'rotate-180' : ''}`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditingPosition(false);
              setSelectedPlayer(null);
            }}
            className="bg-white/90 hover:bg-white flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Done
          </Button>
        </div>
      )}

      {[
        { players: goalkeepers, position: "Goalkeeper" },
        { players: defenders, position: "Defender" },
        { players: midfielders, position: "Midfielder" },
        { players: forwards, position: "Forward" }
      ].map(({ players: positionPlayers, position }) => (
        positionPlayers.map((player, index) => {
          const defaultCoords = getPositionCoordinates(position, index, positionPlayers.length, rotate);
          const customPosition = customPositions[player.id];
          const assignedPosition = determinePlayerPosition(player, currentDefenders, currentMidfielders);
          const isSelected = selectedPlayer === player.id;

          const style = customPosition 
            ? { left: `${customPosition.x}%`, top: `${customPosition.y}%` }
            : { left: defaultCoords.x, top: defaultCoords.y };

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                boxShadow: isSelected ? "0 0 0 2px rgba(255,255,255,0.5)" : "none"
              }}
              transition={{ delay: index * 0.1 }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${editingPosition && isSelected ? 'cursor-move' : 'cursor-pointer'}`}
              style={style}
              drag={editingPosition && isSelected}
              dragMomentum={false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0}
              onDrag={(_, info) => handleDrag(player.id, info)}
              whileDrag={{ zIndex: 50 }}
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className={`relative flex flex-col items-center ${rotate ? 'rotate-180' : ''}`}>
                <div className="text-white text-xs font-medium mb-1 whitespace-pre-line text-center">
                  {formatPlayerName(player.name)}
                </div>
                <div 
                  className={`w-4 h-4 rounded-full border ${isSelected ? 'border-white' : 'border-white/40'} 
                    ${getPositionColor(assignedPosition)} 
                    ${isSelected ? 'scale-110' : 'hover:scale-110'} 
                    transition-transform`}
                />
              </div>
            </motion.div>
          );
        })
      ))}
    </div>
  );
};
