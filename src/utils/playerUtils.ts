import type { Player, PlayerPosition } from '@/types/player';

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

export const getDefaultAttributes = (position: PlayerPosition, secondaryPosition?: PlayerPosition) => {
  const needsGKAttributes = position === "Goalkeeper" || secondaryPosition === "Goalkeeper";
  const needsFieldAttributes = position !== "Goalkeeper" || secondaryPosition;

  return {
    ...(needsFieldAttributes && {
      speed: 50,
      physical: 50,
      mental: 50,
      passing: 50,
      dribbling: 50,
      shooting: 50,
      heading: 50,
      defending: 50,
    }),
    ...(needsGKAttributes && {
      handling: 50,
      diving: 50,
      positioning: 50,
      reflexes: 50,
      mental: 50,
      passing: 50,
      speed: 50,
    }),
  };
};

export const renderAttributes = (position: PlayerPosition, secondaryPosition?: PlayerPosition) => {
  const isGK = position === "Goalkeeper";
  const hasGKSecondary = secondaryPosition === "Goalkeeper";
  const hasFieldSecondary = !isGK && secondaryPosition;
  
  if ((isGK && secondaryPosition) || hasGKSecondary) {
    return [
      { key: "handling", label: "Handling (GK)" },
      { key: "diving", label: "Diving (GK)" },
      { key: "positioning", label: "Positioning (GK)" },
      { key: "reflexes", label: "Reflexes (GK)" },
      { key: "speed", label: "Speed" },
      { key: "physical", label: "Physical" },
      { key: "mental", label: "Mental" },
      { key: "passing", label: "Passing" },
      { key: "dribbling", label: "Dribbling" },
      { key: "shooting", label: "Shooting" },
      { key: "heading", label: "Heading" },
      { key: "defending", label: "Defending" },
    ];
  }
  
  if (isGK) {
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
