
export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface PlayerAttributes {
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  mental: number;
  handling?: number;
  diving?: number;
  positioning?: number;
  reflexes?: number;
  heading?: number;
}

export interface PlayerStats {
  matches: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  photo?: string;
  rating: number;
  attributes: PlayerAttributes;
  stats?: PlayerStats;
}
