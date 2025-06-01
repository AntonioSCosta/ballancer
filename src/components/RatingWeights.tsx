
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type PlayerPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

interface PositionWeights {
  [key: string]: number;
}

interface RatingWeights {
  Goalkeeper: PositionWeights;
  Defender: PositionWeights;
  Midfielder: PositionWeights;
  Forward: PositionWeights;
}

const getDefaultWeights = (): RatingWeights => ({
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
});

const RatingWeights = () => {
  const [weights, setWeights] = useState<RatingWeights>(getDefaultWeights());

  useEffect(() => {
    const storedWeights = localStorage.getItem("ratingWeights");
    if (storedWeights) {
      setWeights(JSON.parse(storedWeights));
    }
  }, []);

  const handleWeightChange = (position: PlayerPosition, attribute: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeights(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        [attribute]: numValue
      }
    }));
  };

  const normalizeWeights = (position: PlayerPosition) => {
    const positionWeights = weights[position];
    const total = Object.values(positionWeights).reduce((sum: number, weight: number) => sum + weight, 0);
    
    if (total === 0) return;
    
    const normalizedWeights: PositionWeights = {};
    Object.entries(positionWeights).forEach(([attr, weight]) => {
      normalizedWeights[attr] = Math.round((weight / total) * 100);
    });
    
    setWeights(prev => ({
      ...prev,
      [position]: normalizedWeights
    }));
  };

  const saveWeights = () => {
    localStorage.setItem("ratingWeights", JSON.stringify(weights));
    toast.success("Rating weights saved successfully!");
  };

  const resetToDefaults = () => {
    const defaultWeights = getDefaultWeights();
    setWeights(defaultWeights);
    localStorage.setItem("ratingWeights", JSON.stringify(defaultWeights));
    toast.success("Rating weights reset to defaults!");
  };

  const renderPositionWeights = (position: PlayerPosition) => {
    const positionWeights = weights[position];
    const total = Object.values(positionWeights).reduce((sum: number, weight: number) => sum + weight, 0);

    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {Object.entries(positionWeights).map(([attribute, weight]) => (
            <div key={attribute} className="flex items-center gap-4">
              <Label className="w-24 capitalize">{attribute}</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => handleWeightChange(position, attribute, e.target.value)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground w-12">
                {total > 0 ? Math.round((weight / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => normalizeWeights(position)}
          >
            Normalize to 100%
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            Total: {total}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Rating Weights</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize how much each attribute contributes to a player's overall rating based on their position.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Goalkeeper" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Goalkeeper">Goalkeeper</TabsTrigger>
            <TabsTrigger value="Defender">Defender</TabsTrigger>
            <TabsTrigger value="Midfielder">Midfielder</TabsTrigger>
            <TabsTrigger value="Forward">Forward</TabsTrigger>
          </TabsList>
          
          {(["Goalkeeper", "Defender", "Midfielder", "Forward"] as PlayerPosition[]).map((position) => (
            <TabsContent key={position} value={position}>
              {renderPositionWeights(position)}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex gap-4 mt-6">
          <Button onClick={saveWeights}>Save Weights</Button>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingWeights;
