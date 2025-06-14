
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AuthProvider } from "@/components/AuthProvider";
import CreatePlayer from "./pages/CreatePlayer";
import TeamGenerator from "./pages/TeamGenerator";
import GeneratedTeams from "./pages/GeneratedTeams";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="pt-16">
            <Navigation />
            <ThemeSwitcher />
            <Routes>
              <Route path="/" element={<CreatePlayer />} />
              <Route path="/generator" element={<TeamGenerator />} />
              <Route path="/generated-teams" element={<GeneratedTeams />} />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
