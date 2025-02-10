
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Player } from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";

interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  goals: number;
}

const PlayerStats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const player = location.state?.player as Player;
  
  if (!player) {
    navigate("/");
    return null;
  }

  const [stats, setStats] = useState<PlayerStats>(() => {
    const stored = localStorage.getItem(`playerStats_${player.id}`);
    return stored ? JSON.parse(stored) : { wins: 0, losses: 0, draws: 0, goals: 0 };
  });

  const handleStatChange = (key: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    
    setStats(prev => {
      const newStats = { ...prev, [key]: numValue };
      localStorage.setItem(`playerStats_${player.id}`, JSON.stringify(newStats));
      return newStats;
    });
  };

  const clearStats = () => {
    const newStats = { wins: 0, losses: 0, draws: 0, goals: 0 };
    localStorage.setItem(`playerStats_${player.id}`, JSON.stringify(newStats));
    setStats(newStats);
    toast.success("Statistics cleared successfully");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {player.name}'s Statistics
          </h1>

          <div className="grid gap-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="min-w-[100px] font-medium capitalize text-gray-700 dark:text-gray-300">
                  {key}:
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleStatChange(key as keyof PlayerStats, e.target.value)}
                  min="0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-6">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Statistics
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Statistics</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear all statistics for {player.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => document.querySelector('button[aria-label="Close"]')?.click()}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    clearStats();
                    document.querySelector('button[aria-label="Close"]')?.click();
                  }}
                >
                  Clear
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
