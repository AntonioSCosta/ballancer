import { motion } from "framer-motion";

const Help = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-3xl py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & FAQ</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How to Create a Player
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. Navigate to the Create Player page from the menu
            <br />
            2. Fill in the player's name and select their position
            <br />
            3. Set the player's attributes (0-100)
            <br />
            4. Click "Create Player" to save
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Generating Teams
          </h2>
          <p className="text-gray-600 leading-relaxed">
            1. Go to the Team Generator page
            <br />
            2. Select at least 10 players for two teams
            <br />
            3. Click "Generate Teams" to create balanced teams
            <br />
            4. Use "Regenerate" for different combinations
            <br />
            5. Share the teams via WhatsApp using the share button
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Player Attributes
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Each position has specific attributes that affect the player's overall
            rating:
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Outfield Players
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>Speed</li>
                <li>Physical</li>
                <li>Mental</li>
                <li>Passing</li>
                <li>Dribbling</li>
                <li>Shooting</li>
                <li>Heading</li>
                <li>Defending</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Goalkeepers</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Handling</li>
                <li>Diving</li>
                <li>Positioning</li>
                <li>Reflexes</li>
                <li>Mental</li>
                <li>Passing</li>
                <li>Speed</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you need additional assistance or have suggestions for improvement,
            please contact our support team.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default Help;