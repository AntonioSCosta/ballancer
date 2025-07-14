import { useEffect, useState } from 'react';
import { StorageUtils } from '@/utils/storageUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export const StorageHealthCheck = () => {
  const [storageInfo, setStorageInfo] = useState<{ used: number; available: number; percentage: number } | null>(null);

  useEffect(() => {
    const checkStorage = () => {
      const info = StorageUtils.getStorageUsage();
      setStorageInfo(info);
    };

    checkStorage();
    // Check every minute
    const interval = setInterval(checkStorage, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!storageInfo) return null;

  if (storageInfo.percentage > 90) {
    return (
      <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-950/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-sm">
          <div className="text-red-800 dark:text-red-200">
            <strong>Storage Almost Full:</strong> {storageInfo.percentage.toFixed(1)}% used
          </div>
          <div className="text-xs text-red-700 dark:text-red-300 mt-1">
            Please delete some players or reduce photo sizes to free up space.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (storageInfo.percentage > 75) {
    return (
      <Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-sm">
          <div className="text-yellow-800 dark:text-yellow-200">
            Storage: {storageInfo.percentage.toFixed(1)}% used
          </div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            Consider reducing photo sizes for better performance.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};