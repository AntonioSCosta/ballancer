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

const getPlayersByPosition = (players: Player[], position: string) => {
  return players.filter(p => 
    p.position === position || p.secondaryPosition === position
  );
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const primaryGoalkeepers = players.filter(p => p.position === "Goalkeeper");
  const primaryDefenders = players.filter(p => p.position === "Defender");
  const primaryMidfielders = players.filter(p => p.position === "Midfielder");
  const primaryForwards = players.filter(p => p.position === "Forward");

  const secondaryGoalkeepers = players.filter(p => p.secondaryPosition === "Goalkeeper");
  const secondaryDefenders = players.filter(p => p.secondaryPosition === "Defender");
  const secondaryMidfielders = players.filter(p => p.secondaryPosition === "Midfielder");
  const secondaryForwards = players.filter(p => p.secondaryPosition === "Forward");

  const team1: Player[] = [];
  const team2: Player[] = [];

  const allGoalkeepers = [...primaryGoalkeepers];
  if (allGoalkeepers.length < 2) {
    allGoalkeepers.push(...secondaryGoalkeepers);
  }

  if (allGoalkeepers.length >= 2) {
    const shuffledGKs = shuffle(allGoalkeepers);
    team1.push(shuffledGKs[0]);
    team2.push(shuffledGKs[1]);
    if (allGoalkeepers.length > 2) {
      distributeEvenly(shuffledGKs.slice(2), team1, team2);
    }
  } else if (allGoalkeepers.length === 1) {
    (Math.random() < 0.5 ? team1 : team2).push(allGoalkeepers[0]);
  }

  const remainingPlayers = players.filter(p => 
    !team1.includes(p) && !team2.includes(p)
  );

  const defenders = remainingPlayers.filter(p => 
    p.position === "Defender" || p.secondaryPosition === "Defender"
  );
  const midfielders = remainingPlayers.filter(p => 
    p.position === "Midfielder" || p.secondaryPosition === "Midfielder"
  );
  const forwards = remainingPlayers.filter(p => 
    p.position === "Forward" || p.secondaryPosition === "Forward"
  );

  distributeEvenly(defenders, team1, team2);
  distributeEvenly(midfielders, team1, team2);
  distributeEvenly(forwards, team1, team2);

  const unassigned = remainingPlayers.filter(p => 
    !team1.includes(p) && !team2.includes(p)
  );
  distributeEvenly(unassigned, team1, team2);

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
