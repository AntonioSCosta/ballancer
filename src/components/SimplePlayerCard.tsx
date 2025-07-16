
import { Player } from "./PlayerCard";
import PlayerPhotoDisplay from "./PlayerPhotoDisplay";
import { getInitials } from "@/utils/playerCardUtils";

interface SimplePlayerCardProps {
  player: Player;
}

const SimplePlayerCard = ({ player }: SimplePlayerCardProps) => {
  const getPositionColor = (position: string) => {
    const colors = {
      "Goalkeeper": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Defender": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Midfielder": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Forward": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    };
    return colors[position as keyof typeof colors] || "bg-muted/50 text-muted-foreground border-border";
  };

  const getPlayerStats = () => {
    const stats = localStorage.getItem(`playerStats_${player.id}`);
    return stats ? JSON.parse(stats) : { wins: 0, losses: 0, draws: 0, goals: 0 };
  };

  const stats = getPlayerStats();

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <PlayerPhotoDisplay 
          player={player} 
          size="md" 
          showPosition={true}
        />
        <div className="flex-1">
          <h4 className="font-medium text-card-foreground">{player.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(player.rating)}
            </span>
            {stats.goals > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                {stats.goals}⚽
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlayerCard;
