
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayerPosition, Player } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImagePlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const playerToEdit = location.state?.player as Player | undefined;

  const [name, setName] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("Midfielder");
  const [photo, setPhoto] = useState("https://via.placeholder.com/300");
  const [hasPhoto, setHasPhoto] = useState(false);
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

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setPosition(playerToEdit.position);
      setPhoto(playerToEdit.photo);
      setHasPhoto(playerToEdit.photo !== "https://via.placeholder.com/300");
      setAttributes(playerToEdit.attributes);
    }
  }, [playerToEdit]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setHasPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const existingPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    
    const playerData = {
      id: playerToEdit?.id || uuidv4(),
      name,
      position,
      photo,
      attributes,
      rating: calculateRating(attributes, position),
    };

    if (playerToEdit) {
      // Update existing player
      const updatedPlayers = existingPlayers.map((p: Player) =>
        p.id === playerToEdit.id ? playerData : p
      );
      localStorage.setItem("players", JSON.stringify(updatedPlayers));
      toast.success("Player updated successfully!");
    } else {
      // Create new player
      localStorage.setItem("players", JSON.stringify([...existingPlayers, playerData]));
      toast.success("Player created successfully!");
    }

    // Reset form and navigate back if editing
    setName("");
    setPosition("Midfielder");
    setPhoto("https://via.placeholder.com/300");
    setHasPhoto(false);
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

    if (playerToEdit) {
      navigate("/generator");
    }
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
      className="container max-w-4xl py-8 px-4"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
        {playerToEdit ? "Edit Player" : "Create Player"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo
              </label>
              <div className="flex flex-col items-center gap-4">
                {hasPhoto && (
                  <img
                    src={photo}
                    alt={name}
                    className="w-32 h-32 object-cover rounded-full border-2 border-primary"
                  />
                )}
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Choose Photo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
                    className="[&_[role=slider]]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full max-w-md mx-auto block">
          {playerToEdit ? "Update Player" : "Create Player"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreatePlayer;

