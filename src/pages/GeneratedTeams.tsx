import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { toast } from "sonner";
import { Share2, RefreshCw, ArrowLeft } from "lucide-react";

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

interface Team {
  players: Player[];
  rating: number;
}

const GeneratedTeams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!location.state?.selectedPlayerIds) {
      navigate("/generator");
      return;
    }

    // Here you would implement your team generation algorithm
    const selectedPlayers = mockPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const midpoint = Math.floor(shuffled.length / 2);
    
    const calculateTeamRating = (players: Player[]) => {
      if (players.length === 0) return 0;
      const sum = players.reduce((acc, player) => acc + player.rating, 0);
      return Math.round(sum / players.length);
    };

    setTeams([
      {
        players: shuffled.slice(0, midpoint),
        rating: calculateTeamRating(shuffled.slice(0, midpoint)),
      },
      {
        players: shuffled.slice(midpoint),
        rating: calculateTeamRating(shuffled.slice(midpoint)),
      },
    ]);
  }, [location.state, navigate]);

  const handleShareWhatsApp = () => {
    const message = teams
      .map(
        (team, i) =>
          `Team ${i + 1} (Rating: ${team.rating}):\n${team.players
            .map((p) => `- ${p.name} (${p.position})`)
            .join("\n")}`
      )
      .join("\n\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleRegenerateTeams = () => {
    const selectedPlayers = mockPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const midpoint = Math.floor(shuffled.length / 2);
    
    const calculateTeamRating = (players: Player[]) => {
      if (players.length === 0) return 0;
      const sum = players.reduce((acc, player) => acc + player.rating, 0);
      return Math.round(sum / players.length);
    };

    setTeams([
      {
        players: shuffled.slice(0, midpoint),
        rating: calculateTeamRating(shuffled.slice(0, midpoint)),
      },
      {
        players: shuffled.slice(midpoint),
        rating: calculateTeamRating(shuffled.slice(midpoint)),
      },
    ]);
    
    toast.success("Teams regenerated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-4 px-2 md:py-8 md:px-4"
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/generator")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Generated Teams
          </h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={handleRegenerateTeams}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
          <Button 
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {teams.map((team, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Team {index + 1}
              </h2>
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold">
                  Rating: {team.rating}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {team.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  className="transform-none shadow-sm"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GeneratedTeams;
