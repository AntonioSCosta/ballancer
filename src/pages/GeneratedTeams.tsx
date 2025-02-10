import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, ArrowLeft, Share2, Copy, Trophy } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamDisplay from "@/components/TeamDisplay";
import type { Team } from "@/utils/teamDistribution";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface MatchResult {
  date: string;
  teams: Team[];
  winner: number; // 0 = draw, 1 = team 1, 2 = team 2
  playerIds: string[];
}

const GeneratedTeams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showResultDialog, setShowResultDialog] = useState(false);

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

  const saveMatchResult = (winner: number) => {
    const matchResult: MatchResult = {
      date: new Date().toISOString(),
      teams,
      winner,
      playerIds: teams.flatMap(team => team.players.map(p => p.id))
    };

    // Load existing results
    const existingResults = JSON.parse(localStorage.getItem('matchResults') || '[]');
    
    // Add new result
    localStorage.setItem('matchResults', JSON.stringify([...existingResults, matchResult]));
    
    // Update player stats
    teams.forEach((team, index) => {
      team.players.forEach(player => {
        const playerStats = JSON.parse(localStorage.getItem(`playerStats_${player.id}`) || '{"wins": 0, "losses": 0, "draws": 0}');
        
        if (winner === 0) {
          playerStats.draws += 1;
        } else if (winner === index + 1) {
          playerStats.wins += 1;
        } else {
          playerStats.losses += 1;
        }
        
        localStorage.setItem(`playerStats_${player.id}`, JSON.stringify(playerStats));
      });
    });

    toast.success("Match result recorded!");
    setShowResultDialog(false);
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
          <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Record Result
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Match Result</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup onValueChange={(value) => saveMatchResult(parseInt(value))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="team1" />
                    <Label htmlFor="team1">Team 1 Won</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="team2" />
                    <Label htmlFor="team2">Team 2 Won</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="draw" />
                    <Label htmlFor="draw">Draw</Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
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
