import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayerCard } from "@/components/PlayerCard";
import { Player } from "@/types/player";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { validateTeamGeneration, handleTeamGenerationError } from "@/utils/teamGenerationErrorHandler";
import { ErrorHandler, handleStorageError } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/LoadingSpinner";

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
        const storedPlayers = localStorage.getItem("players");
        if (storedPlayers) {
          const parsedPlayers = JSON.parse(storedPlayers);
          if (Array.isArray(parsedPlayers)) {
            setPlayers(parsedPlayers);
          } else {
            throw new Error("Invalid player data format");
          }
        } else {
          setPlayers([]);
        }
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
      className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Team Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Select players to generate balanced teams
            </p>
          </div>
          <div className="flex gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search players..."
              className="flex-1"
            />
            <Button onClick={handleCreatePlayer} variant="outline" className="shrink-0">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Player
            </Button>
          </div>
        </div>

        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-24">
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                layout
                onClick={() => togglePlayerSelection(player.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlayers.has(player.id)
                    ? "ring-2 ring-primary rounded-xl transform scale-[1.02]"
                    : "hover:scale-[1.01]"
                }`}
              >
                <PlayerCard
                  player={player}
                  onEdit={() => handleEditPlayer(player.id)}
                  className="h-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {players.length === 0
                ? "No players available. Start by creating some players!"
                : "No players found matching your search."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md px-4">
        <Button
          onClick={handleGenerateTeams}
          disabled={selectedPlayers.size < 10}
          className="w-full shadow-lg animate-fade-in"
          size="lg"
        >
          <Users className="mr-2 h-5 w-5" />
          Generate Teams ({selectedPlayers.size})
        </Button>
      </div>
    </motion.div>
  );
};

export default TeamGenerator;
