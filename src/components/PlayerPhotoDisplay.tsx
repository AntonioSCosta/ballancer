import { Player } from "@/types/player";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/utils/playerCardUtils";
import { User } from "lucide-react";

interface PlayerPhotoDisplayProps {
  player: Player;
  size?: "sm" | "md" | "lg" | "xl";
  showPosition?: boolean;
  className?: string;
}

const PlayerPhotoDisplay = ({ 
  player, 
  size = "md", 
  showPosition = true,
  className = "" 
}: PlayerPhotoDisplayProps) => {
  const getPositionColor = (position: string) => {
    const colors = {
      "Goalkeeper": "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300",
      "Defender": "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300", 
      "Midfielder": "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300",
      "Forward": "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300"
    };
    return colors[position as keyof typeof colors] || "bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300";
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  const badgeSizes = {
    sm: "w-3 h-3 text-[8px]",
    md: "w-4 h-4 text-[10px]",
    lg: "w-5 h-5 text-xs", 
    xl: "w-6 h-6 text-sm"
  };

  return (
    <div className={`relative group ${className}`}>
      <div className={`${sizeClasses[size]} shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 backdrop-blur-sm`}>
        {player.photo && player.photo !== "https://via.placeholder.com/300" ? (
          <img 
            src={player.photo} 
            alt={player.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/80 flex items-center justify-center">
            <User className="h-1/2 w-1/2 text-muted-foreground/70" />
          </div>
        )}
        
        {/* Subtle overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {showPosition && (
        <div className={`absolute -bottom-1 -right-1 ${badgeSizes[size]} rounded-full ${getPositionColor(player.position)} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
          <span className="text-white font-bold drop-shadow-sm">
            {player.position[0]}
          </span>
        </div>
      )}
      
      {/* Rating badge for larger sizes */}
      {(size === "lg" || size === "xl") && (
        <div className="absolute -top-1 -left-1 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl backdrop-blur-sm">
          {Math.round(player.rating)}
        </div>
      )}
    </div>
  );
};

export default PlayerPhotoDisplay;