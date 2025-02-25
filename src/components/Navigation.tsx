
import { Menu, LogOut, UserPlus, Settings, Users, PlusCircle, UsersRound, HelpCircle, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Define navigation menu items
  const menuItems = [
    { path: "/", label: "Create Player", icon: <PlusCircle className="w-4 h-4 mr-2" /> },
    { path: "/generator", label: "Team Generator", icon: <UsersRound className="w-4 h-4 mr-2" /> },
    { path: "/communities", label: "Communities", icon: <Users className="w-4 h-4 mr-2" /> },
    { path: "/friends", label: "Friends", icon: <UserPlus className="w-4 h-4 mr-2" /> },
    { path: "/profile", label: "Profile", icon: <UserCircle className="w-4 h-4 mr-2" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-4 h-4 mr-2" /> },
    { path: "/help", label: "Help", icon: <HelpCircle className="w-4 h-4 mr-2" /> },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 p-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-lg bg-white dark:bg-secondary dark:hover:bg-secondary/80 shadow-lg hover:bg-gray-50 transition-colors">
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-100" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mt-2 dark:bg-secondary">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.path} className="p-0">
              <Link
                to={item.path}
                className={`w-full px-4 py-2 text-sm flex items-center ${
                  location.pathname === item.path
                    ? "text-primary font-medium dark:text-primary-foreground"
                    : "text-gray-700 dark:text-gray-100"
                } hover:bg-accent dark:hover:bg-accent/20`}
              >
                {item.icon}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          {user && (
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
