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

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();
  const playersPerTeam = Math.floor(players.length / 2);
  const needsMinDefenders = playersPerTeam >= 9;

  //1 - First, try to distribute goalkeepers
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

  //2 - Distribute defenders first when we need minimum 3
  if (needsMinDefenders) {
    const defenders = getPlayersForPosition(players, "Defender", assignedPlayers);
    const shuffledDefenders = shuffle(defenders);
    
    // Try to assign at least 3 defenders to each team if available
    let team1Defenders = countPlayersByPosition(team1, "Defender");
    let team2Defenders = countPlayersByPosition(team2, "Defender");

    // First pass: try to get 3 defenders per team
    shuffledDefenders.forEach(defender => {
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

    // Second pass: distribute any remaining defenders if we still need them
    if (needsMinDefenders && (team1Defenders < 3 || team2Defenders < 3)) {
      const remainingDefenders = defenders.filter(d => !assignedPlayers.has(d.id));
      remainingDefenders.forEach(defender => {
        if (team1Defenders < 3 && (team1.length <= team2.length || team2Defenders >= 3)) {
          team1.push(defender);
          assignedPlayers.add(defender.id);
          team1Defenders++;
        } else if (team2Defenders < 3) {
          team2.push(defender);
          assignedPlayers.add(defender.id);
          team2Defenders++;
        }
      });
    }
  } else {

    defenders.forEach(defender => {
      if (!assignedPlayers.has(defender.id)) {
        if (
          (team1Defenders < 2 || (needsMinDefenders && team1.length >= 9 && team1Defenders < 3)) &&
          (team1Defenders <= team2Defenders || team2Defenders >= 2)
        ) {
          team1.push(defender);
          team1Defenders++;
        } else if (
          (team2Defenders < 2 || (needsMinDefenders && team2.length >= 9 && team2Defenders < 3))
        ) {
          team2.push(defender);
          team2Defenders++;
        }
        assignedPlayers.add(defender.id);
      }
    });
  }

  //3 - Distribute remaining positions
  const positions = ["Defender", "Midfielder", "Forward"];
  positions.forEach(position => {
    const availablePlayers = getPlayersForPosition(players, position, assignedPlayers);
    
    if (availablePlayers.length > 0) {
      const shuffledPlayers = shuffle(availablePlayers);
      
      shuffledPlayers.forEach(player => {
        if (!assignedPlayers.has(player.id)) {
          // For midfielders, check if we're not exceeding 5 per team
          if (position === "Midfielder") {
            const team1Midfielders = countPlayersByPosition(team1, "Midfielder");
            const team2Midfielders = countPlayersByPosition(team2, "Midfielder");
            
            if (team1Midfielders < 5 && team1.length <= team2.length) {
              team1.push(player);
            } else if (team2Midfielders < 5) {
              team2.push(player);
            }
          } else {
            // For other positions, distribute evenly
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

  // Distribute remaining players evenly (if any players weren't assigned due to position restrictions)
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
