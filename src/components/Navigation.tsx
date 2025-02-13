
import { Menu } from "lucide-react";
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
    { path: "/", label: "Create Player" },
    { path: "/generator", label: "Team Generator" },
    { path: "/help", label: "Help" },
  ];

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
                className={`w-full px-4 py-2 text-sm ${
                  location.pathname === item.path
                    ? "text-primary font-medium dark:text-primary-foreground"
                    : "text-gray-700 dark:text-gray-100"
                } hover:bg-accent dark:hover:bg-accent/20`}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
