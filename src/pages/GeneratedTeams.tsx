
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamActions from "@/components/TeamActions";
import { saveMatchResult, shareTeamsToWhatsApp, copyTeamsToClipboard } from "@/utils/teamResultUtils";
import type { Team } from "@/utils/teamDistribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsComparison from "@/components/TeamsComparison";
import { ErrorHandler, handleStorageError } from "@/utils/errorHandler";
import { handleTeamGenerationError } from "@/utils/teamGenerationErrorHandler";
import LoadingSpinner from "@/components/LoadingSpinner";

const GeneratedTeams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [playerGoals, setPlayerGoals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateTeams = () => {
      try {
        setLoading(true);
        setError(null);

        if (!location.state?.selectedPlayerIds) {
          throw new Error("No players selected");
        }

        const storedPlayers = localStorage.getItem("players");
        if (!storedPlayers) {
          throw new Error("No players found in storage");
        }

        const allPlayers: Player[] = JSON.parse(storedPlayers);
        const selectedPlayers = allPlayers.filter((p) =>
          location.state.selectedPlayerIds.includes(p.id)
        );

        if (selectedPlayers.length === 0) {
          throw new Error("Selected players not found");
        }

        if (selectedPlayers.length < 10) {
          throw new Error("Not enough players selected for team generation");
        }
        
        const distributedTeams = distributePlayersByPosition(selectedPlayers);
        if (!distributedTeams || distributedTeams.length !== 2) {
          throw new Error("Failed to generate balanced teams");
        }

        setTeams(distributedTeams);

        const initialGoals: Record<string, number> = {};
        selectedPlayers.forEach(player => {
          initialGoals[player.id] = 0;
        });
        setPlayerGoals(initialGoals);

      } catch (err) {
        console.error("Team generation error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to generate teams";
        setError(errorMessage);
        ErrorHandler.handle(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    generateTeams();
  }, [location.state, navigate]);

  const handleRegenerateTeams = () => {
    try {
      if (!location.state?.selectedPlayerIds) {
        ErrorHandler.handle("No players selected for regeneration");
        return;
      }

      const storedPlayers = localStorage.getItem("players");
      if (!storedPlayers) {
        handleStorageError("load players for regeneration");
        return;
      }

      const allPlayers: Player[] = JSON.parse(storedPlayers);
      const selectedPlayers = allPlayers.filter((p) =>
        location.state.selectedPlayerIds.includes(p.id)
      );
      
      const distributedTeams = distributePlayersByPosition(selectedPlayers);
      setTeams(distributedTeams);
      ErrorHandler.success("Teams regenerated successfully");
    } catch (err) {
      handleTeamGenerationError(err as Error);
    }
  };

  const handleGoalChange = (playerId: string, goals: number) => {
    try {
      setPlayerGoals(prev => ({
        ...prev,
        [playerId]: Math.max(0, goals)
      }));
    } catch (err) {
      ErrorHandler.handle("Failed to update goal count");
    }
  };

  const handleSaveResult = (winner: number) => {
    try {
      if (saveMatchResult(teams, winner, playerGoals)) {
        setShowResultDialog(false);
        ErrorHandler.success("Match result saved successfully");
      }
    } catch (err) {
      handleStorageError("save match result", err as Error);
    }
  };

  const handleShare = () => {
    try {
      shareTeamsToWhatsApp(teams);
    } catch (err) {
      ErrorHandler.handle("Failed to share teams");
    }
  };

  const handleCopy = () => {
    try {
      copyTeamsToClipboard(teams);
      ErrorHandler.success("Teams copied to clipboard");
    } catch (err) {
      ErrorHandler.handle("Failed to copy teams to clipboard");
    }
  };

  const handleBackToGenerator = () => {
    try {
      navigate("/generator");
    } catch (err) {
      ErrorHandler.handle("Failed to navigate back");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto py-4 px-4 md:py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message="Generating teams..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-4 px-4 md:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Team Generation Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <div className="space-y-2">
              <Button onClick={handleBackToGenerator}>
                Back to Team Generator
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={handleBackToGenerator}
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
          onShareWhatsApp={handleShare}
          onCopyTeams={handleCopy}
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
