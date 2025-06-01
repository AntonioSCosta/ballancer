
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamActions from "@/components/TeamActions";
import { saveMatchResult, shareTeamsToWhatsApp, copyTeamsToClipboard } from "@/utils/teamResultUtils";
import type { Team } from "@/utils/teamDistribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsComparison from "@/components/TeamsComparison";

const GeneratedTeams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [playerGoals, setPlayerGoals] = useState<Record<string, number>>({});

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

    const initialGoals: Record<string, number> = {};
    selectedPlayers.forEach(player => {
      initialGoals[player.id] = 0;
    });
    setPlayerGoals(initialGoals);
  }, [location.state, navigate]);

  const handleRegenerateTeams = () => {
    const storedPlayers = localStorage.getItem("players");
    if (!storedPlayers) return;

    const allPlayers: Player[] = JSON.parse(storedPlayers);
    const selectedPlayers = allPlayers.filter((p) =>
      location.state.selectedPlayerIds.includes(p.id)
    );
    
    const distributedTeams = distributePlayersByPosition(selectedPlayers);
    setTeams(distributedTeams);
  };

  const handleGoalChange = (playerId: string, goals: number) => {
    setPlayerGoals(prev => ({
      ...prev,
      [playerId]: Math.max(0, goals)
    }));
  };

  const handleSaveResult = (winner: number) => {
    if (saveMatchResult(teams, winner, playerGoals)) {
      setShowResultDialog(false);
    }
  };

  // Transform teams for TeamsComparison component
  const transformedTeams = teams.map((team, index) => ({
    ...team,
    id: `team-${index + 1}`,
    name: `Team ${index + 1}`
  }));

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
        
        <TeamActions
          onRegenerateTeams={handleRegenerateTeams}
          onShareWhatsApp={() => shareTeamsToWhatsApp(teams)}
          onCopyTeams={() => copyTeamsToClipboard(teams)}
          teams={teams}
        />

        <Tabs defaultValue="tactical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tactical">Tactical View</TabsTrigger>
            <TabsTrigger value="comparison">Team Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="tactical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="overflow-x-auto"
                >
                  <div className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Team {index + 1} - Rating: {team.rating}
                  </div>
                  <FootballField 
                    players={team.players} 
                    teamName={`Team ${index + 1}`}
                    rotate={index === 1}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="comparison">
            {transformedTeams.length === 2 && <TeamsComparison team1={transformedTeams[0]} team2={transformedTeams[1]} />}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default GeneratedTeams;
