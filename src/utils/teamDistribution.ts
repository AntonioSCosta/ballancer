
import type { Player } from "@/types/player";
import { Team, calculateTeamRating } from "@/types/team";
import { determinePlayerPosition } from "./positionUtils";

export const distributePlayersByPosition = (players: Player[]): Team[] => {
  // Sort players by rating descending for fair distribution
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  
  // Split players into two teams
  const team1Players: Player[] = [];
  const team2Players: Player[] = [];
  
  sortedPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      team1Players.push(player);
    } else {
      team2Players.push(player);
    }
  });

  const teams: Team[] = [
    {
      id: "team1",
      name: "Team 1",
      players: team1Players,
      rating: calculateTeamRating(team1Players)
    },
    {
      id: "team2",
      name: "Team 2",
      players: team2Players,
      rating: calculateTeamRating(team2Players)
    }
  ];

  return teams;
};
