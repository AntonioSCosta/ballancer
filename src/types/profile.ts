
import type { PlayerPosition } from './player';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_position: PlayerPosition | null;
  attributes: Record<string, number> | null;
  wins: number;
  losses: number;
  matches_played: number;
  created_at: string;
}
