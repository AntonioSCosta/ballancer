
import { Player } from "./PlayerCard";
import { Football } from "lucide-react";

interface SimplePlayerCardProps {
  player: Player;
}

const SimplePlayerCard = ({ player }: SimplePlayerCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500 dark:bg-gray-700 flex items-center justify-center">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Football className="h-6 w-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{player.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">{player.position}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rating: {Math.round(player.rating)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlayerCard;
