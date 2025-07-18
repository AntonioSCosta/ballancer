
import { Menu, HelpCircle, Settings, UsersRound, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  // Define navigation menu items
  const menuItems = [
    { path: "/create-player", label: "Create Player", icon: <UserPlus className="w-4 h-4 mr-2" /> },
    { path: "/generator", label: "Team Generator", icon: <UsersRound className="w-4 h-4 mr-2" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-4 h-4 mr-2" /> },
    { path: "/help", label: "Help", icon: <HelpCircle className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 p-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-lg bg-white dark:bg-secondary dark:hover:bg-secondary/80 shadow-lg hover:bg-gray-50 transition-colors">
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-100" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mt-2 bg-popover dark:bg-popover border border-border shadow-lg">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.path} className="p-0 focus:bg-accent dark:focus:bg-accent">
              <Link
                to={item.path}
                className={`w-full px-4 py-2 text-sm flex items-center transition-colors ${
                  location.pathname === item.path
                    ? "text-primary bg-accent/50 font-medium dark:text-primary dark:bg-accent/30"
                    : "text-foreground hover:text-foreground"
                } hover:bg-accent dark:hover:bg-accent/50`}
              >
                {item.icon}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
