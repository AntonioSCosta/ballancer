import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, UserPlus, Share2, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Help = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  const cards = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      description: "Essential basics to get you going",
      content: (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Team Generator helps you create balanced teams quickly and easily. Here's how to start:
          </p>
          <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <li>Create players with their photos and details</li>
            <li>Select players for the current game</li>
            <li>Click generate to create balanced teams</li>
            <li>Share teams by copying them to the clipboard</li>
          </ul>
        </>
      ),
    },
    {
      title: "Player Skill Attributes",
      icon: <UserPlus className="h-5 w-5 text-primary" />,
      description: "Managing your player roster",
      content: (
        <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <li>Speed: How fast the player moves, both in sprints and acceleration.</li>
          <li>Physical: Strength, stamina, and overall fitness level.</li>
          <li>Passing: Accuracy and vision when distributing the ball.</li>
          <li>Mental: Decision-making, composure, and game intelligence.</li>
          <li>Shooting: Finishing, shot power, and accuracy in front of goal.</li>
          <li>Defending: Tackling, positioning, and ability to stop opponents.</li>
          <li>Heading: Aerial ability in both attacking and defensive situations.</li>
          <li>Dribbling: Ball control, agility, and skill in taking on opponents.</li>
        </ul>
      ),
    },
    {
      title: "Team Generation",
      icon: <Users className="h-5 w-5 text-primary" />,
      description: "Creating balanced teams",
      content: (
        <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <li>Balancing team skill levels</li>
          <li>Considering both primary and secondary positions</li>
          <li>Using appropriate attributes based on assigned position</li>
          <li>Visualizing team formations with position-specific colors</li>
        </ul>
      ),
    },
    {
      title: "Sharing Teams",
      icon: <Share2 className="h-5 w-5 text-primary" />,
      description: "Share generated teams easily",
      content: (
        <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <li>Copy teams to clipboard</li>
          <li>View team formations</li>
          <li>Quick team overview</li>
        </ul>
      ),
    },
    {
      title: "Tips & Best Practices",
      icon: <Info className="h-5 w-5 text-primary" />,
      description: "Get the most out of the app",
      content: (
        <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <li>Add player photos for easy identification</li>
          <li>Set accurate player attributes for better team balance</li>
          <li>Use secondary positions for versatile players</li>
          <li>Keep your player roster up to date</li>
        </ul>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6 max-w-7xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Help & Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Everything you need to know about using Team Generator
        </p>
        <Separator className="my-4" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, icon, description, content }) => (
          <motion.div
            key={title}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="shadow-md border dark:border-gray-700">
              <CardHeader
                onClick={() => toggleCard(title)}
                className="cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-2 w-full">
                  {icon}
                  <CardTitle className="flex-grow flex justify-between items-center">
                    {title}
                    <motion.span
                      animate={{ rotate: expandedCard === title ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2 text-gray-500 dark:text-gray-400 text-xs"
                    >
                      ▼
                    </motion.span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="px-4">{description}</CardDescription>
              <motion.div
                layout
                initial={false}
                animate={{
                  opacity: expandedCard === title ? 1 : 0,
                  scale: expandedCard === title ? 1 : 0.95,
                }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden ${expandedCard === title ? "block" : "hidden"}`}
              >
                <CardContent className="space-y-4">{content}</CardContent>
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Help;
