
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/team";
import { Player } from "./PlayerCard";

interface TeamsComparisonProps {
  team1: Team;
  team2: Team;
}

const TeamsComparison = ({ team1, team2 }: TeamsComparisonProps) => {
  const calculateTeamAttribute = (team: Team, attribute: keyof Player["attributes"]) => {
    return team.players.reduce((sum, player) => sum + (player.attributes[attribute] || 0), 0) / team.players.length;
  };

  const calculateOverallRating = (team: Team) => {
    return team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length;
  };

  const team1Overall = calculateOverallRating(team1);
  const team2Overall = calculateOverallRating(team2);

  const comparisons = [
    {
      label: "Speed",
      team1Value: calculateTeamAttribute(team1, "speed"),
      team2Value: calculateTeamAttribute(team2, "speed"),
    },
    {
      label: "Physical",
      team1Value: calculateTeamAttribute(team1, "physical"),
      team2Value: calculateTeamAttribute(team2, "physical"),
    },
    {
      label: "Mental",
      team1Value: calculateTeamAttribute(team1, "mental"),
      team2Value: calculateTeamAttribute(team2, "mental"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{Math.round(team1Overall)}</div>
              <div className="text-sm text-muted-foreground">Team 1 Rating</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{Math.round(team2Overall)}</div>
              <div className="text-sm text-muted-foreground">Team 2 Rating</div>
            </div>
          </div>

          <div className="space-y-4">
            {comparisons.map((comparison) => (
              <div key={comparison.label} className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.round(comparison.team1Value)}</span>
                  <span>{comparison.label}</span>
                  <span>{Math.round(comparison.team2Value)}</span>
                </div>
                <div className="flex gap-2 h-2">
                  <div className="w-1/2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${comparison.team1Value}%` }}
                    />
                  </div>
                  <div className="w-1/2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${comparison.team2Value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsComparison;
