
import { Player, PlayerPosition, PlayerStats } from "@/types/player";

export const getPositionColor = (position: PlayerPosition) => {
  const colors = {
    "Goalkeeper": "bg-orange-500",
    "Defender": "bg-blue-500",
    "Midfielder": "bg-purple-500",
    "Forward": "bg-emerald-500"
  };
  return colors[position];
};

export const getPlayerGradient = (name: string, position: PlayerPosition) => {
  // Generate a consistent gradient based on player name and position
  const gradients = {
    "Goalkeeper": [
      "bg-gradient-to-br from-orange-400 to-red-500",
      "bg-gradient-to-br from-amber-400 to-orange-600",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
    ],
    "Defender": [
      "bg-gradient-to-br from-blue-400 to-indigo-600",
      "bg-gradient-to-br from-cyan-400 to-blue-600",
      "bg-gradient-to-br from-sky-400 to-blue-500",
    ],
    "Midfielder": [
      "bg-gradient-to-br from-purple-400 to-pink-600",
      "bg-gradient-to-br from-violet-400 to-purple-600",
      "bg-gradient-to-br from-indigo-400 to-purple-500",
    ],
    "Forward": [
      "bg-gradient-to-br from-emerald-400 to-green-600",
      "bg-gradient-to-br from-green-400 to-emerald-600",
      "bg-gradient-to-br from-teal-400 to-green-500",
    ]
  };

  // Use name length to pick a consistent gradient
  const positionGradients = gradients[position];
  const index = name.length % positionGradients.length;
  return positionGradients[index];
};

export const getPlayerStats = (playerId: string): PlayerStats => {
  const stats = localStorage.getItem(`playerStats_${playerId}`);
  return stats ? JSON.parse(stats) : { wins: 0, losses: 0, draws: 0, goals: 0 };
};

export const calculateWinRate = (stats: PlayerStats) => {
  const totalGames = stats.wins + stats.losses + stats.draws;
  if (totalGames === 0) return 0;
  return Math.round((stats.wins / totalGames) * 100);
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAttributes = (player: Player) => {
  if (player.position === "Goalkeeper") {
    return [
      { label: "Handling", value: player.attributes.handling || 0 },
      { label: "Diving", value: player.attributes.diving || 0 },
      { label: "Positioning", value: player.attributes.positioning || 0 },
      { label: "Reflexes", value: player.attributes.reflexes || 0 },
      { label: "Mental", value: player.attributes.mental },
      { label: "Passing", value: player.attributes.passing },
      { label: "Speed", value: player.attributes.speed },
    ];
  }

  return [
    { label: "Speed", value: player.attributes.speed },
    { label: "Physical", value: player.attributes.physical || 0 },
    { label: "Mental", value: player.attributes.mental },
    { label: "Passing", value: player.attributes.passing },
    { label: "Dribbling", value: player.attributes.dribbling || 0 },
    { label: "Shooting", value: player.attributes.shooting || 0 },
    { label: "Heading", value: player.attributes.heading || 0 },
    { label: "Defending", value: player.attributes.defending || 0 },
  ];
};
