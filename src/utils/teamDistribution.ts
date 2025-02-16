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

const countPlayersByPosition = (team: Player[], position: string): number => {
  return team.filter(p => p.position === position || p.secondaryPosition === position).length;
};

const findLowestRatedPlayer = (players: Player[]): Player => {
  return players.reduce((lowest, current) => 
    current.rating < lowest.rating ? current : lowest
  , players[0]);
};

const convertToGoalkeeper = (player: Player): Player => {
  const oldPosition = player.position;
  return {
    ...player,
    position: "Goalkeeper" as const,
    secondaryPosition: oldPosition
  };
};

const distributeGoalkeepers = (allPlayers: Player[], team1: Player[], team2: Player[], assignedPlayers: Set<string>) => {
  // Get all available goalkeepers (primary and secondary)
  const primaryGoalkeepers = allPlayers.filter(p => p.position === "Goalkeeper" && !assignedPlayers.has(p.id));
  const secondaryGoalkeepers = allPlayers.filter(p => p.secondaryPosition === "Goalkeeper" && !assignedPlayers.has(p.id));
  
  // Handle Team 1 goalkeeper
  if (primaryGoalkeepers.length > 0) {
    const gk = primaryGoalkeepers[0];
    team1.push(gk);
    assignedPlayers.add(gk.id);
  } else if (secondaryGoalkeepers.length > 0) {
    const gk = secondaryGoalkeepers[0];
    const convertedGk = {
      ...gk,
      position: "Goalkeeper" as const,
      secondaryPosition: gk.position
    };
    team1.push(convertedGk);
    assignedPlayers.add(gk.id);
  }

  // Handle Team 2 goalkeeper
  const remainingPrimaryGks = primaryGoalkeepers.filter(p => !assignedPlayers.has(p.id));
  const remainingSecondaryGks = secondaryGoalkeepers.filter(p => !assignedPlayers.has(p.id));

  if (remainingPrimaryGks.length > 0) {
    const gk = remainingPrimaryGks[0];
    team2.push(gk);
    assignedPlayers.add(gk.id);
  } else if (remainingSecondaryGks.length > 0) {
    const gk = remainingSecondaryGks[0];
    const convertedGk = {
      ...gk,
      position: "Goalkeeper" as const,
      secondaryPosition: gk.position
    };
    team2.push(convertedGk);
    assignedPlayers.add(gk.id);
  }
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();

  // First, distribute goalkeepers
  distributeGoalkeepers(players, team1, team2, assignedPlayers);

  // If any team is missing a goalkeeper, assign the lowest rated unassigned player
  if (team1.filter(p => p.position === "Goalkeeper").length === 0) {
    const availablePlayers = players.filter(p => !assignedPlayers.has(p.id));
    if (availablePlayers.length > 0) {
      const lowestRated = findLowestRatedPlayer(availablePlayers);
      team1.push(convertToGoalkeeper(lowestRated));
      assignedPlayers.add(lowestRated.id);
    }
  }

  if (team2.filter(p => p.position === "Goalkeeper").length === 0) {
    const availablePlayers = players.filter(p => !assignedPlayers.has(p.id));
    if (availablePlayers.length > 0) {
      const lowestRated = findLowestRatedPlayer(availablePlayers);
      team2.push(convertToGoalkeeper(lowestRated));
      assignedPlayers.add(lowestRated.id);
    }
  }

  // Distribute remaining players
  const availableDefenders = getPlayersForPosition(players, "Defender", assignedPlayers);
  let team1Defenders = countPlayersByPosition(team1, "Defender");
  let team2Defenders = countPlayersByPosition(team2, "Defender");

  availableDefenders.forEach(defender => {
    if (!assignedPlayers.has(defender.id)) {
      if (team1Defenders < 3 && (team1Defenders <= team2Defenders || team2Defenders >= 3)) {
        team1.push(defender);
        assignedPlayers.add(defender.id);
        team1Defenders++;
      } else if (team2Defenders < 3) {
        team2.push(defender);
        assignedPlayers.add(defender.id);
        team2Defenders++;
      }
    }
  });

  const positions = ["Midfielder", "Forward"];
  positions.forEach(position => {
    const availablePlayers = getPlayersForPosition(players, position, assignedPlayers);
    
    if (availablePlayers.length > 0) {
      const shuffledPlayers = shuffle(availablePlayers);
      
      shuffledPlayers.forEach(player => {
        if (!assignedPlayers.has(player.id)) {
          if (position === "Midfielder") {
            const team1Midfielders = countPlayersByPosition(team1, "Midfielder");
            const team2Midfielders = countPlayersByPosition(team2, "Midfielder");
            
            if (team1Midfielders < 5 && team1.length <= team2.length) {
              team1.push(player);
            } else if (team2Midfielders < 5) {
              team2.push(player);
            }
          } else {
            if (team1.length <= team2.length) {
              team1.push(player);
            } else {
              team2.push(player);
            }
          }
          assignedPlayers.add(player.id);
        }
      });
    }
  });

  const remainingPlayers = players.filter(p => !assignedPlayers.has(p.id));
  if (remainingPlayers.length > 0) {
    distributeEvenly(remainingPlayers, team1, team2);
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
