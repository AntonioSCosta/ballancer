
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  UserPlus,
  Share2,
  ListCheck,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Help = () => {
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>Essential basics to get you going</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Team Generator helps you create balanced teams quickly and easily. Here's how to start:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Create players with their photos and details</li>
              <li>Select players for the current game</li>
              <li>Click generate to create balanced teams</li>
              <li>Share teams via WhatsApp or copy to clipboard</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Player Management
            </CardTitle>
            <CardDescription>Managing your player roster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For each player, you can set:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Name and primary position</li>
              <li>Secondary position for versatile players</li>
              <li>Specific attributes for each position:</li>
              <ul className="list-disc pl-4 ml-2 space-y-1">
                <li>Field players: speed, physical, mental, etc.</li>
                <li>Goalkeepers: handling, diving, reflexes, etc.</li>
                <li>Both sets when having dual positions</li>
              </ul>
              <li>Upload a player photo</li>
              <li>Edit player details anytime</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Generation
            </CardTitle>
            <CardDescription>Creating balanced teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our algorithm ensures fair team distribution by:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Balancing team skill levels</li>
              <li>Considering both primary and secondary positions</li>
              <li>Using appropriate attributes based on assigned position</li>
              <li>Visualizing team formations with position-specific colors</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListCheck className="h-5 w-5 text-primary" />
              Match Results
            </CardTitle>
            <CardDescription>Record game outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              After each game, you can:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Record which team won</li>
              <li>Track individual player goals</li>
              <li>Save match statistics</li>
              <li>View player performance history</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Sharing Teams
            </CardTitle>
            <CardDescription>Share generated teams easily</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share teams instantly:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Share directly to WhatsApp</li>
              <li>Copy teams to clipboard</li>
              <li>View team formations</li>
              <li>Quick team overview</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Tips & Best Practices
            </CardTitle>
            <CardDescription>Get the most out of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recommended practices:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Add player photos for easy identification</li>
              <li>Set accurate player attributes for better team balance</li>
              <li>Use secondary positions for versatile players</li>
              <li>Record match results promptly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Help;
