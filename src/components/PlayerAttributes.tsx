
import { PlayerPosition } from "@/types/player";
import { renderAttributes } from "@/utils/playerUtils";
import { Slider } from "@/components/ui/slider";

interface PlayerAttributesProps {
  position: PlayerPosition;
  secondaryPosition?: PlayerPosition;
  attributes: Record<string, number>;
  onAttributeChange?: (attr: string, value: number[]) => void;
  readOnly?: boolean;
}

const PlayerAttributes = ({ 
  position, 
  secondaryPosition, 
  attributes, 
  onAttributeChange,
  readOnly = false 
}: PlayerAttributesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Attributes</h2>
      <div className="grid gap-6">
        {renderAttributes(position, secondaryPosition).map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {attributes[key]}
              </span>
            </div>
            {readOnly ? (
              <div className="relative w-full h-2 bg-secondary rounded-full">
                <div 
                  className="absolute h-full bg-primary rounded-full" 
                  style={{ width: `${attributes[key]}%` }}
                />
              </div>
            ) : (
              <div className="[&_[role=slider]]:bg-primary">
                {onAttributeChange && (
                  <Slider
                    value={[attributes[key]]}
                    onValueChange={(value) => onAttributeChange(key, value)}
                    min={0}
                    max={99}
                    step={1}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerAttributes;
