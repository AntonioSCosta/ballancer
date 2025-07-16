import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Target, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Player Management",
      description: "Create and manage player profiles with detailed attributes and photos"
    },
    {
      icon: Target,
      title: "Smart Team Generation",
      description: "Automatically generate balanced teams based on player ratings and positions"
    },
    {
      icon: Trophy,
      title: "Match Results",
      description: "Track game results and player statistics over time"
    },
    {
      icon: Zap,
      title: "Advanced Analytics",
      description: "Get insights into team performance and player development"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Team Generator Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create balanced teams, manage players, and track performance with our intelligent team management system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="shadow-elegant hover:shadow-glow transition-all duration-300">
              <Link to="/team-generator">
                <Users className="mr-2 h-5 w-5" />
                Start Generating Teams
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:bg-accent/10">
              <Link to="/create-player">
                <Target className="mr-2 h-5 w-5" />
                Create Player
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Balanced Teams</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Players Supported</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">⚡</div>
              <div className="text-muted-foreground">Instant Generation</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
