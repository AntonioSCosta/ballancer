import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayerCard, Player } from "@/components/PlayerCard";
import { toast } from "sonner";

// Temporary mock data (replace with your actual data)
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
    // For now, we'll just split the players randomly
    const selectedPlayers = mockPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const midpoint = Math.floor(shuffled.length / 2);
    
    setTeams([
      {
        players: shuffled.slice(0, midpoint),
        rating: Math.round(
          shuffled
            .slice(0, midpoint)
            .reduce((acc, p) => acc + p.rating, 0) / midpoint
        ),
      },
      {
        players: shuffled.slice(midpoint),
        rating: Math.round(
          shuffled
            .slice(midpoint)
            .reduce((acc, p) => acc + p.rating, 0) /
            (shuffled.length - midpoint)
        ),
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
    // Re-run the team generation algorithm
    const selectedPlayers = mockPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const midpoint = Math.floor(shuffled.length / 2);
    
    setTeams([
      {
        players: shuffled.slice(0, midpoint),
        rating: Math.round(
          shuffled
            .slice(0, midpoint)
            .reduce((acc, p) => acc + p.rating, 0) / midpoint
        ),
      },
      {
        players: shuffled.slice(midpoint),
        rating: Math.round(
          shuffled
            .slice(midpoint)
            .reduce((acc, p) => acc + p.rating, 0) /
            (shuffled.length - midpoint)
        ),
      },
    ]);
    
    toast.success("Teams regenerated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generated Teams</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/generator")}>
            Back to Selection
          </Button>
          <Button variant="outline" onClick={handleRegenerateTeams}>
            Regenerate Teams
          </Button>
          <Button onClick={handleShareWhatsApp}>Share on WhatsApp</Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {teams.map((team, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Team {index + 1}
              </h2>
              <div className="px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold">
                  Rating: {team.rating}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              {team.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  className="transform-none shadow-md"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GeneratedTeams;