import { motion } from "framer-motion";

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-3xl py-8 space-y-8"
    >
      {/* Main title */}
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
              To create a new player, follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Navigate to the Create Player page from the menu</li>
              <li>Enter the player's full name</li>
              <li>Select their preferred position on the field</li>
              <li>Rate their attributes on a scale of 0-100:</li>
            </ol>
          </div>
        </section>

        {/* Attributes Explanation Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Understanding Player Attributes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Physical Attributes
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li><span className="font-medium">Speed:</span> Player's acceleration and sprint speed</li>
                <li><span className="font-medium">Physical:</span> Strength and stamina</li>
                <li><span className="font-medium">Mental:</span> Decision making and positioning</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Technical Attributes
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li><span className="font-medium">Passing:</span> Short and long passing accuracy</li>
                <li><span className="font-medium">Dribbling:</span> Ball control and dribbling skills</li>
                <li><span className="font-medium">Shooting:</span> Shot power and accuracy</li>
                <li><span className="font-medium">Heading:</span> Aerial ability</li>
                <li><span className="font-medium">Defending:</span> Tackling and marking ability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Generation Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Generating Balanced Teams
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our team generator uses a sophisticated algorithm to create balanced teams:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Select at least 10 players from your squad</li>
              <li>The algorithm considers all player attributes</li>
              <li>Teams are balanced based on overall player ratings</li>
              <li>You can regenerate teams until you're satisfied</li>
              <li>Share the generated teams via WhatsApp</li>
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
              <li>Rate players honestly for the best team balance</li>
              <li>Consider creating multiple players for those who play different positions</li>
              <li>Update player ratings regularly to maintain accuracy</li>
              <li>Use the search function to quickly find specific players</li>
            </ul>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Help;