
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import CreatePlayer from "./pages/CreatePlayer";
import TeamGenerator from "./pages/TeamGenerator";
import GeneratedTeams from "./pages/GeneratedTeams";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";

// Initialize React Query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="pt-16">
          <Navigation />
          <ThemeSwitcher />
          <Routes>
            <Route path="/" element={<CreatePlayer />} />
            <Route path="/generator" element={<TeamGenerator />} />
            <Route path="/generated-teams" element={<GeneratedTeams />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
