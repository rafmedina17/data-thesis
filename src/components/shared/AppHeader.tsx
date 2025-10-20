import { Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/stores/settings-store";

const AppHeader = () => {
  const navigate = useNavigate();
  const { systemSettings } = useSettingsStore();

  return (
    <header
      className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      style={
        systemSettings.headerBackground
          ? {
              backgroundImage: `url(${systemSettings.headerBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {systemSettings.schoolLogo ? (
              <img
                src={systemSettings.schoolLogo}
                alt={systemSettings.schoolName}
                className="h-10 w-10 object-contain rounded-xl"
              />
            ) : (
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Library className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold">
                {systemSettings.schoolName}
              </h1>
              <p className="text-sm ">
                Academic Research Repository
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hover:bg-muted/50"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/about")}
              className="hover:bg-muted/50"
            >
              About
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
