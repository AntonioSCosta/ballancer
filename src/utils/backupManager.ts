
import { Player } from '@/types/player';
import { ErrorHandler } from './errorHandler';

export interface BackupData {
  version: string;
  timestamp: string;
  players: Player[];
  metadata: {
    totalPlayers: number;
    createdAt: string;
    appVersion: string;
  };
}

export class BackupManager {
  private static readonly BACKUP_VERSION = '1.0.0';
  private static readonly APP_VERSION = '1.0.0';

  static createBackup(): BackupData | null {
    try {
      const playersData = localStorage.getItem('players');
      const players: Player[] = playersData ? JSON.parse(playersData) : [];

      const backup: BackupData = {
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        players,
        metadata: {
          totalPlayers: players.length,
          createdAt: new Date().toISOString(),
          appVersion: this.APP_VERSION
        }
      };

      return backup;
    } catch (error) {
      ErrorHandler.handle('Failed to create backup');
      return null;
    }
  }

  static exportBackup(): void {
    try {
      const backup = this.createBackup();
      if (!backup) return;

      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `football-teams-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      ErrorHandler.success('Backup exported successfully');
    } catch (error) {
      ErrorHandler.handle('Failed to export backup');
    }
  }

  static async importBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      if (!this.validateBackup(backup)) {
        ErrorHandler.handle('Invalid backup file format');
        return false;
      }

      // Create a backup of current data before importing
      const currentBackup = this.createBackup();
      if (currentBackup) {
        localStorage.setItem('players_backup_before_import', JSON.stringify(currentBackup));
      }

      // Import the new data
      localStorage.setItem('players', JSON.stringify(backup.players));
      
      ErrorHandler.success(`Successfully imported ${backup.players.length} players`);
      return true;
    } catch (error) {
      ErrorHandler.handle('Failed to import backup file');
      return false;
    }
  }

  private static validateBackup(backup: any): backup is BackupData {
    return (
      backup &&
      typeof backup.version === 'string' &&
      typeof backup.timestamp === 'string' &&
      Array.isArray(backup.players) &&
      backup.metadata &&
      typeof backup.metadata.totalPlayers === 'number'
    );
  }

  static restoreFromAutoBackup(): boolean {
    try {
      const autoBackup = localStorage.getItem('players_backup_before_import');
      if (!autoBackup) {
        ErrorHandler.handle('No automatic backup found');
        return false;
      }

      const backup: BackupData = JSON.parse(autoBackup);
      localStorage.setItem('players', JSON.stringify(backup.players));
      localStorage.removeItem('players_backup_before_import');
      
      ErrorHandler.success('Successfully restored from automatic backup');
      return true;
    } catch (error) {
      ErrorHandler.handle('Failed to restore from automatic backup');
      return false;
    }
  }
}
