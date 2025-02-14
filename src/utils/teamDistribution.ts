import { Player } from "@/components/PlayerCard";

export interface Team {
  players: Player[];
  rating: number;
}

interface AssignedPlayer extends Player {
  assignedPosition: string;
}

const shuffle = (array: Player[]) => [...array].sort(() => Math.random() - 0.5);

const distributeEvenly = (players: AssignedPlayer[], team1: AssignedPlayer[], team2: AssignedPlayer[]) => {
  shuffle(players).forEach((player, i) => {
    (team1.length <= team2.length ? team1 : team2).push(player);
  });
};

const calculateTeamRating = (players: Player[]) =>
  players.length === 0 ? 0 : Math.round(players.reduce((acc, p) => acc + p.rating, 0) / players.length);

const getPlayersForPosition = (players: Player[], position: string, excludeIds = new Set<string>()) =>
  players.filter(p => !excludeIds.has(p.id) && (p.position === position || p.secondaryPosition === position));

const countPlayersByPosition = (team: AssignedPlayer[], position: string) =>
  team.filter(p => p.assignedPosition === position).length;

const balanceTeams = (team1: AssignedPlayer[], team2: AssignedPlayer[], totalPlayers: number) => {
  const targetSize = Math.floor(totalPlayers / 2);
  while (team1.length < targetSize) {
    team1.push(team2.pop()!);
  }
  while (team2.length < targetSize) {
    team2.push(team1.pop()!);
  }
};

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  const team1: AssignedPlayer[] = [];
  const team2: AssignedPlayer[] = [];
  const assignedPlayers = new Set<string>();
  const playersPerTeam = Math.floor(players.length / 2);
  const needsMinDefenders = playersPerTeam >= 9;

  // **1. Assign Goalkeepers**
  const goalkeepers = getPlayersForPosition(players, "Goalkeeper");
  if (goalkeepers.length >= 2) {
    const [gk1, gk2] = shuffle(goalkeepers);
    team1.push({ ...gk1, assignedPosition: "Goalkeeper" });
    team2.push({ ...gk2, assignedPosition: "Goalkeeper" });
    assignedPlayers.add(gk1.id);
    assignedPlayers.add(gk2.id);
  } else if (goalkeepers.length === 1) {
    const gk = { ...goalkeepers[0], assignedPosition: "Goalkeeper" };
    (Math.random() < 0.5 ? team1 : team2).push(gk);
    assignedPlayers.add(gk.id);
  }

  // **2. Assign at least 2 Defenders per team, and 3 if needed**
  const defenders = getPlayersForPosition(players, "Defender", assignedPlayers);
  shuffle(defenders);
  let team1Defenders = 0, team2Defenders = 0;

  defenders.forEach(defender => {
    if (!assignedPlayers.has(defender.id)) {
      if (
        (team1Defenders < 2 || (needsMinDefenders && team1.length >= 9 && team1Defenders < 3)) &&
        (team1Defenders <= team2Defenders || team2Defenders >= 2)
      ) {
        team1.push({ ...defender, assignedPosition: "Defender" });
        team1Defenders++;
      } else if (
        (team2Defenders < 2 || (needsMinDefenders && team2.length >= 9 && team2Defenders < 3))
      ) {
        team2.push({ ...defender, assignedPosition: "Defender" });
        team2Defenders++;
      }
      assignedPlayers.add(defender.id);
    }
  });

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

        const assignedPlayer = { ...player, assignedPosition: position };

        if (team1.length <= team2.length) {
          team1.push(assignedPlayer);
        } else {
          team2.push(assignedPlayer);
        }
        assignedPlayers.add(player.id);
      }
    });
  });

  // **4. Assign remaining unassigned players evenly**
  distributeEvenly(
    players.filter(p => !assignedPlayers.has(p.id)).map(p => ({ ...p, assignedPosition: p.position })),
    team1,
    team2
  );

  return [
    { players: team1, rating: calculateTeamRating(team1) },
    { players: team2, rating: calculateTeamRating(team2) }
  ];
};  