import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { Team } from "@/types/team";
import { FootballField } from "@/components/FootballField";
import { distributePlayersByPosition } from "@/utils/teamDistribution";

const initialPlayers: Player[] = [
  { id: "1", name: "Ronaldo", position: "Forward", rating: 95, attributes: { speed: 90, shooting: 95, passing: 80, dribbling: 92, defending: 30, physical: 88, mental: 90 } , photo: "https://e0.365dm.com/24/02/2048x1152/skysports-cristiano-ronaldo_6445449.jpg?20240209191435"},
  { id: "2", name: "Messi", position: "Forward", rating: 94, attributes: { speed: 88, shooting: 94, passing: 95, dribbling: 97, defending: 32, physical: 75, mental: 92 }, photo: "https://img.a.transfermarkt.technology/image/foto/normal/lionel-messi.png" },
  { id: "3", name: "Neymar", position: "Forward", rating: 92, attributes: { speed: 92, shooting: 90, passing: 88, dribbling: 95, defending: 40, physical: 78, mental: 89 }, photo: "https://static.independent.co.uk/2023/08/02/12/neymar%20profile.jpg?quality=75&width=982&height=726&auto=webp" },
  { id: "4", name: "Mbappe", position: "Forward", rating: 93, attributes: { speed: 96, shooting: 93, passing: 82, dribbling: 94, defending: 35, physical: 85, mental: 91 }, photo: "https://cdn.britannica.com/91/238491-050-897730E4/Kylian-Mbappe-2022.jpg" },
  { id: "5", name: "De Bruyne", position: "Midfielder", rating: 91, attributes: { speed: 85, shooting: 88, passing: 96, dribbling: 90, defending: 70, physical: 82, mental: 94 } },
  { id: "6", name: "Van Dijk", position: "Defender", rating: 90, attributes: { speed: 75, shooting: 60, passing: 72, dribbling: 65, defending: 95, physical: 92, mental: 88 } },
  { id: "7", name: "Alisson", position: "Goalkeeper", rating: 89, attributes: { speed: 65, shooting: 40, passing: 68, dribbling: 50, defending: 90, physical: 85, mental: 86 } },
  { id: "8", name: "Ramos", position: "Defender", rating: 88, attributes: { speed: 78, shooting: 65, passing: 75, dribbling: 70, defending: 92, physical: 89, mental: 85 } },
  { id: "9", name: "Lewandowski", position: "Forward", rating: 92, attributes: { speed: 82, shooting: 94, passing: 78, dribbling: 85, defending: 45, physical: 86, mental: 90 } },
  { id: "10", name: "Kante", position: "Midfielder", rating: 87, attributes: { speed: 84, shooting: 62, passing: 75, dribbling: 80, defending: 90, physical: 88, mental: 85 } },
  { id: "11", name: "Salah", position: "Forward", rating: 91, attributes: { speed: 94, shooting: 90, passing: 82, dribbling: 92, defending: 42, physical: 80, mental: 88 } },
  { id: "12", name: "Haaland", position: "Forward", rating: 90, attributes: { speed: 92, shooting: 91, passing: 70, dribbling: 84, defending: 30, physical: 90, mental: 85 } },
  { id: "13", name: "Courtois", position: "Goalkeeper", rating: 88, attributes: { speed: 50, shooting: 20, passing: 30, dribbling: 30, defending: 92, physical: 80, mental: 85 } },
  { id: "14", name: "Alexander-Arnold", position: "Defender", rating: 87, attributes: { speed: 80, shooting: 70, passing: 90, dribbling: 82, defending: 85, physical: 78, mental: 84 } },
  { id: "15", name: "Son", position: "Forward", rating: 89, attributes: { speed: 90, shooting: 88, passing: 80, dribbling: 89, defending: 40, physical: 76, mental: 86 } },
  { id: "16", name: "Suarez", position: "Forward", rating: 86, attributes: { speed: 78, shooting: 87, passing: 84, dribbling: 85, defending: 48, physical: 75, mental: 84 } },
  { id: "17", name: "Neuer", position: "Goalkeeper", rating: 87, attributes: { speed: 55, shooting: 25, passing: 60, dribbling: 45, defending: 88, physical: 78, mental: 84 } },
  { id: "18", name: "Pogba", position: "Midfielder", rating: 86, attributes: { speed: 79, shooting: 82, passing: 88, dribbling: 86, defending: 75, physical: 80, mental: 83 } },
  { id: "19", name: "Griezmann", position: "Forward", rating: 87, attributes: { speed: 80, shooting: 86, passing: 85, dribbling: 87, defending: 60, physical: 74, mental: 85 } },
  { id: "20", name: "Chiellini", position: "Defender", rating: 85, attributes: { speed: 68, shooting: 50, passing: 65, dribbling: 60, defending: 90, physical: 88, mental: 82 } }
];

const TeamGenerator = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [teams, setTeams] = useState<Team[]>([]);

  const handleGenerateTeams = () => {
    const generatedTeams = distributePlayersByPosition(players);
    setTeams(generatedTeams);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Generator</h1>
      
      <Button onClick={handleGenerateTeams} className="mb-4">
        Generate Teams
      </Button>

      <div className="flex flex-col md:flex-row gap-4">
        {teams.map((team) => (
          <div key={team.id} className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold mb-2">{team.name} (Rating: {team.rating})</h2>
            <FootballField players={team.players} teamName={team.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamGenerator;
