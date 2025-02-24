import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player, PlayerPosition } from "@/types/player";
import { DEFAULT_ATTRIBUTES } from "@/utils/defaultAttributes";

const CreatePlayer = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player>({
    id: "",
    name: "",
    position: "Midfielder",
    photo: "",
    rating: 50,
    attributes: DEFAULT_ATTRIBUTES
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPlayer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create player in the database
    navigate("/players");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Player</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={player.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="position">Position</label>
            <select
              id="position"
              name="position"
              value={player.position}
              onChange={handleChange}
            >
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
          </div>
          <div>
            <label htmlFor="photo">Photo URL</label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={player.photo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={player.rating}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>
          <button type="submit">Create Player</button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePlayer;
