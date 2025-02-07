import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, RefreshCw, ArrowLeft } from "lucide-react";
import { FootballField } from "@/components/FootballField";
import { Player } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Team {
  players: Player[];
  rating: number;
}

const SimplePlayerCard = ({ player }: { player: Player }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              {getInitials(player.name)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{player.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">{player.position}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rating: {Math.round(player.rating)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const distributePlayersByPosition = (players: Player[]): Team[] => {
  const goalkeepers = players.filter(p => p.position === "Goalkeeper");
  const defenders = players.filter(p => p.position === "Defender");
  const midfielders = players.filter(p => p.position === "Midfielder");
  const forwards = players.filter(p => p.position === "Forward");

  const team1: Player[] = [];
  const team2: Player[] = [];

  if (goalkeepers.length >= 2) {
    team1.push(goalkeepers[0]);
    team2.push(goalkeepers[1]);
  } else if (goalkeepers.length === 1) {
    (Math.random() < 0.5 ? team1 : team2).push(goalkeepers[0]);
  }

  const distributePosition = (positionPlayers: Player[]) => {
    const shuffled = [...positionPlayers].sort(() => Math.random() - 0.5);
    
    const playersPerTeam = Math.floor(shuffled.length / 2);
    const extraPlayer = shuffled.length % 2;

    team1.push(...shuffled.slice(0, playersPerTeam + (team1.length <= team2.length ? extraPlayer : 0)));
    team2.push(...shuffled.slice(playersPerTeam + (team1.length > team2.length ? extraPlayer : 0)));
  };

  distributePosition(defenders);
  distributePosition(midfielders);
  distributePosition(forwards);

  const calculateTeamRating = (players: Player[]) => {
    if (players.length === 0) return 0;
    const sum = players.reduce((acc, player) => acc + player.rating, 0);
    return Math.round(sum / players.length);
  };

  return [
    {
      players: team1,
      rating: calculateTeamRating(team1)
    },
    {
      players: team2,
      rating: calculateTeamRating(team2)
    }
  ];
};

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
          `🏃‍♂️ Team ${i + 1} (Rating: ${team.rating})\n\n` +
          team.players
            .map((p) => `- ${p.name} (${p.position})`)
            .join("\n")
      )
      .join("\n\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(teamsInfo)}`,
      "_blank"
    );
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
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="tactics">Tactics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
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

                    <div className="mt-4 grid gap-3">
                      {team.players.map((player) => (
                        <SimplePlayerCard key={player.id} player={player} />
                      ))}
                    </div>
                  </div>
                </motion.div>
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
