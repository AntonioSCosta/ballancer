import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
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

  const handleGenerateTeams = () => {
    if (selectedPlayers.size < 10) {
      toast.error("Please select at least 10 players");
      return;
    }
    navigate("/generated-teams", {
      state: { selectedPlayerIds: Array.from(selectedPlayers) },
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Team Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Selected players: {selectedPlayers.size}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search players..."
              className="w-full sm:w-64"
            />
            <Button
              onClick={handleGenerateTeams}
              disabled={selectedPlayers.size < 10}
              className="whitespace-nowrap"
            >
              Generate Teams
            </Button>
          </div>
        </div>

        {filteredPlayers.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                variants={item}
                layout
                onClick={() => togglePlayerSelection(player.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlayers.has(player.id)
                    ? "ring-2 ring-primary rounded-xl transform scale-[1.02]"
                    : ""
                }`}
              >
                <PlayerCard player={player} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {players.length === 0
                ? "No players available. Start by creating some players!"
                : "No players found matching your search."}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamGenerator;