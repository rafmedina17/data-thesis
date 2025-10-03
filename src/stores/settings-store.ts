import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Program {
  id: string;
  name: string;
  department: 'college' | 'senior-high';
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  schoolName: string;
  schoolLogo?: string;
  headerBackground?: string;
  aboutContent: string;
  updatedAt: string;
}

interface SettingsState {
  // Programs
  programs: Program[];
  addProgram: (program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgramsByDepartment: (department: 'college' | 'senior-high') => Program[];
  
  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
}

// Initial mock data
const initialPrograms: Program[] = [
  // College Programs
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    department: 'college',
    description: 'Study of computation, algorithms, and information systems',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Bachelor of Science in Business Administration',
    department: 'college',
    description: 'Business management and entrepreneurship program',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Bachelor of Arts in Education',
    department: 'college',
    description: 'Teacher education and pedagogical studies',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Senior High Programs
  {
    id: '4',
    name: 'Science, Technology, Engineering, and Mathematics (STEM)',
    department: 'senior-high',
    description: 'Focus on science and mathematics disciplines',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Accountancy, Business, and Management (ABM)',
    department: 'senior-high',
    description: 'Business and accounting fundamentals',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Humanities and Social Sciences (HUMSS)',
    department: 'senior-high',
    description: 'Social sciences and humanities studies',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialSystemSettings: SystemSettings = {
  id: '1',
  schoolName: 'Tayabas Western Academy',
  schoolLogo: undefined,
  headerBackground: undefined,
  aboutContent: 'Access a comprehensive collection of thesis and research papers from our academic community. Explore groundbreaking work across departments and programs.',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Programs state
      programs: initialPrograms,
      
      addProgram: (program) => {
        const newProgram: Program = {
          ...program,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          programs: [...state.programs, newProgram],
        }));
      },
      
      updateProgram: (id, updates) => {
        set((state) => ({
          programs: state.programs.map((program) =>
            program.id === id
              ? { ...program, ...updates, updatedAt: new Date().toISOString() }
              : program
          ),
        }));
      },
      
      deleteProgram: (id) => {
        set((state) => ({
          programs: state.programs.filter((program) => program.id !== id),
        }));
      },
      
      getProgramsByDepartment: (department) => {
        return get().programs.filter(
          (program) => program.department === department && program.isActive
        );
      },
      
      // System Settings state
      systemSettings: initialSystemSettings,
      
      updateSystemSettings: (settings) => {
        set((state) => ({
          systemSettings: {
            ...state.systemSettings,
            ...settings,
            updatedAt: new Date().toISOString(),
          },
        }));
      },
    }),
    {
      name: 'thesis-archive-settings',
    }
  )
);
