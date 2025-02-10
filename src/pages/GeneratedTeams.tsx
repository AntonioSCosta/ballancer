import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, ArrowLeft, Share2, FileDown } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distributePlayersByPosition } from "@/utils/teamDistribution";
import TeamDisplay from "@/components/TeamDisplay";
import type { Team } from "@/utils/teamDistribution";
import jsPDF from "jspdf";

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

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const lineHeight = 10;
    const margin = 20;

    // Add title
    pdf.setFontSize(16);
    pdf.text("Generated Teams", margin, yPosition);
    yPosition += lineHeight * 2;

    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += lineHeight * 2;

    teams.forEach((team, teamIndex) => {
      // Add team header
      pdf.setFontSize(14);
      pdf.text(`Team ${teamIndex + 1} (Rating: ${team.rating})`, margin, yPosition);
      yPosition += lineHeight;

      // Add players
      pdf.setFontSize(12);
      team.players.forEach((player) => {
        if (yPosition > 270) { // Check if we need a new page
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${player.name} - ${player.position}`, margin, yPosition);
        yPosition += lineHeight;
      });

      yPosition += lineHeight; // Add space between teams
    });

    // Save the PDF
    pdf.save("generated-teams.pdf");
    toast.success("Teams exported to PDF!");
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
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="tactics">Tactics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <TeamDisplay key={index} team={team} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tactics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
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
