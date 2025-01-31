import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";

const PlayersList = () => {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(storedPlayers);
  }, []);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(search.toLowerCase()) ||
      player.position.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Players List
          </h1>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or position..."
            className="w-full md:w-72"
          />
        </div>

        {filteredPlayers.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlayers.map((player) => (
              <motion.div key={player.id} variants={item} layout>
                <PlayerCard
                  player={player}
                  onEdit={() => {
                    // Handle edit
                  }}
                  className="h-full"
                />
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
                ? "No players added yet. Start by creating a player!"
                : "No players found matching your search."}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayersList;