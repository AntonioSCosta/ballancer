import { Player } from '@/types/player';
import { handleValidationError } from './errorHandler';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePlayer = (player: Partial<Player>): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!player.name || player.name.trim().length === 0) {
    errors.push('Player name is required');
  } else if (player.name.trim().length < 2) {
    errors.push('Player name must be at least 2 characters long');
  } else if (player.name.trim().length > 50) {
    errors.push('Player name must be less than 50 characters');
  }

  // Position validation
  if (!player.position) {
    errors.push('Player position is required');
  }

  // Rating validation
  if (player.rating !== undefined) {
    if (player.rating < 1 || player.rating > 100) {
      errors.push('Player rating must be between 1 and 100');
    }
  }

  // Attributes validation
  if (player.attributes) {
    const { attributes } = player;
    const attributeKeys = ['speed', 'physical', 'mental', 'passing', 'dribbling', 'shooting', 'heading', 'defending'];
    
    for (const key of attributeKeys) {
      const value = attributes[key as keyof typeof attributes];
      if (value !== undefined && (value < 1 || value > 100)) {
        errors.push(`${key} must be between 1 and 100`);
      }
    }

    // Goalkeeper specific attributes
    if (player.position === 'Goalkeeper') {
      const gkAttributes = ['handling', 'diving', 'positioning', 'reflexes'];
      for (const key of gkAttributes) {
        const value = attributes[key as keyof typeof attributes];
        if (value !== undefined && (value < 1 || value > 100)) {
          errors.push(`${key} must be between 1 and 100`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAndShowErrors = (player: Partial<Player>): boolean => {
  const validation = validatePlayer(player);
  
  if (!validation.isValid) {
    validation.errors.forEach(error => {
      handleValidationError('player data', error);
    });
  }
  
  return validation.isValid;
};
