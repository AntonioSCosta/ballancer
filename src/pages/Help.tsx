
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Help = () => {
  const features = [
    {
      title: "Create Player",
      description: "Add and manage your player roster:",
      items: [
        "Add players with custom names and photos",
        "Set primary and secondary positions",
        "Customize player attributes (speed, physical, mental, etc.)",
        "Special goalkeeper attributes (handling, diving, positioning, reflexes)",
        "Real-time rating calculation based on position weights",
        "Edit existing players anytime"
      ]
    },
    {
      title: "Team Generator",
      description: "Create balanced teams from your player pool:",
      items: [
        "Select any number of players (minimum 10 required)",
        "Automatic team balancing based on player ratings",
        "Position-based distribution (optional)",
        "Visual tactical formation display",
        "Team comparison view to analyze balance",
        "Regenerate teams with different combinations"
      ]
    },
    {
      title: "Rating System",
      description: "Customizable player rating calculations:",
      items: [
        "Position-specific attribute weights",
        "Defenders prioritize defending and physical attributes",
        "Midfielders focus on passing and mental skills",
        "Forwards emphasize shooting and speed",
        "Goalkeepers use specialized attributes",
        "Fully customizable weights in Settings"
      ]
    },
    {
      title: "Settings & Customization",
      description: "Personalize your experience:",
      items: [
        "Toggle position-based team distribution",
        "Customize rating weights for each position",
        "Normalize weight percentages automatically",
        "Reset to default weight configurations",
        "All settings saved locally on your device"
      ]
    },
    {
      title: "Team Management",
      description: "Organize and share your teams:",
      items: [
        "Generate balanced teams instantly",
        "View teams in tactical formation",
        "Compare team strengths and weaknesses",
        "Share team lineups via WhatsApp",
        "Copy team information to clipboard",
        "Tactical view with player positioning"
      ]
    },
    {
      title: "Data Storage",
      description: "Your data management:",
      items: [
        "All data stored locally on your device",
        "No internet connection required",
        "Player data persists between sessions",
        "Settings automatically saved",
        "Import/export capabilities for backup"
      ]
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>
            Learn how to use all features of the Football Team Generator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              {features.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <ul className="list-disc list-inside space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
