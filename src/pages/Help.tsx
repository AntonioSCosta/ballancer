
import { motion } from "framer-motion";
import { BookOpen, Users, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Help & Documentation
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>Get started with Team Generator</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Team Generator helps you create balanced teams for your sports games.
              Start by creating players, then use the generator to form balanced
              teams based on skill levels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Player Management
            </CardTitle>
            <CardDescription>Learn about player creation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create players by providing their name, position, and skill level.
              You can edit or delete players at any time. All players are stored
              locally in your browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Generation
            </CardTitle>
            <CardDescription>Understanding team generation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select at least 10 players to generate teams. The algorithm ensures
              balanced teams by considering player positions and skill levels. You
              can regenerate teams until you're satisfied with the result.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Help;
