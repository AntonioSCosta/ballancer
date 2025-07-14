import { motion } from "framer-motion";
import { Player } from "@/types/player";
import PlayerPhotoDisplay from "./PlayerPhotoDisplay";
import { Badge } from "./ui/badge";

interface TeamLineupProps {
  players: Player[];
  teamName: string;
  teamRating: number;
  inverted?: boolean;
}

const TeamLineup = ({ players, teamName, teamRating, inverted = false }: TeamLineupProps) => {
  const groupPlayersByPosition = () => {
    const positions = {
      "Goalkeeper": players.filter(p => p.position === "Goalkeeper"),
      "Defender": players.filter(p => p.position === "Defender"), 
      "Midfielder": players.filter(p => p.position === "Midfielder"),
      "Forward": players.filter(p => p.position === "Forward")
    };
    return positions;
  };

  const positionGroups = groupPlayersByPosition();

  const getFormationString = () => {
    const counts = {
      defenders: positionGroups.Defender.length,
      midfielders: positionGroups.Midfielder.length, 
      forwards: positionGroups.Forward.length
    };
    return `${counts.defenders}-${counts.midfielders}-${counts.forwards}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-card via-card to-muted/20 rounded-xl shadow-lg border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">{teamName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Formation: {getFormationString()}
              </Badge>
              <Badge variant="outline">
                Rating: {teamRating}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Players</div>
            <div className="text-2xl font-bold text-foreground">{players.length}</div>
          </div>
        </div>
      </div>

      {/* Formation Layout */}
      <div className="p-6 space-y-6">
        {inverted ? (
          <>
            {/* Inverted layout for Team 1 - Goalkeeper first */}
            {positionGroups.Goalkeeper.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Goalkeeper
                </h3>
                <div className="flex justify-center">
                  {positionGroups.Goalkeeper.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="xl" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Defenders */}
            {positionGroups.Defender.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Defenders ({positionGroups.Defender.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Defender.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Goalkeeper.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Midfielders */}
            {positionGroups.Midfielder.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Midfielders ({positionGroups.Midfielder.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Midfielder.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Goalkeeper.length + positionGroups.Defender.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Forwards */}
            {positionGroups.Forward.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Forwards ({positionGroups.Forward.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Forward.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Goalkeeper.length + positionGroups.Defender.length + positionGroups.Midfielder.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Normal layout for Team 2 - Forwards first */}
            {/* Forwards */}
            {positionGroups.Forward.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Forwards ({positionGroups.Forward.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Forward.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Midfielders */}
            {positionGroups.Midfielder.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Midfielders ({positionGroups.Midfielder.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Midfielder.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Forward.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Defenders */}
            {positionGroups.Defender.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Defenders ({positionGroups.Defender.length})
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {positionGroups.Defender.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Forward.length + positionGroups.Midfielder.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="lg" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Goalkeeper */}
            {positionGroups.Goalkeeper.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Goalkeeper
                </h3>
                <div className="flex justify-center">
                  {positionGroups.Goalkeeper.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (positionGroups.Forward.length + positionGroups.Midfielder.length + positionGroups.Defender.length + index) * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <PlayerPhotoDisplay player={player} size="xl" showPosition={false} />
                      <div className="text-center">
                        <div className="text-sm font-medium text-foreground truncate max-w-[80px]">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(player.rating)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TeamLineup;
