
export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface PlayerAttributes {
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  mental: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  photo?: string;
  rating: number;
  attributes: PlayerAttributes;
}
