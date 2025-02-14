import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PlayerPhotoUploadProps {
  photo: string;
  hasPhoto: boolean;
  name: string;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerPhotoUpload = ({ photo, hasPhoto, name, onPhotoChange }: PlayerPhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create an immediate preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Call the parent's onPhotoChange handler
      onPhotoChange(e);
    }
  };

  // Determine which image to show: preview, uploaded photo, or placeholder
  const displayImage = previewUrl || (hasPhoto ? photo : "");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Photo
      </label>
      <div className="flex flex-col items-center gap-4">
        {hasPhoto || previewUrl ? (
          <img
            src={displayImage}
            alt="Player Photo"
            className="w-32 h-32 object-cover rounded-full border-2 border-primary"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600">
            <ImagePlus className="w-8 h-8 text-gray-500" />
          </div>
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
  );
};

export default PlayerPhotoUpload;
