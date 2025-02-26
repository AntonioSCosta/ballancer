
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [considerPositions, setConsiderPositions] = useState(() => {
    const stored = localStorage.getItem("considerPositions");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("considerPositions", JSON.stringify(considerPositions));
  }, [considerPositions]);

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/profile-settings")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="space-y-0.5">
              <Label>Position-Based Team Distribution</Label>
              <p className="text-sm text-muted-foreground">
                Consider player positions when generating teams
              </p>
            </div>
            <Switch
              checked={considerPositions}
              onCheckedChange={setConsiderPositions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
