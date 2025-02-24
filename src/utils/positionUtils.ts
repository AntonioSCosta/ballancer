import type { Player } from '@/types/player';

export const getPlayerPosition = (player: Player): string => {
  return player.position;
};

export const isPlayerForward = (player: Player): boolean => {
  return player.position === "Forward";
};

export const isPlayerMidfielder = (player: Player): boolean => {
  return player.position === "Midfielder";
};

export const isPlayerDefender = (player: Player): boolean => {
  return player.position === "Defender";
};

export const isPlayerGoalkeeper = (player: Player): boolean => {
  return player.position === "Goalkeeper";
};

export const getPositionColor = (position: string): string => {
  const colors = {
    "Goalkeeper": "bg-orange-500",
    "Defender": "bg-blue-500",
    "Midfielder": "bg-purple-500",
    "Forward": "bg-emerald-500"
  };
  return colors[position as keyof typeof colors] || "bg-gray-500";
};
