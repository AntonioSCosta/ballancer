
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamDisplay from "@/components/TeamDisplay";
import TeamActions from "@/components/TeamActions";
import { saveMatchResult, shareTeamsToWhatsApp, copyTeamsToClipboard } from "@/utils/teamResultUtils";
import type { MatchResult } from "@/types/matchResult";

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

    // Initialize player goals
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
          showResultDialog={showResultDialog}
          setShowResultDialog={setShowResultDialog}
          playerGoals={playerGoals}
          onGoalChange={handleGoalChange}
          onSaveResult={handleSaveResult}
        />

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
