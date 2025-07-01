
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
        <label 
          htmlFor="photo-upload" 
          className="cursor-pointer group relative"
        >
          {hasPhoto || previewUrl ? (
            <div className="relative">
              <img
                src={displayImage}
                alt="Player Photo"
                className="w-32 h-32 object-cover rounded-full border-2 border-primary group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200">
                <ImagePlus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
              <ImagePlus className="w-8 h-8 text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
            </div>
          )}
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
        />
      </div>
    </div>
  );
};

export default PlayerPhotoUpload;
