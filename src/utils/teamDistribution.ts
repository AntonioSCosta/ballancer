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

  // Assign one goalkeeper to each team
  if (primaryGoalkeepers.length >= 2) {
    // Assign the first two primary goalkeepers to each team
    team1.push(primaryGoalkeepers[0]);
    assignedPlayers.add(primaryGoalkeepers[0].id);
    team2.push(primaryGoalkeepers[1]);
    assignedPlayers.add(primaryGoalkeepers[1].id);
  } else if (primaryGoalkeepers.length === 1) {
    // Assign the primary goalkeeper to Team 1 and a secondary goalkeeper to Team 2
    team1.push(primaryGoalkeepers[0]);
    assignedPlayers.add(primaryGoalkeepers[0].id);
    if (secondaryGoalkeepers.length > 0) {
      const gk = secondaryGoalkeepers[0];
      const convertedGk = convertToGoalkeeper(gk);
      team2.push(convertedGk);
      assignedPlayers.add(gk.id);
    }
  } else if (secondaryGoalkeepers.length >= 2) {
    // Assign the first two secondary goalkeepers to each team
    const gk1 = convertToGoalkeeper(secondaryGoalkeepers[0]);
    team1.push(gk1);
    assignedPlayers.add(secondaryGoalkeepers[0].id);
    const gk2 = convertToGoalkeeper(secondaryGoalkeepers[1]);
    team2.push(gk2);
    assignedPlayers.add(secondaryGoalkeepers[1].id);
  } else if (secondaryGoalkeepers.length === 1) {
    // Assign the secondary goalkeeper to Team 1 and convert the lowest-rated player to goalkeeper for Team 2
    const gk = convertToGoalkeeper(secondaryGoalkeepers[0]);
    team1.push(gk);
    assignedPlayers.add(secondaryGoalkeepers[0].id);
    const availablePlayers = allPlayers.filter(p => !assignedPlayers.has(p.id));
    if (availablePlayers.length > 0) {
      const lowestRated = findLowestRatedPlayer(availablePlayers);
      const convertedGk = convertToGoalkeeper(lowestRated);
      team2.push(convertedGk);
      assignedPlayers.add(lowestRated.id);
    }
  } else {
    // No goalkeepers available, convert the two lowest-rated players to goalkeepers
    const availablePlayers = allPlayers.filter(p => !assignedPlayers.has(p.id));
    if (availablePlayers.length >= 2) {
      const lowestRated1 = findLowestRatedPlayer(availablePlayers);
      const convertedGk1 = convertToGoalkeeper(lowestRated1);
      team1.push(convertedGk1);
      assignedPlayers.add(lowestRated1.id);

      const remainingPlayers = availablePlayers.filter(p => p.id !== lowestRated1.id);
      const lowestRated2 = findLowestRatedPlayer(remainingPlayers);
      const convertedGk2 = convertToGoalkeeper(lowestRated2);
      team2.push(convertedGk2);
      assignedPlayers.add(lowestRated2.id);
    }
  }
};

const assignPlayerToSecondaryPosition = (player: Player, team: Player[], assignedPlayers: Set<string>) => {
  if (player.secondaryPosition) {
    team.push({
      ...player,
      position: player.secondaryPosition,
      secondaryPosition: player.position
    });
    assignedPlayers.add(player.id);
  } else {
    // Assign to a necessary position (Defender, Midfielder, or Forward)
    const positions = ["Defender", "Midfielder", "Forward"];
    for (const position of positions) {
      if (countPlayersByPosition(team, position) < 5) {
        team.push({
          ...player,
          position: position as "Defender" | "Midfielder" | "Forward",
          secondaryPosition: player.position
        });
        assignedPlayers.add(player.id);
        break;
      }
    }
  }
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();

  // First, distribute goalkeepers
  distributeGoalkeepers(players, team1, team2, assignedPlayers);

  // Handle extra goalkeepers by assigning them to their secondary positions
  const extraGoalkeepers = players.filter(p => p.position === "Goalkeeper" && !assignedPlayers.has(p.id));
  for (const gk of extraGoalkeepers) {
    if (team1.length <= team2.length) {
      assignPlayerToSecondaryPosition(gk, team1, assignedPlayers);
    } else {
      assignPlayerToSecondaryPosition(gk, team2, assignedPlayers);
    }
  }

  // Distribute remaining players
  const availableDefenders = getPlayersForPosition(players, "Defender", assignedPlayers);
  let team1Defenders = countPlayersByPosition(team1, "Defender");
  let team2Defenders = countPlayersByPosition(team2, "Defender");

  availableDefenders.forEach(defender => {
    if (!assignedPlayers.has(defender.id)) {
      if (team1Defenders < 6 && (team1Defenders <= team2Defenders || team2Defenders >= 6)) {
        team1.push(defender);
        assignedPlayers.add(defender.id);
        team1Defenders++;
      } else if (team2Defenders < 6) {
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