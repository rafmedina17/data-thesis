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
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
      updateEmail: async (newEmail: string) => {
        // TODO: Replace with actual API call when backend is ready
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            email: newEmail,
          };
          set({ user: updatedUser });
        }
      },
      updatePassword: async (currentPassword: string, newPassword: string) => {
        // TODO: Replace with actual API call when backend is ready
        // For now, mock validation
        if (currentPassword !== 'admin123') {
          throw new Error('Current password is incorrect');
        }
        // Password would be updated in real implementation
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
