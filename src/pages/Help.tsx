
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Help = () => {
  const features = [
    {
      title: "Offline Features",
      description: "These features work without an internet connection:",
      items: [
        "Create Player - Add and manage your player roster",
        "Team Generator - Create balanced teams from your player pool",
        "Basic app settings and preferences"
      ]
    },
    {
      title: "Online Features",
      description: "These features require an internet connection:",
      items: [
        "Communities - Create and join football communities",
        "Friends - Connect with other players",
        "Match Organization - Schedule and manage matches",
        "Player Evaluations - Rate players after matches",
        "Chat - Communicate within communities"
      ]
    },
    {
      title: "Team Generation",
      description: "How teams are generated:",
      items: [
        "Position-based distribution (optional)",
        "Balanced skill ratings",
        "Even team sizes",
        "Consideration of player preferences"
      ]
    },
    {
      title: "Communities",
      description: "Community features include:",
      items: [
        "Create private or public communities",
        "Invite friends to join",
        "Organize matches",
        "Chat with community members",
        "Track match history and statistics"
      ]
    },
    {
      title: "Player Profiles",
      description: "Player profile features:",
      items: [
        "Personal statistics",
        "Match history",
        "Performance ratings",
        "Preferred positions",
        "Community memberships"
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
