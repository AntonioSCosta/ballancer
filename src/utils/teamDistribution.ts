import { Player } from "@/components/PlayerCard";

export interface Team {
  players: Player[];
  rating: number;
}

const shuffle = (array: Player[]) => [...array].sort(() => Math.random() - 0.5);

const distributeEvenly = (players: Player[], team1: Player[], team2: Player[]) => {
  shuffle(players).forEach((player, i) => {
    (team1.length <= team2.length ? team1 : team2).push(player);
  });
};

const calculateTeamRating = (players: Player[]) =>
  players.length === 0 ? 0 : Math.round(players.reduce((acc, p) => acc + p.rating, 0) / players.length);

const getPlayersForPosition = (players: Player[], position: string, excludeIds = new Set<string>()) =>
  players.filter(p => !excludeIds.has(p.id) && (p.position === position || p.secondaryPosition === position));

const countPlayersByPosition = (team: Player[], position: string) =>
  team.filter(p => p.position === position || p.secondaryPosition === position).length;

const balanceTeams = (team1: Player[], team2: Player[], totalPlayers: number) => {
  const targetSize = Math.floor(totalPlayers / 2);
  while (team1.length < targetSize) {
    team1.push(team2.pop()!);
  }
  while (team2.length < targetSize) {
    team2.push(team1.pop()!);
  }
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: Player[] = [];
  const team2: Player[] = [];
  const assignedPlayers = new Set<string>();
  const playersPerTeam = Math.floor(players.length / 2);
  const needsMinDefenders = playersPerTeam >= 9;

  // **1. Assign Goalkeepers**
  const goalkeepers = getPlayersForPosition(players, "Goalkeeper");
  if (goalkeepers.length >= 2) {
    const [gk1, gk2] = shuffle(goalkeepers);
    team1.push(gk1);
    team2.push(gk2);
    assignedPlayers.add(gk1.id);
    assignedPlayers.add(gk2.id);
  } else if (goalkeepers.length === 1) {
    (Math.random() < 0.5 ? team1 : team2).push(goalkeepers[0]);
    assignedPlayers.add(goalkeepers[0].id);
  }

  // **2. Assign at least 3 Defenders per team if needed**
  const defenders = getPlayersForPosition(players, "Defender", assignedPlayers);
  shuffle(defenders);
  let team1Defenders = 0, team2Defenders = 0;

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
  
  // **3. Assign remaining positions while keeping balance**
  ["Defender", "Midfielder", "Forward"].forEach(position => {
    const availablePlayers = getPlayersForPosition(players, position, assignedPlayers);
    shuffle(availablePlayers);

    availablePlayers.forEach(player => {
      if (!assignedPlayers.has(player.id)) {
        const team1Count = countPlayersByPosition(team1, position);
        const team2Count = countPlayersByPosition(team2, position);

        if (position === "Defender" && (team1Count >= 5 || team2Count >= 5)) return;
        if (position === "Midfielder" && (team1Count >= 5 || team2Count >= 5)) return;

        if (team1.length <= team2.length) {
          team1.push(player);
        } else {
          team2.push(player);
        }
        assignedPlayers.add(player.id);
      }
    });
  });

  // **4. Assign remaining unassigned players evenly**
  distributeEvenly(players.filter(p => !assignedPlayers.has(p.id)), team1, team2);

  // Ensure no team has more than one goalkeeper
  if (countPlayersByPosition(team1, "Goalkeeper") > 1) {
    const extraGk = team1.find(p => p.position === "Goalkeeper");
    if (extraGk) {
      team1.splice(team1.indexOf(extraGk), 1);
      team2.push(extraGk);
    }
  }

  if (countPlayersByPosition(team2, "Goalkeeper") > 1) {
    const extraGk = team2.find(p => p.position === "Goalkeeper");
    if (extraGk) {
      team2.splice(team2.indexOf(extraGk), 1);
      team1.push(extraGk);
    }
  }

  // **5. Balance teams to have equal number of players**
  balanceTeams(team1, team2, players.length);

  return [
    { players: team1, rating: calculateTeamRating(team1) },
    { players: team2, rating: calculateTeamRating(team2) }
  ];
};
