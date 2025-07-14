import { Player } from '@/types/player';
import { toast } from 'sonner';

export class StorageUtils {
  private static readonly MAX_STORAGE_SIZE = 5000000; // 5MB
  
  static safeGetItem(key: string, defaultValue: any = null): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      toast.error(`Failed to load ${key} data`);
      return defaultValue;
    }
  }

  static safeSetItem(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      
      // Check size before setting
      if (serialized.length > this.MAX_STORAGE_SIZE) {
        toast.error("Data too large to save. Please reduce image sizes or number of players.");
        return false;
      }
      
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          toast.error("Storage quota exceeded. Please delete some data or use smaller images.");
        } else {
          toast.error(`Failed to save ${key} data`);
        }
      }
      return false;
    }
  }

  static getPlayers(): Player[] {
    return this.safeGetItem('players', []);
  }

  static savePlayers(players: Player[]): boolean {
    return this.safeSetItem('players', players);
  }

  static validatePlayerData(players: Player[]): { valid: Player[], invalid: Player[] } {
    const valid: Player[] = [];
    const invalid: Player[] = [];

    players.forEach(player => {
      if (this.isValidPlayer(player)) {
        valid.push(player);
      } else {
        invalid.push(player);
      }
    });

    return { valid, invalid };
  }

  private static isValidPlayer(player: any): player is Player {
    return (
      player &&
      typeof player.id === 'string' &&
      typeof player.name === 'string' &&
      player.name.trim().length > 0 &&
      player.name.trim().length <= 30 &&
      typeof player.position === 'string' &&
      ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].includes(player.position) &&
      typeof player.photo === 'string' &&
      typeof player.attributes === 'object' &&
      typeof player.rating === 'number' &&
      player.rating >= 1 &&
      player.rating <= 100
    );
  }

  static cleanupInvalidPlayers(): void {
    const players = this.getPlayers();
    const { valid, invalid } = this.validatePlayerData(players);
    
    if (invalid.length > 0) {
      console.warn(`Found ${invalid.length} invalid players, cleaning up...`);
      this.savePlayers(valid);
      toast.warning(`Removed ${invalid.length} corrupted player records`);
    }
  }

  static getStorageUsage(): { used: number, available: number, percentage: number } {
    let used = 0;
    
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }

    const available = this.MAX_STORAGE_SIZE - used;
    const percentage = (used / this.MAX_STORAGE_SIZE) * 100;

    return { used, available, percentage };
  }
}