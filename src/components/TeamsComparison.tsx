
import { useMemo } from "react";
import { Team } from "@/utils/teamDistribution";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TeamsComparisonProps {
  teams: Team[];
}

interface StatComparison {
  name: string;
  "Team 1": number;
  "Team 2": number;
}

const TeamsComparison = ({ teams }: TeamsComparisonProps) => {
  const data = useMemo(() => {
    if (teams.length !== 2) return [];

    const calculateTeamStats = (team: Team) => {
      const players = team.players;
      return {
        averageRating:
          players.reduce((sum, p) => sum + p.rating, 0) / players.length,
        totalSpeed:
          players.reduce((sum, p) => sum + p.attributes.speed, 0) / players.length,
        totalStrength:
          players.reduce((sum, p) => sum + p.attributes.strength, 0) /
          players.length,
        totalAgility:
          players.reduce((sum, p) => sum + p.attributes.agility, 0) /
          players.length,
        totalStamina:
          players.reduce((sum, p) => sum + p.attributes.stamina, 0) /
          players.length,
      };
    };

    const team1Stats = calculateTeamStats(teams[0]);
    const team2Stats = calculateTeamStats(teams[1]);

    return [
      {
        name: "Rating",
        "Team 1": Number(team1Stats.averageRating.toFixed(1)),
        "Team 2": Number(team2Stats.averageRating.toFixed(1)),
      },
      {
        name: "Speed",
        "Team 1": Number(team1Stats.totalSpeed.toFixed(1)),
        "Team 2": Number(team2Stats.totalSpeed.toFixed(1)),
      },
      {
        name: "Strength",
        "Team 1": Number(team1Stats.totalStrength.toFixed(1)),
        "Team 2": Number(team2Stats.totalStrength.toFixed(1)),
      },
      {
        name: "Agility",
        "Team 1": Number(team1Stats.totalAgility.toFixed(1)),
        "Team 2": Number(team2Stats.totalAgility.toFixed(1)),
      },
      {
        name: "Stamina",
        "Team 1": Number(team1Stats.totalStamina.toFixed(1)),
        "Team 2": Number(team2Stats.totalStamina.toFixed(1)),
      },
    ];
  }, [teams]);

  if (teams.length !== 2) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Teams Comparison</CardTitle>
        <CardDescription>
          Compare average stats between teams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Team 1" fill="#8884d8" />
            <Bar dataKey="Team 2" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamsComparison;
