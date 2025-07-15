
import { ImagePlus, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ImageCropDialog from "./ImageCropDialog";

interface PlayerPhotoUploadProps {
  photo: string;
  hasPhoto: boolean;
  name: string;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerPhotoUpload = ({ photo, hasPhoto, name, onPhotoChange }: PlayerPhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create an immediate preview
      const objectUrl = URL.createObjectURL(file);
      setRawImageUrl(objectUrl);
      setShowCropDialog(true);
    }
  };

  const handleCroppedImageSave = (croppedImage: string) => {
    setPreviewUrl(croppedImage);
    
    // Create a proper mock event for the parent handler
    const file = dataURLtoFile(croppedImage, 'cropped-image.jpg');
    const mockEvent = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onPhotoChange(mockEvent);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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

        <div className="flex gap-2">
          <label htmlFor="photo-upload">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer">
              <ImagePlus className="w-4 h-4 mr-1" />
              {hasPhoto || previewUrl ? 'Change' : 'Upload'}
            </Button>
          </label>
          
          {(hasPhoto || previewUrl) && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (displayImage && displayImage !== "https://via.placeholder.com/300") {
                  setRawImageUrl(displayImage);
                  setShowCropDialog(true);
                }
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Adjust
            </Button>
          )}
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
        />
      </div>

      <ImageCropDialog
        open={showCropDialog}
        onOpenChange={setShowCropDialog}
        imageUrl={rawImageUrl || ""}
        onSave={handleCroppedImageSave}
      />
    </div>
  );
};

export default PlayerPhotoUpload;
