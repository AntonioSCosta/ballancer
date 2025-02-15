
import { Player } from "@/components/PlayerCard";

export const determinePlayerPosition = (player: Player, defenders: number, midfielders: number) => {
  if (player.position === "Goalkeeper") return "Goalkeeper";
  
  if (player.position === "Defender") return "Defender";
  
  if (defenders < 3 && player.secondaryPosition === "Defender") {
    return "Defender";
  }
  
  if (player.position === "Midfielder" && midfielders < 5) {
    return "Midfielder";
  }
  
  if (player.secondaryPosition === "Midfielder" && midfielders < 5) {
    return "Midfielder";
  }
  
  return player.position;
};
