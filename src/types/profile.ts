
import { PlayerPosition } from "@/components/PlayerCard";

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_position: PlayerPosition | null;
  attributes: {
    speed: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  matches_played: number;
  wins: number;
  losses: number;
  created_at: string;
}

export const DEFAULT_ATTRIBUTES = {
  speed: 50,
  shooting: 50,
  passing: 50,
  dribbling: 50,
  defending: 50,
  physical: 50,
};
