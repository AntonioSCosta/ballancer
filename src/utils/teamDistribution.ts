import type { Player } from '@/types/player';

export interface Team {
  id: string;
  players: Player[];
  rating: number;
}

const calculateTeamRating = (players: Player[]): number => {
  if (players.length === 0) return 0;
  return players.reduce((sum, player) => sum + player.rating, 0) / players.length;
};

const findBestTeamCombination = (
  players: Player[],
  teamSize: number,
  maxAttempts = 1000
): [Team[], number] => {
  let bestDifference = Infinity;
  let bestTeams: Team[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const teams: Team[] = [];
    
    for (let i = 0; i < shuffledPlayers.length; i += teamSize) {
      const teamPlayers = shuffledPlayers.slice(i, i + teamSize);
      teams.push({
        id: `team-${teams.length + 1}`,
        players: teamPlayers,
        rating: calculateTeamRating(teamPlayers)
      });
    }

    const ratings = teams.map(team => team.rating);
    const difference = Math.max(...ratings) - Math.min(...ratings);

    if (difference < bestDifference) {
      bestDifference = difference;
      bestTeams = teams;
    }

    if (difference === 0) break;
  }

  return [bestTeams, bestDifference];
};

const distributeTeams = (players: Player[], numberOfTeams: number = 2): Team[] => {
  if (players.length === 0) return [];
  
  const teamSize = Math.floor(players.length / numberOfTeams);
  if (teamSize === 0) return [];

  const [teams] = findBestTeamCombination(players, teamSize);
  return teams;
};

export { distributeTeams, calculateTeamRating };
