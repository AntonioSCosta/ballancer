import { Player } from '@/types/player';

export interface PositionAnalysis {
  warnings: string[];
  suggestions: string[];
  isBalanced: boolean;
  positionCounts: Record<string, number>;
}

export const analyzePositionBalance = (players: Player[]): PositionAnalysis => {
  const positionCounts: Record<string, number> = {};
  
  // Count players by position
  players.forEach(player => {
    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
  });

  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  const totalPlayers = players.length;
  const goalkeepers = positionCounts['Goalkeeper'] || 0;
  const defenders = positionCounts['Defender'] || 0;
  const midfielders = positionCounts['Midfielder'] || 0;
  const forwards = positionCounts['Forward'] || 0;

  // Goalkeeper analysis
  if (goalkeepers === 0) {
    warnings.push('No goalkeepers selected');
    suggestions.push('Add at least 2 goalkeepers for balanced teams');
  } else if (goalkeepers === 1) {
    warnings.push('Only 1 goalkeeper selected');
    suggestions.push('Add 1 more goalkeeper so each team can have one');
  }

  // Position balance for outfield players
  const outfieldPlayers = totalPlayers - goalkeepers;
  const idealDefenders = Math.ceil(outfieldPlayers * 0.3); // ~30%
  const idealMidfielders = Math.ceil(outfieldPlayers * 0.4); // ~40%
  const idealForwards = Math.ceil(outfieldPlayers * 0.3); // ~30%

  if (defenders < idealDefenders - 1) {
    warnings.push('Not enough defenders');
    suggestions.push(`Consider adding ${idealDefenders - defenders} more defenders`);
  }

  if (midfielders < idealMidfielders - 1) {
    warnings.push('Not enough midfielders');
    suggestions.push(`Consider adding ${idealMidfielders - midfielders} more midfielders`);
  }

  if (forwards < idealForwards - 1) {
    warnings.push('Not enough forwards');
    suggestions.push(`Consider adding ${idealForwards - forwards} more forwards`);
  }

  // Check if severely unbalanced
  const maxPosition = Math.max(defenders, midfielders, forwards);
  const minPosition = Math.min(defenders, midfielders, forwards);
  
  if (maxPosition > minPosition * 2 && totalPlayers >= 10) {
    warnings.push('Teams may be unbalanced');
    suggestions.push('Try to balance defenders, midfielders, and forwards more evenly');
  }

  const isBalanced = warnings.length <= 1; // Allow minor imbalances

  return {
    warnings,
    suggestions,
    isBalanced,
    positionCounts
  };
};
