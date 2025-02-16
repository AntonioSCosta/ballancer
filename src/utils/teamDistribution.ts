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

const assignExtraGoalkeeper = (goalkeeper: Player, team: Player[]) => {
  if (goalkeeper.secondaryPosition) {
    return {
      ...goalkeeper,
      position: goalkeeper.secondaryPosition,
      secondaryPosition: "Goalkeeper"
    };
  }
  
  const currentDefenders = team.filter(p => p.position === "Defender").length;
  if (currentDefenders < 3) {
    return {
      ...goalkeeper,
      position: "Defender",
      secondaryPosition: "Goalkeeper"
    };
  }
  
  return {
    ...goalkeeper,
    position: "Forward",
    secondaryPosition: "Goalkeeper"
  };
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();
  const playersPerTeam = Math.floor(players.length / 2);

  const goalkeepers = getPlayersForPosition(players, "Goalkeeper");
  if (goalkeepers.length > 0) {
    const shuffledGKs = shuffle(goalkeepers);
    
    team1.push(shuffledGKs[0]);
    assignedPlayers.add(shuffledGKs[0].id);
    
    if (shuffledGKs.length > 1) {
      team2.push(shuffledGKs[1]);
      assignedPlayers.add(shuffledGKs[1].id);
      
      for (let i = 2; i < shuffledGKs.length; i++) {
        const reassignedGK = assignExtraGoalkeeper(
          shuffledGKs[i],
          team1.length <= team2.length ? team1 : team2
        );
        
        if (team1.length <= team2.length) {
          team1.push(reassignedGK);
        } else {
          team2.push(reassignedGK);
        }
        assignedPlayers.add(shuffledGKs[i].id);
      }
    }
  }

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
