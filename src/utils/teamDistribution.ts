
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

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const goalkeepers = players.filter(p => p.position === "Goalkeeper");
  const defenders = players.filter(p => p.position === "Defender");
  const midfielders = players.filter(p => p.position === "Midfielder");
  const forwards = players.filter(p => p.position === "Forward");

  const team1: Player[] = [];
  const team2: Player[] = [];

  if (goalkeepers.length >= 2) {
    const shuffledGKs = shuffle(goalkeepers);
    team1.push(shuffledGKs[0]);
    team2.push(shuffledGKs[1]);
    if (goalkeepers.length > 2) {
      distributeEvenly(shuffledGKs.slice(2), team1, team2);
    }
  } else if (goalkeepers.length === 1) {
    (Math.random() < 0.5 ? team1 : team2).push(goalkeepers[0]);
  }

  distributeEvenly(defenders, team1, team2);
  distributeEvenly(midfielders, team1, team2);
  distributeEvenly(forwards, team1, team2);

  while (Math.abs(team1.length - team2.length) > 1) {
    if (team1.length > team2.length) {
      team2.push(team1.pop()!);
    } else {
      team1.push(team2.pop()!);
    }
  }

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
