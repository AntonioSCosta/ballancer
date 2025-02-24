
export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface PlayerAttributes {
  speed: number;
  physical: number;
  mental: number;
  passing: number;
  dribbling: number;
  shooting: number;
  heading: number;
  defending: number;
  handling?: number;
  diving?: number;
  positioning?: number;
  reflexes?: number;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  goals: number;
  matches?: number;
  assists?: number;
  cleanSheets?: number;
  rating?: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  secondaryPosition?: PlayerPosition;
  photo: string;
  attributes: PlayerAttributes;
  rating: number;
  stats?: PlayerStats;
}
