
import { Button } from "@/components/ui/button";
import { CheckSquare, Target, Trophy, Users } from "lucide-react";
import { Player } from "@/components/PlayerCard";

interface BulkSelectionProps {
  players: Player[];
  selectedPlayers: Set<string>;
  onSelectionChange: (playerIds: string[]) => void;
}

const BulkSelection = ({ players, selectedPlayers, onSelectionChange }: BulkSelectionProps) => {
  const handleSelectAll = () => {
    if (selectedPlayers.size === players.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(players.map(p => p.id));
    }
  };

  const handleSelectByPosition = (position: string) => {
    const positionPlayers = players.filter(p => p.position === position);
    const positionPlayerIds = positionPlayers.map(p => p.id);
    
    // Check if all players of this position are already selected
    const allPositionSelected = positionPlayerIds.every(id => selectedPlayers.has(id));
    
    if (allPositionSelected) {
      // Deselect all players of this position
      const newSelection = Array.from(selectedPlayers).filter(id => !positionPlayerIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      // Select all players of this position
      const newSelection = Array.from(new Set([...selectedPlayers, ...positionPlayerIds]));
      onSelectionChange(newSelection);
    }
  };

  const handleSelectBestRated = () => {
    // Sort players by rating and select top 11
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    const bestPlayers = sortedPlayers.slice(0, 11).map(p => p.id);
    onSelectionChange(bestPlayers);
  };

  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Quick Selection
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="flex items-center gap-1 text-xs"
        >
          <CheckSquare className="w-3 h-3" />
          {selectedPlayers.size === players.length ? "Deselect All" : "Select All"}
        </Button>
        
        {positions.map(position => {
          const positionPlayers = players.filter(p => p.position === position);
          const positionPlayerIds = positionPlayers.map(p => p.id);
          const allPositionSelected = positionPlayerIds.every(id => selectedPlayers.has(id));
          
          return (
            <Button
              key={position}
              variant="outline"
              size="sm"
              onClick={() => handleSelectByPosition(position)}
              className={`flex items-center gap-1 text-xs ${
                allPositionSelected ? "bg-primary/10 border-primary" : ""
              }`}
            >
              <Users className="w-3 h-3" />
              {position}s ({positionPlayers.length})
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectBestRated}
          className="flex items-center gap-1 text-xs"
        >
          <Trophy className="w-3 h-3" />
          Best 11
        </Button>
      </div>
    </div>
  );
};

export default BulkSelection;
