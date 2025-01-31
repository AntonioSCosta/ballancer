import { motion } from "framer-motion";

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

const AttributeBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="w-24 text-gray-600 dark:text-gray-300">{label}</span>
    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="w-8 text-right text-gray-700 dark:text-gray-300 font-medium">{value}</span>
  </div>
);

export const PlayerCard = ({ player, onEdit, className = "" }: PlayerCardProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={player.photo || "https://via.placeholder.com/300"}
          alt={player.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-medium">{Math.round(player.rating)}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{player.name}</h3>
            <span className="text-sm text-primary font-medium">
              {player.position}
            </span>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        <div className="space-y-3">
          {getAttributes().map((attr) => (
            <AttributeBar
              key={attr.label}
              label={attr.label}
              value={attr.value}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};