import { Player, PlayerPosition } from '@/types/player';
import { v4 as uuidv4 } from 'uuid';
import { calculateRating, getDefaultAttributes } from './playerUtils';

const generateRandomAttributes = (position: PlayerPosition) => {
  const baseAttributes = getDefaultAttributes(position);
  const variation = 25; // ±25 points variation
  
  const randomize = (base: number) => {
    const min = Math.max(1, base - variation);
    const max = Math.min(100, base + variation);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    speed: randomize(baseAttributes.speed),
    physical: randomize(baseAttributes.physical),
    mental: randomize(baseAttributes.mental),
    passing: randomize(baseAttributes.passing),
    dribbling: randomize(baseAttributes.dribbling),
    shooting: randomize(baseAttributes.shooting),
    heading: randomize(baseAttributes.heading),
    defending: randomize(baseAttributes.defending),
    handling: position === 'Goalkeeper' ? randomize(baseAttributes.handling || 75) : undefined,
    diving: position === 'Goalkeeper' ? randomize(baseAttributes.diving || 75) : undefined,
    positioning: position === 'Goalkeeper' ? randomize(baseAttributes.positioning || 75) : undefined,
    reflexes: position === 'Goalkeeper' ? randomize(baseAttributes.reflexes || 75) : undefined,
  };
};

export const samplePlayers: Array<{name: string, position: PlayerPosition, secondaryPosition?: PlayerPosition}> = [
  // Goalkeepers (2)
  { name: "David Silva", position: "Goalkeeper" },
  { name: "Marco Alisson", position: "Goalkeeper" },
  
  // Defenders (8)
  { name: "Marcus Johnson", position: "Defender" },
  { name: "Carlos Rodriguez", position: "Defender" },
  { name: "James Mitchell", position: "Defender" },
  { name: "Andrea Romano", position: "Defender" },
  { name: "Luis Fernando", position: "Defender" },
  { name: "Alex Thompson", position: "Defender" },
  { name: "Pietro Rossi", position: "Defender" },
  { name: "Gabriel Santos", position: "Defender" },
  
  // Midfielders (8)
  { name: "Kevin De Bruyne", position: "Midfielder" },
  { name: "Pablo Hernandez", position: "Midfielder" },
  { name: "Luka Modric", position: "Midfielder" },
  { name: "Thomas Müller", position: "Midfielder" },
  { name: "Jordan Henderson", position: "Midfielder" },
  { name: "Marco Verratti", position: "Midfielder" },
  { name: "Eduardo Silva", position: "Midfielder" },
  { name: "Antoine Griezmann", position: "Midfielder" },
  
  // Forwards (4)
  { name: "Cristiano Ronaldo", position: "Forward" },
  { name: "Lionel Messi", position: "Forward" },
  { name: "Robert Lewandowski", position: "Forward" },
  { name: "Erling Haaland", position: "Forward" }
];

export const generateSamplePlayers = (): Player[] => {
  return samplePlayers.map(playerData => {
    const attributes = generateRandomAttributes(playerData.position);
    return {
      id: uuidv4(),
      name: playerData.name,
      position: playerData.position,
      secondaryPosition: playerData.secondaryPosition,
      photo: "https://via.placeholder.com/300",
      attributes,
      rating: calculateRating(attributes, playerData.position),
    };
  });
};
