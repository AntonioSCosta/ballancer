import { Player } from "@/types/player";
import { Team } from "@/types/team";

const GeneratedTeams = () => {
  const calculateTeamRating = (players: Player[]) => {
    const totalRating = players.reduce((sum, player) => sum + player.rating, 0);
    return totalRating / players.length;
  };

  const team1Players: Player[] = [
    {
      id: "player1",
      name: "Player 1",
      position: "Forward",
      photo: "https://example.com/player1.jpg",
      attributes: {
        speed: 90,
        physical: 85,
        mental: 80,
        passing: 75,
        dribbling: 88,
        shooting: 92,
        heading: 78,
        defending: 45,
      },
      rating: 86,
    },
    {
      id: "player2",
      name: "Player 2",
      position: "Midfielder",
      photo: "https://example.com/player2.jpg",
      attributes: {
        speed: 85,
        physical: 78,
        mental: 88,
        passing: 92,
        dribbling: 85,
        shooting: 78,
        heading: 70,
        defending: 75,
      },
      rating: 82,
    },
  ];

  const team2Players: Player[] = [
    {
      id: "player3",
      name: "Player 3",
      position: "Defender",
      photo: "https://example.com/player3.jpg",
      attributes: {
        speed: 75,
        physical: 92,
        mental: 78,
        passing: 70,
        dribbling: 65,
        shooting: 50,
        heading: 85,
        defending: 90,
      },
      rating: 78,
    },
    {
      id: "player4",
      name: "Player 4",
      position: "Goalkeeper",
      photo: "https://example.com/player4.jpg",
      attributes: {
        speed: 60,
        physical: 70,
        mental: 80,
        passing: 50,
        dribbling: 40,
        shooting: 30,
        heading: 40,
        defending: 60,
        handling: 92,
        diving: 88,
        positioning: 85,
        reflexes: 90,
      },
      rating: 80,
    },
  ];

  const teams: Team[] = [
    {
      id: "team1",
      name: "Team 1",
      players: team1Players,
      rating: calculateTeamRating(team1Players),
    },
    {
      id: "team2",
      name: "Team 2",
      players: team2Players,
      rating: calculateTeamRating(team2Players),
    },
  ];

  return (
    <div>
      <h1>Generated Teams</h1>
      {teams.map((team) => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>Rating: {team.rating.toFixed(2)}</p>
          <h3>Players:</h3>
          <ul>
            {team.players.map((player) => (
              <li key={player.id}>
                {player.name} - {player.position} (Rating: {player.rating})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GeneratedTeams;
