import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayerPosition, Player } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CreatePlayer = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("Midfielder");
  const [attributes, setAttributes] = useState({
    speed: 50,
    physical: 50,
    mental: 50,
    passing: 50,
    dribbling: 50,
    shooting: 50,
    heading: 50,
    defending: 50,
    handling: 50,
    diving: 50,
    positioning: 50,
    reflexes: 50,
  });

  const handleAttributeChange = (attr: string, value: number[]) => {
    setAttributes((prev) => ({
      ...prev,
      [attr]: value[0],
    }));
  };

  const calculateRating = (attrs: typeof attributes, pos: PlayerPosition) => {
    if (pos === "Goalkeeper") {
      return Math.round(
        (attrs.handling + attrs.diving + attrs.positioning + attrs.reflexes + attrs.mental + attrs.passing + attrs.speed) / 7
      );
    }
    return Math.round(
      (attrs.speed + attrs.physical + attrs.mental + attrs.passing + attrs.dribbling + attrs.shooting + attrs.heading + attrs.defending) / 8
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      position,
      photo: "https://via.placeholder.com/300",
      attributes,
      rating: calculateRating(attributes, position),
    };

    // Get existing players from localStorage
    const existingPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    
    // Add new player
    localStorage.setItem("players", JSON.stringify([...existingPlayers, newPlayer]));
    
    toast.success("Player created successfully!");
    
    // Reset form
    setName("");
    setPosition("Midfielder");
    setAttributes({
      speed: 50,
      physical: 50,
      mental: 50,
      passing: 50,
      dribbling: 50,
      shooting: 50,
      heading: 50,
      defending: 50,
      handling: 50,
      diving: 50,
      positioning: 50,
      reflexes: 50,
    });
  };

  const renderAttributes = () => {
    if (position === "Goalkeeper") {
      return [
        { key: "handling", label: "Handling" },
        { key: "diving", label: "Diving" },
        { key: "positioning", label: "Positioning" },
        { key: "reflexes", label: "Reflexes" },
        { key: "mental", label: "Mental" },
        { key: "passing", label: "Passing" },
        { key: "speed", label: "Speed" },
      ];
    }

    return [
      { key: "speed", label: "Speed" },
      { key: "physical", label: "Physical" },
      { key: "mental", label: "Mental" },
      { key: "passing", label: "Passing" },
      { key: "dribbling", label: "Dribbling" },
      { key: "shooting", label: "Shooting" },
      { key: "heading", label: "Heading" },
      { key: "defending", label: "Defending" },
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-2xl py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Create Player</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Position
            </label>
            <Select value={position} onValueChange={(v) => setPosition(v as PlayerPosition)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Forward">Forward</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Attributes</h2>
          <div className="grid gap-6">
            {renderAttributes().map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {attributes[key as keyof typeof attributes]}
                  </span>
                </div>
                <Slider
                  value={[attributes[key as keyof typeof attributes]]}
                  onValueChange={(value) => handleAttributeChange(key, value)}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Player
        </Button>
      </form>
    </motion.div>
  );
};

export default CreatePlayer;