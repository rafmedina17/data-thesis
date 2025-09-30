import { Library, Sparkles } from "lucide-react";
import DepartmentSelector from "../components/DepartmentSelector";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <Library className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Tayabas Western Academy</h1>
                <p className="text-sm text-muted-foreground">Academic Research Repository</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded-md text-sm font-medium hover:bg-muted/50 transition-colors"
                onClick={() => window.location.reload()}
              >
                Home
              </button>
              <button
                className="px-3 py-1 rounded-md text-sm font-medium hover:bg-muted/50 transition-colors"
                // About functionality placeholder
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
            Access a comprehensive collection of thesis and research papers from our academic community. 
            Explore groundbreaking work across departments and programs.
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