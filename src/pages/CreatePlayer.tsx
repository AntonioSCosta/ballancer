import { useState } from "react";
import { motion } from "framer-motion";
import { PlayerPosition, Player } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

  const handleAttributeChange = (attr: string, value: number) => {
    setAttributes((prev) => ({
      ...prev,
      [attr]: Math.min(100, Math.max(0, value)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the player to your storage
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Player</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <h2 className="text-lg font-semibold text-gray-900">Attributes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderAttributes().map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={attributes[key as keyof typeof attributes]}
                    onChange={(e) =>
                      handleAttributeChange(key, parseInt(e.target.value))
                    }
                    min="0"
                    max="100"
                    required
                  />
                  <span className="text-sm text-gray-500 w-8">
                    {attributes[key as keyof typeof attributes]}
                  </span>
                </div>
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