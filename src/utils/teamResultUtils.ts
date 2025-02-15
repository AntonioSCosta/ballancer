
import { Team } from "./teamDistribution";
import { MatchResult } from "@/types/matchResult";
import { toast } from "sonner";
import { determinePlayerPosition } from "./positionUtils";

export const saveMatchResult = (
  teams: Team[],
  winner: number,
  playerGoals: Record<string, number>
) => {
  const matchResult: MatchResult = {
    date: new Date().toISOString(),
    teams,
    winner,
    playerIds: teams.flatMap(team => team.players.map(p => p.id)),
    playerGoals
  };

  // Load existing results
  const existingResults = JSON.parse(localStorage.getItem('matchResults') || '[]');
  
  // Add new result
  localStorage.setItem('matchResults', JSON.stringify([...existingResults, matchResult]));
  
  // Update player stats and goals
  teams.forEach((team, index) => {
    team.players.forEach(player => {
      const playerStats = JSON.parse(localStorage.getItem(`playerStats_${player.id}`) || '{"wins": 0, "losses": 0, "draws": 0, "goals": 0}');
      
      if (winner === 0) {
        playerStats.draws += 1;
      } else if (winner === index + 1) {
        playerStats.wins += 1;
      } else {
        playerStats.losses += 1;
      }

      // Add goals scored in this match
      playerStats.goals = (playerStats.goals || 0) + (playerGoals[player.id] || 0);
      
      localStorage.setItem(`playerStats_${player.id}`, JSON.stringify(playerStats));
    });
  });

  toast.success("Match result recorded!");
  return true;
};

export const shareTeamsToWhatsApp = (teams: Team[]) => {
  const teamsInfo = teams
    .map(
      (team, i) =>
        `⚽ Team ${i + 1} (Rating: ${team.rating})\n\n` +
        team.players
          .map((p) => {
            const currentDefenders = team.players.filter(pl => pl.position === "Defender").length;
            const currentMidfielders = team.players.filter(pl => pl.position === "Midfielder").length;
            const assignedPosition = determinePlayerPosition(p, currentDefenders, currentMidfielders);
            return `- ${p.name} (${assignedPosition})`;
          })
          .join("\n")
    )
    .join("\n\n");

  try {
    const encodedText = encodeURIComponent(teamsInfo);
    const whatsappUrl = `whatsapp://send?text=${encodedText}`;
    window.location.href = whatsappUrl;
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    navigator.clipboard.writeText(teamsInfo)
      .then(() => toast.success("Teams copied to clipboard!"))
      .catch(() => toast.error("Failed to copy teams"));
  }
};

export const copyTeamsToClipboard = (teams: Team[]) => {
  const teamsInfo = teams
    .map(
      (team, i) =>
        `Team ${i + 1} (Rating: ${team.rating})\n\n` +
        team.players
          .map((p) => {
            const currentDefenders = team.players.filter(pl => pl.position === "Defender").length;
            const currentMidfielders = team.players.filter(pl => pl.position === "Midfielder").length;
            const assignedPosition = determinePlayerPosition(p, currentDefenders, currentMidfielders);
            return `- ${p.name} (${assignedPosition})`;
          })
          .join("\n")
    )
    .join("\n\n");

  navigator.clipboard.writeText(teamsInfo)
    .then(() => toast.success("Teams copied to clipboard!"))
    .catch(() => toast.error("Failed to copy teams"));
};
