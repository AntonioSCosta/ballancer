
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

export interface PlayerAttributes {
  speed: number;
  physical?: number;
  mental: number;
  passing: number;
  dribbling?: number;
  shooting?: number;
  heading?: number;
  defending?: number;
  handling?: number;
  diving?: number;
  positioning?: number;
  reflexes?: number;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  photo: string;
  attributes: PlayerAttributes;
  rating: number;
}

interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  className?: string;
}

const getPositionColor = (position: PlayerPosition) => {
  const colors = {
    "Goalkeeper": "bg-orange-500",
    "Defender": "bg-blue-500",
    "Midfielder": "bg-purple-500",
    "Forward": "bg-emerald-500"
  };
  return colors[position];
};

const AttributeBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{label}</span>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export const PlayerCard = ({ player, className = "" }: PlayerCardProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/", { state: { player } });
  };

  const getAttributes = () => {
    if (player.position === "Goalkeeper") {
      return [
        { label: "Handling", value: player.attributes.handling || 0 },
        { label: "Diving", value: player.attributes.diving || 0 },
        { label: "Positioning", value: player.attributes.positioning || 0 },
        { label: "Reflexes", value: player.attributes.reflexes || 0 },
        { label: "Mental", value: player.attributes.mental },
        { label: "Passing", value: player.attributes.passing },
        { label: "Speed", value: player.attributes.speed },
      ];
    }

    return [
      { label: "Speed", value: player.attributes.speed },
      { label: "Physical", value: player.attributes.physical || 0 },
      { label: "Mental", value: player.attributes.mental },
      { label: "Passing", value: player.attributes.passing },
      { label: "Dribbling", value: player.attributes.dribbling || 0 },
      { label: "Shooting", value: player.attributes.shooting || 0 },
      { label: "Heading", value: player.attributes.heading || 0 },
      { label: "Defending", value: player.attributes.defending || 0 },
    ];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className={`w-full h-full flex items-center justify-center ${getPositionColor(player.position)}`}>
          <span className="text-4xl font-bold text-white">
            {getInitials(player.name)}
          </span>
        </div>
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-medium">{Math.round(player.rating)}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="max-w-[80%]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {player.name}
            </h3>
            <span className="text-sm text-primary font-medium">
              {player.position}
            </span>
          </div>
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {getAttributes().map((attr, index) => (
            <div key={attr.label} className={index % 2 === 0 ? "col-span-1" : "col-span-1"}>
              <AttributeBar
                label={attr.label}
                value={attr.value}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

