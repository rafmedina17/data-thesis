import { Library } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useNavigate } from "react-router-dom";

const About = () => {
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
                className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-background rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">About Our Thesis Archive</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {systemSettings.aboutContent}
            </p>
            
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                Our thesis archive system is designed to preserve and provide access to the valuable 
                research conducted by our students. We aim to create a comprehensive repository that 
                showcases the academic excellence and innovative thinking of our academic community.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a platform that not only serves as a digital library of student research 
                but also as a catalyst for future academic exploration and collaboration. Our system 
                connects students, faculty, and researchers, creating an ecosystem of shared knowledge.
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Comprehensive access to academic research papers</li>
                <li>Organization by department and program for easy browsing</li>
                <li>Search and filtering capabilities for efficient discovery</li>
                <li>Digital preservation of student work</li>
                <li>Platform for academic discourse and collaboration</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/50 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 {systemSettings.schoolName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;