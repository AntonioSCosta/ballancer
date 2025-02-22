
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/profile/ProfileForm";
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
    handleAttributeChange,
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
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/settings")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <ProfileForm
        formData={formData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onPhotoChange={handlePhotoChange}
        onAttributeChange={handleAttributeChange}
        onFormDataChange={handleFormDataChange}
      />
    </div>
  );
};

export default ProfileSettings;
