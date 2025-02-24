
import { Player } from "./player";

export interface Team {
  id: string;
  name: string;
  players: Player[];
  rating: number;
}

export const calculateTeamRating = (players: Player[]): number => {
  if (players.length === 0) return 0;
  return Math.round(players.reduce((sum, player) => sum + player.rating, 0) / players.length);
};
