
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  UserPlus,
  Trophy,
  Share2,
  History,
  Settings,
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
          Everything you need to know about using Team Generator effectively
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
              Team Generator helps you create balanced teams for sports games. Here's how to start:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Create players with their details</li>
              <li>Select players for team generation</li>
              <li>Generate balanced teams</li>
              <li>Share or save your teams</li>
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
              <li>Name and preferred position</li>
              <li>Skill level (1-5 stars)</li>
              <li>Track performance statistics</li>
              <li>Edit or remove players anytime</li>
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
              <li>Balancing overall team skill levels</li>
              <li>Considering player positions</li>
              <li>Distributing experienced players evenly</li>
              <li>Supporting multiple team configurations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Statistics & Performance
            </CardTitle>
            <CardDescription>Track player and team performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep track of:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Win/loss records</li>
              <li>Goals scored</li>
              <li>Player participation</li>
              <li>Team performance history</li>
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
              Multiple sharing options:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Share directly to WhatsApp</li>
              <li>Copy to clipboard</li>
              <li>Export team listings</li>
              <li>Quick team overview format</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Tips & Best Practices
            </CardTitle>
            <CardDescription>Get the most out of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recommended practices:
            </p>
            <ul className="list-disc pl-4 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li>Keep player skills up to date</li>
              <li>Use consistent rating criteria</li>
              <li>Record match results promptly</li>
              <li>Regular roster updates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Help;
