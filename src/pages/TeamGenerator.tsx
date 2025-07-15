import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayerCard } from "@/components/PlayerCard";
import { Player } from "@/types/player";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, AlertTriangle, Info, Database, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { validateTeamGeneration, handleTeamGenerationError } from "@/utils/teamGenerationErrorHandler";
import { ErrorHandler, handleStorageError } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/LoadingSpinner";
import { analyzePositionBalance } from "@/utils/positionAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StorageUtils } from "@/utils/storageUtils";
import { StorageHealthCheck } from "@/components/StorageHealthCheck";
import { generateSamplePlayers } from "@/utils/samplePlayers";
import { Link } from "react-router-dom";

const TeamGenerator = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayers = () => {
      try {
        setLoading(true);
        
        // Clean up any corrupted player data
        StorageUtils.cleanupInvalidPlayers();
        
        // Load valid players
        const allPlayers = StorageUtils.getPlayers();
        const { valid, invalid } = StorageUtils.validatePlayerData(allPlayers);
        
        if (invalid.length > 0) {
          console.warn(`Found ${invalid.length} invalid players during load`);
          // Save only valid players back
          StorageUtils.savePlayers(valid);
        }
        
        setPlayers(valid);
        setError(null);
      } catch (err) {
        console.error("Failed to load players:", err);
        setError("Failed to load players from storage");
        handleStorageError("load players", err as Error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(search.toLowerCase()) ||
      player.position.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPlayersList = players.filter(p => selectedPlayers.has(p.id));
  const positionAnalysis = analyzePositionBalance(selectedPlayersList);

  const togglePlayerSelection = (playerId: string) => {
    try {
      const newSelected = new Set(selectedPlayers);
      if (newSelected.has(playerId)) {
        newSelected.delete(playerId);
      } else {
        newSelected.add(playerId);
      }
      setSelectedPlayers(newSelected);
    } catch (err) {
      ErrorHandler.handle("Failed to update player selection");
    }
  };

  const handleEditPlayer = (playerId: string) => {
    try {
      navigate(`/create-player?edit=${playerId}`);
    } catch (err) {
      ErrorHandler.handle("Failed to navigate to player editor");
    }
  };

  const handleGenerateTeams = () => {
    try {
      const selectedPlayersList = players.filter(p => selectedPlayers.has(p.id));
      
      if (!validateTeamGeneration(selectedPlayersList)) {
        return;
      }

      toast.success("Teams generated successfully!", {
        description: "Your balanced teams are ready!"
      });

      navigate("/generated-teams", {
        state: { selectedPlayerIds: Array.from(selectedPlayers) },
      });
    } catch (err) {
      handleTeamGenerationError(err as Error);
    }
  };

  const handleCreatePlayer = () => {
    try {
      navigate("/");
    } catch (err) {
      ErrorHandler.handle("Failed to navigate to player creation");
    }
  };

  const handlePopulateDatabase = () => {
    const samplePlayers = generateSamplePlayers();
    const existingPlayers = StorageUtils.getPlayers();
    
    // Filter out players with duplicate names
    const newPlayers = samplePlayers.filter(samplePlayer => 
      !existingPlayers.some(existing => 
        existing.name.toLowerCase() === samplePlayer.name.toLowerCase()
      )
    );
    
    if (newPlayers.length === 0) {
      toast.info("All sample players already exist in your database");
      return;
    }
    
    const allPlayers = [...existingPlayers, ...newPlayers];
    if (StorageUtils.savePlayers(allPlayers)) {
      setPlayers(allPlayers);
      toast.success(`Added ${newPlayers.length} sample players to your database!`);
    }
  };

  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to delete all players? This action cannot be undone.")) {
      if (StorageUtils.savePlayers([])) {
        setPlayers([]);
        setSelectedPlayers(new Set());
        toast.success("All players deleted successfully!");
      }
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Loading players..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unable to Load Players
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-3 py-4 bg-background min-h-screen relative"
    >
      <div className="space-y-4 pb-32">
        <StorageHealthCheck />
        
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Team Generator
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Select players to generate balanced teams
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search players..."
              className="flex-1"
            />
            <div className="flex gap-2">
              {players.length === 0 && (
                <Button 
                  onClick={handlePopulateDatabase}
                  variant="outline" 
                  className="shrink-0 h-11 px-3"
                >
                  <Database className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sample Players</span>
                  <span className="sm:hidden">Sample</span>
                </Button>
              )}
              {players.length > 0 && (
                <Button 
                  onClick={handleClearDatabase}
                  variant="outline" 
                  className="shrink-0 h-11 px-3 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
              <Button 
                onClick={handleCreatePlayer} 
                variant="outline" 
                className="shrink-0 h-11 px-4"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create Player</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedPlayers.size > 0 && (
            <div className="bg-card border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedPlayers.size} players selected
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedPlayers.size >= 10 ? "Ready to generate" : `Need ${10 - selectedPlayers.size} more`}
                </span>
              </div>
              
              {/* Position Balance Warnings */}
              {positionAnalysis.warnings.length > 0 && (
                <Alert className="mt-2 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    <div className="space-y-1">
                      {positionAnalysis.warnings.map((warning, idx) => (
                        <div key={idx} className="text-yellow-800 dark:text-yellow-200">
                          {warning}
                        </div>
                      ))}
                      {positionAnalysis.suggestions.length > 0 && (
                        <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                          {positionAnalysis.suggestions.join(". ")}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                layout
                onClick={() => togglePlayerSelection(player.id)}
                className={`cursor-pointer transition-all duration-200 touch-manipulation ${
                  selectedPlayers.has(player.id)
                    ? "ring-2 ring-primary rounded-xl transform scale-[1.02] shadow-lg"
                    : "hover:scale-[1.01] active:scale-[0.98]"
                }`}
              >
                <PlayerCard
                  player={player}
                  onEdit={() => handleEditPlayer(player.id)}
                  className="h-full bg-card shadow-md border border-border hover:shadow-lg transition-shadow"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-card rounded-lg shadow-md border border-border"
          >
            {players.length === 0 ? (
              <div className="space-y-4">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-muted-foreground text-sm mb-3">
                    No players in your database yet. Get started quickly!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      onClick={handlePopulateDatabase}
                      className="text-sm"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Add 22 Sample Players
                    </Button>
                    <Button
                      onClick={handleCreatePlayer}
                      variant="outline"
                      className="text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Custom Player
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No players found matching your search.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating Action Button - Thumb-friendly bottom placement */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
        <div className="container mx-auto max-w-md">
          <Button
            onClick={handleGenerateTeams}
            disabled={selectedPlayers.size < 10}
            className="w-full shadow-lg h-12 text-base font-medium touch-manipulation"
            size="lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Generate Teams ({selectedPlayers.size})
            {selectedPlayers.size < 10 && (
              <span className="ml-2 text-xs opacity-75">
                (Need {10 - selectedPlayers.size} more)
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamGenerator;
