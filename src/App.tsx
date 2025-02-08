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
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Initialize React Query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <ThemeSwitcher />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<CreatePlayer />} />
            <Route path="/generator" element={<TeamGenerator />} />
            <Route path="/generated-teams" element={<GeneratedTeams />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;