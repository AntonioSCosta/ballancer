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

export const determinePlayerPosition = (
  player: Player,
  currentDefenders: number,
  currentMidfielders: number
): string => {
  // If player is a goalkeeper, keep them as goalkeeper
  if (player.position === "Goalkeeper") {
    return "Goalkeeper";
  }

  // If we need defenders (less than 4), prioritize defensive positions
  if (currentDefenders < 4 && (player.position === "Defender" || player.attributes.defending > 70)) {
    return "Defender";
  }

  // If we need midfielders (less than 3), and player has good passing
  if (currentMidfielders < 3 && (player.position === "Midfielder" || player.attributes.passing > 70)) {
    return "Midfielder";
  }

  // Default to forward if no other position is assigned
  return "Forward";
};
