
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayerPosition, Player } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import PlayerPhotoUpload from "@/components/PlayerPhotoUpload";
import PlayerAttributes from "@/components/PlayerAttributes";
import { calculateRating, getDefaultAttributes } from "@/utils/playerUtils";

const MAX_WIDTH = 300;
const MAX_HEIGHT = 300;

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG with reduced quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const CreatePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playerToEdit = location.state?.player as Player | undefined;

  const [name, setName] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("Midfielder");
  const [secondaryPosition, setSecondaryPosition] = useState<PlayerPosition | undefined>();
  const [photo, setPhoto] = useState("https://via.placeholder.com/300");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [attributes, setAttributes] = useState(getDefaultAttributes());

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setPosition(playerToEdit.position);
      setSecondaryPosition(playerToEdit.secondaryPosition);
      setPhoto(playerToEdit.photo);
      setHasPhoto(playerToEdit.photo !== "https://via.placeholder.com/300");
      setAttributes({
        speed: playerToEdit.attributes.speed,
        physical: playerToEdit.attributes.physical || 50,
        mental: playerToEdit.attributes.mental,
        passing: playerToEdit.attributes.passing,
        dribbling: playerToEdit.attributes.dribbling || 50,
        shooting: playerToEdit.attributes.shooting || 50,
        heading: playerToEdit.attributes.heading || 50,
        defending: playerToEdit.attributes.defending || 50,
        handling: playerToEdit.attributes.handling || 50,
        diving: playerToEdit.attributes.diving || 50,
        positioning: playerToEdit.attributes.positioning || 50,
        reflexes: playerToEdit.attributes.reflexes || 50,
      });
    }
  }, [playerToEdit]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        console.log("Compressed photo size:", Math.round(compressedImage.length / 1024), "KB");
        setPhoto(compressedImage);
        setHasPhoto(true);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Error processing image. Please try a smaller image.");
      }
    }
  };

  const handleDelete = () => {
    const existingPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    const updatedPlayers = existingPlayers.filter((p: Player) => p.id !== playerToEdit?.id);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    toast.success("Player deleted successfully!");
    navigate("/generator");
  };

  const handleAttributeChange = (attr: string, value: number[]) => {
    setAttributes((prev) => ({
      ...prev,
      [attr]: value[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playerData = {
      id: playerToEdit?.id || uuidv4(),
      name,
      position,
      secondaryPosition,
      photo,
      attributes,
      rating: calculateRating(attributes, position),
    };

    try {
      const existingPlayers = JSON.parse(localStorage.getItem("players") || "[]");
      
      if (playerToEdit) {
        const updatedPlayers = existingPlayers.map((p: Player) =>
          p.id === playerToEdit.id ? playerData : p
        );
        localStorage.setItem("players", JSON.stringify(updatedPlayers));
        toast.success("Player updated successfully!");
        setTimeout(() => {
          window.location.href = "/generator";
        }, 100);
      } else {
        localStorage.setItem("players", JSON.stringify([...existingPlayers, playerData]));
        toast.success("Player created successfully!");

        setName("");
        setPosition("Midfielder");
        setSecondaryPosition(undefined);
        setPhoto("https://via.placeholder.com/300");
        setHasPhoto(false);
        setAttributes(getDefaultAttributes());
      }
    } catch (error) {
      console.error("Error saving player:", error);
      toast.error("Error saving player. Please try using a smaller photo.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-4xl py-8 px-4"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {playerToEdit ? "Edit Player" : "Create Player"}
        </h1>
        {playerToEdit && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Player
          </Button>
        )}
      </div>
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
                Primary Position
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
                Secondary Position (Optional)
              </label>
              <Select 
                value={secondaryPosition || "none"} 
                onValueChange={(v) => setSecondaryPosition(v === "none" ? undefined : v as PlayerPosition)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                  <SelectItem value="Defender">Defender</SelectItem>
                  <SelectItem value="Midfielder">Midfielder</SelectItem>
                  <SelectItem value="Forward">Forward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PlayerPhotoUpload
              photo={photo}
              hasPhoto={hasPhoto}
              name={name}
              onPhotoChange={handlePhotoChange}
            />
          </div>

          <PlayerAttributes
            position={position}
            attributes={attributes}
            onAttributeChange={handleAttributeChange}
          />
        </div>

        <Button type="submit" className="w-full max-w-md mx-auto block">
          {playerToEdit ? "Update Player" : "Create Player"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreatePlayer;
