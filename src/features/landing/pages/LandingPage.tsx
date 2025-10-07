import { Library } from "lucide-react";
import DepartmentSelector from "../components/DepartmentSelector";
import { useSettingsStore } from '@/stores/settings-store';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { systemSettings } = useSettingsStore();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header 
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        style={systemSettings.headerBackground ? {
          backgroundImage: `url(${systemSettings.headerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
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
                <h1 className="text-lg font-semibold">{systemSettings.schoolName}</h1>
                <p className="text-sm text-muted-foreground">Academic Research Repository</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          
          <h1 className="text-display mb-6 max-w-4xl mx-auto">
            Discover Outstanding
            <span className="block text-primary">Academic Research</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {systemSettings.aboutContent}
          </p>
        </div>

        {/* Department Selection */}
        <div className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="text-heading mb-3">Select Department</h2>
            <p className="text-muted-foreground">Choose your area of interest to browse relevant research</p>
          </div>
          
          <DepartmentSelector />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/50 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Thesis Archive System. Empowering academic research discovery.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;