
interface AttributeBarProps {
  label: string;
  value: number;
}

export const AttributeBar = ({ label, value }: AttributeBarProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{label}</span>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);
