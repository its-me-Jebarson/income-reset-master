import { ChefHat, Volume2, VolumeX, Sun, Moon, BarChart3, UtensilsCrossed, History, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";

export function KDSHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { soundOn, toggleSound } = useSound();
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/20 p-2">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Kitchen Display</h1>
          <p className="text-xs text-muted-foreground">Live order management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-mono">{today}</span>
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-accent transition-colors"
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundOn ? "Sound On" : "Sound Off"}
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <UtensilsCrossed className="h-4 w-4" /> Menu
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <History className="h-4 w-4" /> History
        </button>
        <button
          onClick={() => navigate("/analytics")}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <BarChart3 className="h-4 w-4" /> Analytics
        </button>
        <button
          onClick={() => navigate("/api")}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Key className="h-4 w-4" /> API
        </button>
      </div>
    </header>
  );
}
