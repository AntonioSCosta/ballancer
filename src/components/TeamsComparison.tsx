
import { Team } from "@/utils/teamDistribution";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TeamsComparisonProps {
  teams: Team[];
}

const TeamsComparison = ({ teams }: TeamsComparisonProps) => {
  const calculateTeamStats = (team: Team) => {
    const players = team.players;
    const stats = {
      speed: 0,
      physical: 0,
      mental: 0,
      passing: 0,
      dribbling: 0,
      shooting: 0,
      heading: 0,
      defending: 0,
    };

    players.forEach(player => {
      stats.speed += player.attributes.speed || 0;
      stats.physical += player.attributes.physical || 0;
      stats.mental += player.attributes.mental || 0;
      stats.passing += player.attributes.passing || 0;
      stats.dribbling += player.attributes.dribbling || 0;
      stats.shooting += player.attributes.shooting || 0;
      stats.heading += player.attributes.heading || 0;
      stats.defending += player.attributes.defending || 0;
    });

    // Calculate averages
    Object.keys(stats).forEach(key => {
      stats[key as keyof typeof stats] = Math.round(stats[key as keyof typeof stats] / players.length);
    });

    return stats;
  };

  const team1Stats = calculateTeamStats(teams[0]);
  const team2Stats = calculateTeamStats(teams[1]);

  const data = [
    { attribute: "Speed", team1: team1Stats.speed, team2: team2Stats.speed },
    { attribute: "Physical", team1: team1Stats.physical, team2: team2Stats.physical },
    { attribute: "Mental", team1: team1Stats.mental, team2: team2Stats.mental },
    { attribute: "Passing", team1: team1Stats.passing, team2: team2Stats.passing },
    { attribute: "Dribbling", team1: team1Stats.dribbling, team2: team2Stats.dribbling },
    { attribute: "Shooting", team1: team1Stats.shooting, team2: team2Stats.shooting },
    { attribute: "Heading", team1: team1Stats.heading, team2: team2Stats.heading },
    { attribute: "Defending", team1: team1Stats.defending, team2: team2Stats.defending },
  ];

  return (
    <div className="w-full h-[500px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fontSize: 12 }}
            className="text-xs md:text-sm"
            tickFormatter={(value, index) => {
              // Get the angle of the axis in radians (360/8 = 45 degrees per segment)
              const angleRad = ((index * 45) * Math.PI) / 180;
              // Add a rotation to make text perpendicular to the axis
              const rotation = (index * 45 ) % 360;
              return value;
            }}
            tick={(props) => {
              const { x, y, payload } = props;
              const angleRad = ((props.index * 90) * Math.PI) / 180;
              // Calculate position slightly further from the center
              const offsetX = x + (Math.sin(angleRad) * 15);
              const offsetY = y - (Math.cos(angleRad) * 15);
              const rotation = (props.index * 45 + 90) % 360;
              
              return (
                <g transform={`translate(${offsetX},${offsetY})`}>
                  <text
                    x={0}
                    y={0}
                    dy={0}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize={12}
                    transform={`rotate(${rotation})`}
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Team 1"
            dataKey="team1"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
          />
          <Radar
            name="Team 2"
            dataKey="team2"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Legend 
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '20px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamsComparison;
