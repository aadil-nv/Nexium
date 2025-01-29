import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../../components/landing/landingPage/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme(); // Get the current theme and setTheme function

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light"); // Toggle between light and dark
  };

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon" className="border-none">
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
