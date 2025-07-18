
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
import Settings from "./pages/Settings";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { Button } from "./components/ui/button";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";

const queryClient = new QueryClient();

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isOnline, hasError, errorMessage, retry } = useAppInitialization();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Initializing application..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Initialization Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage || "Unable to start the application"}
          </p>
          <Button onClick={retry} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        {!isOnline && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <WifiOff className="h-4 w-4" />
            Offline
          </div>
        )}
      </div>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppInitializer>
            <div className="pt-16">
              <Navigation />
              <ThemeSwitcher />
              <Routes>
                <Route path="/" element={<CreatePlayer />} />
                <Route path="/create-player" element={<CreatePlayer />} />
                <Route path="/generator" element={<TeamGenerator />} />
                <Route path="/generated-teams" element={<GeneratedTeams />} />
                <Route path="/help" element={<Help />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </div>
          </AppInitializer>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
