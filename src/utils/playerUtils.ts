
import { Player, PlayerPosition } from "@/components/PlayerCard";

const getDefaultWeights = () => ({
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

export const calculateRating = (attrs: Record<string, number>, pos: PlayerPosition) => {
  const storedWeights = localStorage.getItem("ratingWeights");
  const weights = storedWeights ? JSON.parse(storedWeights) : getDefaultWeights();
  const positionWeights = weights[pos];

  if (pos === "Goalkeeper") {
    const weightedSum = Object.entries(positionWeights).reduce((sum: number, [attr, weight]) => {
      return sum + ((attrs[attr] || 0) * (weight as number) / 100);
    }, 0);
    return Math.round(weightedSum);
  }

  const weightedSum = Object.entries(positionWeights).reduce((sum: number, [attr, weight]) => {
    return sum + ((attrs[attr] || 0) * (weight as number) / 100);
  }, 0);
  
  return Math.round(weightedSum);
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
