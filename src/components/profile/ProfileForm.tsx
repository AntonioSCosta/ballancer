
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PlayerPosition } from "@/components/PlayerCard";
import PlayerAttributes from "@/components/PlayerAttributes";
import PlayerPhotoUpload from "@/components/PlayerPhotoUpload";
import { Profile } from "@/types/profile";

interface ProfileFormProps {
  formData: Profile;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAttributeChange: (attr: string, value: number[]) => void;
  onFormDataChange: (updates: Partial<Profile>) => void;
}

const ProfileForm = ({
  formData,
  isLoading,
  onSubmit,
  onPhotoChange,
  onAttributeChange,
  onFormDataChange,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage your profile information. Attributes can only be changed through player evaluations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PlayerPhotoUpload
            photo={formData.avatar_url || ""}
            hasPhoto={!!formData.avatar_url}
            name="avatar"
            onPhotoChange={onPhotoChange}
          />

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username || ""}
              onChange={(e) => onFormDataChange({ username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio || ""}
              onChange={(e) => onFormDataChange({ bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Preferred Position</Label>
            <Select
              value={formData.favorite_position || "Forward"}
              onValueChange={(value: PlayerPosition) => 
                onFormDataChange({ favorite_position: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Forward">Forward</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PlayerAttributes
            position={formData.favorite_position || "Forward"}
            attributes={formData.attributes}
            readOnly={true}
          />

          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileForm;
