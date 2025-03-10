
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

const TeamGenerator = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [players] = useState<Player[]>(() => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  });
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(search.toLowerCase()) ||
      player.position.toLowerCase().includes(search.toLowerCase())
  );

  const togglePlayerSelection = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleEditPlayer = (playerId: string) => {
    navigate(`/create-player?edit=${playerId}`);
  };

  const handleGenerateTeams = () => {
    if (selectedPlayers.size < 10) {
      toast.error("Please select at least 10 players");
      return;
    }
    navigate("/generated-teams", {
      state: { selectedPlayerIds: Array.from(selectedPlayers) },
    });
  };

  const handleCreatePlayer = () => {
    navigate("/");
  };

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
