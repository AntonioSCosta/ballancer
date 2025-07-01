
import { Player } from '@/types/player';
import { ErrorHandler } from './errorHandler';

export class OfflineStorage {
  private static readonly SYNC_QUEUE_KEY = 'sync_queue';
  private static readonly LAST_SYNC_KEY = 'last_sync';

  static saveOfflineAction(action: 'create' | 'update' | 'delete', data: any): void {
    try {
      const queue = this.getSyncQueue();
      const actionItem = {
        id: Date.now().toString(),
        action,
        data,
        timestamp: new Date().toISOString()
      };
      
      queue.push(actionItem);
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline action:', error);
    }
  }

  static getSyncQueue(): any[] {
    try {
      const queue = localStorage.getItem(this.SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  static clearSyncQueue(): void {
    try {
      localStorage.removeItem(this.SYNC_QUEUE_KEY);
      localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  }

  static getLastSyncTime(): Date | null {
    try {
      const lastSync = localStorage.getItem(this.LAST_SYNC_KEY);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  static isDataStale(maxAgeHours: number = 24): boolean {
    const lastSync = this.getLastSyncTime();
    if (!lastSync) return true;
    
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    return hoursDiff > maxAgeHours;
  }

  static async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const queue = this.getSyncQueue();
      if (queue.length === 0) return;

      // Process sync queue items
      for (const item of queue) {
        // In a real app, this would sync with a server
        console.log('Syncing item:', item);
      }

      this.clearSyncQueue();
      ErrorHandler.success('Data synchronized successfully');
    } catch (error) {
      ErrorHandler.handle('Failed to synchronize data');
    }
  }
}
