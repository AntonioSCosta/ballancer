import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <li>Create players with their photos and details</li>
          <li>Select players for the current game</li>
          <li>Click generate to create balanced teams</li>
          <li>Share teams by copying them to the clipboard</li>
        </ul>
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
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
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-2 text-gray-500 dark:text-gray-400 text-xs"
                    >
                      ▼
                    </motion.span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="px-4">{description}</CardDescription>
              <AnimatePresence>
                {expandedCard === title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <CardContent className="space-y-4">{content}</CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Help;
