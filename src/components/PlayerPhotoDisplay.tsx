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
      "Goalkeeper": "border-orange-500 bg-orange-500",
      "Defender": "border-blue-500 bg-blue-500", 
      "Midfielder": "border-purple-500 bg-purple-500",
      "Forward": "border-emerald-500 bg-emerald-500"
    };
    return colors[position as keyof typeof colors] || "border-gray-500 bg-gray-500";
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
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-lg`}>
        {player.photo && player.photo !== "https://via.placeholder.com/300" ? (
          <AvatarImage 
            src={player.photo} 
            alt={player.name}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-muted/50 text-muted-foreground">
            <User className="h-1/2 w-1/2" />
          </AvatarFallback>
        )}
      </Avatar>
      
      {showPosition && (
        <div className={`absolute -bottom-1 -right-1 ${badgeSizes[size]} rounded-full border-2 border-white ${getPositionColor(player.position)} flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold">
            {player.position[0]}
          </span>
        </div>
      )}
      
      {/* Rating badge for larger sizes */}
      {(size === "lg" || size === "xl") && (
        <div className="absolute -top-1 -left-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-md">
          {Math.round(player.rating)}
        </div>
      )}
    </div>
  );
};

export default PlayerPhotoDisplay;