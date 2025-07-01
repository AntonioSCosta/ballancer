
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackupManager } from '@/utils/backupManager';
import { Download, Upload, RotateCcw, AlertCircle } from 'lucide-react';
import { ErrorHandler } from '@/utils/errorHandler';

const BackupSettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      BackupManager.exportBackup();
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const success = await BackupManager.importBackup(file);
      if (success) {
        // Refresh the page to show imported data
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setIsImporting(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const handleRestoreBackup = () => {
    const confirmed = window.confirm(
      'This will restore your data from the automatic backup created before your last import. Are you sure?'
    );
    
    if (confirmed) {
      const success = BackupManager.restoreFromAutoBackup();
      if (success) {
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Backup & Restore
        </CardTitle>
        <CardDescription>
          Export your player data for backup or import data from a previous backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Export Data</Label>
            <Button 
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Backup'}
            </Button>
            <p className="text-xs text-gray-500">
              Download all your player data as a JSON file
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup-import">Import Data</Label>
            <div className="relative">
              <Input
                id="backup-import"
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={isImporting}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {isImporting && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <span className="text-sm">Importing...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Import player data from a backup file
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Automatic Backup Available
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                A backup was automatically created before your last import. You can restore it if needed.
              </p>
              <Button 
                onClick={handleRestoreBackup}
                size="sm"
                variant="outline"
                className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-amber-900/40"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Restore Auto-Backup
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupSettings;
