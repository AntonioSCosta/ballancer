import { useState, useEffect } from "react";
import type { Player } from "@/types/player";

const FootballField = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Fetch players data from an API or state management
    const fetchPlayers = async () => {
      // Simulated fetch
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="football-field">
      {players.map(player => (
        <div key={player.id} className={`player ${player.position.toLowerCase()}`}>
          <img src={player.photo} alt={player.name} />
          <span>{player.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FootballField;
