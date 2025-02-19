
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [considerPositions, setConsiderPositions] = useState(() => {
    const stored = localStorage.getItem("considerPositions");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem("considerPositions", JSON.stringify(considerPositions));
  }, [considerPositions]);

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your app preferences and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between">
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
