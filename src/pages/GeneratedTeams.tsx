
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, ArrowLeft, Share2, Copy } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamDisplay from "@/components/TeamDisplay";
import type { Team } from "@/utils/teamDistribution";

const GeneratedTeams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!location.state?.selectedPlayerIds) {
      navigate("/generator");
      return;
    }

    const storedPlayers = localStorage.getItem("players");
    if (!storedPlayers) {
      navigate("/generator");
      return;
    }

    const allPlayers: Player[] = JSON.parse(storedPlayers);
    const selectedPlayers = allPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const distributedTeams = distributePlayersByPosition(selectedPlayers);
    setTeams(distributedTeams);
  }, [location.state, navigate]);

  const handleShareWhatsApp = () => {
    const teamsInfo = teams
      .map(
        (team, i) =>
          `⚽ Team ${i + 1} (Rating: ${team.rating})\n\n` +
          team.players
            .map((p) => `- ${p.name} (${p.position})`)
            .join("\n")
      )
      .join("\n\n");

    try {
      const encodedText = encodeURIComponent(teamsInfo);
      const whatsappUrl = `whatsapp://send?text=${encodedText}`;
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      // Fallback to clipboard
      navigator.clipboard.writeText(teamsInfo)
        .then(() => toast.success("Teams copied to clipboard!"))
        .catch(() => toast.error("Failed to copy teams"));
    }
  };

  const handleRegenerateTeams = () => {
    const storedPlayers = localStorage.getItem("players");
    if (!storedPlayers) return;

    const allPlayers: Player[] = JSON.parse(storedPlayers);
    const selectedPlayers = allPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const distributedTeams = distributePlayersByPosition(selectedPlayers);
    setTeams(distributedTeams);
    
    toast.success("Teams regenerated!");
  };

  const handleCopyTeams = () => {
    const teamsInfo = teams
      .map(
        (team, i) =>
          `Team ${i + 1} (Rating: ${team.rating})\n\n` +
          team.players
            .map((p) => `- ${p.name} (${p.position})`)
            .join("\n")
      )
      .join("\n\n");

    navigator.clipboard.writeText(teamsInfo)
      .then(() => toast.success("Teams copied to clipboard!"))
      .catch(() => toast.error("Failed to copy teams"));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-2xl mx-auto py-4 px-4 md:py-8"
    >
      <div className="flex flex-col gap-6">
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
          <div className="w-8" />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
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
          <Button
            variant="outline"
            onClick={handleCopyTeams}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Teams
          </Button>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="tactics">Tactics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <TeamDisplay key={index} team={team} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tactics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="overflow-x-auto"
                >
                  <FootballField 
                    players={team.players} 
                    teamName={`Team ${index + 1}`}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default GeneratedTeams;
