
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";
import { Team } from "@/utils/teamDistribution";

interface TeamActionsProps {
  onRegenerateTeams: () => void;
  onShareWhatsApp: () => void;
  onCopyTeams: () => void;
  teams: Team[];
}

const TeamActions = ({
  onRegenerateTeams,
  onCopyTeams,
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
    </div>
  );
};

export default TeamActions;
