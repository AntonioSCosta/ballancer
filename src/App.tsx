
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AuthProvider } from "@/components/AuthProvider";
import { useAuth } from "@/components/AuthProvider";
import CreatePlayer from "./pages/CreatePlayer";
import TeamGenerator from "./pages/TeamGenerator";
import GeneratedTeams from "./pages/GeneratedTeams";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import Communities from "./pages/Communities";
import CommunityDetails from "./pages/CommunityDetails";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirectTo', currentPath);
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="pt-16">
      <Navigation />
      <ThemeSwitcher />
      <Routes>
        {/* Public routes that don't require authentication */}
        <Route path="/" element={<CreatePlayer />} />
        <Route path="/generator" element={<TeamGenerator />} />
        <Route path="/generated-teams" element={<GeneratedTeams />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />

        {/* Protected routes that require authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:id"
          element={
            <ProtectedRoute>
              <CommunityDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
