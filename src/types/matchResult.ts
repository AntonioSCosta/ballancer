
import { Team } from "./team";

export interface MatchResult {
  id: string;
  winner: Team;
  loser: Team;
  date: string;
  score: {
    winner: number;
    loser: number;
  };
}
