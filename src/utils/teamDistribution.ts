import { Player } from "@/components/PlayerCard";

export interface Team {
  players: Player[];
  rating: number;
}

const shuffle = (array: Player[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const distributeEvenly = (players: Player[], team1: Player[], team2: Player[]) => {
  const shuffled = shuffle(players);
  for (let i = 0; i < shuffled.length; i++) {
    if (team1.length <= team2.length) {
      team1.push(shuffled[i]);
    } else {
      team2.push(shuffled[i]);
    }
  }
};

const calculateTeamRating = (players: Player[]) => {
  if (players.length === 0) return 0;
  const sum = players.reduce((acc, player) => acc + player.rating, 0);
  return Math.round(sum / players.length);
};

const getPlayersForPosition = (
  players: Player[],
  position: string,
  excludeIds: Set<string> = new Set()
): Player[] => {
  return players.filter(
    p => !excludeIds.has(p.id) && (
      p.position === position || p.secondaryPosition === position
    )
  );
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();

  // First, try to distribute goalkeepers
  const goalkeepers = getPlayersForPosition(players, "Goalkeeper");
  if (goalkeepers.length >= 2) {
    const shuffledGKs = shuffle(goalkeepers);
    team1.push(shuffledGKs[0]);
    team2.push(shuffledGKs[1]);
    assignedPlayers.add(shuffledGKs[0].id);
    assignedPlayers.add(shuffledGKs[1].id);
  } else if (goalkeepers.length === 1) {
    (Math.random() < 0.5 ? team1 : team2).push(goalkeepers[0]);
    assignedPlayers.add(goalkeepers[0].id);
  }

  // Distribute other positions
  const positions = ["Defender", "Midfielder", "Forward"];
  positions.forEach(position => {
    const availablePlayers = getPlayersForPosition(players, position, assignedPlayers);
    const minPlayersPerTeam = Math.floor(availablePlayers.length / 2);

    if (minPlayersPerTeam > 0) {
      const shuffledPlayers = shuffle(availablePlayers);
      
      // Ensure each team gets the minimum number of players for this position
      for (let i = 0; i < minPlayersPerTeam * 2; i++) {
        const player = shuffledPlayers[i];
        if (i % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
        assignedPlayers.add(player.id);
      }
    }
  });

  // Distribute remaining players evenly
  const remainingPlayers = players.filter(p => !assignedPlayers.has(p.id));
  distributeEvenly(remainingPlayers, team1, team2);

  return [
    {
      players: team1,
      rating: calculateTeamRating(team1)
    },
    {
      players: team2,
      rating: calculateTeamRating(team2)
    }
  ];
};
