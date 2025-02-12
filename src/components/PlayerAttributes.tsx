
import { Slider } from "@/components/ui/slider";
import { PlayerPosition } from "@/components/PlayerCard";
import { renderAttributes } from "@/utils/playerUtils";
import { useTranslation } from "react-i18next";

interface PlayerAttributesProps {
  position: PlayerPosition;
  attributes: Record<string, number>;
  onAttributeChange: (attr: string, value: number[]) => void;
}

const PlayerAttributes = ({ position, attributes, onAttributeChange }: PlayerAttributesProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Attributes</h2>
      <div className="grid gap-6">
        {renderAttributes(position).map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`playerAttributes.${key}`)}
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {attributes[key]}
              </span>
            </div>
            <Slider
              value={[attributes[key]]}
              onValueChange={(value) => onAttributeChange(key, value)}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerAttributes;
