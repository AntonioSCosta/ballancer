import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, ZoomOut, Move } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (croppedImage: string) => void;
}

const ImageCropDialog = ({ open, onOpenChange, imageUrl, onSave }: ImageCropDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for circular crop
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Move to center for transformations
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(position.x, position.y);

    // Calculate image dimensions to maintain aspect ratio
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    let drawWidth, drawHeight;
    
    if (aspectRatio > 1) {
      drawHeight = size;
      drawWidth = size * aspectRatio;
    } else {
      drawWidth = size;
      drawHeight = size / aspectRatio;
    }

    // Draw image centered
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // Restore context
    ctx.restore();

    // Draw border
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [scale, rotation, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
    onSave(croppedImage);
    onOpenChange(false);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image preview */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-dashed border-border rounded-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ width: '200px', height: '200px' }}
              />
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Original"
                className="hidden"
                onLoad={drawImage}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Zoom: {scale.toFixed(1)}x
                </label>
              </div>
              <Slider
                value={[scale]}
                onValueChange={(value) => setScale(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Rotation: {rotation}°
                </label>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                min={-180}
                max={180}
                step={5}
                className="w-full"
              />
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Move className="w-3 h-3" />
              Drag the image to reposition
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;