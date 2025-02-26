
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/team";
import { Player } from "@/types/player";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';

interface TeamsComparisonProps {
  team1: Team;
  team2: Team;
}

const TeamsComparison = ({ team1, team2 }: TeamsComparisonProps) => {
  const calculateTeamAttribute = (team: Team, attribute: keyof Player["attributes"]) => {
    return team.players.reduce((sum, player) => sum + (player.attributes[attribute] || 0), 0) / team.players.length;
  };

  const calculateOverallRating = (team: Team) => {
    return Math.round(team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length);
  };

  const team1Overall = calculateOverallRating(team1);
  const team2Overall = calculateOverallRating(team2);

  const attributes = ["speed", "shooting", "passing", "dribbling", "defending", "physical"];
  
  const data = attributes.map(attr => ({
    subject: attr.charAt(0).toUpperCase() + attr.slice(1),
    "Team 1": Math.round(calculateTeamAttribute(team1, attr as keyof Player["attributes"])),
    "Team 2": Math.round(calculateTeamAttribute(team2, attr as keyof Player["attributes"]))
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{team1Overall}</div>
              <div className="text-sm text-muted-foreground">Team 1 Rating</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold">{team2Overall}</div>
              <div className="text-sm text-muted-foreground">Team 2 Rating</div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="Team 1"
                  dataKey="Team 1"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Team 2"
                  dataKey="Team 2"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamsComparison;
