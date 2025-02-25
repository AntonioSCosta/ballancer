
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PlayerAttributes from "@/components/PlayerAttributes";
import { DEFAULT_ATTRIBUTES } from "@/types/profile";
import { PlayerPosition } from "@/types/player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayerEvaluationDialogProps {
  open: boolean;
  onClose: () => void;
  playerId: string;
  matchId: string;
  playerPosition: PlayerPosition;
}

export const PlayerEvaluationDialog = ({
  open,
  onClose,
  playerId,
  matchId,
  playerPosition,
}: PlayerEvaluationDialogProps) => {
  const queryClient = useQueryClient();
  const [attributes, setAttributes] = useState(DEFAULT_ATTRIBUTES);
  const [comment, setComment] = useState("");

  const submitEvaluation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('player_evaluations')
        .insert({
          player_id: playerId,
          match_id: matchId,
          attributes,
          comment,
          rating: Object.values(attributes).reduce((a, b) => a + b, 0) / Object.keys(attributes).length
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-evaluations', playerId] });
      toast.success('Evaluation submitted successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleAttributeChange = (attr: string, value: number[]) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: value[0]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Player Evaluation</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <PlayerAttributes
            position={playerPosition}
            attributes={attributes}
            onAttributeChange={handleAttributeChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this player..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => submitEvaluation.mutate()}
              disabled={submitEvaluation.isPending}
            >
              Submit Evaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
