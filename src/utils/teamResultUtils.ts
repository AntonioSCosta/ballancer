import { Team } from "@/types/team";
import { toast } from "sonner";

export const saveMatchResult = (teams: Team[], winner: number, playerGoals: Record<string, number>): boolean => {
  try {
    const winningTeam = teams[winner - 1];
    const losingTeam = teams[winner === 1 ? 1 : 0];
    
    const matchResult = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      winner: winningTeam,
      loser: losingTeam,
      playerGoals
    };

    const storedResults = JSON.parse(localStorage.getItem('matchResults') || '[]');
    storedResults.push(matchResult);
    localStorage.setItem('matchResults', JSON.stringify(storedResults));

    toast.success('Match result saved successfully!');
    return true;
  } catch (error) {
    console.error("Error saving match result:", error);
    toast.error('Failed to save match result');
    return false;
  }
};

export const shareTeamsToWhatsApp = (teams: Team[]) => {
  const teamsText = teams.map((team, index) => {
    const playersList = team.players.map(p => `${p.name} (${p.position})`).join(", ");
    return `Team ${index + 1} (Rating: ${team.rating}): ${playersList}`;
  }).join("\n\n");

  const url = `https://wa.me/?text=${encodeURIComponent(teamsText)}`;
  window.open(url, "_blank");
};

export const copyTeamsToClipboard = (teams: Team[]) => {
  const teamsText = teams.map((team, index) => {
    const playersList = team.players.map(p => `${p.name} (${p.position})`).join(", ");
    return `Team ${index + 1} (Rating: ${team.rating}): ${playersList}`;
  }).join("\n\n");

  navigator.clipboard.writeText(teamsText)
    .then(() => toast.success("Teams copied to clipboard!"))
    .catch(() => toast.error("Failed to copy teams to clipboard"));
};
