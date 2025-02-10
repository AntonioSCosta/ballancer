
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Team } from "@/utils/teamDistribution";

interface MatchResultDialogProps {
  teams: Team[];
  showResultDialog: boolean;
  setShowResultDialog: (show: boolean) => void;
  playerGoals: Record<string, number>;
  onGoalChange: (playerId: string, goals: number) => void;
  onSaveResult: (winner: number) => void;
}

const MatchResultDialog = ({
  teams,
  showResultDialog,
  setShowResultDialog,
  playerGoals,
  onGoalChange,
  onSaveResult,
}: MatchResultDialogProps) => {
  return (
    <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Record Result
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Match Result</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <RadioGroup onValueChange={(value) => onSaveResult(parseInt(value))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="team1" />
              <Label htmlFor="team1">Team 1 Won</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="team2" />
              <Label htmlFor="team2">Team 2 Won</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="draw" />
              <Label htmlFor="draw">Draw</Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            <h3 className="font-medium text-sm">Player Goals</h3>
            {teams.map((team, teamIndex) => (
              <div key={teamIndex} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Team {teamIndex + 1}</h4>
                {team.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between gap-2">
                    <Label htmlFor={`goals-${player.id}`} className="flex-1">
                      {player.name}
                    </Label>
                    <Input
                      id={`goals-${player.id}`}
                      type="number"
                      min="0"
                      value={playerGoals[player.id]}
                      onChange={(e) => onGoalChange(player.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchResultDialog;
