import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Temporary mock data
const mockPlayers: Player[] = [
  {
    id: "1",
    name: "John Doe",
    position: "Forward",
    photo: "https://via.placeholder.com/300",
    attributes: {
      speed: 85,
      physical: 75,
      mental: 80,
      passing: 70,
      dribbling: 88,
      shooting: 90,
      heading: 65,
      defending: 45,
    },
    rating: 85,
  },
  // Add more mock players as needed
];

const TeamGenerator = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [players] = useState<Player[]>(mockPlayers);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Generator</h1>
          <p className="text-gray-500 mt-2">
            Selected players: {selectedPlayers.size}
          </p>
        </div>
        <div className="flex gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or position..."
            className="w-72"
          />
          <Button
            onClick={handleGenerateTeams}
            disabled={selectedPlayers.size < 10}
          >
            Generate Teams
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className={`cursor-pointer transition-transform duration-200 ${
              selectedPlayers.has(player.id)
                ? "ring-2 ring-primary rounded-xl transform scale-[1.02]"
                : ""
            }`}
            onClick={() => togglePlayerSelection(player.id)}
          >
            <PlayerCard player={player} />
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No players found</p>
        </div>
      )}
    </motion.div>
  );
};

export default TeamGenerator;