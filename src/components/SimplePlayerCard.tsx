
import { Player } from "./PlayerCard";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface SimplePlayerCardProps {
  player: Player;
}

const SimplePlayerCard = ({ player }: SimplePlayerCardProps) => {
  const getPositionColor = (position: string) => {
    const colors = {
      "Goalkeeper": "bg-orange-500",
      "Defender": "bg-blue-500",
      "Midfielder": "bg-purple-500",
      "Forward": "bg-emerald-500"
    };
    return colors[position as keyof typeof colors] || "bg-gray-500";
  };

  const getPlayerStats = () => {
    const stats = localStorage.getItem(`playerStats_${player.id}`);
    return stats ? JSON.parse(stats) : { wins: 0, losses: 0, draws: 0, goals: 0 };
  };

  const stats = getPlayerStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Avatar className={`h-12 w-12 border-2 border-white shadow-lg ${getPositionColor(player.position)}`}>
          <AvatarImage src={player.photo} alt={player.name} />
          <AvatarFallback className={`text-white ${getPositionColor(player.position)}`}>
            {player.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{player.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">{player.position}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rating: {Math.round(player.rating)}
            </span>
            {stats.goals > 0 && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                Goals: {stats.goals}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlayerCard;
