import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { SearchBar } from "@/components/SearchBar";

const PlayersList = () => {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

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
      className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Players List
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your players
            </p>
          </div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or position..."
            className="w-full"
          />
        </div>

        {filteredPlayers.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="w-full"
              >
                <PlayerCard
                  player={player}
                  className="h-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
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