
import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlayerPhotoUploadProps {
  photo: string;
  hasPhoto: boolean;
  name: string;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerPhotoUpload = ({ photo, hasPhoto, name, onPhotoChange }: PlayerPhotoUploadProps) => {
  return (
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
            onChange={onPhotoChange}
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
  );
};

export default PlayerPhotoUpload;
