import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // TODO: Replace with actual API call when backend is ready
        // For now, mock authentication
        if (email === 'admin@twa.edu' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: 'admin@twa.edu',
            role: 'admin',
          };
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid username or password');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
