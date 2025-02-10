
import { Player, PlayerPosition } from "@/components/PlayerCard";

export const calculateRating = (attrs: Record<string, number>, pos: PlayerPosition) => {
  if (pos === "Goalkeeper") {
    return Math.round(
      (attrs.handling + attrs.diving + attrs.positioning + attrs.reflexes + attrs.mental + attrs.passing + attrs.speed) / 7
    );
  }
  return Math.round(
    (attrs.speed + attrs.physical + attrs.mental + attrs.passing + attrs.dribbling + attrs.shooting + attrs.heading + attrs.defending) / 8
  );
};

export const getDefaultAttributes = () => ({
  speed: 50,
  physical: 50,
  mental: 50,
  passing: 50,
  dribbling: 50,
  shooting: 50,
  heading: 50,
  defending: 50,
  handling: 50,
  diving: 50,
  positioning: 50,
  reflexes: 50,
});

export const renderAttributes = (position: PlayerPosition) => {
  if (position === "Goalkeeper") {
    return [
      { key: "handling", label: "Handling" },
      { key: "diving", label: "Diving" },
      { key: "positioning", label: "Positioning" },
      { key: "reflexes", label: "Reflexes" },
      { key: "mental", label: "Mental" },
      { key: "passing", label: "Passing" },
      { key: "speed", label: "Speed" },
    ];
  }

  return [
    { key: "speed", label: "Speed" },
    { key: "physical", label: "Physical" },
    { key: "mental", label: "Mental" },
    { key: "passing", label: "Passing" },
    { key: "dribbling", label: "Dribbling" },
    { key: "shooting", label: "Shooting" },
    { key: "heading", label: "Heading" },
    { key: "defending", label: "Defending" },
  ];
};
