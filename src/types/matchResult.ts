
import { Team } from "@/utils/teamDistribution";

export interface MatchResult {
  date: string;
  teams: Team[];
  winner: number;
  playerIds: string[];
  playerGoals: Record<string, number>;
}
