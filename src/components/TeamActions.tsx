
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";
import MatchResultDialog from "./MatchResultDialog";
import { Team } from "@/utils/teamDistribution";

interface TeamActionsProps {
  onRegenerateTeams: () => void;
  onShareWhatsApp: () => void;
  onCopyTeams: () => void;
  teams: Team[];
  showResultDialog: boolean;
  setShowResultDialog: (show: boolean) => void;
  playerGoals: Record<string, number>;
  onGoalChange: (playerId: string, goals: number) => void;
  onSaveResult: (winner: number) => void;
}

const TeamActions = ({
  onRegenerateTeams,
  onCopyTeams,
  teams,
  showResultDialog,
  setShowResultDialog,
  playerGoals,
  onGoalChange,
  onSaveResult,
}: TeamActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant="outline" 
        onClick={onRegenerateTeams}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Regenerate
      </Button>
      <Button
        variant="outline"
        onClick={onCopyTeams}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Copy Teams
      </Button>
      <MatchResultDialog
        teams={teams}
        showResultDialog={showResultDialog}
        setShowResultDialog={setShowResultDialog}
        playerGoals={playerGoals}
        onGoalChange={onGoalChange}
        onSaveResult={onSaveResult}
      />
    </div>
  );
};

export default TeamActions;
