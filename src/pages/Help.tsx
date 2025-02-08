
import { motion } from "framer-motion";

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-4xl mx-auto py-8 px-4"
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Help Center</h1>

      <div className="grid gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Welcome to TeamGenius! Here's how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Start by creating player profiles with their positions and skills</li>
            <li>Use the team generator to select players for your match</li>
            <li>Generate balanced teams automatically</li>
            <li>View and adjust teams as needed</li>
          </ol>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Player Management</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Add player details including name and position</li>
            <li>Rate player skills (speed, physical, mental, technical)</li>
            <li>Upload player photos for easy identification</li>
            <li>Update player information as needed</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Team Generation</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Select available players for the match</li>
            <li>Generate teams with balanced skill levels</li>
            <li>View team formations on the virtual field</li>
            <li>Regenerate teams until you're satisfied</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
};

export default Help;
