
interface Team {
  id?: string;
  name?: string;
  players: import("./components/PlayerCard").Player[];
  rating: number;
}
