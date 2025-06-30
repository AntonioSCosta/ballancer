
import { Player } from '@/types/player';
import { ErrorHandler, ErrorType } from './errorHandler';

export const validateTeamGeneration = (players: Player[]): boolean => {
  if (players.length < 10) {
    ErrorHandler.handle({
      type: ErrorType.VALIDATION,
      message: 'Not enough players selected',
      details: `Selected ${players.length} players, but need at least 10`,
      action: 'Please select more players to generate teams'
    });
    return false;
  }

  if (players.length > 22) {
    ErrorHandler.handle({
      type: ErrorType.VALIDATION,
      message: 'Too many players selected',
      details: `Selected ${players.length} players, but maximum is 22`,
      action: 'Please select fewer players'
    });
    return false;
  }

  // Check for balanced positions
  const positions = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasGoalkeeper = positions['Goalkeeper'] >= 2;
  if (!hasGoalkeeper) {
    ErrorHandler.warning(
      'No goalkeepers selected',
      'Teams will be generated without dedicated goalkeepers'
    );
  }

  return true;
};

export const handleTeamGenerationError = (error: Error) => {
  console.error('Team generation failed:', error);
  ErrorHandler.handle({
    type: ErrorType.UNKNOWN,
    message: 'Failed to generate teams',
    details: error.message,
    action: 'Please try again or adjust your player selection'
  });
};
