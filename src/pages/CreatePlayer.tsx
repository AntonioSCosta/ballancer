
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerPosition, Player, PlayerCard } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
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
import { StorageUtils } from "@/utils/storageUtils";
import { StorageHealthCheck } from "@/components/StorageHealthCheck";
import { useIsMobile } from "@/hooks/use-mobile";

const MAX_WIDTH = 300;
const MAX_HEIGHT = 300;

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("Image file is too large. Please use an image smaller than 10MB."));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error("Please select a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

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
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        // Check final size
        if (compressedDataUrl.length > 500000) { // 500KB
          const smallerDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          resolve(smallerDataUrl);
        } else {
          resolve(compressedDataUrl);
        }
      };
      img.onerror = () => {
        reject(new Error("Invalid image file. Please try a different image."));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read image file."));
    };
    reader.readAsDataURL(file);
  });
};

const CreatePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const playerToEdit = location.state?.player as Player | undefined;

  const [createdPlayers, setCreatedPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState<PlayerPosition>("Midfielder");
  const [secondaryPosition, setSecondaryPosition] = useState<PlayerPosition | undefined>();
  const [photo, setPhoto] = useState("https://via.placeholder.com/300");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [attributes, setAttributes] = useState(getDefaultAttributes("Midfielder"));
  const [currentRating, setCurrentRating] = useState(50);

  // Update rating whenever attributes or position changes
  useEffect(() => {
    const newRating = calculateRating(attributes, position);
    setCurrentRating(newRating);
  }, [attributes, position]);

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

  useEffect(() => {
    if (!playerToEdit) {
      setAttributes(getDefaultAttributes(position, secondaryPosition));
    }
  }, [position, secondaryPosition, playerToEdit]);

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

  const handleDelete = (playerId: string) => {
    const existingPlayers = StorageUtils.getPlayers();
    const updatedPlayers = existingPlayers.filter((p: Player) => p.id !== playerId);
    if (StorageUtils.savePlayers(updatedPlayers)) {
      setCreatedPlayers(prev => prev.filter(p => p.id !== playerId));
      toast.success("Player deleted successfully!");
    }
  };

  const handleAttributeChange = (attr: string, value: number[]) => {
    setAttributes((prev) => ({
      ...prev,
      [attr]: value[0],
    }));
  };

  const resetForm = () => {
    setName("");
    setPosition("Midfielder");
    setSecondaryPosition(undefined);
    setPhoto("https://via.placeholder.com/300");
    setHasPhoto(false);
    setAttributes(getDefaultAttributes("Midfielder"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate player name length
    if (name.trim().length === 0) {
      toast.error("Player name is required");
      return;
    }
    
    if (name.trim().length > 30) {
      toast.error("Player name cannot exceed 30 characters");
      return;
    }

    // Check for duplicate names and prepare data
    const allPlayers = StorageUtils.getPlayers();
    const isDuplicate = allPlayers.some((p: Player) => 
      p.name.toLowerCase().trim() === name.toLowerCase().trim() && 
      (!playerToEdit || p.id !== playerToEdit.id)
    );
    
    if (isDuplicate) {
      toast.error("A player with this name already exists");
      return;
    }
    
    const playerData = {
      id: playerToEdit?.id || uuidv4(),
      name: name.trim(),
      position,
      secondaryPosition,
      photo,
      attributes,
      rating: calculateRating(attributes, position),
    };
    if (playerToEdit) {
      const updatedPlayers = allPlayers.map((p: Player) =>
        p.id === playerToEdit.id ? playerData : p
      );
      if (StorageUtils.savePlayers(updatedPlayers)) {
        toast.success("Player updated successfully!");
        navigate("/generator");
      }
    } else {
      const newPlayers = [...allPlayers, playerData];
      if (StorageUtils.savePlayers(newPlayers)) {
        setCreatedPlayers(prev => [...prev, playerData]);
        toast.success("Player created successfully!");
        resetForm();
      }
    }
  };

  const handleFinish = () => {
    navigate("/generator");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`container max-w-7xl ${isMobile ? 'py-6 px-3' : 'py-8 px-4'}`}
    >
      <div className={`flex justify-between items-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 dark:text-gray-100`}>
          {playerToEdit ? "Edit Player" : "Create Players"}
        </h1>
      </div>

      <StorageHealthCheck />

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'lg:grid-cols-5 gap-8'}`}>
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <span className={`text-xs ${name.length > 30 ? 'text-red-500' : name.length > 25 ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {name.length}/30
                  </span>
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter player name"
                  maxLength={30}
                  required
                  className={name.length > 30 ? 'border-red-500 focus:border-red-500' : ''}
                />
                {name.length > 25 && name.length <= 30 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    {30 - name.length} characters remaining
                  </p>
                )}
                {name.length > 30 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Name cannot exceed 30 characters
                  </p>
                )}
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

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Current Rating: {currentRating}
                  </span>
                </div>
                <PlayerAttributes
                  position={position}
                  secondaryPosition={secondaryPosition}
                  attributes={attributes}
                  onAttributeChange={handleAttributeChange}
                />
              </div>

              <Button type="submit" className="w-full">
                {playerToEdit ? "Update Player" : "Add Player"}
              </Button>
            </div>
          </form>
        </div>

        <div className={isMobile ? '' : 'lg:col-span-3'}>
          <div className={isMobile ? '' : 'sticky top-20'}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Created Players ({createdPlayers.length})
              </h2>
              {createdPlayers.length > 0 && (
                <Button onClick={handleFinish} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Continue to Team Generator
                </Button>
              )}
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
              <AnimatePresence>
                {createdPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <PlayerCard
                      player={player}
                      className="h-full"
                      onEdit={() => {
                        navigate("/", { state: { player } });
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePlayer;
