import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { LoginForm } from '../components/LoginForm';
import { GraduationCap } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10" />
            <div className="text-left">
              <h1 className="text-2xl font-bold">TWA Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Tayabas Western Academy Repository</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
          </div>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Academic Research Repository System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
