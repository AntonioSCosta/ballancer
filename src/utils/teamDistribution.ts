import { Player } from "@/components/PlayerCard";

export interface Team {
  players: Player[];
  rating: number;
}

const shuffle = (array: Player[]) => [...array].sort(() => Math.random() - 0.5);

const distributeEvenly = (players: Player[], team1: Player[], team2: Player[]) => {
  const shuffled = shuffle(players);
  shuffled.forEach((player, index) => {
    (index % 2 === 0 ? team1 : team2).push(player);
  });
};

const calculateTeamRating = (players: Player[]) => {
  if (players.length === 0) return 0;
  return Math.round(players.reduce((acc, player) => acc + player.rating, 0) / players.length);
};

const getPlayersForPosition = (
  players: Player[],
  position: string,
  excludeIds: Set<string> = new Set()
) => {
  return players.filter(
    (p) => !excludeIds.has(p.id) && (p.position === position || p.secondaryPosition === position)
  );
};

const countPlayersByPosition = (team: Player[], position: string) => {
  return team.filter((p) => p.position === position || p.secondaryPosition === position).length;
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();
  const playersPerTeam = Math.floor(players.length / 2);
  const needsMinDefenders = playersPerTeam >= 9;

  // ✅ Step 1: Ensure each team gets a Goalkeeper if possible
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

  // ✅ Step 2: Ensure each team gets at least 3 defenders if needed
  if (needsMinDefenders) {
    const defenders = getPlayersForPosition(players, "Defender", assignedPlayers);
    const shuffledDefenders = shuffle(defenders);
    let team1Defenders = 0;
    let team2Defenders = 0;

    shuffledDefenders.forEach((defender) => {
      if (!assignedPlayers.has(defender.id)) {
        if (team1Defenders < 3 && (team1Defenders <= team2Defenders || team2Defenders >= 3)) {
          team1.push(defender);
          team1Defenders++;
        } else if (team2Defenders < 3) {
          team2.push(defender);
          team2Defenders++;
        }
        assignedPlayers.add(defender.id);
      }
    });
  }

  // ✅ Step 3: Distribute remaining players (Defenders, Midfielders, Forwards) with limits
  const positions = ["Defender", "Midfielder", "Forward"];
  positions.forEach((position) => {
    const availablePlayers = getPlayersForPosition(players, position, assignedPlayers);
    if (availablePlayers.length > 0) {
      const shuffledPlayers = shuffle(availablePlayers);

      shuffledPlayers.forEach((player) => {
        if (!assignedPlayers.has(player.id)) {
          const team1Defenders = countPlayersByPosition(team1, "Defender");
          const team2Defenders = countPlayersByPosition(team2, "Defender");
          const team1Midfielders = countPlayersByPosition(team1, "Midfielder");
          const team2Midfielders = countPlayersByPosition(team2, "Midfielder");

          let canAssignToTeam1 = true;
          let canAssignToTeam2 = true;

          // Prevent exceeding 5 defenders
          if (position === "Defender") {
            if (team1Defenders >= 5) canAssignToTeam1 = false;
            if (team2Defenders >= 5) canAssignToTeam2 = false;
          }

          // Prevent exceeding 5 midfielders
          if (position === "Midfielder") {
            if (team1Midfielders >= 5) canAssignToTeam1 = false;
            if (team2Midfielders >= 5) canAssignToTeam2 = false;
          }

          if (canAssignToTeam1 && (team1.length <= team2.length || !canAssignToTeam2)) {
            team1.push(player);
          } else if (canAssignToTeam2) {
            team2.push(player);
          }

          assignedPlayers.add(player.id);
        }
      });
    }
  });

  // ✅ Step 4: Assign remaining unassigned players
  const remainingPlayers = players.filter((p) => !assignedPlayers.has(p.id));
  if (remainingPlayers.length > 0) {
    distributeEvenly(remainingPlayers, team1, team2);
  }

  return [
    {
      players: team1,
      rating: calculateTeamRating(team1),
    },
    {
      players: team2,
      rating: calculateTeamRating(team2),
    },
  ];
};
