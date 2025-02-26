
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

const Settings = () => {
  const [considerPositions, setConsiderPositions] = useState(() => {
    const stored = localStorage.getItem("considerPositions");
    return stored ? JSON.parse(stored) : true;
  });

  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    const stored = localStorage.getItem("notificationPreferences");
    return stored ? JSON.parse(stored) : {
      matchUpdates: true,
      friendRequests: true,
      communityInvites: true,
      matchReminders: true
    };
  });

  useEffect(() => {
    localStorage.setItem("considerPositions", JSON.stringify(considerPositions));
  }, [considerPositions]);

  useEffect(() => {
    localStorage.setItem("notificationPreferences", JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  const updateNotificationPreference = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
          <div>
            <h3 className="text-lg font-medium">Team Generation</h3>
            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Position-Based Distribution</Label>
                <p className="text-sm text-muted-foreground">
                  Consider player positions when generating teams
                </p>
              </div>
              <Switch
                checked={considerPositions}
                onCheckedChange={setConsiderPositions}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Match Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about match scores and results
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.matchUpdates}
                  onCheckedChange={() => updateNotificationPreference('matchUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new friend requests
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.friendRequests}
                  onCheckedChange={() => updateNotificationPreference('friendRequests')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Community Invites</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new community invitations
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.communityInvites}
                  onCheckedChange={() => updateNotificationPreference('communityInvites')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Match Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders before scheduled matches
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.matchReminders}
                  onCheckedChange={() => updateNotificationPreference('matchReminders')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
