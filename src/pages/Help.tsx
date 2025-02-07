
import { motion } from "framer-motion";

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-3xl py-8 space-y-8"
    >
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Help & Guide
      </h1>

      <div className="space-y-12">
        {/* Player Creation Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Creating Players
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To create a new player:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Add their full name</li>
              <li>Select their primary position (Goalkeeper, Defender, Midfielder, Forward)</li>
              <li>Add a photo (optional)</li>
              <li>Rate their skills (0-100):</li>
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Speed: Player's pace and acceleration</li>
                <li>Physical: Strength and stamina</li>
                <li>Mental: Decision making and positioning</li>
                <li>Technical: Ball control and overall skill</li>
              </ul>
            </ol>
          </div>
        </section>

        {/* Team Generation Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Team Generator Features
          </h2>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Main Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Select players for your match</li>
              <li>Generate balanced teams automatically</li>
              <li>Equal number of players in each team</li>
              <li>Balanced distribution of positions</li>
              <li>View teams in list format</li>
              <li>View tactical formations on a football field</li>
              <li>Regenerate teams until you're satisfied</li>
            </ul>
          </div>
        </section>

        {/* Tactics View Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Understanding the Tactics View
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The tactics view shows your team's formation on a virtual football field:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Players are positioned based on their roles</li>
              <li>Hover over player icons to see their names</li>
              <li>Different colors represent different positions:</li>
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Orange: Goalkeepers</li>
                <li>Blue: Defenders</li>
                <li>Purple: Midfielders</li>
                <li>Green: Forwards</li>
              </ul>
            </ul>
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Pro Tips
          </h2>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Create a varied pool of players across all positions</li>
              <li>Rate players honestly for better team balance</li>
              <li>Use the regenerate button if teams aren't balanced</li>
              <li>Keep your player list updated with current abilities</li>
              <li>Add player photos to make identification easier</li>
            </ul>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Help;
