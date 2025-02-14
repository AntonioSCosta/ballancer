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
        {[
          {
            title: "Getting Started",
            icon: <BookOpen className="h-5 w-5 text-primary" />,
            description: "Essential basics to get you going",
            content: (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Team Generator helps you create balanced teams quickly and easily. Here's how to start:
              </p>
            ),
          },
          {
            title: "Player Skill Attributes",
            icon: <UserPlus className="h-5 w-5 text-primary" />,
            description: "Managing your player roster",
            content: (
              <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>Speed: How fast the player moves</li>
                <li>Physical: Strength, stamina, and fitness</li>
                <li>Passing: Accuracy and vision</li>
                <li>Mental: Decision-making and composure</li>
              </ul>
            ),
          },
        ].map(({ title, icon, description, content }) => (
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
