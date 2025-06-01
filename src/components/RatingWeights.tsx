
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayerPosition } from "@/types/player";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface RatingWeightsProps {
  onWeightsChange?: (weights: Record<string, number>) => void;
}

const defaultWeights = {
  Goalkeeper: {
    handling: 25,
    diving: 25,
    positioning: 20,
    reflexes: 20,
    mental: 5,
    passing: 3,
    speed: 2,
  },
  Defender: {
    defending: 30,
    physical: 20,
    mental: 15,
    heading: 15,
    speed: 10,
    passing: 5,
    dribbling: 3,
    shooting: 2,
  },
  Midfielder: {
    passing: 25,
    mental: 20,
    dribbling: 15,
    speed: 15,
    physical: 10,
    shooting: 8,
    defending: 4,
    heading: 3,
  },
  Forward: {
    shooting: 30,
    speed: 20,
    dribbling: 20,
    mental: 10,
    physical: 10,
    passing: 5,
    heading: 3,
    defending: 2,
  },
};

const RatingWeights = ({ onWeightsChange }: RatingWeightsProps) => {
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition>("Midfielder");
  const [weights, setWeights] = useState(() => {
    const stored = localStorage.getItem("ratingWeights");
    return stored ? JSON.parse(stored) : defaultWeights;
  });

  useEffect(() => {
    localStorage.setItem("ratingWeights", JSON.stringify(weights));
    onWeightsChange?.(weights);
  }, [weights, onWeightsChange]);

  const handleWeightChange = (attribute: string, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [selectedPosition]: {
        ...prev[selectedPosition],
        [attribute]: value[0],
      },
    }));
  };

  const resetToDefaults = () => {
    setWeights(defaultWeights);
    toast.success("Rating weights reset to defaults");
  };

  const normalizeWeights = () => {
    const currentWeights = weights[selectedPosition];
    const total = Object.values(currentWeights).reduce((sum, weight) => sum + weight, 0);
    
    if (total === 100) {
      toast.info("Weights are already normalized");
      return;
    }

    const normalizedWeights = Object.entries(currentWeights).reduce((acc, [key, weight]) => {
      acc[key] = Math.round((weight / total) * 100);
      return acc;
    }, {} as Record<string, number>);

    setWeights(prev => ({
      ...prev,
      [selectedPosition]: normalizedWeights,
    }));
    
    toast.success("Weights normalized to 100%");
  };

  const currentWeights = weights[selectedPosition];
  const totalWeight = Object.values(currentWeights).reduce((sum, weight) => sum + weight, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Weights by Position</CardTitle>
        <CardDescription>
          Customize how much each attribute contributes to a player's overall rating based on their position.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={selectedPosition} onValueChange={(value: PlayerPosition) => setSelectedPosition(value)}>
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Attribute Weights</h4>
            <span className={`text-sm ${totalWeight === 100 ? 'text-green-600' : 'text-orange-600'}`}>
              Total: {totalWeight}%
            </span>
          </div>
          
          {Object.entries(currentWeights).map(([attribute, weight]) => (
            <div key={attribute} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="capitalize">{attribute}</Label>
                <span className="text-sm text-gray-500">{weight}%</span>
              </div>
              <Slider
                value={[weight]}
                onValueChange={(value) => handleWeightChange(attribute, value)}
                min={0}
                max={50}
                step={1}
                className="[&_[role=slider]]:bg-primary"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={normalizeWeights} variant="outline" size="sm">
            Normalize to 100%
          </Button>
          <Button onClick={resetToDefaults} variant="outline" size="sm">
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingWeights;
