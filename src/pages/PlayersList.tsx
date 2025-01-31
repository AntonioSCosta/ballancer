import { useState } from "react";
import { motion } from "framer-motion";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";

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

const PlayersList = () => {
  const [search, setSearch] = useState("");
  const [players] = useState<Player[]>(mockPlayers);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(search.toLowerCase()) ||
      player.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Players List</h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or position..."
          className="w-72"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onEdit={() => {
              // Handle edit
            }}
          />
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

export default PlayersList;