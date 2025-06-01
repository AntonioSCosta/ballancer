
import { Player } from "@/types/player";
import { shortenPlayerName } from "./nameUtils";

export const getDisplayName = (player: Player, context: 'tactical' | 'full' = 'full'): string => {
  if (context === 'tactical') {
    return shortenPlayerName(player.name);
  }
  return player.name;
};

export const formatPlayerForTactical = (player: Player) => {
  return {
    ...player,
    displayName: shortenPlayerName(player.name)
  };
};
