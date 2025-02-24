
import { PlayerStats } from "@/types/player";

interface PlayerStatsDisplayProps {
  stats: PlayerStats;
  winRate: number;
}

export const PlayerStatsDisplay = ({ stats, winRate }: PlayerStatsDisplayProps) => (
  <div className="space-y-3 mb-4">
    <div className="bg-primary/10 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Win Rate</span>
        <span className="text-sm font-bold text-primary">{winRate}%</span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-green-600 dark:text-green-400">Wins: {stats.wins}</span>
          <span className="text-red-600 dark:text-red-400">Losses: {stats.losses}</span>
          <span className="text-gray-600 dark:text-gray-400">Draws: {stats.draws}</span>
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-yellow-600 dark:text-yellow-400">Goals: {stats.goals}</span>
        </div>
      </div>
    </div>
  </div>
);
