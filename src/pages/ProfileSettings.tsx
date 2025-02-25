
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/profile/ProfileForm";
import { PlayerStats } from "@/components/profile/PlayerStats";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const {
    profile,
    formData,
    isLoading,
    updateProfile,
    handlePhotoChange,
    handleFormDataChange,
    setFormData,
  } = useProfile();

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ProfileForm
            formData={formData}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onPhotoChange={handlePhotoChange}
            onFormDataChange={handleFormDataChange}
            onAttributeChange={() => {}}
          />
        </div>

        {profile && (
          <div>
            <PlayerStats profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
