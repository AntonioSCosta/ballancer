
import { useState, useEffect } from "react";
import type { Player } from "@/types/player";

export const FootballField = ({ players, teamName, rotate = false }: { 
  players: Player[];
  teamName: string;
  rotate?: boolean;
}) => {
  return (
    <div className={`football-field relative w-full aspect-[2/3] bg-green-600 rounded-lg p-4 ${
      rotate ? 'rotate-180' : ''
    }`}>
      {players.map(player => (
        <div 
          key={player.id} 
          className={`player absolute ${rotate ? 'rotate-180' : ''} ${
            player.position.toLowerCase()
          }`}
        >
          <img 
            src={player.photo || '/placeholder.svg'} 
            alt={player.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-xs text-white mt-1 font-medium">{player.name}</span>
        </div>
      ))}
    </div>
  );
};
