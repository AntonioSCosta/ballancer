
import type { Player, PlayerPosition, PlayerStats } from "@/types/player";

export const getAttributeColor = (value: number): string => {
  if (value >= 90) return "text-emerald-500";
  if (value >= 80) return "text-blue-500";
  if (value >= 70) return "text-yellow-500";
  if (value >= 60) return "text-orange-500";
  return "text-red-500";
};

export const calculateOverallRating = (player: Player): number => {
  const { attributes, position } = player;

  if (position === "Goalkeeper") {
    const gkAttributes = [
      attributes.handling || 0,
      attributes.diving || 0,
      attributes.positioning || 0,
      attributes.reflexes || 0,
      attributes.mental,
      attributes.physical
    ];
    return Math.round(gkAttributes.reduce((sum, attr) => sum + attr, 0) / gkAttributes.length);
  }

  const fieldPlayerAttributes = [
    attributes.speed,
    attributes.shooting,
    attributes.passing,
    attributes.dribbling,
    attributes.defending,
    attributes.physical,
    attributes.heading || 0,
    attributes.mental
  ];

  return Math.round(fieldPlayerAttributes.reduce((sum, attr) => sum + attr, 0) / fieldPlayerAttributes.length);
};

export const getDefaultPlayerStats = (): PlayerStats => ({
  matches: 0,
  goals: 0,
  assists: 0,
  cleanSheets: 0,
  rating: 0,
});
